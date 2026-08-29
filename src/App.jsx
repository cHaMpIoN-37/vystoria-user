// Vystoria User App
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {
  Home, Search as SearchIcon, BookOpen, Trophy, User,
  LogOut, Trash2, Mail, CheckCircle2, Settings, Loader2,
  Menu, ArrowLeft, Save, Download, Check, Bookmark,
  Edit3, Camera, Heart, ThumbsUp, ThumbsDown, Copy,
  ArrowRight, Undo2
} from 'lucide-react';


// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  );
}

const IS_NATIVE = Capacitor.isNativePlatform();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // PKCE is required for the Capacitor OAuth flow in section 2.
    // Set it explicitly rather than relying on the SDK default.
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    // On native we receive the OAuth code via a deep link and exchange it
    // ourselves, so the SDK must not try to parse it out of window.location.
    detectSessionInUrl: !IS_NATIVE,
  },
});

// --- YOUR CUSTOM ASSETS ---
import backIcon from './assets/back.svg';
import logoUrl from './assets/logo.png';
import homeIcon from './assets/home.svg';
import libraryIcon from './assets/library.svg';
import trophyIcon from './assets/trophy.svg';
import profileIcon from './assets/profile.svg';
import empLib from './assets/empty-library.svg';
import supp from './assets/support.svg';
import { FcGoogle } from "react-icons/fc";
import { Search, ChevronDown } from 'lucide-react';

const ICONS = {
  back: backIcon,
  navLibrary: libraryIcon,
  navHome: homeIcon,
  navAchievements: trophyIcon,
  navProfile: profileIcon,
  emptyLibrary: empLib,
  support: supp,
  logout: null,
  deleteAccount: null,
};

