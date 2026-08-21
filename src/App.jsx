// Vystoria User App
import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
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
 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- YOUR CUSTOM ASSETS ---
const LOGO_URL = 'data:image/webp;base64,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';

import backIcon from './assets/back.svg';
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

  // Wraps your existing handleAuthContinue to also drive the countdown/success UI
  const handleResendCode = async () => {
    await handleAuthContinue();
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

  const syncMetadata = async (activeUser) => {
    if (!activeUser) return;
    const meta = activeUser.user_metadata || {};
    setUserMetadata({
      full_name: meta.full_name || 'Player One',
      avatar_url: meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      bookmarks: meta.bookmarks || [],
      reactions: meta.reactions || {},
      stats: meta.stats || { gamesStarted: [], choicesMade: 0, playTimeMins: 0 }
    });
  };

  const updateMetadata = async (updates) => {
    const newMeta = { ...userMetadata, ...updates };
    setUserMetadata(newMeta);
    if (user) await supabase.auth.updateUser({ data: newMeta });
    return newMeta;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          syncMetadata(session.user);
          setCurrentView('main');
          fetchCloudGames(session.user);
        } else {
          setCurrentView('splash');
        }
      });
    }, 2500);

    

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncMetadata(session.user);
        fetchCloudGames(session.user);
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

  const handleAuthContinue = async () => {
    if (!authEmail) return setAuthError("Email is required.");
    setAuthLoading(true); setAuthError(null); setAuthMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: { shouldCreateUser: false }
    });

    if (!error) {
      setIsNewAccount(false);
      setAuthMessage("");
      setAuthLoading(false);
      setCurrentView('auth_verify');
      return;
    }

    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('signups not allowed') || msg.includes('not found') || msg.includes('user not found')) {
      const { error: signupError } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: { emailRedirectTo: window.location.origin }
      });
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
    if (!authEmail || !authOtp) return setAuthError("Email and Code are required.");
    setAuthLoading(true); setAuthError(null);
    const { data, error } = await supabase.auth.verifyOtp({ email: authEmail, token: authOtp, type: 'email' });
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }
    setUser(data.session?.user);
    syncMetadata(data.session?.user);
    setAuthLoading(false);
    setCurrentView('welcome');
    setTimeout(() => {
      setCurrentView('main');
      fetchCloudGames(data.session?.user);
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
    <div className="w-52 h-52 mb-1 relative flex items-center justify-center">
      <img src={LOGO_URL} alt="Vystoria logo" className="w-full h-full object-contain" />
    </div>
    <h1 className="text-5xl font-bold tracking-wide -mt-4">Vystoria</h1>
  </div>
);

  const renderSplash = () => (
    <div className="flex flex-col h-full relative bg-[#050511] text-white font-saprtan">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-[#050511]/80 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col items-start justify-end h-full pb-20 px-8 text-left">
        <h1 className="text-5xl font-bold text-purple-500 mb-2 leading-[1] tracking-wide"><br/><span className="text-white">Journey Beyond Reality</span></h1>
        <p className="text-[18px] font-orelega text-gray-400 mb-10 mt-4 leading-[1.1]">Interactive stories where every choice creates a new adventure.</p>
        <button onClick={() => { setAuthError(null); setAuthMessage(null); setCurrentView('auth'); }} className="w-full h-[60px] bg-[#9457EB] hover:bg-[#4C1D95] text-white font-markazi font-bold py-4 rounded-xl shadow-purple-900/50 transition-all text-[38px] tracking-wide justify-center items-center flex">
          Get Started
        </button>
      </div>
    </div>
  );

  const renderAuthEmail = () => (
  <div className="flex flex-col h-full bg-[#141624] text-white px-4 pt-20 pb-8">

    <h2 className="text-[42px] font-extrabold font-spartan leading-tight">
      Ready to Play?
    </h2>

    <p className="mt-4 text-[29px] text-[#B5B5B5] font-markazi font-bold leading-8">
      Enter email id to log in or create a
      <br />
      new account.
    </p>

    <div className="mt-8">
      <label className="block text-[24px] font-markazi font-bold mb-3">
        Email :
      </label>

      <input
        type="email"
        value={authEmail}
        onChange={(e) => setAuthEmail(e.target.value)}
        className="
          w-full
          h-14
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
        h-14
        w-full
        rounded-lg
        font-bold
        font-markazi
        text-[32px]
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

    <p className="text-center text-[25px] text-white font-markazi font-semibold text-[18px] my-5">
      or
    </p>

    <button
      className="
        h-14
        w-full
        rounded-lg
        bg-gradient-to-r
        from-[#9457EB]
        to-[#A15DFF]
        flex
        items-center
        justify-center
        gap-5
        font-bold
        font-markazi
        text-[34px]
        
      "
    >
      <FcGoogle size={38} />

      <span>Sign-in with Google</span>
    </button>

    <p className="mt-12 text-center text-[19px] text-[#A6A6A6] leading-6 font-markazi font-semibold">
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
    <div className="flex flex-col h-full bg-[#11111E] text-white p-6 pt-12 text-left font-spartan">
      <BackButton className="mb-4 mt-0 border-0 bg-transparent size-[20px]" onClick={() => { setCurrentView('auth'); setAuthError(null); setAuthMessage(null); setAuthOtp(''); }} />
      <h2 className="text-5xl font-bold text-white mb-2 leading-[1]">
        {isNewAccount ? 'Create New \nAccount' : `Welcome Back \n${userMetadata.full_name || 'User'}`}
      </h2>

      <div className="space-y-4 w-full mt-6">
        <div>
          <label className="text-[32px] font-markazi font-bold mb-2 block">Enter Verification Code :</label>
          <p className="text-[24px] text-gray-400 mb-4 font-markazi leading-[1]">
            A verification code has been sent to your email address. Please check your inbox.
          </p>
          <input 
            type="text" 
            value={authOtp} 
            onChange={(e) => setAuthOtp(e.target.value)} 
            className="w-full bg-[#2D1B4E] rounded-lg p-4 text-white text-center tracking-[0.5em] text-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" 
          />
        </div>
        
        <button 
          onClick={handleVerifyOtp} 
          disabled={authLoading} 
          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-markazi text-4xl font-bold py-3 rounded-lg mt-4 shadow-lg disabled:opacity-50 flex justify-center items-center tracking-wide"
        >
          {authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm"}
        </button>

        {resendSuccess ? (
          <p className="text-[19px] text-green-400 font-markazi font-bold flex items-center justify-center gap-2 mt-4">
            <Check className="w-4 h-4" strokeWidth={3} />
            Verification code sent successfully !
          </p>
        ) : resendCountdown > 0 ? (
          <p className="text-[19px] text-left mt-4 text-gray-400 font-markazi font-bold flex items-center justify-center">
            Resend verification code in {resendCountdown} seconds.
          </p>
        ) : (
          <p className="text-[21px] text-left mt-4 text-gray-400 font-markazi font-medium flex items-center justify-center">
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
        className="font-spartan font-bold text-[48px] text-white leading-none"
      >
        Welcome
      </h2>

      <h1
        className="mt-3 font-spartan font-bold text-[64px] font-extrabold text-white leading-none"
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
        <div className="relative h-[480px] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer border border-[#1C1635]" onClick={() => { setSelectedGame(featuredGame); setCurrentView('game_detail'); }}>
          <img src={featuredGame.coverImage} alt="Featured" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 w-full p-6 flex flex-col items-start gap-2">
            <span className="bg-white/25 backdrop-transparent text-white px-4 py-1.5 rounded-xl text-sm font-bold tracking-wide">{featuredGame.title}</span>
            <span className="bg-white/25 backdrop-transparent text-white px-4 py-1.5 rounded-xl text-xs font-medium mb-4">{featuredGame.filename || featuredGame.subtitle}</span>
            <div className="w-full h-[50px] bg-white/25 backdrop-transparent border border-white/20 text-white py-3.5 rounded-xl font-markazi font-bold text-3xl flex justify-center items-center transition tracking-wide">
              Play
            </div>
          </div>black/50
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
                <div key={game.id + i} className="min-w-[110px] w-[110px] h-[110px] rounded-lg overflow-hidden relative snap-start cursor-pointer group border border-[#1C1635] hover:border-[#8B5CF6]/50 transition-colors" onClick={() => { setSelectedGame(game); setCurrentView('game_detail'); }}>
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
        <div className="h-px w-[full] bg-[#9457EB] mb-6"></div>

        {results.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold font-markazi text-white tracking-widest mb-4 pl-1">{searchQuery ? 'Results' : 'Top Search'}</h3>
            <div className="space-y-3">
              {results.map(game => (
                <div key={game.id} className="bg-[#1C1635] rounded-2xl p-3 flex gap-4 items-center cursor-pointer border border-transparent hover:border-[#8B5CF6]/40 transition shadow-sm" onClick={() => handleSearchResultClick(game)}>
                  <img src={game.coverImage} className="w-[80px] h-[80px] rounded-xl object-cover" alt="thumb" />
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
            <h3 className="text-4xl font-markazi font-bold text-white mb-2 tracking-wide">Search Not Found</h3>
            <p className="text-xl font-markazi text-white justify-left leading-relaxed">we couldn't find anything matching<br/>your search.</p>
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

        <div className="h-[2px] w-[full] bg-[#FFFFFF]/50 mb-6"></div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-white text-2xl font-markazi font-bold">Sort By:</span>
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-l font-markazi font-bold py-1.5 pl-3 pr-8 rounded-l focus:outline-none cursor-pointer transition-colors"
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
            <img src={empLib} alt="Empty Library" className="w-30 h-30 mb-4" />
            <h2 className="text-[40px] font-markazi font-bold text-white mb-6">Library is Empty</h2>
            <button 
              onClick={() => setCurrentTab('home')} 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-[32px] text-white px-10 py-3 rounded-lg font-markazi font-bold shadow-lg transition-colors"
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
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-10 bg-[#0B0B14] font-spartan">
        <h2 className="text-3xl font-bold text-white text-left mb-8 tracking-wide px-2">Achievements</h2>
        
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
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-16 bg-[#0B0B14] flex flex-col items-center font-spartan">
        {/* Avatar */}
        <div className="relative w-28 h-28 mb-5">
          <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#8B5CF6] shadow-[0_0_25px_rgba(139,92,246,0.6)] p-[3px]">
            <img src={userMetadata.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
          </div>
          <div onClick={handlePicEdit} className="absolute bottom-0 right-0 bg-[#1C1635] p-1.5 rounded-full cursor-pointer hover:bg-[#2D1B4E] transition border border-[#4C1D95]">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 mb-1 group cursor-pointer" onClick={handleNameEdit}>
          <h3 className="text-2xl font-markazi font-bold text-white tracking-wide">{userMetadata.full_name}</h3>
          <Edit3 className="w-5 h-5 text-white group-hover:text-white transition" />
        </div>

        {/* Email */}
        <button onClick={handleCopyEmail} className="text-2xl text-white font-markazi flex items-center gap-2 mb-14 hover:text-white transition">
          {user?.email || 'player@darkcity.com'}
          {emailCopied ? <Check className="w-4 h-4 text-green-400 font-markazi" /> : <Copy className="w-4 h-4 text-white font-markazi" />}
        </button>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <button onClick={() => setCurrentView('support')} className="w-full bg-[#9457EB80] text-[30px] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <img src={supp} alt="Support" className="w-5 h-5 object-contain text-[30px]" />
            </div>
            <span className="font-bold text-[25px]">Support</span>
          </button>
          <button onClick={() => setShowLogoutModal(true)} className="w-full bg-[#9457EB80] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <LogOut className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-[25px]">Logout</span>
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="w-full bg-[#9457EB80] text-white p-5 font-markazi flex items-center gap-4 transition shadow-md">
            <div className="">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-[25px]">Delete Account</span>
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
    <div className="flex flex-col h-full bg-[#0B0B14] text-white overflow-y-auto pb-24 relative px-6 pt-12 text-center font-spartan">
      <BackButton onClick={() => setCurrentView('main')} className="mb-6 self-start" />

      <div className="h-px w-full bg-[#FFFFFF]/50 mb-6"></div>
      
      <h1 className="text-[36px] font-markazi font-bold tracking-wide">Customer Support</h1>
      
      <div className="w-full flex flex-col items-center justify-center mt-8">
        <div className="w-32 h-32 flex items-center justify-center mb-4">
          <Mail className="w-60 h-60 text-white" strokeWidth={1.5} />
        </div>
        <p className="text-xl font-markazi text-white mb-6">Need Help ? Contact us at</p>
        <a 
          href="mailto:darkcity.atelier@gmail.com" 
          className="bg-[#5B21B6] hover:bg-[#6D28D9] text-white px-6 py-3.5 rounded-xl font-markazi font-bold text-lg transition w-full flex items-center justify-center gap-2"
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
        <div className="w-full flex justify-between items-center px-5 py-4 border-b border-[#1C1635]">
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
            <h1 className="text-2xl font-markazi font-bold tracking-wide truncate">{selectedGame.title}</h1>
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
            className="w-full bg-[#7C3AED] hover:bg-[#8B5CF6] active:scale-[0.98] text-white font-markazi font-bold py-4 rounded-[14px] shadow-[0_0_20px_rgba(124,58,237,0.4)] text-3xl transition-all tracking-wide mt-5"
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

    return (
      <div className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden font-spartan">
        <div className="w-full h-[56.25vw] max-h-screen sm:aspect-video sm:h-full sm:w-auto relative overflow-hidden bg-[#0B0B14] text-white shadow-2xl flex flex-col justify-center">

          <div className="absolute inset-0 z-0">
             <img src={engineBg} className="w-full h-full object-cover blur-sm brightness-50" alt="Engine BG" />
             <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* MAIN MENU — title top-left, buttons bottom-left, matched to screenshot */}
          {playerState === 'main_menu' && (
            <div className="relative z-10 w-full h-full">
               <h1 className="absolute top-80 left-8 text-[70px] md:text-4xl font-markazi font-bold text-white drop-shadow-xl">{selectedGame?.title || 'Visual Novel'}</h1>

               <div className="absolute left-8 bottom-8 w-full max-w-[300px] space-y-3">
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className="w-full h-18 bg-[#9457EB33]/20 backdrop-transparent-md hover:bg-[#9457EB33] text-white font-bold font-markazi py-3.5 rounded-lg text-[30px] transition border border-[#8000FF]">Start New Game</button>
                 <button onClick={() => setPlayerState('load_menu')} className="w-full h-18 bg-[#9457EB33]/20 backdrop-transparent-md hover:bg-[#9457EB33] text-white font-bold font-markazi py-3.5 rounded-lg text-[30px] transition border border-[#8000FF]">Load Game</button>
                 <button onClick={() => setCurrentView('game_detail')} className="w-full h-18 bg-[#9457EB33]/20 backdrop-transparent-md hover:bg-[#9457EB33] text-white font-bold font-markazi py-3.5 rounded-lg text-[30px] transition border border-[#8000FF]">Exit</button>
               </div>
            </div>
          )}

          {/* PAUSED — more transparent, all buttons uniform glass style, centered */}
          {playerState === 'paused' && (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 py-6 bg-black/30 backdrop-blur-[2px]">
               <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 drop-shadow-xl text-center">{selectedGame?.title || 'Visual Novel'}</h1>

               <div className="space-y-3 w-full max-w-[300px]">
                 <button onClick={() => setPlayerState('playing')} className="w-full bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF] shadow-sm">Resume</button>
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className="w-full bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/800 text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF] shadow-sm">Start New Game</button>
                 <button onClick={() => setPlayerState('save_menu')} className="w-full bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF] shadow-sm">Save Game</button>
                 <button onClick={() => setPlayerState('load_menu')} className="w-full bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF] shadow-sm">Load Game</button>
                 <button onClick={() => setCurrentView('game_detail')} className="w-full bg-[#5F448E80]/50 backdrop-blur-md hover:bg-[#5F448E80]/80 text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF] shadow-sm">Exit</button>
               </div>
            </div>
          )}

          {/* STORY END — reached a genuine ending (no valid next scene / no choices).
              Fixes the "loops back to the beginning near the last scenes" bug: an
              unresolved next_scene_default or choice target is now treated as an
              ending instead of silently falling back to scenes[0]. */}
          {playerState === 'story_end' && (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8 pb-16 pt-8 text-center bg-black/40 backdrop-blur-[2px]">
               <h1 className="text-[42px] font-markazi font-bold text-white mb-4 drop-shadow-xl">The End</h1>
               <p className="text-purple-200 font-markazi text-[22px] leading-relaxed max-w-xs mx-auto mb-10">
                 You've reached the end of this path. Thanks for playing {selectedGame?.title || 'this story'}.
               </p>
               <div className="space-y-3 w-full max-w-[300px]">
                 <button onClick={() => { setSequenceIndex(0); setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id); setPlayerState('playing'); }} className="w-full bg-[#9457EB33]/20 backdrop-transparent-md hover:bg-[#9457EB33] text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF]">Play Again</button>
                 <button onClick={() => setCurrentView('game_detail')} className="w-full bg-[#9457EB33]/20 backdrop-transparent-md hover:bg-[#9457EB33] text-white font-bold font-markazi py-3.5 rounded-lg text-[28px] transition border border-[#8000FF]">Exit</button>
               </div>
            </div>
          )}

          {/* SAVE MENU — title centered top, uniform glass slots, Back button bottom-right */}
          {playerState === 'save_menu' && (
             <div className="relative z-10 flex flex-col w-full h-full px-6 py-8 bg-black/20 backdrop-blur-[2px]">
                <h2 className="text-[32px] font-markazi font-bold text-white tracking-wide text-center mb-8 drop-shadow-md">Save Game</h2>
                <div className="flex-1 overflow-y-auto space-y-3 pb-6 no-scrollbar">
                  {saveSlots.map((slot, idx) => (
                    <button key={idx} onClick={() => setConfirmSaveIdx(idx)} className="w-full bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white text-left px-5 py-3.5 rounded-lg flex items-center gap-3 transition-all shadow-sm">
                      <Save className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="font-bold font-serif text-[15px]">Slot {idx + 1}</span>
                      <span className="text-[12px] text-purple-100/80 font-medium">{slot ? `Playtime : ${slot.date}` : 'Empty Save Slot'}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setPlayerState('paused')} className="bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white font-bold font-serif px-8 py-2.5 rounded-lg text-[15px] transition">Back</button>
                </div>
             </div>
          )}

          {/* SAVE CONFIRMATION — matched to screenshot */}
          {confirmSaveIdx !== null && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
              <div className="w-full max-w-[320px] flex flex-col items-center">
                <h2 className="text-4xl font-serif font-bold text-white text-center mb-3 drop-shadow-md">Save Game</h2>
                <p className="text-white font-bold font-markazi text-center text-[21px] mb-6 leading-snug">
                  Do you want to save your progress in slot {confirmSaveIdx + 1}?
                </p>
                <div className="w-full rounded-lg border border-purple-300/40 overflow-hidden bg-purple-500/30 backdrop-blur-md">
                  <button
                    onClick={() => { handleSaveSlot(confirmSaveIdx); setConfirmSaveIdx(null); }}
                    className="w-full py-3 font-bold font-markazi text-white border-b border-purple-300/30 hover:bg-purple-500/50 transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmSaveIdx(null)}
                    className="w-full py-3 font-bold font-markazi text-white hover:bg-purple-500/50 transition"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOAD MENU — same treatment as Save Menu, no confirmation step (unchanged behavior) */}
          {playerState === 'load_menu' && (
             <div className="relative z-10 flex flex-col w-full h-full px-6 py-8 bg-black/20 backdrop-blur-[2px]">
                <h2 className="text-[26px] font-serif font-bold text-white tracking-wide text-center mb-8 drop-shadow-md">Load Game</h2>
                <div className="flex-1 overflow-y-auto space-y-3 pb-6 no-scrollbar">
                  {saveSlots.map((slot, idx) => (
                    <button key={idx} disabled={!slot} onClick={() => handleLoadSlot(idx)} className="w-full bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white text-left px-5 py-3.5 rounded-lg flex items-center gap-3 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-purple-500/30">
                      <Download className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="font-bold font-serif text-[15px]">Slot {idx + 1}</span>
                      <span className="text-[12px] text-purple-100/80 font-medium">{slot ? `Playtime : ${slot.date}` : 'No Save Data'}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setPlayerState(storyData ? 'paused' : 'main_menu')} className="bg-purple-500/30 backdrop-blur-md hover:bg-purple-500/50 border border-purple-300/40 text-white font-bold font-serif px-8 py-2.5 rounded-lg text-[15px] transition">Back</button>
                </div>
             </div>
          )}

          {/* PLAYING — hamburger icon (no pill), dialogue & choice boxes restyled to match screenshots */}
          {playerState === 'playing' && (
            <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <img src={engineBg} className="w-full h-full object-cover" alt="Gameplay BG" />
               </div>

               {portraitUrl && (
                 <img
                   src={portraitUrl}
                   alt={currentSequenceBlock.speaker}
                   className="absolute bottom-0 right-4 sm:right-12 h-[70%] max-h-[600px] object-contain drop-shadow-2xl z-30 pointer-events-none"
                 />
               )}

               <button onClick={() => setPlayerState('paused')} className="absolute top-4 left-4 z-50 p-2 hover:bg-white/10 rounded-md transition">
                  <Menu className="w-7 h-7 text-white" strokeWidth={2.5} />
               </button>

               {(!isEndOfSequence || !(currentScene.choices && currentScene.choices.length > 0)) ? (
                 <div className="mt-auto relative z-40 px-4 pb-6 w-full flex justify-center cursor-pointer" onClick={advanceStory}>
                    <div className="relative w-full max-w-3xl">
                       {currentSequenceBlock.speaker && (
                         <div className="absolute -top-9 left-6 bg-[#9457EB] text-white font-markazi font-bold px-5 py-1.5 rounded-xl shadow-lg z-50 text-[25px] tracking-wide">
                           {currentSequenceBlock.speaker}
                         </div>
                       )}

                       <div className="bg-[#000228]/60 border-2 border-[#8B5CF6]/70 w-full min-h-[110px] rounded-xl p-5 pt-7 pb-7 text-white font-markazi text-[21px] leading-relaxed shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
                          <span className={currentSequenceBlock.type === 'narrative' ? 'italic text-[#D8B4FE]' : 'text-gray-100'}>
                             {currentSequenceBlock.text || 'The silent dark city envelops you...'}
                          </span>

                          <div className="absolute -bottom-0 right-5 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                            <ArrowRight className="w-4 h-4 text-[#4C1D95]" strokeWidth={3} />
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                    <div className="mt-auto relative z-40 px-4 pb-8 w-full flex justify-center">
                      <div className="w-full max-w-3xl bg-[#000228]/60 border-2 border-[#9457EB]/70 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                        <p className="text-white text-[16px] font-medium mb-4 leading-relaxed">
                          {currentScene.choice_prompt || "What do you think would be the best argument?"}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {currentScene.choices.map((choice, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChoice(choice.next_scene)}
                              className="bg-[#2D1B4E]/70 hover:bg-[#9457EB] border border-[#9457EB]/60 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-all text-[14px] text-center leading-tight active:scale-[0.98]"
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
      `}</style>
      
      <div className="min-h-screen bg-black flex items-center justify-center font-spartan selection:bg-purple-500/30">
        <div className={`transition-all duration-500 bg-[#0B0B14] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col ${
          currentView === 'engine'
            ? 'w-full h-[100dvh] sm:w-[100vw] sm:h-[100vh] sm:max-w-none sm:max-h-none sm:border-none sm:rounded-none'
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
            <div className="w-full bg-[#0B0B14] border-t border-[#1C1635] px-8 py-3 pb-6 sm:pb-3 z-30 flex-shrink-0">
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
      flex flex-col items-center gap-1.5 cursor-pointer group px-3 py-2 rounded-xl
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
      text-[10px] font-bold tracking-wide transition-all duration-300
      ${active 
        ? 'text-white drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]' 
        : 'text-[#4D3A7A] group-hover:text-[#8B5CF6]'}
    `}>
      {label}
    </span>
  </div>
);