const MOCK_GAMES = [
  { id: '1', title: 'Demon Slayer', subtitle: 'Chapter 1: The Wise Man', genre: 'Action', coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop', likes: 8, dislikes: 2, progress: 0 },
  { id: '2', title: 'Naruto', subtitle: 'Hidden Leaf', genre: 'Action', coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop', likes: 0, dislikes: 0, progress: 0 },
  { id: '3', title: 'One Piece', subtitle: 'Romance Dawn', genre: 'Adventure', coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', likes: 5, dislikes: 0, progress: 10 },
  { id: '4', title: 'Another', subtitle: 'Class 3-3', genre: 'Horror', coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1555580399-5219d2eb0543?q=80&w=1200&auto=format&fit=crop', likes: 4, dislikes: 1, progress: 0 },
  { id: '5', title: 'Vinland Saga', subtitle: 'True Warrior', genre: 'Historical', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop', likes: 12, dislikes: 0, progress: 100 },
];

// --- REGISTRATION GATE ---------------------------------------------------
// Vystoria treats a user as "registered" only once a public.profiles row
// exists. That row is created by the SECURITY DEFINER trigger in
// 20260828_0001_profiles_confirmed_gate.sql, which fires when
// auth.users.email_confirmed_at goes null -> not-null. An unconfirmed
// auth.users row is therefore inert as far as this app is concerned.
const REGISTRATION_POLL_ATTEMPTS = 6;
const REGISTRATION_POLL_DELAY_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const calculateProgress = (story, sceneId) => {
  if (!story?.scenes?.length || !sceneId) return 0;
  const idx = story.scenes.findIndex(s => s.id === sceneId);
  if (idx === -1) return 0;
  return Math.min(100, Math.round(((idx + 1) / story.scenes.length) * 100));
};

export default function App() {
  const [currentView, setCurrentView] = useState('init');
  const [currentTab, setCurrentTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authMessage, setAuthMessage] = useState(null);


  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);


  // Reset the countdown to 60s every time we land on the verify screen
  useEffect(() => {
    if (currentView === 'auth_verify') {
      setResendCountdown(60);
      setResendSuccess(false);
    }
  }, [currentView]);

  // Tick the countdown down every second while on this screen
  useEffect(() => {
    if (currentView !== 'auth_verify') return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentView]);


  // The whole app is portrait except the story engine, which is authored for
  // landscape. CSS cannot change device orientation, so lock it natively on
  // the way in and release it on the way out. MainActivity declares
  // configChanges="orientation|screenSize", so rotating does NOT recreate the
  // activity — React state (currentSceneId, sequenceIndex, saveSlots) survives.
  useEffect(() => {
    if (!IS_NATIVE) return;

    let cancelled = false;
    const target = currentView === 'engine' ? 'landscape' : 'portrait';

    (async () => {
      try {
        // 'landscape' accepts either landscape direction, so the player can
        // hold the phone whichever way is comfortable.
        await ScreenOrientation.lock({ orientation: target });
      } catch (err) {
        // Never let an orientation failure block gameplay — worst case the
        // story renders in the current orientation.
        if (!cancelled) console.error('[vystoria] orientation lock failed:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [currentView]);

  // Release the lock if the component unmounts while still in the engine,
  // so the OS orientation setting isn't left pinned.
  useEffect(() => {
    if (!IS_NATIVE) return;
    return () => { ScreenOrientation.unlock().catch(() => {}); };
  }, []);

  // Resends the code without re-running the account-discovery branch in
  // handleAuthContinue. For a brand-new signup the auth.users row already
  // exists at this point, so shouldCreateUser must stay true or GoTrue will
  // reject the resend for an unconfirmed account.
  const handleResendCode = async () => {
    const email = authEmail.trim().toLowerCase();
    if (!email) return setAuthError("Email is required.");
    setAuthLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: isNewAccount }
    });

    setAuthLoading(false);
    if (error) return setAuthError(error.message);

    setResendCountdown(60);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 2500);
  };

  const [userMetadata, setUserMetadata] = useState({
    full_name: 'Player One',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    bookmarks: [],
    reactions: {},
    stats: { gamesStarted: [], choicesMade: 0, playTimeMins: 0 }
  });


  //627={authError && <p className="text-red-400 text-xs text-left">{authError}</p>}
  //628={authMessage && <p className="text-green-400 text-xs text-left">{authMessage}</p>}


  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAccNotFound, setShowAccNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  const [playerState, setPlayerState] = useState('main_menu');
  const [saveSlots, setSaveSlots] = useState(Array(8).fill(null));
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [cloudGames, setCloudGames] = useState([]);
  const [storyData, setStoryData] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [playerError, setPlayerError] = useState(null);

  const [sortBy, setSortBy] = useState('recentlyAdded');

  const [confirmSaveIdx, setConfirmSaveIdx] = useState(null); // slot index awaiting "Do you want to save?" confirmation

  const fetchCloudGames = async (activeUser = user) => {
    try {
      const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
      if (data) {
        let progressMap = {};
        if (activeUser) {
          const { data: progressRows } = await supabase
            .from('user_progress')
            .select('story_id, progress_percent')
            .eq('user_id', activeUser.id);
          if (progressRows) progressRows.forEach(r => { progressMap[r.story_id] = r.progress_percent || 0; });
        }

        const games = data.map((story, i) => {
          const filename = story.url.substring(story.url.lastIndexOf('/') + 1);
          return {
            id: story.id,
            title: story.title,
            filename: filename,
            genre: story.genre || 'Uncategorized',
            coverImage: story.cover_image || MOCK_GAMES[i % MOCK_GAMES.length].coverImage,
            bgImage: MOCK_GAMES[i % MOCK_GAMES.length].bgImage,
            likes: story.likes || 0,
            dislikes: story.dislikes || 0,
            isCloud: true,
            progress: progressMap[story.id] || 0,
            search_count: story.search_count || 0,
            assets: story.assets || {}
          };
        });
        setCloudGames(games);
      }
    } catch (err) {
      console.error("Error loading cloud games:", err);
    }
  };

  // Reads the public.profiles row. Absence of a row === "not registered yet".
  const fetchProfile = async (userId) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('Failed to read profile:', error);
      return null;
    }
    return data || null;
  };

  // The trigger runs inside the same transaction as the confirmation, but the
  // client can still race the write on a slow connection, so poll briefly
  // before deciding the account genuinely is not registered.
  const waitForProfile = async (userId) => {
    for (let attempt = 0; attempt < REGISTRATION_POLL_ATTEMPTS; attempt += 1) {
      const profile = await fetchProfile(userId);
      if (profile) return profile;
      await wait(REGISTRATION_POLL_DELAY_MS);
    }
    return null;
  };

  const syncMetadata = async (activeUser, profile = null) => {
    if (!activeUser) return;
    const meta = activeUser.user_metadata || {};
    setUserMetadata({
      // profiles is the source of truth for identity fields; user_metadata
      // still carries gameplay state (bookmarks / reactions / stats).
      full_name: profile?.full_name || meta.full_name || 'Player One',
      avatar_url: profile?.avatar_url || meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      bookmarks: meta.bookmarks || [],
      reactions: meta.reactions || {},
      stats: meta.stats || { gamesStarted: [], choicesMade: 0, playTimeMins: 0 }
    });
  };

  const updateMetadata = async (updates) => {
    const newMeta = { ...userMetadata, ...updates };
    setUserMetadata(newMeta);
    if (user) {
      await supabase.auth.updateUser({ data: newMeta });

      // Mirror identity fields into public.profiles so server-side reads and
      // RLS policies never have to look at auth.users. UPDATE only: there is
      // no INSERT policy on profiles, rows are born in the trigger.
      const profilePatch = {};
      if (Object.prototype.hasOwnProperty.call(updates, 'full_name')) profilePatch.full_name = updates.full_name;
      if (Object.prototype.hasOwnProperty.call(updates, 'avatar_url')) profilePatch.avatar_url = updates.avatar_url;
      if (Object.keys(profilePatch).length > 0) {
        const { error } = await supabase.from('profiles').update(profilePatch).eq('id', user.id);
        if (error) console.error('Failed to mirror profile fields:', error);
      }
    }
    return newMeta;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
          setCurrentView('splash');
          return;
        }

        // Belt and braces: a session can only exist post-confirmation, but if
        // one somehow does without a profiles row the user is NOT registered
        // and must not be dropped into the app.
        const profile = await fetchProfile(sessionUser.id);
        if (!sessionUser.email_confirmed_at || !profile) {
          await supabase.auth.signOut();
          setUser(null);
          setCurrentView('splash');
          return;
        }

        setUser(sessionUser);
        syncMetadata(sessionUser, profile);
        setCurrentView('main');
        fetchCloudGames(sessionUser);
      });
    }, 2500);

    

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;

      // Never promote an unconfirmed user to "logged in" state.
      if (nextUser && !nextUser.email_confirmed_at) {
        setUser(null);
        return;
      }

      setUser(nextUser);
      if (nextUser) {
        const profile = await fetchProfile(nextUser.id);
        syncMetadata(nextUser, profile);
        fetchCloudGames(nextUser);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const toggleBookmark = (gameId) => {
    const isBookmarked = userMetadata.bookmarks.includes(gameId);
    const newBookmarks = isBookmarked
      ? userMetadata.bookmarks.filter(id => id !== gameId)
      : [...userMetadata.bookmarks, gameId];
    updateMetadata({ bookmarks: newBookmarks });
  };

  const handleReaction = async (gameId, type) => {
    const currentReaction = userMetadata.reactions?.[gameId] || null;
    const nextReaction = currentReaction === type ? null : type;
    const newReactions = { ...(userMetadata.reactions || {}) };
    if (nextReaction) newReactions[gameId] = nextReaction;
    else delete newReactions[gameId];

    await updateMetadata({ reactions: newReactions });

    setCloudGames(prev => prev.map(g => {
      if (g.id !== gameId) return g;
      let likes = g.likes || 0, dislikes = g.dislikes || 0;
      if (currentReaction === 'like') likes = Math.max(0, likes - 1);
      if (currentReaction === 'dislike') dislikes = Math.max(0, dislikes - 1);
      if (nextReaction === 'like') likes += 1;
      if (nextReaction === 'dislike') dislikes += 1;
      return { ...g, likes, dislikes };
    }));
    setSelectedGame(prev => prev && prev.id === gameId ? {
      ...prev,
      likes: nextReaction === 'like' ? (prev.likes || 0) + (currentReaction === 'like' ? 0 : 1) - (currentReaction === 'like' && !nextReaction ? 1 : 0) : (currentReaction === 'like' ? Math.max(0, (prev.likes || 0) - 1) : prev.likes),
      dislikes: nextReaction === 'dislike' ? (prev.dislikes || 0) + (currentReaction === 'dislike' ? 0 : 1) - (currentReaction === 'dislike' && !nextReaction ? 1 : 0) : (currentReaction === 'dislike' ? Math.max(0, (prev.dislikes || 0) - 1) : prev.dislikes),
    } : prev);

    try {
      await supabase.rpc('adjust_story_reaction', {
        story_id_input: gameId,
        new_reaction: nextReaction,
        old_reaction: currentReaction
      });
    } catch (err) {
      console.error('Failed to sync reaction:', err);
    }
  };

  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard?.writeText(user.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

  const handleSearchResultClick = async (game) => {
    setSelectedGame(game);
    setCurrentView('game_detail');

    if (game.isCloud) {
      try {
        await supabase.rpc('increment_search_count', { story_id_input: game.id });
        setCloudGames(prev => prev.map(g =>
          g.id === game.id ? { ...g, search_count: (g.search_count || 0) + 1 } : g
        ));
      } catch (err) {
        console.error('Failed to increment search count:', err);
      }
    }
  };

  const handleCloudPlay = async () => {
    if (!selectedGame) return;
    setPlayerError(null);
    try {
      const { data, error } = await supabase.storage.from('visual-novels').download(selectedGame.filename);
      if (error) throw error;

      const text = await data.text();
      const json = JSON.parse(text);
      if (!json.scenes || json.scenes.length === 0) throw new Error("Invalid structure.");

      const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', user.id).eq('story_id', selectedGame.id).maybeSingle();

      let parsedSlots = Array(8).fill(null);
      if (progressData?.save_slots && Array.isArray(progressData.save_slots)) {
        progressData.save_slots.forEach((slot, idx) => { if (idx < 8) parsedSlots[idx] = slot; });
      }

      setSaveSlots(parsedSlots);
      setStoryData(json);
      setCurrentSceneId(progressData?.current_scene_id || json.starting_scene || json.scenes[0].id);
      setSequenceIndex(0);
      setPlayerState('main_menu');
      setCurrentView('engine');

      if (!userMetadata.stats.gamesStarted.includes(selectedGame.id)) {
        updateMetadata({ stats: { ...userMetadata.stats, gamesStarted: [...userMetadata.stats.gamesStarted, selectedGame.id] }});
      }
    } catch (err) {
      console.error("Cloud Play Error:", err);
      alert("Failed to load story from cloud.");
    }
  };

  const handleSaveSlot = async (idx) => {
    if (!user || !selectedGame) return;
    try {
      const newSlots = [...saveSlots];
      newSlots[idx] = { sceneId: currentSceneId, date: new Date().toLocaleString() };
      setSaveSlots(newSlots);

      const progressPercent = calculateProgress(storyData, currentSceneId);

      await supabase.from('user_progress').upsert({
        user_id: user.id, story_id: selectedGame.id, current_scene_id: currentSceneId,
        save_slots: newSlots, progress_percent: progressPercent, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, story_id' });

      setCloudGames(prev => prev.map(g => g.id === selectedGame.id ? { ...g, progress: progressPercent } : g));
      setSelectedGame(prev => prev ? { ...prev, progress: progressPercent } : prev);

      alert(`Progress saved to Slot ${idx + 1}!`);
    } catch (err) {
      console.error(err);
      alert("Database failed to process save.");
    }
  };

  const handleLoadSlot = (idx) => {
    const slot = saveSlots[idx];
    if (slot && slot.sceneId) {
      setCurrentSceneId(slot.sceneId);
      setSequenceIndex(0);
      setPlayerState('playing');
    }
  };

  // --- FIXED: no longer falls back to scenes[0] when a link target is
  // missing (that was the "loops back to the start near the end" bug).
  // A missing/invalid next_scene_default with no choices is now treated as
  // a genuine story ending instead of a dead link.
  const advanceStory = () => {
    if (!storyData) return;
    const currentScene = storyData.scenes?.find(s => s.id === currentSceneId) || storyData.scenes?.[0];
    if (!currentScene) return;

    const sequenceLength = currentScene.sequence?.length || 1;
    const isEndOfSeq = sequenceIndex >= sequenceLength - 1;
    const hasChoices = currentScene.choices && currentScene.choices.length > 0;
    const nextSceneExists = storyData.scenes?.some(s => s.id === currentScene.next_scene_default);

    if (!isEndOfSeq) {
      setSequenceIndex(prev => prev + 1);
      return;
    }

    if (currentScene.next_scene_default && nextSceneExists) {
      setCurrentSceneId(currentScene.next_scene_default);
      setSequenceIndex(0);
      return;
    }

    if (!hasChoices) {
      // Reached a real ending (no choices, no valid next scene). Persist
      // 100% progress and show the End screen instead of silently doing
      // nothing (or worse, looping).
      if (user && selectedGame) {
        supabase.from('user_progress').upsert({
          user_id: user.id, story_id: selectedGame.id, current_scene_id: currentSceneId,
          save_slots: saveSlots, progress_percent: 100, updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, story_id' }).then(() => {
          setCloudGames(prev => prev.map(g => g.id === selectedGame.id ? { ...g, progress: 100 } : g));
          setSelectedGame(prev => prev ? { ...prev, progress: 100 } : prev);
        }).catch(err => console.error('Failed to persist ending progress:', err));
      }
      setPlayerState('story_end');
    }
  };

  // --- FIXED: validates the choice's target scene actually exists before
  // navigating, instead of blindly jumping (which previously fell through
  // to scene[0] via the lookup fallback elsewhere in the engine).
  const handleChoice = (nextSceneId) => {
    const exists = nextSceneId && storyData?.scenes?.some(s => s.id === nextSceneId);
    if (exists) {
      setCurrentSceneId(nextSceneId);
      setSequenceIndex(0);
      updateMetadata({ stats: { ...userMetadata.stats, choicesMade: (userMetadata.stats.choicesMade || 0) + 1 }});
    } else {
      setPlayerError("Game Over: Reached a dead end.");
    }
  };

  // Sends an OTP without ever passing emailRedirectTo. Supplying a redirect
  // makes GoTrue render a magic link instead of a code for brand-new users,
  // which is what caused the OTP-vs-link inconsistency. The email templates
  // use {{ .Token }} only.
  const sendOtp = async (email, createUser) =>
    supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: createUser }
    });

  const handleAuthContinue = async () => {
    const email = authEmail.trim().toLowerCase();
    if (!email) return setAuthError("Email is required.");
    setAuthLoading(true); setAuthError(null); setAuthMessage(null);

    // Pass 1: treat this as a returning user. shouldCreateUser:false means
    // Supabase will NOT write an auth.users row if the email is unknown.
    const { error } = await sendOtp(email, false);

    if (!error) {
      setIsNewAccount(false);
      setAuthMessage("");
      setAuthLoading(false);
      setCurrentView('auth_verify');
      return;
    }

    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('signups not allowed') || msg.includes('not found') || msg.includes('user not found')) {
      // Pass 2: genuinely new email. This DOES create an unconfirmed
      // auth.users row — unavoidable, GoTrue needs a row to hang the OTP on.
      // No public.profiles row is created, so nothing in the app treats this
      // person as registered until they enter the code. Rows abandoned here
      // are swept by purge_stale_unconfirmed_users() on a nightly pg_cron job.
      const { error: signupError } = await sendOtp(email, true);
      setAuthLoading(false);
      if (signupError) return setAuthError(signupError.message);
      setIsNewAccount(true);
      setAuthMessage("Verification code sent to your email!");
      setCurrentView('auth_verify');
    } else {
      setAuthLoading(false);
      setAuthError(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    const email = authEmail.trim().toLowerCase();
    const token = authOtp.trim();
    if (!email || !token) return setAuthError("Email and Code are required.");
    setAuthLoading(true); setAuthError(null);

    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }

    const verifiedUser = data?.session?.user;
    if (!verifiedUser) {
      setAuthError("Verification succeeded but no session was returned. Please try again.");
      setAuthLoading(false);
      return;
    }

    // THE GATE. verifyOtp set email_confirmed_at, which fired the trigger that
    // creates the public.profiles row. If that row is not there, registration
    // did not complete and we refuse to let the user into the app rather than
    // running with a half-provisioned account.
    const profile = await waitForProfile(verifiedUser.id);
    if (!profile) {
      await supabase.auth.signOut();
      setUser(null);
      setAuthLoading(false);
      setAuthError("We couldn't finish setting up your account. Please try again in a moment.");
      return;
    }

    setUser(verifiedUser);
    syncMetadata(verifiedUser, profile);
    setAuthLoading(false);
    setCurrentView('welcome');
    setTimeout(() => {
      setCurrentView('main');
      fetchCloudGames(verifiedUser);
    }, 1600);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowLogoutModal(false);
    setCurrentView('splash');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      alert("Account deleted.");
    } catch (e) {
      console.error(e);
      alert("Account deletion requires specific database privileges. Logging you out.");
    }
    handleLogout();
  };

  const navigateTo = (view, tab = 'home') => {
    setCurrentView(view);
    if (view === 'main') setCurrentTab(tab);
    window.scrollTo(0, 0);
  };

  const renderInitScreen = () => (
  <div className="flex flex-col h-full bg-[#11111E] text-white text-center items-center justify-center font-spartan">
    <div className="w-[min(52vw,13rem)] h-[min(52vw,13rem)] mb-1 relative flex items-center justify-center">
      <img src={logoUrl} alt="Vystoria logo" className="w-full h-full object-contain" />
    </div>
    <h1 className="text-[clamp(34px,11.4vw,48px)] font-bold tracking-wide -mt-4">Vystoria</h1>
  </div>
);

  const renderSplash = () => (
    <div className="flex flex-col h-full relative bg-[#050511] text-white font-spartan">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-[#050511]/80 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col items-start justify-end h-full pb-[calc(5rem+env(safe-area-inset-bottom))] px-[max(2rem,env(safe-area-inset-left))] text-left">
        <h1 className="text-[clamp(26px,8.6vw,36px)] font-bold text-purple-500 mb-2 leading-[1] tracking-wide"><br/><span className="text-white">Journey Beyond Reality</span></h1>
        <p className="text-[clamp(15px,4.3vw,18px)] font-orelega text-gray-400 mb-10 mt-4 leading-[1.1]">Interactive stories where every choice creates a new adventure.</p>
        <button onClick={() => { setAuthError(null); setAuthMessage(null); setCurrentView('auth'); }} className="w-full min-h-[60px] px-4 bg-[#9457EB] hover:bg-[#4C1D95] text-white font-markazi font-bold py-4 rounded-xl shadow-purple-900/50 transition-all text-[clamp(27px,9vw,38px)] leading-none tracking-wide justify-center items-center flex">
          Get Started
        </button>
      </div>
    </div>
  );

  const renderAuthEmail = () => (
  <div className="flex flex-col h-full overflow-y-auto bg-[#141624] text-white px-4 pt-[max(5rem,calc(env(safe-area-inset-top)+1.5rem))] pb-[calc(2rem+env(safe-area-inset-bottom))]">

    <h2 className="text-[clamp(30px,10vw,42px)] font-extrabold font-spartan leading-tight">
      Ready to Play?
    </h2>

    <p className="mt-4 text-[clamp(21px,6.9vw,29px)] text-[#B5B5B5] font-markazi font-bold leading-[1.1]">
      Enter email id to log in or create a new account.
    </p>

    <div className="mt-8">
      <label className="block text-[clamp(18px,5.7vw,24px)] font-markazi font-bold mb-3">
        Email :
      </label>

      <input
        type="email"
        value={authEmail}
        onChange={(e) => setAuthEmail(e.target.value)}
        className="
          w-full
          h-14
          min-h-[3.5rem]
          text-[16px]
          bg-[#5B3A93]
          border-none
          rounded-lg
          px-3
          text-white
          placeholder:text-white/50
          focus:outline-none
        "
      />
    </div>

    {authError && (
      <p className="mt-2 text-xs text-red-400">
        {authError}
      </p>
    )}

    <button
      onClick={handleAuthContinue}
      disabled={authLoading}
      className="
        mt-4
        min-h-[3.5rem]
        py-2
        w-full
        rounded-lg
        font-bold
        font-markazi
        leading-none
        text-[clamp(23px,7.6vw,32px)]
        bg-gradient-to-r
        from-[#9457EB]
        to-[#A15DFF]
        disabled:opacity-50
        flex
        items-center
        justify-center
      "
    >
      {authLoading ? (
        <Loader2 className="w-5 h-8 animate-spin" />
      ) : (
        "Confirm"
      )}
    </button>

    <p className="text-center text-[clamp(15px,4.3vw,18px)] text-white font-markazi font-semibold my-5">
      or
    </p>

    <button
      className="
        min-h-[3.5rem]
        py-2
        px-3
        w-full
        rounded-lg
        bg-gradient-to-r
        from-[#9457EB]
        to-[#A15DFF]
        flex
        items-center
        justify-center
        gap-[clamp(0.5rem,3vw,1.25rem)]
        font-bold
        font-markazi
        leading-none
        text-[clamp(24px,8.1vw,34px)]
        
      "
    >
      <FcGoogle size={38} className="shrink-0" />

      <span className="truncate">Sign-in with Google</span>
    </button>

    <p className="mt-12 text-center text-[clamp(15px,4.5vw,19px)] text-[#A6A6A6] leading-[1.35] font-markazi font-semibold">
      By continuing, you agree to Vystoria's
      <br />
      <a
        href="https://vystoria.app/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-white"
      >
        Terms &amp; Conditions
      </a>{" "}
      and{" "}
      <a
        href="https://vystoria.app/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-white"
      >
        Privacy Policy
      </a>.
    </p>
  </div>
);

  const renderAuthVerify = () => (
    <div className="flex flex-col h-full overflow-y-auto bg-[#11111E] text-white px-6 pt-[max(3rem,calc(env(safe-area-inset-top)+1rem))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-left font-spartan">
      <BackButton className="mb-4 mt-0 border-0 bg-transparent size-[20px]" onClick={() => { setCurrentView('auth'); setAuthError(null); setAuthMessage(null); setAuthOtp(''); }} />
      <h2 className="text-[clamp(32px,11.4vw,48px)] font-bold text-white mb-2 leading-[1] break-words">
        {isNewAccount ? 'Create New Account' : `Welcome Back ${userMetadata.full_name || 'User'}`}
      </h2>

      <div className="space-y-4 w-full mt-6">
        <div>
          <label className="text-[clamp(23px,7.6vw,32px)] font-markazi font-bold mb-2 block">Enter Verification Code :</label>
          <p className="text-[clamp(18px,5.7vw,24px)] text-gray-400 mb-4 font-markazi leading-[1.1]">
            A verification code has been sent to your email address. Please check your inbox.
          </p>
          <input 
            type="text" 
            value={authOtp} 
            onChange={(e) => setAuthOtp(e.target.value)} 
            className="w-full bg-[#2D1B4E] rounded-lg p-4 text-white text-center tracking-[0.4em] indent-[0.4em] text-[clamp(16px,4.5vw,18px)] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" 
          />
        </div>
        
        <button 
          onClick={handleVerifyOtp} 
          disabled={authLoading} 
          className="w-full min-h-[3.5rem] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-markazi text-[clamp(26px,8.6vw,36px)] leading-none font-bold py-3 rounded-lg mt-4 shadow-lg disabled:opacity-50 flex justify-center items-center tracking-wide"
        >
          {authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm"}
        </button>

        {resendSuccess ? (
          <p className="text-[clamp(15px,4.5vw,19px)] text-green-400 font-markazi font-bold flex items-center justify-center gap-2 mt-4">
            <Check className="w-4 h-4" strokeWidth={3} />
            Verification code sent successfully !
          </p>
        ) : resendCountdown > 0 ? (
          <p className="text-[clamp(15px,4.5vw,19px)] text-left mt-4 text-gray-400 font-markazi font-bold flex items-center justify-center">
            Resend verification code in {resendCountdown} seconds.
          </p>
        ) : (
          <p className="text-[clamp(16px,5vw,21px)] text-left mt-4 text-gray-400 font-markazi font-medium flex flex-wrap items-center justify-center text-center">
            Didn't get code? Check spam or{' '}
            <button onClick={handleResendCode} disabled={authLoading} className="text-white underline font-markazi font-bold ml-1 disabled:opacity-50">
              resend it.
            </button>
          </p>
        )}
      </div>
    </div>
  );

  const renderWelcome = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#0F1322]">

    {/* Background Image */}
    <img
      src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop"
      alt="Background"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-[#111626]/75"></div>

    {/* Content */}
    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">

      <h2
        className="font-spartan font-bold text-[clamp(34px,11.4vw,48px)] text-white leading-none"
      >
        Welcome
      </h2>

      <h1
        className="mt-3 font-spartan font-bold text-[clamp(38px,15.2vw,64px)] font-extrabold text-white leading-[1.05] break-words max-w-full"
      >
        {userMetadata.full_name || "User"}
      </h1>

    </div>

  </div>
);

  const renderHome = () => {
    const displayList = cloudGames.length > 0 ? cloudGames : MOCK_GAMES;
    const featuredGame = displayList[0] || MOCK_GAMES[0];
 
    const categories = [
      { title: 'Horror', list: displayList.filter(g => g.genre?.toLowerCase().includes('horror')) },
      { title: 'Scifi', list: displayList.filter(g => g.genre?.toLowerCase().includes('sci-fi') || g.genre?.toLowerCase().includes('action')) },
      { title: 'Mystery', list: displayList.filter(g => g.genre?.toLowerCase().includes('mystery') || g.genre?.toLowerCase().includes('adventure')) }
    ];
 
    if (activeCategory) {
    const activeList = categories.find(c => c.title === activeCategory)?.list || displayList;
    return (
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 bg-[#0B0B14] font-spartan">
        {/* Header: Back + Search */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={() => setActiveCategory(null)} />
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#0B0B14] text-white rounded-full py-2.5 px-5 pr-12 text-sm focus:outline-none border border-[#8B5CF6] placeholder-gray-500"
            />
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5CF6]" />
          </div>
        </div>

        <div className="h-px w-full bg-[#FFFFFF]/30 mb-6"></div>

        {/* Category Badge */}
        <div className="bg-[#8B5CF6] inline-flex items-center px-5 py-1.5 rounded-lg mb-6">
          <h4 className="text-white font-bold text-sm tracking-wide">{activeCategory}</h4>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3">
          {activeList.map((game) => (
            <div 
              key={game.id} 
              className="aspect-[3/4] rounded-xl overflow-hidden relative cursor-pointer group"
              onClick={() => { setSelectedGame(game); setCurrentView('game_detail'); }}
            >
              <img 
                src={game.coverImage} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={game.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <h4 className="text-white text-xl font-bold tracking-wide leading-tight">{game.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
 
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-[#0B0B14] font-spartan">
        <div className="px-4 pt-4 pb-3">
          <div className="rounded-full px-5 py-2.5 flex items-center justify-end border border-[#4C3A8A] bg-transparent cursor-pointer" onClick={() => setCurrentTab('search')}>
            <SearchIcon className="text-[#8B5CF6] w-4 h-4" />
          </div>
        </div>
        <div className="h-px w-full bg-[#9457EB]/30 mb-6"></div>
 
        <div className="px-4 space-y-8">
        <div className="relative h-[clamp(320px,58vh,480px)] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer border border-[#1C1635]" onClick={() => { setSelectedGame(featuredGame); setCurrentView('game_detail'); }}>
          <img src={featuredGame.coverImage} alt="Featured" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 w-full p-6 flex flex-col items-start gap-2">
            <span className="bg-white/25 text-white px-4 py-1.5 rounded-xl text-sm font-bold tracking-wide max-w-full truncate">{featuredGame.title}</span>
            <span className="bg-white/25 text-white px-4 py-1.5 rounded-xl text-xs font-medium mb-4 max-w-full truncate">{featuredGame.filename || featuredGame.subtitle}</span>
            <div className="w-full min-h-[50px] bg-white/25 border border-white/20 text-white py-3.5 rounded-xl font-markazi font-bold text-[clamp(22px,7.1vw,30px)] leading-none flex justify-center items-center transition tracking-wide">
              Play
            </div>
          </div>
        </div>
 
        {categories.map((category, idx) => (
          <div key={idx} className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="bg-[#9457EB33] text-white px-4 py-1.5 rounded-xl font-semibold text-base tracking-wide">{category.title}</h4>
              <button onClick={() => setActiveCategory(category.title)} className="text-xs font-medium text-white hover:text-white flex items-center gap-1 transition">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-6 snap-x no-scrollbar">
              {(category.list.length > 0 ? category.list : displayList).map((game, i) => (
                <div key={game.id + i} className="min-w-[26vw] w-[26vw] max-w-[110px] h-[26vw] max-h-[110px] flex-shrink-0 rounded-lg overflow-hidden relative snap-start cursor-pointer group border border-[#1C1635] hover:border-[#8B5CF6]/50 transition-colors" onClick={() => { setSelectedGame(game); setCurrentView('game_detail'); }}>
                  <img src={game.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={game.title} />
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    );
  };

  const renderSearch = () => {
    const sourceList = cloudGames.length > 0 ? cloudGames : MOCK_GAMES;

    const trendingSearches = [...sourceList]
      .sort((a, b) => (b.search_count || 0) - (a.search_count || 0))
      .slice(0, 3);

    const results = searchQuery
      ? sourceList.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : trendingSearches;

    return (
      <div className="flex-1 overflow-y-auto pb-6 px-4 pt-6 bg-[#0B0B14] font-spartan">
        <div className="flex items-center gap-3 mb-8">
          <BackButton onClick={() => setCurrentTab('home')} />
          <div className="flex-1 bg-[#1C1635] rounded-full px-5 py-3.5 flex items-center border border-[#2D1B4E] shadow-inner">
            <input type="text" placeholder="" className="bg-transparent text-white w-full focus:outline-none text-sm font-medium tracking-wide placeholder:text-[#8A7DAB]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
            <SearchIcon className="text-[#8B5CF6] w-5 h-5 ml-2 flex-shrink-0" />
          </div>
        </div>
        <div className="h-px w-full bg-[#9457EB] mb-6"></div>

        {results.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold font-markazi text-white tracking-widest mb-4 pl-1">{searchQuery ? 'Results' : 'Top Search'}</h3>
            <div className="space-y-3">
              {results.map(game => (
                <div key={game.id} className="bg-[#1C1635] rounded-2xl p-3 flex gap-4 items-center cursor-pointer border border-transparent hover:border-[#8B5CF6]/40 transition shadow-sm" onClick={() => handleSearchResultClick(game)}>
                  <img src={game.coverImage} className="w-[19vw] h-[19vw] max-w-[80px] max-h-[80px] flex-shrink-0 rounded-xl object-cover" alt="thumb" />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-[#9457EB] font-bold text-base mb-1 truncate">{game.title}</h4>
                    <p className="text-[11px] text-[#8A7DAB] line-clamp-2 leading-relaxed font-medium">An immersive visual novel about {game.title.toLowerCase()} and the epic journey that awaits...</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-60">
            <SearchIcon className="w-14 h-14 text-[#9457EB] mb-4" />
            <h3 className="text-[clamp(26px,8.6vw,36px)] font-markazi font-bold text-white mb-2 tracking-wide">Search Not Found</h3>
            <p className="text-[clamp(16px,4.8vw,20px)] font-markazi text-white leading-relaxed">we couldn't find anything matching<br/>your search.</p>
          </div>
        )}
      </div>
    );
  };

  const renderLibrary = () => {
    const displayList = cloudGames.length > 0 ? cloudGames : MOCK_GAMES;
    let bookmarkedGames = displayList.filter(g => userMetadata.bookmarks.includes(g.id));

    // Search filter
    if (searchQuery.trim()) {
      bookmarkedGames = bookmarkedGames.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    const sortedGames = [...bookmarkedGames].sort((a, b) => {
      if (sortBy === 'nameAZ') return a.title.localeCompare(b.title);
      if (sortBy === 'nameZA') return b.title.localeCompare(a.title);
      return 0; // recentlyAdded — preserves original array order
    });

    return (
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 bg-[#0B0B14] relative h-full flex flex-col font-spartan">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="" 
            className="w-full bg-[#1C1635] text-white rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] placeholder-gray-500"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5CF6]" />
        </div>

        <div className="h-[2px] w-full bg-[#9457EB]/50 mb-6"></div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-white text-[clamp(18px,5.7vw,24px)] font-markazi font-bold whitespace-nowrap">Sort By:</span>
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-base font-markazi font-bold py-1.5 pl-3 pr-8 rounded-l focus:outline-none cursor-pointer transition-colors max-w-[55vw] truncate"
            >
              <option value="recentlyAdded">Recently Added</option>
              <option value="nameAZ">Name A-Z</option>
              <option value="nameZA">Name Z-A</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>

        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {sortedGames.map((game) => (
              <div 
                key={game.id} 
                className="aspect-[2/3] rounded-xl overflow-hidden relative cursor-pointer group shadow-md"
                onClick={() => { setSelectedGame(game); setCurrentView('game_detail'); }}
              >
                <img 
                  src={game.coverImage} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  alt={game.title} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <img src={empLib} alt="Empty Library" className="w-[min(30vw,120px)] h-[min(30vw,120px)] object-contain mb-4" />
            <h2 className="text-[clamp(29px,9.5vw,40px)] font-markazi font-bold text-white mb-6">Library is Empty</h2>
            <button 
              onClick={() => setCurrentTab('home')} 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-[clamp(23px,7.6vw,32px)] leading-none text-white px-[clamp(1.5rem,8vw,2.5rem)] py-3 rounded-lg font-markazi font-bold shadow-lg transition-colors"
            >
              Browse Games
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAchievements = () => {
    const stats = userMetadata.stats;
    const achievements = [
      { id: 1, title: 'Booter', desc: 'Play visual novels for a total of 30 minutes', progress: Math.min(100, (stats.playTimeMins / 30) * 100), unlocked: stats.playTimeMins >= 30, icon: '🚀' },
      { id: 2, title: 'Drop In', desc: 'Start your first visual novel.', progress: stats.gamesStarted.length > 0 ? 100 : 0, unlocked: stats.gamesStarted.length > 0, icon: '🏳️' },
      { id: 3, title: 'Locked In', desc: 'Read visual novels on 10 different days', progress: 10, unlocked: false, icon: '📅' },
      { id: 4, title: 'Loadrunner', desc: 'Start 3 different visual novels', progress: Math.min(100, (stats.gamesStarted.length / 3) * 100), unlocked: stats.gamesStarted.length >= 3, icon: '📚' },
      { id: 5, title: 'Pathfinder', desc: 'Start visual novels from 5 different genres', progress: 0, unlocked: false, icon: '🧭' },
      { id: 6, title: 'Decision Maker', desc: 'Make 25 meaningful choices across all games', progress: Math.min(100, (stats.choicesMade / 25) * 100), unlocked: stats.choicesMade >= 25, icon: '🔀' },
    ];

    return (
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1rem))] bg-[#0B0B14] font-spartan">
        <h2 className="text-[clamp(22px,7.1vw,30px)] font-bold text-white text-left mb-8 tracking-wide px-2">Achievements</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-8 px-1">
          {achievements.slice(0, 4).map(ach => (
            <div key={ach.id} className="bg-[#1C1635] border border-[#2D1B4E] rounded-2xl p-4 flex flex-col items-start relative overflow-hidden shadow-sm">
               {ach.unlocked && <div className="absolute top-3 right-3 bg-[#10B981] rounded-full w-5 h-5 flex items-center justify-center z-10"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}
               <div className="mb-3 text-2xl">
                  {ach.icon}
               </div>
               <span className="text-[13px] font-bold text-white mb-2 z-10 leading-tight pr-4">{ach.title}</span>
               <span className={`text-[9px] px-3 py-1 rounded-full font-bold z-10 uppercase tracking-widest ${ach.unlocked ? 'bg-[#10B981]/20 text-[#34D399]' : 'bg-black/40 text-gray-500'}`}>{ach.unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          ))}
        </div>

        <h3 className="text-xs font-bold text-[#A78BFA] tracking-widest uppercase mb-4 px-2">All Badges</h3>
        <div className="space-y-3 px-1">
          {achievements.map(ach => (
            <div key={ach.id} className="bg-[#1C1635] border border-[#2D1B4E] rounded-2xl p-4 flex items-center gap-4 transition shadow-sm">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl border ${ach.unlocked ? 'bg-[#2D1B4E] border-[#4C1D95]' : 'bg-[#0B0B14] border-[#1C1635] grayscale opacity-50'}`}>
                 {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-[15px] truncate">{ach.title}</h4>
                <p className="text-[11px] text-[#8A7DAB] mt-1 mb-2 font-medium leading-snug">{ach.desc}</p>
                <div className="w-full bg-[#0B0B14] h-1.5 rounded-full overflow-hidden border border-[#2D1B4E]">
                  <div className={`h-full rounded-full transition-all ${ach.unlocked ? 'bg-[#10B981]' : 'bg-[#4C1D95]'}`} style={{width: `${ach.progress}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const handleNameEdit = () => {
      const newName = prompt("Enter your new name:", userMetadata.full_name);
      if (newName) updateMetadata({ full_name: newName });
    };
    const handlePicEdit = () => {
      const newUrl = prompt("Enter a new image URL for your avatar:", userMetadata.avatar_url);
      if (newUrl) updateMetadata({ avatar_url: newUrl });
    };

    return (
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-[max(4rem,calc(env(safe-area-inset-top)+2rem))] bg-[#0B0B14] flex flex-col items-center font-spartan">
        {/* Avatar */}
        <div className="relative w-[min(28vw,7rem)] h-[min(28vw,7rem)] flex-shrink-0 mb-5">
          <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#8B5CF6] shadow-[0_0_25px_rgba(139,92,246,0.6)] p-[3px]">
            <img src={userMetadata.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
          </div>
          <div onClick={handlePicEdit} className="absolute bottom-0 right-0 bg-[#1C1635] p-1.5 rounded-full cursor-pointer hover:bg-[#2D1B4E] transition border border-[#4C1D95]">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 mb-1 group cursor-pointer" onClick={handleNameEdit}>
          <h3 className="text-[clamp(18px,5.7vw,24px)] font-markazi font-bold text-white tracking-wide max-w-[70vw] truncate">{userMetadata.full_name}</h3>
          <Edit3 className="w-5 h-5 text-white group-hover:text-white transition" />
        </div>

        {/* Email */}
        <button onClick={handleCopyEmail} className="text-[clamp(16px,5.7vw,24px)] text-white font-markazi flex items-center justify-center gap-2 mb-14 max-w-full break-all text-center hover:text-white transition">
          {user?.email || 'player@darkcity.com'}
          {emailCopied ? <Check className="w-4 h-4 text-green-400 font-markazi" /> : <Copy className="w-4 h-4 text-white font-markazi" />}
        </button>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <button onClick={() => setCurrentView('support')} className="w-full bg-[#9457EB80] text-[30px] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <img src={supp} alt="Support" className="w-5 h-5 object-contain text-[30px]" />
            </div>
            <span className="font-bold text-[clamp(19px,6vw,25px)] leading-none">Support</span>
          </button>
          <button onClick={() => setShowLogoutModal(true)} className="w-full bg-[#9457EB80] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <LogOut className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-[clamp(19px,6vw,25px)] leading-none">Logout</span>
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="w-full bg-[#9457EB80] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-[clamp(19px,6vw,25px)] leading-none">Delete Account</span>
          </button>
        </div>

        {/* Modals */}
        {(showLogoutModal || showDeleteModal) && (
          <div className="fixed inset-0 bg-[#0B0B14]/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-[#13132B] w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl border border-[#2D1B4E]">
              <div className="w-16 h-16 rounded-full bg-[#2D1B4E] flex items-center justify-center mx-auto mb-6 shadow-inner">
                {showLogoutModal ? <LogOut className="text-white w-8 h-8" /> : <Trash2 className="text-white w-8 h-8" />}
              </div>
              <h3 className="text-white font-markazi font-bold mb-4 text-lg leading-snug">
                {showLogoutModal ? 'Are you sure you want to Logout?' : 'Are you sure you want to permanently delete your account? All your data will be lost forever.'}
              </h3>
              <div className="flex gap-4 mt-8">
                <button onClick={() => {setShowLogoutModal(false); setShowDeleteModal(false)}} className="flex-1 bg-[#2D1B4E] hover:bg-[#3B0764] text-white py-4 rounded-xl font-markazi text-xl font-bold transition">Cancel</button>
                <button onClick={showLogoutModal ? handleLogout : handleDeleteAccount} className="flex-1 py-4 rounded-xl font-markazi font-bold text-white shadow-lg transition bg-[#8B5CF6] text-xl hover:bg-[#7C3AED]">
                  {showLogoutModal ? 'Logout' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCustomerSupport = () => (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white overflow-y-auto pb-24 relative px-6 pt-[max(3rem,calc(env(safe-area-inset-top)+1rem))] text-center font-spartan">
      <BackButton onClick={() => setCurrentView('main')} className="mb-6 self-start" />

      <div className="h-px w-full bg-[#FFFFFF]/50 mb-6"></div>
      
      <h1 className="text-[clamp(26px,8.6vw,36px)] font-markazi font-bold tracking-wide">Customer Support</h1>
      
      <div className="w-full flex flex-col items-center justify-center mt-8">
        <div className="w-[min(32vw,8rem)] h-[min(32vw,8rem)] flex items-center justify-center mb-4">
          <Mail className="w-full h-full text-white" strokeWidth={1.5} />
        </div>
        <p className="text-[clamp(16px,4.8vw,20px)] font-markazi text-white mb-6">Need Help ? Contact us at</p>
        <a 
          href="mailto:darkcity.atelier@gmail.com" 
          className="bg-[#5B21B6] hover:bg-[#6D28D9] text-white px-4 py-3.5 rounded-xl font-markazi font-bold text-[clamp(14px,4.3vw,18px)] transition w-full flex items-center justify-center gap-2 break-all text-center"
        >
          darkcity.atelier@gmail.com
          <Copy className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  const renderGameDetail = () => {
    if (!selectedGame) return null;
    const isBookmarked = userMetadata.bookmarks.includes(selectedGame.id);
    const reaction = userMetadata.reactions?.[selectedGame.id] || null;
    const likes = selectedGame.likes || 0;
    const dislikes = selectedGame.dislikes || 0;
    const totalVotes = likes + dislikes;
    const likedPercent = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : null;

    const progressPercent = selectedGame.progress || 0;
    const hasStarted = progressPercent > 0;
    const isComplete = progressPercent >= 100;
    const buttonLabel = isComplete ? 'Re-Play' : hasStarted ? 'Continue' : 'Play';

    return (
      <div className="flex flex-col h-full bg-[#0B0B14] text-white overflow-y-auto relative items-center font-spartan">
        {/* Header matched to screenshot */}
        <div className="w-full flex justify-between items-center px-5 pb-4 pt-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] border-b border-[#1C1635]">
          <button 
            onClick={() => setCurrentView('main')} 
            className="w-10 h-10 bg-transparent border border-[#2D1B4E] rounded-full flex items-center justify-center hover:bg-[#1C1635] transition"
          >
             {/* Fallback to Undo2 if the custom back icon isn't hooked up yet */}
             <Undo2 className="text-[#A78BFA] w-5 h-5" />
          </button>
          
          <button 
            onClick={() => toggleBookmark(selectedGame.id)}
            className="w-10 h-10 bg-transparent border border-[#2D1B4E] rounded-full flex items-center justify-center hover:bg-[#1C1635] transition"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#A78BFA] fill-[#A78BFA]' : 'text-gray-400'}`} />
          </button>
        </div>

        <div className="w-full px-5 pt-5 pb-10 flex flex-col">
          {/* Cover Image matched to screenshot */}
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-[#1C1635]">
            <img src={selectedGame.coverImage} alt={selectedGame.title} className="w-full h-full object-cover" />
          </div>

          {/* Title Row — title left, thumbs up/down right, matched to new screenshot */}
          <div className="flex justify-between items-center mt-5 gap-3">
            <h1 className="text-[clamp(18px,5.7vw,24px)] font-markazi font-bold tracking-wide truncate min-w-0">{selectedGame.title}</h1>
            <div className="flex gap-2.5 flex-shrink-0">
              <button
                onClick={() => handleReaction(selectedGame.id, 'like')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${reaction === 'like' ? 'bg-[#2D1B4E] border-[#8B5CF6] text-white' : 'bg-transparent border-[#2D1B4E] text-[#8A7DAB] hover:border-[#4D3A7A]'}`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReaction(selectedGame.id, 'dislike')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${reaction === 'dislike' ? 'bg-[#2D1B4E] border-[#8B5CF6] text-white' : 'bg-transparent border-[#2D1B4E] text-[#8A7DAB] hover:border-[#4D3A7A]'}`}
              >
                <ThumbsDown className="w-4 h-4 mt-1" />
              </button>
            </div>
          </div>

          {/* Genre and Liked Status — same row, matched to new screenshot */}
          <div className="flex justify-between items-center mt-3">
             <div className="bg-[#2D1B4E] border border-[#3B0764] px-5 py-1.5 rounded-full">
                <span className="text-white font-markazi font-bold text-[13px] tracking-widest uppercase">{selectedGame.genre}</span>
             </div>
             
             {likedPercent !== null ? (
                <div className="text-[15px]">
                   <span className="font-bold text-white">{likedPercent}% </span>
                   <span className="text-gray-300 font-markazi font-semibold">Liked it</span>
                </div>
             ) : (
                <span className="text-[15px] font-markazi font-semibold text-white">Be the first critic</span>
             )}
          </div>

          {/* Progress Bar matched to screenshot */}
          {hasStarted && (
            <div className="w-full h-9 bg-[#1C1635] border border-[#2D1B4E] rounded-lg overflow-hidden mt-5 relative flex items-center justify-center shadow-inner">
               <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] transition-all" style={{width: `${progressPercent}%`}}></div>
               <span className="relative z-10 text-[13px] font-markazi font-bold text-white drop-shadow-md tracking-wide">{progressPercent}% Explored</span>
            </div>
          )}

          {/* Action Button matched to screenshot */}
          <button
            onClick={() => {
              if (selectedGame?.isCloud) handleCloudPlay();
              else alert("This is a placeholder! Please launch stories dynamically sync'd from your personal library.");
            }}
            className="w-full min-h-[56px] bg-[#7C3AED] hover:bg-[#8B5CF6] active:scale-[0.98] text-white font-markazi font-bold py-4 rounded-[14px] shadow-[0_0_20px_rgba(124,58,237,0.4)] text-[clamp(22px,7.1vw,30px)] leading-none transition-all tracking-wide mt-5"
          >
            {buttonLabel}
          </button>

          {/* Synopsis Box matched to screenshot */}
          <div className="bg-[#120F24] rounded-[14px] p-5 mt-5 border border-[#1C1635] shadow-lg">
            <p className="text-[13px] text-gray-300 leading-[1.8] font-medium opacity-90">
              The forest slept beneath a thin veil of moonlight, every tree standing like a silent witness. Even the wind seemed afraid to move. The young slayer advanced carefully, boots brushing fallen leaves, his breath slow and measured. Somewhere ahead, a child whimpered—soft, trembling—then fell abruptly quiet. That silence was worse than any scream. He knew the demon was close.
              <br/><br/>
              A sudden blur tore through the darkness. Claws grazed his side, warm blood soaking into his uniform, but he didn't cry out. Pain was expected. Fear was not. He steadied himself, recalling his training: listen to the forest, feel the rhythm, wait for the opening. The demon laughed from the—
            </p>
          </div>
        </div>
      </div>
    );
  };

    const renderGameEngine = () => {
    if (!storyData || !storyData.scenes) {
      return (
        <div className="absolute inset-0 bg-[#0B0B14] flex flex-col items-center justify-center text-white p-6 z-50 font-spartan">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B5CF6] mb-6" />
          <p className="text-[15px] font-bold text-[#A78BFA] tracking-wide uppercase">Loading Story Assets...</p>
        </div>
      );
    }

    const currentScene = storyData.scenes?.find(s => s.id === currentSceneId) || storyData.scenes?.[0] || {};
    const sequenceList = currentScene.sequence || [];
    const currentSequenceBlock = sequenceList[sequenceIndex] || {};
    const isEndOfSequence = sequenceIndex >= sequenceList.length - 1;

    const sceneBgUrl = selectedGame?.assets?.backgrounds?.[currentScene.background];
    const engineBg = sceneBgUrl
      || selectedGame?.bgImage
      || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop';

    const portraitUrl = currentSequenceBlock.speaker
      ? selectedGame?.assets?.characters?.[currentSequenceBlock.speaker]
      : null;

    // In landscape the viewport is WIDE and SHORT (~868x411 on a 1080p phone),
    // so height is the binding constraint, not width. Every size below keys
    // off vh. 1vh is ~4.1px on that device, ~7.2px on a tablet in landscape.
    const menuBtn =
      "w-full text-white font-bold font-markazi rounded-lg border border-[#8000FF] transition " +
      "py-[clamp(0.3rem,1.5vh,0.9rem)] px-3 text-[clamp(14px,4.2vh,28px)] leading-none";

    return (
      <div className="absolute inset-0 z-50 bg-black overflow-hidden font-spartan">
        <div className="w-full h-full relative overflow-hidden bg-[#0B0B14] text-white">

          <div className="absolute inset-0 z-0">
             <img src={engineBg} className="w-full h-full object-cover blur-sm brightness-50" alt="Engine BG" />
             <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* MAIN MENU — flex column instead of two absolutely-positioned
              blocks. Title takes the space it needs at the top, the button
              stack sits at the bottom, and they can never overlap however
              short the viewport gets. */}
          {playerState === 'main_menu' && (
            <div className="relative z-10 w-full h-full flex flex-col justify-between
                            pt-[max(1.5rem,env(safe-area-inset-top))]
                            pb-[max(1.5rem,env(safe-area-inset-bottom))]
                            pl-[max(2rem,env(safe-area-inset-left))]
                            pr-[max(2rem,env(safe-area-inset-right))]">
               <div className="flex-1 flex items-center min-h-0">
                 <h1 className="text-[clamp(30px,11vh,72px)] leading-[1.05] font-markazi font-bold text-white drop-shadow-xl break-words max-w-[70%]">
                   {selectedGame?.title || 'Visual Novel'}
                 </h1>
               </div>

               <div className="w-full max-w-[min(70vw,300px)] space-y-[clamp(0.4rem,1.5vh,0.75rem)] flex-shrink-0">
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className={`${menuBtn} bg-[#9457EB33]/20 hover:bg-[#9457EB33]`}>Start New Game</button>
                 <button onClick={() => setPlayerState('load_menu')} className={`${menuBtn} bg-[#9457EB33]/20 hover:bg-[#9457EB33]`}>Load Game</button>
                 <button onClick={() => setCurrentView('game_detail')} className={`${menuBtn} bg-[#9457EB33]/20 hover:bg-[#9457EB33]`}>Exit</button>
               </div>
            </div>
          )}

          {/* PAUSED — five buttons is the tightest stack in the app. Sizes are
              deliberately smaller than the main menu so the whole set clears
              a 411px-tall viewport without scrolling; it still scrolls as a
              fallback on anything shorter. */}
          {playerState === 'paused' && (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-y-auto
                            px-6
                            py-[max(1rem,env(safe-area-inset-top))]
                            bg-black/30 backdrop-blur-[2px]">
               <h1 className="text-[clamp(18px,5vh,34px)] font-serif font-bold text-white mb-[clamp(0.5rem,2.5vh,2rem)] drop-shadow-xl text-center px-4 break-words flex-shrink-0">
                 {selectedGame?.title || 'Visual Novel'}
               </h1>

               <div className="w-full max-w-[min(70vw,300px)] space-y-[clamp(0.35rem,1.3vh,0.75rem)] flex-shrink-0">
                 <button onClick={() => setPlayerState('playing')} className={`${menuBtn} bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 shadow-sm`}>Resume</button>
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className={`${menuBtn} bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 shadow-sm`}>Start New Game</button>
                 <button onClick={() => setPlayerState('save_menu')} className={`${menuBtn} bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 shadow-sm`}>Save Game</button>
                 <button onClick={() => setPlayerState('load_menu')} className={`${menuBtn} bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 shadow-sm`}>Load Game</button>
                 <button onClick={() => setCurrentView('game_detail')} className={`${menuBtn} bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 shadow-sm`}>Exit</button>
               </div>
            </div>
          )}

          {/* STORY END — reached a genuine ending (no valid next scene / no
              choices). Treats an unresolved next_scene_default or choice
              target as an ending rather than falling back to scenes[0]. */}
          {playerState === 'story_end' && (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-y-auto text-center
                            px-8
                            py-[max(1rem,env(safe-area-inset-top))]
                            bg-black/40 backdrop-blur-[2px]">
               <h1 className="text-[clamp(24px,7vh,44px)] font-markazi font-bold text-white mb-[clamp(0.4rem,1.5vh,1rem)] drop-shadow-xl flex-shrink-0">The End</h1>
               <p className="text-purple-200 font-markazi text-[clamp(14px,4vh,22px)] leading-snug max-w-md mx-auto mb-[clamp(0.75rem,3vh,2.5rem)] flex-shrink-0">
                 You've reached the end of this path. Thanks for playing {selectedGame?.title || 'this story'}.
               </p>
               <div className="w-full max-w-[min(70vw,300px)] space-y-[clamp(0.35rem,1.3vh,0.75rem)] flex-shrink-0">
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className={`${menuBtn} bg-[#9457EB33]/20 hover:bg-[#9457EB33]`}>Play Again</button>
                 <button onClick={() => setCurrentView('game_detail')} className={`${menuBtn} bg-[#9457EB33]/20 hover:bg-[#9457EB33]`}>Exit</button>
               </div>
            </div>
          )}

          {/* SAVE MENU — header and footer are flex-shrink-0, the slot list is
              the only thing that scrolls, so Back is always reachable. */}
          {playerState === 'save_menu' && (
             <div className="relative z-10 flex flex-col w-full h-full
                             px-[max(1.5rem,env(safe-area-inset-left))]
                             pt-[max(0.75rem,env(safe-area-inset-top))]
                             pb-[max(0.75rem,env(safe-area-inset-bottom))]
                             bg-black/20 backdrop-blur-[2px]">
                <h2 className="text-[clamp(18px,5vh,32px)] font-markazi font-bold text-white tracking-wide text-center mb-[clamp(0.4rem,1.5vh,2rem)] drop-shadow-md flex-shrink-0">Save Game</h2>
                <div className="flex-1 min-h-0 overflow-y-auto space-y-[clamp(0.3rem,1vh,0.75rem)] pb-3 no-scrollbar">
                  {saveSlots.map((slot, idx) => (
                    <button key={idx} onClick={() => setConfirmSaveIdx(idx)} className="w-full bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white text-left px-4 py-[clamp(0.35rem,1.4vh,0.875rem)] rounded-lg flex items-center gap-3 transition-all shadow-sm">
                      <Save className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="font-bold font-serif text-[clamp(12px,3.4vh,15px)] flex-shrink-0">Slot {idx + 1}</span>
                      <span className="text-[clamp(10px,2.8vh,12px)] text-purple-100/80 font-medium min-w-0 truncate">{slot ? `Playtime : ${slot.date}` : 'Empty Save Slot'}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end flex-shrink-0 pt-2">
                  <button onClick={() => setPlayerState('paused')} className="bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white font-bold font-serif px-8 py-[clamp(0.3rem,1.2vh,0.625rem)] rounded-lg text-[clamp(12px,3.4vh,15px)] transition">Back</button>
                </div>
             </div>
          )}

          {/* SAVE CONFIRMATION */}
          {confirmSaveIdx !== null && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6 py-4 overflow-y-auto">
              <div className="w-full max-w-[min(80vw,320px)] flex flex-col items-center">
                <h2 className="text-[clamp(20px,6vh,36px)] font-serif font-bold text-white text-center mb-[clamp(0.25rem,1vh,0.75rem)] drop-shadow-md">Save Game</h2>
                <p className="text-white font-bold font-markazi text-center text-[clamp(13px,3.8vh,21px)] mb-[clamp(0.5rem,2vh,1.5rem)] leading-snug">
                  Do you want to save your progress in slot {confirmSaveIdx + 1}?
                </p>
                <div className="w-full rounded-lg border border-purple-300/40 overflow-hidden bg-purple-500/30 backdrop-blur-md">
                  <button
                    onClick={() => { handleSaveSlot(confirmSaveIdx); setConfirmSaveIdx(null); }}
                    className="w-full py-[clamp(0.35rem,1.4vh,0.75rem)] text-[clamp(13px,3.6vh,18px)] font-bold font-markazi text-white border-b border-purple-300/30 hover:bg-purple-500/50 transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmSaveIdx(null)}
                    className="w-full py-[clamp(0.35rem,1.4vh,0.75rem)] text-[clamp(13px,3.6vh,18px)] font-bold font-markazi text-white hover:bg-purple-500/50 transition"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOAD MENU — same structure as Save, no confirmation step */}
          {playerState === 'load_menu' && (
             <div className="relative z-10 flex flex-col w-full h-full
                             px-[max(1.5rem,env(safe-area-inset-left))]
                             pt-[max(0.75rem,env(safe-area-inset-top))]
                             pb-[max(0.75rem,env(safe-area-inset-bottom))]
                             bg-black/20 backdrop-blur-[2px]">
                <h2 className="text-[clamp(18px,5vh,32px)] font-serif font-bold text-white tracking-wide text-center mb-[clamp(0.4rem,1.5vh,2rem)] drop-shadow-md flex-shrink-0">Load Game</h2>
                <div className="flex-1 min-h-0 overflow-y-auto space-y-[clamp(0.3rem,1vh,0.75rem)] pb-3 no-scrollbar">
                  {saveSlots.map((slot, idx) => (
                    <button key={idx} disabled={!slot} onClick={() => handleLoadSlot(idx)} className="w-full bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white text-left px-4 py-[clamp(0.35rem,1.4vh,0.875rem)] rounded-lg flex items-center gap-3 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-purple-500/30">
                      <Download className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="font-bold font-serif text-[clamp(12px,3.4vh,15px)] flex-shrink-0">Slot {idx + 1}</span>
                      <span className="text-[clamp(10px,2.8vh,12px)] text-purple-100/80 font-medium min-w-0 truncate">{slot ? `Playtime : ${slot.date}` : 'No Save Data'}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end flex-shrink-0 pt-2">
                  <button onClick={() => setPlayerState(storyData ? 'paused' : 'main_menu')} className="bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white font-bold font-serif px-8 py-[clamp(0.3rem,1.2vh,0.625rem)] rounded-lg text-[clamp(12px,3.4vh,15px)] transition">Back</button>
                </div>
             </div>
          )}

          {/* PLAYING */}
          {playerState === 'playing' && (
            <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <img src={engineBg} className="w-full h-full object-cover" alt="Gameplay BG" />
               </div>

               {/* Capped at 45% width so a tall portrait can never crowd the
                   dialogue box on a narrow screen. */}
               {portraitUrl && (
                 <img
                   src={portraitUrl}
                   alt={currentSequenceBlock.speaker}
                   className="absolute bottom-0 right-[max(1rem,env(safe-area-inset-right))] h-[68%] max-w-[45%] object-contain object-bottom drop-shadow-2xl z-30 pointer-events-none"
                 />
               )}

               <button onClick={() => setPlayerState('paused')} className="absolute top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))] z-50 p-2 bg-black/30 hover:bg-white/10 rounded-md transition">
                  <Menu className="w-[clamp(20px,5.5vh,28px)] h-[clamp(20px,5.5vh,28px)] text-white" strokeWidth={2.5} />
               </button>

               {/* Dead-end guard. handleChoice sets playerError when a choice
                   points at a scene that doesn't exist; without this the state
                   was set but never shown and the tap appeared to do nothing. */}
               {playerError && (
                 <div className="absolute inset-0 z-[55] flex flex-col items-center justify-center bg-black/70 px-8 text-center">
                    <p className="text-white font-markazi font-bold text-[clamp(15px,4.5vh,24px)] mb-[clamp(0.5rem,2vh,1.5rem)]">{playerError}</p>
                    <button onClick={() => { setPlayerError(null); setPlayerState('paused'); }} className="bg-[#9457EB] hover:bg-[#7C3AED] text-white font-bold font-markazi px-8 py-[clamp(0.35rem,1.4vh,0.75rem)] rounded-lg text-[clamp(13px,3.8vh,20px)] transition">
                      Back to Menu
                    </button>
                 </div>
               )}

               {(!isEndOfSequence || !(currentScene.choices && currentScene.choices.length > 0)) ? (
                 <div className="mt-auto relative z-40 w-full flex justify-center cursor-pointer
                                 px-[max(0.75rem,env(safe-area-inset-left))]
                                 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                      onClick={advanceStory}>
                    <div className="relative w-full max-w-3xl">
                       {/* Speaker badge sits in flow above the box rather than
                           absolutely offset, so it can't be clipped off the
                           top of a short viewport. */}
                       {currentSequenceBlock.speaker && (
                         <div className="inline-block max-w-[60%] truncate bg-[#9457EB] text-white font-markazi font-bold px-4 py-1 rounded-t-xl shadow-lg text-[clamp(13px,3.8vh,25px)] tracking-wide">
                           {currentSequenceBlock.speaker}
                         </div>
                       )}

                       <div className={`bg-[#000228]/60 border-2 border-[#8B5CF6]/70 w-full rounded-xl ${currentSequenceBlock.speaker ? 'rounded-tl-none' : ''} px-5 py-[clamp(0.6rem,2.2vh,1.75rem)] pr-12 text-white font-markazi text-[clamp(13px,4vh,21px)] leading-snug shadow-[0_0_30px_rgba(0,0,0,0.8)] relative break-words max-h-[42vh] overflow-y-auto no-scrollbar`}>
                          <span className={currentSequenceBlock.type === 'narrative' ? 'italic text-[#D8B4FE]' : 'text-gray-100'}>
                             {currentSequenceBlock.text || 'The silent dark city envelops you...'}
                          </span>
                       </div>

                       {/* Moved outside the scrolling box so it stays pinned
                           while long dialogue scrolls underneath. */}
                       <div className="absolute bottom-2 right-3 bg-white w-[clamp(20px,5vh,28px)] h-[clamp(20px,5vh,28px)] rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                         <ArrowRight className="w-[60%] h-[60%] text-[#4C1D95]" strokeWidth={3} />
                       </div>
                    </div>
                 </div>
               ) : (
                    <div className="mt-auto relative z-40 w-full flex justify-center
                                    px-[max(0.75rem,env(safe-area-inset-left))]
                                    pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                      <div className="w-full max-w-3xl bg-[#000228]/60 border-2 border-[#9457EB]/70 rounded-2xl p-[clamp(0.6rem,2vh,1.25rem)] shadow-[0_0_40px_rgba(0,0,0,0.9)] max-h-[70vh] overflow-y-auto no-scrollbar">
                        <p className="text-white text-[clamp(12px,3.4vh,16px)] font-medium mb-[clamp(0.4rem,1.5vh,1rem)] leading-snug">
                          {currentScene.choice_prompt || "What do you think would be the best argument?"}
                        </p>
                        {/* auto-fit means 2+ columns on a wide landscape screen
                            and a single column when narrow — no breakpoint
                            guesswork, and long choice text never gets crushed. */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[clamp(0.35rem,1.2vh,0.75rem)]">
                          {currentScene.choices.map((choice, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChoice(choice.next_scene)}
                              className="bg-[#2D1B4E]/70 hover:bg-[#9457EB] border border-[#9457EB]/60 text-white font-semibold py-[clamp(0.35rem,1.4vh,0.75rem)] px-3 rounded-lg shadow-sm transition-all text-[clamp(11px,3.2vh,14px)] text-center leading-tight break-words active:scale-[0.98]"
                            >
                              {choice.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
               )}
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <>
      {/* 
        Inject League Spartan globally. 
        Note: You can move this to your index.css or index.html later. 
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800&display=swap');
        .font-spartan { font-family: 'League Spartan', sans-serif !important; }

        /* Capacitor runs full-screen behind the notch and the gesture bar.
           index.html MUST carry viewport-fit=cover or every env() below
           resolves to 0px. See the notes that shipped with this file. */
        html, body, #root { height: 100%; }
        body { overscroll-behavior-y: none; }

        /* The 'xs' breakpoint used by the choice grid in the engine. Declared
           here so this file stays drop-in; move it into tailwind.config.js
           (theme.extend.screens.xs = '400px') when convenient. */
        @media (min-width: 400px) {
          [class~="xs:grid-cols-2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
      
      <div className="min-h-[100dvh] bg-black flex items-center justify-center font-spartan selection:bg-purple-500/30">
        <div className={`transition-all duration-500 bg-[#0B0B14] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col ${
          currentView === 'engine'
            ? 'w-full h-[100dvh] max-w-none max-h-none border-none rounded-none'
            : 'w-full max-w-[420px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] sm:border-[8px] border-[#1C1635] sm:rounded-[3rem]'
        }`}>

          {currentView === 'init' && renderInitScreen()}
          {currentView === 'splash' && renderSplash()}
          {currentView === 'auth' && renderAuthEmail()}
          {currentView === 'auth_verify' && renderAuthVerify()}
          {currentView === 'welcome' && renderWelcome()}
          {currentView === 'game_detail' && renderGameDetail()}
          {currentView === 'support' && renderCustomerSupport()}

          {currentView === 'main' && (
            <div className="flex-1 overflow-hidden flex flex-col bg-[#0B0B14]">
              {currentTab === 'home' && renderHome()}
              {currentTab === 'search' && renderSearch()}
              {currentTab === 'library' && renderLibrary()}
              {currentTab === 'achievements' && renderAchievements()}
              {currentTab === 'profile' && renderProfile()}
            </div>
          )}

          {currentView === 'main' && currentTab !== 'search' && (
            <div className="w-full bg-[#0B0B14] border-t border-[#1C1635] px-[max(0.75rem,env(safe-area-inset-left))] py-3 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-3 z-30 flex-shrink-0">
              <div className="flex justify-between items-center">
                <NavBtn icon={<BookOpen />} iconSrc={ICONS.navLibrary} label="Library" active={currentTab === 'library'} onClick={() => navigateTo('main', 'library')} />
                <NavBtn icon={<Home />} iconSrc={ICONS.navHome} label="Home" active={currentTab === 'home'} onClick={() => navigateTo('main', 'home')} />
                <NavBtn icon={<Trophy />} iconSrc={ICONS.navAchievements} label="Achievements" active={currentTab === 'achievements'} onClick={() => navigateTo('main', 'achievements')} />
                <NavBtn icon={<User />} iconSrc={ICONS.navProfile} label="Profile" active={currentTab === 'profile'} onClick={() => navigateTo('main', 'profile')} />
              </div>
            </div>
          )}

          {currentView === 'engine' && renderGameEngine()}

        </div>
      </div>
    </>
  );
}

// Reusable back button utilizing your custom SVG if provided, falling back to Lucide.
const BackButton = ({ onClick, className = '' }) => (
  <div 
    onClick={onClick} 
    className={`w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#1C1635] transition flex-shrink-0 ${className}`}
  >
    {ICONS.back ? (
      <img src={ICONS.back} alt="Back" className="w-10 h-10 object-contain" />
    ) : (
      <div className="w-10 h-10 bg-transparent border border-[#2D1B4E] rounded-full flex items-center justify-center">
        <Undo2 className="text-[#A78BFA] w-5 h-5" />
      </div>
    )}
  </div>
);

// NavBtn preferentially uses the custom iconSrc. If not mapped, falls back to Lucide.
const NavBtn = ({ icon, iconSrc, label, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={`
      flex flex-col items-center gap-1.5 cursor-pointer group px-2 py-2 rounded-xl min-w-0 flex-1
      transition-all duration-200 select-none
      ${active ? 'scale-105' : 'hover:bg-[#8B5CF6]/10 active:scale-90'}
    `}
  >
    <div className={`
      transition-all duration-300
      ${active ? 'scale-110' : 'group-hover:scale-110'}
    `}>
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={label}
          className={`
            w-6 h-6 object-contain transition-all duration-300
            ${active 
              ? 'opacity-100' 
              : 'opacity-40 group-hover:opacity-100'}
          `}
          style={active ? { 
            filter: 'drop-shadow(0 0 10px rgba(139,92,246,1)) saturate(1.3)' 
          } : { 
            filter: 'none' 
          }}
        />
      ) : (
        React.cloneElement(icon, {
          size: 24,
          strokeWidth: active ? 2.5 : 1.5,
          className: `
            transition-all duration-300
            ${active 
              ? 'text-[#8B5CF6] drop-shadow-[0_0_10px_rgba(139,92,246,1)]' 
              : 'text-[#4D3A7A] group-hover:text-[#8B5CF6] group-hover:drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]'}
          `
        })
      )}
    </div>
    
    <span className={`
      text-[clamp(8px,2.4vw,10px)] font-bold tracking-wide whitespace-nowrap transition-all duration-300
      ${active 
        ? 'text-white drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]' 
        : 'text-[#4D3A7A] group-hover:text-[#8B5CF6]'}
    `}>
      {label}
    </span>
  </div>
);