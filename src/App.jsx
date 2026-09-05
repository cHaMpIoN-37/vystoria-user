// Vystoria User App
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {
  Home, Search as SearchIcon, BookOpen, Trophy, User,
  LogOut, Trash2, Mail, CheckCircle2, Settings, Loader2,
  Menu, ArrowLeft, Save, Download, Check, Bookmark,
  Edit3, Camera, Heart, ThumbsUp, ThumbsDown, Copy,
  ArrowRight, Undo2, ChevronRight, Lock
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
import empLib from './assets/empty-library.svg';
import supp from './assets/support.svg';
import initBg from './assets/init_bg.png';
import authBg from './assets/Auth_bg.png';
import mailIcon from './assets/Frame.svg';
import GoogleIcon from './assets/google.svg';
import noSearchIcon from './assets/no_search.svg';
import rightArrowIcon from './assets/right arrow.svg';
import helpIcon from './assets/Help Icon.svg';
import logoutIcon from './assets/Logout Icon.png';
import deleteIcon from './assets/Delete Icon.png';
import mailIcon1 from './assets/mailIcon1.png';
//import navHomeIcon from './assets/homee.svg';
//import navTrophyIcon from './assets/trophy.svg';
import navLibraryIcon from './assets/library.svg';
//import navProfileIcon from './assets/profile.svg';

// Achievements artwork
import trophyHero from './assets/Vystoria_Trophy_Transparent 1.png';
import achStoryJourney from './assets/01_Story_Journey 1.png';
import achEndingsReplay from './assets/02_Endings_and_Replay 1.png';
import achExploration from './assets/03_Vystoria_Compass_Transparent 1.png';
import achCompletionist from './assets/04_Completionist 1.png';
import achCommunity from './assets/05_Vystoria_Feedback_Transparent 1.png';

import artStoryJourneySummary from './assets/Story Journey Summary Artwork.png';
import artFirstStep from './assets/First Step Artwork.png';
import artOpenPages from './assets/Open Pages Artwork.png';
import artStorySeeker from './assets/story seeker Artwork.png';
import artFirstFinale from './assets/First Finale Artwork.png';
import artStorybound from './assets/Storybound Artwork.png';
import artSeasonedReader from './assets/Seasoned Reader Artwork.png';
import artStoryVeteran from './assets/Story Veteran Artwork.png';
import artStoryLegend from './assets/Story Legend Artwork.png';

import artEndingsReplaySummary from './assets/Endings and Replay.png';
import artFirstEnding from './assets/First Ending.png';
import artAnotherEnding from './assets/Another Ending.png';
import artEndingHunter from './assets/Ending Hunter.png';
import artReplayBegins from './assets/Replay Begins.png';
import artSecondJourney from './assets/Second Journey.png';
import artAllRoads from './assets/All Roads.png';

import artExplorationSummary from './assets/Exploration_Summary.png';
import artCuriousReader from './assets/Curious_Reader.png';
import artGenreHopper from './assets/Genre_Hopper.png';
import artNewHorizons from './assets/New_Horizons.png';
import artStoryBrowser from './assets/Story_Browser.png';
import artDeepExplorer from './assets/Deep_Explore.png';
import artWorldExplorer from './assets/World_Explorer.png';

import artCompletionistSummary from './assets/Completionist_Summary_Transparent 1.png';
import artFullDiscovery from './assets/Full DIscover.png';
import artDoubleComplete from './assets/Double_Complete_Transparent 1.png';
import artFivefoldFinish from './assets/Fivefold_Finish_Transparent.png';
import artCompletionPro from './assets/Completion_Pro.png';
import artMasterArchivist from './assets/Master_Archivist 1.png';


import artCommunitySummary from './assets/01_Community_Feedback_Summary_Transparent 1.png';
import artFirstReaction from './assets/02_First_Reaction_Transparent 1.png';
import artOpinionShared from './assets/03_Opinion_Shared_Transparent 1.png';
import artTrustedCritic from './assets/04_Trusted_Critic_Transparent 1.png';
import artFirstReview from './assets/05_First_Review_Transparent 1.png';
import artCommunityVoice from './assets/06_Community_Voice_Transparent 1.png';


// Home screen chrome
import homeLogo from './assets/Logo1.png';
//import searchIcon from './assets/search1.png';
import choiceBranchIcon from './assets/Choice Branch Icon.svg';
//import bookmarkButton from './assets/Bookmark Button.png';

// Nav bar — each tab ships an inactive (grey) and active (purple) variant,
// so NavBtn swaps the file instead of trying to recolour a PNG with CSS.

//import homeOff    from './assets/home1.png';
//import homeOn     from './assets/home2.png';
//import trophyOff  from './assets/Trophy1.png';
//import trophyOn   from './assets/Trophy2.png';
//import libraryOff from './assets/Library1.png';
//import libraryOn  from './assets/Library2.png';
//import profileOff from './assets/Profile1.png';
//import profileOn  from './assets/Profile2.png';

import { FcGoogle } from "react-icons/fc";
import { Search, ChevronDown } from 'lucide-react';

const ICONS = {
  back: backIcon,
  logo: homeLogo,
  choiceBranch: choiceBranchIcon,
  emptyLibrary: empLib,
  support: supp,
  noSearch: noSearchIcon,
  rightArrow: rightArrowIcon,
  help: helpIcon,
  logout: logoutIcon,
  deleteAccount: deleteIcon,
  //navHome: navHomeIcon,
  //navAchievements: navTrophyIcon,
  navLibrary: navLibraryIcon,
  //navProfile: navProfileIcon,
  //search: searchIcon,
  //bookmark: bookmarkButton,

  // Nav tabs: { off, on } pairs consumed by NavBtn.
  //navHome:         { off: homeOff,    on: homeOn },
  //navAchievements: { off: trophyOff,  on: trophyOn },
  //navLibrary:      { off: libraryOff, on: libraryOn },
  //navProfile:      { off: profileOff, on: profileOn },
};

const MOCK_GAMES = [
  { id: '1', title: 'Demon Slayer', subtitle: 'Chapter 1: The Wise Man', genre: 'Action', coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop', likes: 8, dislikes: 2, progress: 0 },
  { id: '2', title: 'Naruto', subtitle: 'Hidden Leaf', genre: 'Action', coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop', likes: 0, dislikes: 0, progress: 0 },
  { id: '3', title: 'One Piece', subtitle: 'Romance Dawn', genre: 'Adventure', coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', likes: 5, dislikes: 0, progress: 10 },
  { id: '4', title: 'Another', subtitle: 'Class 3-3', genre: 'Horror', coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1555580399-5219d2eb0543?q=80&w=1200&auto=format&fit=crop', likes: 4, dislikes: 1, progress: 0 },
  { id: '5', title: 'Vinland Saga', subtitle: 'True Warrior', genre: 'Historical', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', bgImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop', likes: 12, dislikes: 0, progress: 100 },
];

// --- ACHIEVEMENTS ---------------------------------------------------------
// Category chrome lives here; the badges themselves come from
// public.achievements via the get_achievements RPC. plannedTotal is a
// placeholder for categories that have no catalogue rows yet — the moment you
// seed one, the DB count takes over and the row becomes tappable.
const ACHIEVEMENT_CATEGORIES = [
  { id: 'story',       title: 'Story Journey',        icon: achStoryJourney,  art: artStoryJourneySummary,  plannedTotal: 8 },
  { id: 'endings',     title: 'Endings & Replay',     icon: achEndingsReplay, art: artEndingsReplaySummary, plannedTotal: 6 },
  { id: 'exploration', title: 'Exploration',          icon: achExploration,   art: artExplorationSummary,   plannedTotal: 6 },
  { id: 'completion',  title: 'Completionist',        icon: achCompletionist, art: artCompletionistSummary, plannedTotal: 5 },
  { id: 'community',   title: 'Community & Feedback', icon: achCommunity,     art: artCommunitySummary,     plannedTotal: 5 },
];

// Keyed by public.achievements.id. A badge with no entry falls back to its
// category tile art, so adding a catalogue row never white-screens the grid.
const ACHIEVEMENT_ART = {
  // story
  first_step:      artFirstStep,
  open_pages:      artOpenPages,
  story_seeker:    artStorySeeker,
  first_finale:    artFirstFinale,
  storybound:      artStorybound,
  seasoned_reader: artSeasonedReader,
  story_veteran:   artStoryVeteran,
  story_legend:    artStoryLegend,
  // endings
  first_ending:    artFirstEnding,
  another_ending:  artAnotherEnding,
  ending_hunter:   artEndingHunter,
  replay_begins:   artReplayBegins,
  second_journey:  artSecondJourney,
  all_roads:       artAllRoads,
  // exploration
  curious_reader:  artCuriousReader,
  genre_hopper:    artGenreHopper,
  new_horizons:    artNewHorizons,
  story_browser:   artStoryBrowser,
  deep_explorer:   artDeepExplorer,
  world_explorer:  artWorldExplorer,
  // completion
  full_discovery:   artFullDiscovery,
  double_complete:  artDoubleComplete,
  fivefold_finish:  artFivefoldFinish,
  completion_pro:   artCompletionPro,
  master_archivist: artMasterArchivist,

};


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

// An ending is a scene the engine cannot advance out of: no choices, and no
// next_scene_default that resolves to a real scene. This MUST match the
// terminal-scene test in advanceStory — if the two definitions drift, the
// "All Roads" badge becomes unreachable.
const countStoryEndings = (story) => {
  if (!story?.scenes?.length) return 0;
  const ids = new Set(story.scenes.map(s => s.id));
  return story.scenes.filter(s => {
    const hasChoices = Array.isArray(s.choices) && s.choices.length > 0;
    const hasNext    = s.next_scene_default && ids.has(s.next_scene_default);
    return !hasChoices && !hasNext;
  }).length;
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


  // --- ACHIEVEMENTS STATE ---
  const [achievements, setAchievements] = useState([]);                       // rows from get_achievements()
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [activeAchievementCategory, setActiveAchievementCategory] = useState(null); // null = category list

  // evaluate_achievements() is idempotent and pinned to auth.uid() server-side.
  // The user_progress trigger already unlocks badges the instant progress is
  // written, so this call is belt-and-braces for the case where a trigger was
  // skipped (e.g. rows imported directly, or a warning swallowed a failure).
  const fetchAchievements = async (activeUser = user) => {
    if (!activeUser) { setAchievements([]); return; }
    setAchievementsLoading(true);
    try {
      const { error: evalError } = await supabase.rpc('evaluate_achievements');
      if (evalError) console.error('evaluate_achievements failed:', evalError);

      const { data, error } = await supabase.rpc('get_achievements');
      if (error) throw error;
      setAchievements(data || []);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setAchievementsLoading(false);
    }
  };

  // Refetch whenever the tab is opened, and again on returning from the engine
  // (currentView flips engine -> main), so a badge earned mid-story is present
  // by the time the player looks for it.
  useEffect(() => {
    if (currentView === 'main' && currentTab === 'achievements' && user) {
      fetchAchievements(user);
    }
  }, [currentView, currentTab, user]);
  
  // --- SCENE VISIT TRACKING (Completionist) ---
  // Scene changes happen every few seconds, so visits are buffered in a ref and
  // flushed in batches. A ref, not state: this must never trigger a re-render
  // mid-scene, and the engine reads it only at flush time.
  const visitedScenesRef = useRef(new Set());
  const visitFlushStoryRef = useRef(null);

  // record_scene_visits dedupes server-side, so re-sending a scene is harmless
  // and we don't need to track what was already flushed. The buffer is only
  // cleared on a confirmed success — a failed flush is retried by the next one.
  const flushSceneVisits = async () => {
    const storyId = visitFlushStoryRef.current;
    const scenes = Array.from(visitedScenesRef.current);
    if (!user || !storyId || scenes.length === 0) return;

    try {
      const { error } = await supabase.rpc('record_scene_visits', {
        story_id_input: storyId,
        scene_ids_input: scenes,
      });
      if (error) throw error;
      visitedScenesRef.current = new Set();
    } catch (err) {
      console.error('record_scene_visits failed:', err);
    }
  };


  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAccNotFound, setShowAccNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);
  const [supportCopied, setSupportCopied] = useState(false);

  const [playerState, setPlayerState] = useState('main_menu');
  const [saveSlots, setSaveSlots] = useState(Array(8).fill(null));
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [cloudGames, setCloudGames] = useState([]);
  const [storyData, setStoryData] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);

  // Every scene the player lands on goes in the buffer, including the one they
  // resume onto. Cheap — a Set add, no network.
  //
  // Must live BELOW the currentSceneId declaration: a dependency array is a
  // plain array literal evaluated during render, so referencing a `const`
  // declared further down throws a TDZ ReferenceError before the first paint.
  useEffect(() => {
    if (currentView === 'engine' && currentSceneId && selectedGame?.isCloud) {
      visitFlushStoryRef.current = selectedGame.id;
      visitedScenesRef.current.add(currentSceneId);
    }
  }, [currentSceneId, currentView, selectedGame]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [playerError, setPlayerError] = useState(null);

  const [sortBy, setSortBy] = useState('recentlyAdded');
  const [libraryFilter, setLibraryFilter] = useState('all');   // 'all' | 'in_progress' | 'saved' | 'completed'

  const [confirmSaveIdx, setConfirmSaveIdx] = useState(null); // slot index awaiting "Do you want to save?" confirmation

    const fetchCloudGames = async (activeUser = user) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return;

      // story_id -> { percent, updatedAt }. updatedAt drives the ordering of
      // the "Continue your story" rail; without it the rail is arbitrary.
      const progressMap = {};
      if (activeUser) {
        const { data: progressRows } = await supabase
          .from('user_progress')
          .select('story_id, progress_percent, updated_at')
          .eq('user_id', activeUser.id);
        if (progressRows) {
          progressRows.forEach(r => {
            progressMap[r.story_id] = {
              percent: r.progress_percent || 0,
              updatedAt: r.updated_at || null,
            };
          });
        }
      }

      const games = data.map((story, i) => {
        const filename = story.url.substring(story.url.lastIndexOf('/') + 1);
        const prog = progressMap[story.id] || {};
        return {
          id: story.id,
          title: story.title,
          subtitle: story.subtitle || '',
          description: story.description || '',
          filename: filename,
          genre: story.genre || 'Uncategorized',
          coverImage: story.cover_image || MOCK_GAMES[i % MOCK_GAMES.length].coverImage,
          bgImage: MOCK_GAMES[i % MOCK_GAMES.length].bgImage,
          likes: story.likes || 0,
          dislikes: story.dislikes || 0,
          isCloud: true,
          isFeatured: !!story.is_featured,
          trendingScore: Number(story.trending_score) || 0,
          playCount: story.play_count || 0,
          progress: prog.percent || 0,
          lastPlayedAt: prog.updatedAt || null,
          search_count: story.search_count || 0,
          assets: story.assets || {}
        };
      });
      setCloudGames(games);
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
      // Aggregate counters on public.stories — unchanged.
      await supabase.rpc('adjust_story_reaction', {
        story_id_input: gameId,
        new_reaction: nextReaction,
        old_reaction: currentReaction
      });
    } catch (err) {
      console.error('Failed to sync reaction:', err);
    }

    try {
      // Per-user ledger the Community badges count. user_metadata is still
      // written above for the optimistic UI, but it is no longer the only
      // record of who reacted to what — and it is not what the badges trust,
      // since updateUser() lets a client write it directly.
      const { error } = await supabase.rpc('record_story_reaction', {
        story_id_input: gameId,
        reaction_input: nextReaction
      });
      if (error) throw error;
    } catch (err) {
      console.error('record_story_reaction failed:', err);
    }
  };



  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard?.writeText(user.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

  const SUPPORT_EMAIL = 'darkcity.atelier@gmail.com';

  const handleCopySupportEmail = () => {
    navigator.clipboard?.writeText(SUPPORT_EMAIL);
    setSupportCopied(true);
    setTimeout(() => setSupportCopied(false), 1500);
  };

  
  // Single entry point into game_detail from anywhere in the app. Previously
  // this lived inside renderHome, so novels opened from Search or the Library
  // never recorded a view — which would have quietly broken the "View N novel
  // pages" badges. Hoisted so all three call sites share it.
  //
  // record_story_view handles both the global trending counter and the
  // per-user story_views ledger the Exploration badges read, and dedupes per
  // user/story/hour server-side. Safe to call on every tap, no debounce needed.
  const openGame = (game) => {
    if (!game) return;
    setSelectedGame(game);
    setCurrentView('game_detail');

    if (game.isCloud && user) {
      supabase.rpc('record_story_view', { story_id_input: game.id })
        .then(({ error }) => { if (error) console.error('record_story_view failed:', error); });
    }
  };
  
  const handleSearchResultClick = async (game) => {
    openGame(game);

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

      if (user && selectedGame.isCloud) {
        // Source of truth for "novels started". Creates a 0% user_progress row
        // on conflict-do-nothing, which fires the achievement trigger.
        supabase.rpc('mark_story_started', { story_id_input: selectedGame.id })
          .then(({ error: startError }) => {
            if (startError) console.error('mark_story_started failed:', startError);
          });

        // Needed by the "All Roads" badge. Write-once server-side, so the
        // first player to open a story fixes the number for everyone.
        supabase.rpc('report_story_structure', {
          story_id_input: selectedGame.id,
          ending_count_input: countStoryEndings(json),
          scene_count_input: json.scenes.length,
        }).then(({ error: structError }) => {
          if (structError) console.error('report_story_structure failed:', structError);
        });
      }

      // Legacy mirror. Kept so anything still reading userMetadata.stats keeps
      // working; achievements no longer depend on it.
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
      visitedScenesRef.current = new Set();
      visitFlushStoryRef.current = selectedGame.id;
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
      if (user && selectedGame) {
        visitedScenesRef.current.add(currentSceneId);
        // Flush first: the ending scene itself is part of "fully explored", and
        // the player may exit straight from the end screen without another flush.
        flushSceneVisits().finally(() => {
          supabase.rpc('record_story_ending', {
            story_id_input: selectedGame.id,
            ending_scene_id_input: currentSceneId,
          }).then(({ error }) => {
            if (error) {
              console.error('record_story_ending failed:', error);
              return;
            }
            setCloudGames(prev => prev.map(g => g.id === selectedGame.id ? { ...g, progress: 100 } : g));
            setSelectedGame(prev => prev ? { ...prev, progress: 100 } : prev);
          });
        });
      }
      setPlayerState('story_end');
    }
  };

  // Single entry point for every "Start New Game" / "Play Again" button.
  // record_story_replay is guarded server-side (it only counts when
  // completed_at is already set), so the client can call it unconditionally
  // and never has to work out whether this is a first run or a replay.
  const startNewPlaythrough = () => {
    setSequenceIndex(0);
    setCurrentSceneId(storyData?.starting_scene || storyData?.scenes?.[0]?.id);
    setPlayerState('playing');

    if (user && selectedGame?.isCloud) {
      supabase.rpc('record_story_replay', { story_id_input: selectedGame.id })
        .then(({ error }) => { if (error) console.error('record_story_replay failed:', error); });
    }
  };

  // Leaving the engine is the main flush point — most sessions end here rather
  // than at an ending.
  const exitToDetail = () => {
    flushSceneVisits();
    setCurrentView('game_detail');
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
    // Tapping a nav tab always returns to the category list, never a stale
    // drill-down from a previous visit.
    setActiveAchievementCategory(null);
    window.scrollTo(0, 0);
  };

  const renderInitScreen = () => (
  <div className="relative flex flex-col h-full bg-[#11111E] text-white text-center items-center justify-center overflow-hidden">

    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center"
      />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center">
      <div className="w-[min(52vw,13rem)] h-[min(52vw,13rem)] mb-1 relative flex items-center justify-center">
        <img src={logoUrl} alt="Vystoria logo" className="w-full h-full object-contain" />
      </div>
      <h1
        className="font-fraunces font-bold text-white tracking-wide -mt-4"
        style={{ fontSize: 'clamp(1.9rem, 8.5vw, 2.6rem)' }}
      >
        Vystoria
      </h1>
    </div>
  </div>
);

    const renderSplash = () => (
    <div className="flex flex-col h-full relative bg-[#0B0B14] text-white overflow-hidden">
      {/* Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={initBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-top"
        />
        {/* Scrim so the copy stays legible over the illustration */}
        
      </div>

      {/* Copy + CTA */}
      <div
        className="relative z-10 flex flex-col items-start justify-end h-full w-full px-6 text-left"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + clamp(1.5rem, 5vh, 2.75rem))',
          paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1.5rem)',
          paddingRight: 'calc(env(safe-area-inset-right, 0px) + 1.5rem)',
        }}
      >
        <h1
          className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(1.9rem, 8.5vw, 2.6rem)' }}
        >
          Journey<br />Beyond Reality
        </h1>

        <p
          className="font-manrope text-[#B9B4C9] mt-4 leading-[1.45]"
          style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
        >
          Interactive stories where every choice<br className="hidden xs:inline" /> creates a new adventure.
        </p>

        <button
          onClick={() => { setAuthError(null); setAuthMessage(null); setCurrentView('auth'); }}
          className="w-full mt-8 min-h-[56px] flex items-center justify-center rounded-2xl
                     bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                     active:from-[#6D28D9] active:to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A472F0]
                     shadow-lg shadow-purple-900/40 transition-all
                     font-manrope font-semibold text-white tracking-wide"
          style={{ fontSize: 'clamp(1rem, 4.2vw, 1.15rem)' }}
        >
          Get Started
        </button>
      </div>
    </div>
  );



const renderAuthEmail = () => (
  <div className="flex flex-col h-full relative bg-[#1A0F33] text-white overflow-hidden">

    {/* Artwork */}
    <div className="absolute inset-0 z-0">
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center"
      />
      
    </div>

    {/* Content */}
    <div
      className="relative z-10 flex flex-col h-full w-full overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + clamp(2.5rem, 8vh, 4.5rem))',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + clamp(1.5rem, 4vh, 2.5rem))',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
      }}
    >

      <h2
        className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(1.75rem, 7.5vw, 2.35rem)' }}
      >
        Ready to Play?
      </h2>

      <p
        className="font-manrope text-[#C2BBD4] mt-3 leading-[1.45]"
        style={{ fontSize: 'clamp(0.875rem, 3.8vw, 1rem)' }}
      >
        Enter email id to log in or create a new account.
      </p>

      <label
        className="block font-manrope font-medium text-white mt-8 mb-3"
        style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
      >
        Email Address:
      </label>

      <div className="relative w-full">
        <img
          src={mailIcon}
          alt=""
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
        />
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          className="w-full min-h-[52px] rounded-xl bg-[#E9E3F5] pl-14 pr-4
                     font-manrope text-[#1A0F33] caret-[#7C3AED]
                     placeholder:text-[#1A0F33]/40
                     border border-transparent focus:border-[#9457EB]
                     focus:outline-none transition-colors"
          style={{ fontSize: 'clamp(0.95rem, 4vw, 1.05rem)' }}
        />
      </div>

      {authError && (
        <p className="mt-2 font-manrope text-xs text-red-400">
          {authError}
        </p>
      )}

      <button
        onClick={handleAuthContinue}
        disabled={authLoading}
        className="w-full mt-5 min-h-[52px] flex items-center justify-center rounded-xl
                   bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                   active:from-[#6D28D9] active:to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A472F0]
                   shadow-lg shadow-purple-900/40 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   font-manrope font-semibold text-white tracking-wide"
        style={{ fontSize: 'clamp(1rem, 4.2vw, 1.1rem)' }}
      >
        {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
      </button>

      <div className="flex items-center gap-4 my-6">
        <span className="flex-1 h-px bg-white/20"></span>
        <span
          className="font-manrope text-white/70"
          style={{ fontSize: 'clamp(0.85rem, 3.6vw, 0.95rem)' }}
        >
          or
        </span>
        <span className="flex-1 h-px bg-white/20"></span>
      </div>

      <button
        className="w-full min-h-[52px] flex items-center justify-center gap-3 rounded-xl
                   bg-white active:bg-[#EFEFEF] hover:bg-[#F7F7F7] transition-colors
                   font-manrope font-semibold text-[#1A0F33]"
        style={{ fontSize: 'clamp(0.95rem, 4vw, 1.05rem)' }}
      >
        <FcGoogle size={24} />
        <span>Sign-in with Google</span>
      </button>

      <p
        className="pt-10 text-center font-manrope text-[#B0A9C4] leading-[1.6]"
        style={{ fontSize: 'clamp(0.75rem, 3.2vw, 0.85rem)' }}
      >
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
  </div>
);

  const renderAuthVerify = () => (
  <div className="flex flex-col h-full relative bg-[#1A0F33] text-white overflow-hidden">

    {/* Artwork */}
    <div className="absolute inset-0 z-0">
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center"
      />
    </div>

    {/* Content */}
    <div
      className="relative z-10 flex flex-col h-full w-full overflow-y-auto px-6 text-left"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + clamp(2.5rem, 8vh, 3rem))',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + clamp(1.5rem, 4vh, 2.5rem))',
      }}
    >
      <BackButton
        className="mb-4 mt-0 border-0 bg-transparent size-[20px]"
        onClick={() => { setCurrentView('auth'); setAuthError(null); setAuthMessage(null); setAuthOtp(''); }}
      />

      <h2
        className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(1.75rem, 7.5vw, 2.35rem)' }}
      >
        {isNewAccount ? 'Create New Account' : `Welcome Back ${userMetadata.full_name || 'User'}`}
      </h2>

      <div className="space-y-4 w-full mt-6">
        <div>
          
          <p
            className="font-manrope text-[#C2BBD4] mb-4 leading-[1.45]"
            style={{ fontSize: 'clamp(0.875rem, 3.8vw, 1rem)' }}
          >
            A verification code has been sent to your email address. Please check your inbox.
          </p>
          <br />
          <label
            className="block font-manrope font-medium text-white mb-3"
            style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
          >
            Enter Verification Code :
          </label>
          <input
            type="text"
            value={authOtp}
            onChange={(e) => setAuthOtp(e.target.value)}
            className="w-full min-h-[52px] rounded-xl bg-[#E9E3F5] px-4
                       font-manrope text-[#1A0F33] caret-[#7C3AED] text-center
                       tracking-[0.4em] indent-[0.4em]
                       border border-transparent focus:border-[#9457EB]
                       focus:outline-none transition-colors"
            style={{ fontSize: 'clamp(0.95rem, 4vw, 1.05rem)' }}
          />
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={authLoading}
          className="w-full min-h-[52px] flex items-center justify-center rounded-xl
                     bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                     active:from-[#6D28D9] active:to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A472F0]
                     shadow-lg shadow-purple-900/40 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-manrope font-semibold text-white tracking-wide mt-4"
          style={{ fontSize: 'clamp(1rem, 4.2vw, 1.1rem)' }}
        >
          {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
        </button>

        {resendSuccess ? (
          <p
            className="font-manrope font-bold text-green-400 flex items-center justify-center gap-2 mt-4"
            style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.95rem)' }}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
            Verification code sent successfully !
          </p>
        ) : resendCountdown > 0 ? (
          <p
            className="font-manrope font-medium text-[#B0A9C4] flex items-center justify-center text-center mt-4"
            style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.95rem)' }}
          >
            Resend code in 00:{resendCountdown.toString().padStart(2, '0')}
          </p>
        ) : (
          <p
            className="font-manrope font-medium text-[#B0A9C4] flex flex-wrap items-center justify-center text-center mt-4"
            style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.95rem)' }}
          >
            Didn't get code? Check spam or{' '}
            <button
              onClick={handleResendCode}
              disabled={authLoading}
              className="text-white underline font-manrope font-bold ml-1 disabled:opacity-50"
            >
              resend it.
            </button>
          </p>
        )}
      </div>
    </div>
  </div>
);

  const renderWelcome = () => (
  <div className="relative h-full w-full">

    {/* Background Image */}
    <img
      src={authBg}
      alt="Background"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Content */}
    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">

      <h2
        className="font-manrope font-normal text-white leading-none"
        style={{ fontSize: 'clamp(1.1rem, 4.8vw, 1.4rem)' }}
      >
        Welcome
      </h2>

      <h1
        className="mt-3 font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em] break-words max-w-full"
        style={{ fontSize: 'clamp(2.1rem, 9.5vw, 3.2rem)' }}
      >
        {userMetadata.full_name || "User"}
      </h1>

    </div>

  </div>
);

    const renderHome = () => {
    const displayList = cloudGames.length > 0 ? cloudGames : MOCK_GAMES;

    const categories = [
      { title: 'Horror',  list: displayList.filter(g => g.genre?.toLowerCase().includes('horror')) },
      { title: 'Action',   list: displayList.filter(g => g.genre?.toLowerCase().includes('action') || g.genre?.toLowerCase().includes('Scifi')) },
      { title: 'Mystery', list: displayList.filter(g => g.genre?.toLowerCase().includes('mystery') || g.genre?.toLowerCase().includes('adventure')) },
    ];

    // Single entry point into game_detail so the view ping is never forgotten.
    // record_story_view dedupes per user/story/hour server-side, so calling it
    // on every tap is safe and we don't need to debounce here.
    const openGame = (game) => {
      setSelectedGame(game);
      setCurrentView('game_detail');
      if (game.isCloud) {
        supabase.rpc('record_story_view', { story_id_input: game.id })
          .then(({ error }) => { if (error) console.error('record_story_view failed:', error); });
      }
    };

    const SectionHeader = ({ title, onViewAll }) => (
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3
          className="font-manrope font-semibold text-white tracking-wide"
          style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
        >
          {title}
        </h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 font-manrope font-medium text-[#B65AFF]
                     hover:text-[#FFFFFF] transition-colors flex-shrink-0"
          style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.82rem)' }}
        >
          View all
          <img src={ICONS.rightArrow} alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
        </button>
      </div>
    );

    // ---------- CATEGORY DRILL-DOWN (unchanged behaviour, restyled) ----------
    // ---------- CATEGORY DRILL-DOWN ("View all" target) ----------
    if (activeCategory) {
      const activeList = categories.find(c => c.title === activeCategory)?.list || displayList;

      return (
        <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

          <div className="absolute inset-0 z-0">
            <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/70 via-[#0B0B14]/40 to-[#0B0B14]/80" />
          </div>

          <div
            className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
            style={{
              paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(0.75rem, 2.5vh, 1.25rem))',
              paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
              paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
              paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
            }}
          >

            {/* Top bar — back left, search right, mirroring the Home header
                so the two screens feel like the same surface. */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setActiveCategory(null)}
                aria-label="Back"
                className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center
                           bg-[#1A0F33]/70 backdrop-blur-md border border-[#9457EB]/50
                           hover:border-[#9457EB] active:scale-90 transition-all"
              >
                <Undo2 className="w-5 h-5 text-[#A855F7]" strokeWidth={2.25} />
              </button>

              <button
                onClick={() => { setActiveCategory(null); setCurrentTab('search'); }}
                aria-label="Search"
                className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center
                           bg-[#2A1B4D]/70 backdrop-blur-md border border-[#9457EB]/40
                           hover:border-[#9457EB] active:scale-90 transition-all"
              >
                <SearchIcon className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </button>
            </div>

            {/* Title block — genre name in Fraunces, count in Manrope */}
            <div className="mb-5">
              <h1
                className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(1.9rem, 8.4vw, 2.6rem)' }}
              >
                {activeCategory}
              </h1>
              <p
                className="font-manrope text-[#C2BBD4] mt-1 leading-[1.4]"
                style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)' }}
              >
                {activeList.length} {activeList.length === 1 ? 'story' : 'stories'}
              </p>
            </div>

            {/* Grid — same card anatomy as Library: art on top, dark panel below */}
            {activeList.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {activeList.map((game) => {
                  const bookmarked = userMetadata.bookmarks.includes(game.id);
                  return (
                    <div
                      key={game.id}
                      onClick={() => openGame(game)}
                      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group
                                 bg-[#15111F] border border-white/10 shadow-lg shadow-black/50"
                    >
                      <div className="relative w-full aspect-square flex-shrink-0 overflow-hidden">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="absolute inset-0 w-full h-full object-cover
                                     group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#15111F] to-transparent pointer-events-none" />

                        {/* stopPropagation so bookmarking doesn't open the detail view */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(game.id); }}
                          aria-label={bookmarked ? 'Remove from library' : 'Add to library'}
                          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center
                                     active:scale-90 transition-transform"
                        >
                          <Bookmark
                            className={`w-[22px] h-[22px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                                        ${bookmarked
                                          ? 'text-[#A855F7] fill-[#A855F7]'
                                          : 'text-white/85 fill-white/25'}`}
                          />
                        </button>
                      </div>

                      <div className="px-3 pt-2.5 pb-3">
                        <h4
                          className="font-fraunces font-bold text-white leading-tight line-clamp-2"
                          style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
                        >
                          {game.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                <img
                  src={ICONS.noSearch}
                  alt=""
                  aria-hidden="true"
                  className="w-[min(34vw,140px)] h-[min(34vw,140px)] object-contain mb-5 opacity-70"
                />
                <p
                  className="font-manrope text-[#C2BBD4] leading-[1.5]"
                  style={{ fontSize: 'clamp(0.85rem, 3.6vw, 1rem)' }}
                >
                  No {activeCategory.toLowerCase()} stories yet.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ---------- HOME ----------
    // is_featured is uniquely indexed server-side, so at most one story can
    // claim the badge. If nobody has, the top trending story stands in.
    const featuredGame =
      displayList.find(g => g.isFeatured) ||
      [...displayList].sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))[0] ||
      MOCK_GAMES[0];

    const continueList = displayList
      .filter(g => (g.progress || 0) > 0 && (g.progress || 0) < 100)
      .sort((a, b) => new Date(b.lastPlayedAt || 0) - new Date(a.lastPlayedAt || 0));

    // trending_score is recomputed by pg_cron every 15 min. search_count is the
    // tiebreaker so a cold table (all scores 0) still orders sensibly.
    const trendingList = [...displayList]
      .sort((a, b) =>
        (b.trendingScore || 0) - (a.trendingScore || 0) ||
        (b.search_count || 0) - (a.search_count || 0)
      )
      .slice(0, 10);

    const featuredBookmarked = userMetadata.bookmarks.includes(featuredGame.id);

    return (
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

        {/* Artwork — same treatment as Library and the auth screens */}
        <div className="absolute inset-0 z-0">
          <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
        </div>

        <div
          className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
          style={{
            paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(0.75rem, 2.5vh, 1.25rem))',
            paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
            paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
            paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
          }}
        >

          {/* ---------- TOP BAR ---------- */}
          {/* ---------- TOP BAR ---------- */}
          <div className="flex items-center justify-between mb-4">
            <img src={ICONS.logo} alt="Vystoria" className="w-10 h-10 object-contain flex-shrink-0" />
            <button
              onClick={() => setCurrentTab('search')}
              aria-label="Search"
              className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center
                         bg-[#2A1B4D]/70 backdrop-blur-md border border-[#9457EB]/40
                         hover:border-[#9457EB] active:scale-90 transition-all"
            >
              <SearchIcon className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* ---------- FEATURED HERO ---------- */}
          {/* ---------- FEATURED HERO ---------- */}
          {/* Same anatomy as the Library card: art on top at a fixed ratio,
              then a solid panel that sizes to its content. The old version
              overlaid text on the image, which meant a light or busy cover
              (a screenshot, say) made the title unreadable. */}
          <div
            onClick={() => openGame(featuredGame)}
            className="relative flex flex-col rounded-[1.5rem] overflow-hidden cursor-pointer
                       border border-white/10 bg-[#15111F] shadow-2xl shadow-black/60 mb-7"
          >
            {/* Cover art */}
            <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden">
              <img
                src={featuredGame.coverImage}
                alt={featuredGame.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Fade into the panel so the seam isn't a hard line */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#15111F] to-transparent pointer-events-none" />

              <span
                className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full
                           bg-[#7C3AED] shadow-lg shadow-purple-900/50
                           font-manrope font-bold text-white uppercase tracking-[0.12em]"
                style={{ fontSize: 'clamp(0.55rem, 2.4vw, 0.65rem)' }}
              >
                Featured
              </span>
            </div>

            {/* Info panel */}
            <div className="px-4 pt-1 pb-4">
              <h2
                className="font-fraunces font-bold text-white leading-[1.1] tracking-[-0.01em] line-clamp-2"
                style={{ fontSize: 'clamp(1.4rem, 6.2vw, 1.85rem)' }}
              >
                {featuredGame.title}
              </h2>

              <p
                className="font-manrope font-semibold text-[#A855F7] mt-1.5"
                style={{ fontSize: 'clamp(0.78rem, 3.4vw, 0.9rem)' }}
              >
                {featuredGame.genre}
              </p>

              <p
                className="font-manrope text-[#C2BBD4] mt-2 leading-[1.5] line-clamp-2"
                style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.85rem)' }}
              >
                {featuredGame.description || featuredGame.subtitle || 'A story where every choice writes a new ending.'}
              </p>

              <div className="flex items-stretch gap-2.5 mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); openGame(featuredGame); }}
                  className="flex-1 min-h-[52px] flex items-center justify-center gap-2.5 rounded-xl
                             bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                             active:from-[#6D28D9] active:to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A472F0]
                             shadow-lg shadow-purple-900/50 transition-all active:scale-[0.98]
                             font-manrope font-semibold text-white tracking-wide"
                  style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.02rem)' }}
                >
                  <img src={ICONS.choiceBranch} alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
                  Start story
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(featuredGame.id); }}
                  aria-label={featuredBookmarked ? 'Remove from library' : 'Add to library'}
                  className={`w-[52px] min-h-[52px] flex-shrink-0 rounded-xl flex items-center justify-center
                              border transition-all active:scale-90
                              ${featuredBookmarked
                                ? 'bg-[#7C3AED]/30 border-[#9457EB]'
                                : 'bg-white/[0.04] border-white/20 hover:border-[#9457EB]/70'}`}
                >
                  <Bookmark
                    className={`w-[19px] h-[19px] ${featuredBookmarked ? 'text-[#A855F7] fill-[#A855F7]' : 'text-white'}`}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ---------- CONTINUE YOUR STORY ---------- */}
          {continueList.length > 0 && (
            <div className="mb-7">
              <SectionHeader title="Continue your story" onViewAll={() => setCurrentTab('library')} />

              <div className="space-y-2.5">
                {continueList.slice(0, 3).map((game) => {
                  const progress = Math.min(100, Math.max(0, game.progress || 0));
                  return (
                    <div
                      key={game.id}
                      onClick={() => openGame(game)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer group
                                 bg-[#15111F]/85 backdrop-blur-md border border-white/10
                                 shadow-lg shadow-black/40 active:scale-[0.99] transition-transform"
                    >
                      <div className="w-[22vw] max-w-[92px] aspect-square flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-1">
                        <h4
                          className="font-fraunces font-bold text-white leading-tight truncate"
                          style={{ fontSize: 'clamp(0.95rem, 4.1vw, 1.15rem)' }}
                        >
                          {game.title}
                        </h4>

                        <div className="w-full h-[4px] rounded-full bg-white/15 overflow-hidden mt-2.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <p
                          className="font-manrope font-medium text-[#C2BBD4] mt-1.5"
                          style={{ fontSize: 'clamp(0.65rem, 2.9vw, 0.78rem)' }}
                        >
                          {progress}% completed
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- TRENDING NOW ---------- */}
          {trendingList.length > 0 && (
            <div className="mb-7">
              <SectionHeader title="Trending now" onViewAll={() => setCurrentTab('search')} />

              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 snap-x">
                {trendingList.map((game) => {
                  const progress = Math.min(100, Math.max(0, game.progress || 0));
                  return (
                    <div
                      key={game.id}
                      onClick={() => openGame(game)}
                      className="flex-shrink-0 w-[34vw] max-w-[140px] snap-start flex flex-col
                                 rounded-2xl overflow-hidden cursor-pointer group
                                 bg-[#15111F] border border-white/10 shadow-lg shadow-black/50"
                    >
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#15111F] to-transparent pointer-events-none" />
                      </div>

                      <div className="px-2.5 pt-2 pb-2.5">
                        <h4
                          className="font-fraunces font-bold text-white leading-tight truncate"
                          style={{ fontSize: 'clamp(0.85rem, 3.7vw, 1rem)' }}
                        >
                          {game.title}
                        </h4>
                        {progress > 0 && (
                          <div className="w-full h-[3px] rounded-full bg-white/15 overflow-hidden mt-1.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- GENRE RAILS (existing View All -> activeCategory flow) ---------- */}
          {categories.map((category, idx) => {
            const list = category.list.length > 0 ? category.list : displayList;
            return (
              <div key={idx} className="mb-7">
                <SectionHeader title={category.title} onViewAll={() => setActiveCategory(category.title)} />

                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 snap-x">
                  {list.map((game, i) => (
                    <div
                      key={game.id + '-' + i}
                      onClick={() => openGame(game)}
                      className="flex-shrink-0 w-[34vw] max-w-[140px] snap-start flex flex-col
                                 rounded-2xl overflow-hidden cursor-pointer group
                                 bg-[#15111F] border border-white/10 shadow-lg shadow-black/50"
                    >
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#15111F] to-transparent pointer-events-none" />
                      </div>
                      <div className="px-2.5 pt-2 pb-2.5">
                        <h4
                          className="font-fraunces font-bold text-white leading-tight truncate"
                          style={{ fontSize: 'clamp(0.85rem, 3.7vw, 1rem)' }}
                        >
                          {game.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
      // Shell: paints the artwork, never scrolls.
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] overflow-hidden font-spartan">

        <div className="absolute inset-0 z-0">
          <img
            src={authBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Scrim so cards and body copy stay legible over the illustration.
              Drop this div if you want the art at full strength. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/75 via-[#0B0B14]/45 to-[#0B0B14]/85" />
        </div>

        {/* Scroller: sits on top of the artwork, has no background of its own. */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6 px-4 pt-6">

          <div className="flex items-center gap-3 mb-8">
            <BackButton onClick={() => setCurrentTab('home')} />
            <div className="flex-1 bg-[#0B0B14]/80 backdrop-blur-md rounded-full px-5 py-3.5 flex items-center border border-[#9457EB] shadow-inner">
              <input type="text" placeholder="" className="bg-transparent text-white w-full focus:outline-none text-sm font-medium tracking-wide placeholder:text-[#8A7DAB]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
              <SearchIcon className="text-[#8B5CF6] w-5 h-5 ml-2 flex-shrink-0" />
            </div>
          </div>

          {results.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold font-fraunces text-white tracking-widest mb-4 pl-1">{searchQuery ? 'Results' : 'Top Search'}</h3>
              <div className="space-y-3">
                {results.map(game => (
                  <div key={game.id} className="bg-[#1C1635]/85 backdrop-blur-md rounded-2xl p-3 flex gap-4 items-center cursor-pointer border border-white/10 hover:border-[#8B5CF6]/40 transition shadow-lg shadow-black/40" onClick={() => handleSearchResultClick(game)}>
                    <img src={game.coverImage} className="w-[19vw] h-[19vw] max-w-[80px] max-h-[80px] flex-shrink-0 rounded-xl object-cover" alt="thumb" />
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-[#9457EB] font-bold text-base mb-1 truncate">{game.title}</h4>
                      <p className="text-[11px] text-[#FFFFFF] line-clamp-2 leading-relaxed font-medium">An immersive visual novel about {game.title.toLowerCase()} and the epic journey that awaits...</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
                <img
                  src={ICONS.noSearch}
                  alt=""
                  aria-hidden="true"
                  className="w-[min(46vw,190px)] h-[min(46vw,190px)] object-contain mb-6"
                />

                <h2
                  className="font-fraunces font-bold text-white leading-[1.1] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(1.6rem, 7vw, 2.15rem)' }}
                >
                  No novels found
                </h2>

                <p
                  className="font-manrope text-[#FFFFFF] mt-2.5 leading-[1.5] max-w-[300px]"
                  style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)' }}
                >
                  Try checking the title or search for another novel.
                </p>
              </div>
          )}
        </div>
      </div>
    );
  };

    const renderLibrary = () => {
    const displayList = cloudGames.length > 0 ? cloudGames : MOCK_GAMES;
    const bookmarkedGames = displayList.filter(g => userMetadata.bookmarks.includes(g.id));

    const LIBRARY_FILTERS = [
      { id: 'all',         label: 'All' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'saved',       label: 'Saved' },
      { id: 'completed',   label: 'Completed' },
    ];

    // progress is the single source of truth for the three non-"all" buckets:
    // 0 = bookmarked but never opened, 1-99 = in progress, 100 = finished.
    const matchesFilter = (g) => {
      const p = g.progress || 0;
      if (libraryFilter === 'in_progress') return p > 0 && p < 100;
      if (libraryFilter === 'completed')   return p >= 100;
      if (libraryFilter === 'saved')       return p === 0;
      return true;
    };

    const visibleGames = [...bookmarkedGames.filter(matchesFilter)].sort((a, b) => {
      if (sortBy === 'nameAZ') return a.title.localeCompare(b.title);
      if (sortBy === 'nameZA') return b.title.localeCompare(a.title);
      return 0; // recentlyAdded — preserves original array order
    });

    const isEmptyLibrary = bookmarkedGames.length === 0;

    return (
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

        {/* Artwork — same treatment as the auth screens */}
        <div className="absolute inset-0 z-0">
          <img
            src={authBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Scrim so cards and body copy stay legible over the illustration.
              Drop this div if you want the art at full strength. */}
          
        </div>

        {/* ---------- EMPTY STATE ---------- */}
        {isEmptyLibrary ? (
          <div
            className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center text-center"
            style={{
              paddingLeft:  'calc(env(safe-area-inset-left, 0px) + 2rem)',
              paddingRight: 'calc(env(safe-area-inset-right, 0px) + 2rem)',
            }}
          >
            <img
              src={empLib}
              alt=""
              aria-hidden="true"
              className="w-[min(34vw,250px)] h-[min(34vw,250px)] object-contain mb-5"
            />

            <h2
              className="font-fraunces font-medium text-white leading-snug mb-8"
              style={{ fontSize: 'clamp(1.2rem, 5.4vw, 1.55rem)' }}
            >
              Your Library is Empty
            </h2>
            <p
                  className="font-manrope text-[#C2BBD4] mt-1.5 leading-[1.4]"
                  style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)' }}
                >
                  Bookmark stories you love to find them here
                </p>

            <br/>    
            <button
              onClick={() => setCurrentTab('home')}
              className="w-full max-w-[280px] min-h-[56px] flex items-center justify-center rounded-2xl
                         bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                         active:from-[#6D28D9] active:to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A472F0]
                         shadow-lg shadow-purple-900/40 transition-all
                         font-manrope font-semibold text-white tracking-wide"
              style={{ fontSize: 'clamp(1rem, 4.2vw, 1.15rem)' }}
            >
              Browse Games
            </button>
          </div>
        ) : (
          /* ---------- POPULATED STATE ---------- */
          <div
            className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
            style={{
              paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(1.25rem, 4vh, 2rem))',
              paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
              paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
              paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
            }}
          >

            {/* Title block + sort */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="min-w-0">
                <h1
                  className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(1.65rem, 7.2vw, 2.2rem)' }}
                >
                  My Library
                </h1>
                <p
                  className="font-manrope text-[#C2BBD4] mt-1.5 leading-[1.4]"
                  style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)' }}
                >
                  {bookmarkedGames.length} Bookmarked {bookmarkedGames.length === 1 ? 'story' : 'stories'}
                </p>
              </div>

              <div className="relative flex-shrink-0 mt-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none min-h-[38px] rounded-md
                             bg-[#1A0F33]/70 backdrop-blur-md border border-[#9457EB]/50
                             text-white font-manrope font-medium
                             pl-4 pr-9 py-1.5 max-w-[42vw] truncate
                             focus:outline-none focus:border-[#9457EB] cursor-pointer transition-colors"
                  style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.85rem)' }}
                >
                  <option className="bg-[#1A0F33] text-white" value="recentlyAdded">Recently Added</option>
                  <option className="bg-[#1A0F33] text-white" value="nameAZ">Name A-Z</option>
                  <option className="bg-[#1A0F33] text-white" value="nameZA">Name Z-A</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>

            {/* Filter pills — horizontally scrollable so they never wrap on a 360px screen */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 mb-5">
              {LIBRARY_FILTERS.map(f => {
                const active = libraryFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setLibraryFilter(f.id)}
                    className={`flex-shrink-0 min-h-[36px] px-4 rounded-md font-manrope font-semibold
                                tracking-wide transition-all whitespace-nowrap active:scale-[0.97]
                                ${active
                                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9457EB] text-white shadow-lg shadow-purple-900/40 border border-transparent'
                                  : 'bg-white/5 text-[#C2BBD4] border border-white/20 hover:border-[#9457EB]/60 hover:text-white'}`}
                    style={{ fontSize: 'clamp(0.75rem, 3.2vw, 0.875rem)' }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {visibleGames.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                {visibleGames.map((game) => {
                  const progress = Math.min(100, Math.max(0, game.progress || 0));
                  const started = progress > 0;

                  return (
                    <div
                      key={game.id}
                      onClick={() => openGame(game)}
                      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group
                                 bg-[#15111F] border border-white/10 shadow-lg shadow-black/50"
                    >
                      {/* Cover art — fixed square so every card in a row lines up */}
                      <div className="relative w-full aspect-square flex-shrink-0 overflow-hidden">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="absolute inset-0 w-full h-full object-cover
                                     group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Soft fade into the info panel so the seam isn't a hard line */}
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#15111F] to-transparent pointer-events-none" />

                        {/* Bookmark toggle — stopPropagation so it doesn't open the detail view */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(game.id); }}
                          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center
                                     active:scale-90 transition-transform"
                          aria-label="Remove from library"
                        >
                          <Bookmark className="w-[22px] h-[22px] text-[#A855F7] fill-[#A855F7]
                                               drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" />
                        </button>
                      </div>

                      {/* Info panel */}
                      <div className="flex flex-col px-3 pt-2.5 pb-3">
                        <h4
                          className="font-fraunces font-bold text-white leading-tight line-clamp-2"
                          style={{ fontSize: 'clamp(0.95rem, 4.1vw, 1.15rem)' }}
                        >
                          {game.title}
                        </h4>

                        <div
                          className="flex items-center gap-1.5 text-[#C2BBD4] font-manrope font-medium mt-1.5"
                          style={{ fontSize: 'clamp(0.65rem, 2.9vw, 0.78rem)' }}
                        >
                          {started ? (
                            <>
                              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {progress >= 100 ? 'Completed' : `${progress}% completed`}
                              </span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 flex-shrink-0 text-[#A855F7] fill-[#A855F7]" />
                              <span>Saved</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Progress rail — full-bleed along the bottom edge of the card.
                          Rendered for started games only; unstarted cards end flush
                          at the panel, matching the "Saved" cards in the mockup. */}
                      {started && (
                        <div className="w-full h-[4px] bg-white/10 flex-shrink-0">
                          <div
                            className="h-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Bookmarks exist, but this filter matched none of them */
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <img
                  src={empLib}
                  alt=""
                  aria-hidden="true"
                  className="w-[min(22vw,90px)] h-[min(22vw,90px)] object-contain mb-4 opacity-60"
                />
                <p
                  className="font-manrope text-[#C2BBD4] leading-[1.5]"
                  style={{ fontSize: 'clamp(0.85rem, 3.6vw, 1rem)' }}
                >
                  Nothing in “{LIBRARY_FILTERS.find(f => f.id === libraryFilter)?.label}” yet.
                </p>
                <button
                  onClick={() => setLibraryFilter('all')}
                  className="mt-4 min-h-[40px] px-6 rounded-full border border-[#9457EB]/60
                             bg-white/5 hover:bg-[#9457EB]/20 text-white font-manrope font-semibold transition-colors"
                  style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.9rem)' }}
                >
                  Show all
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

    // ---------- ACHIEVEMENTS: CATEGORY LIST ----------
  const renderAchievements = () => {
    // Totals derive from the catalogue rows we actually fetched. A category
    // with no rows yet falls back to plannedTotal and is not tappable.
    const categories = ACHIEVEMENT_CATEGORIES.map((cat) => {
      const rows = achievements.filter(a => a.category === cat.id);
      return {
        ...cat,
        unlocked:  rows.filter(a => a.unlocked).length,
        total:     rows.length || cat.plannedTotal,
        available: rows.length > 0,
      };
    });

    const totalUnlocked = categories.reduce((sum, c) => sum + c.unlocked, 0);
    const totalBadges   = categories.reduce((sum, c) => sum + c.total, 0);
    const overallPercent = totalBadges > 0 ? Math.round((totalUnlocked / totalBadges) * 100) : 0;

    return (
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

        {/* Artwork — same treatment as the other tabs */}
        <div className="absolute inset-0 z-0">
          <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/80 via-[#0B0B14]/60 to-[#0B0B14]/85" />
        </div>

        <div
          className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
          style={{
            paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(1rem, 3.5vh, 1.75rem))',
            paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
            paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
            paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
          }}
        >

          {/* ---------- SUMMARY CARD ---------- */}
          <div className="rounded-2xl border border-[#9457EB]/40 bg-[#15111F]/85 backdrop-blur-md
                          shadow-lg shadow-black/50 p-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={trophyHero}
                alt=""
                aria-hidden="true"
                className="w-[28vw] max-w-[118px] flex-shrink-0 object-contain
                           drop-shadow-[0_0_18px_rgba(168,85,247,0.45)]"
              />

              <div className="flex-1 min-w-0">
                <h2
                  className="font-manrope font-semibold text-white leading-[1.2]"
                  style={{ fontSize: 'clamp(1.05rem, 4.6vw, 1.35rem)' }}
                >
                  {totalUnlocked} of {totalBadges} unlocked
                </h2>

                <p
                  className="font-manrope text-[#C2BBD4] mt-1"
                  style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.85rem)' }}
                >
                  {overallPercent}% complete
                </p>

                <div className="w-full h-[7px] rounded-full bg-white/12 overflow-hidden mt-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] transition-all"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- CATEGORIES ---------- */}
          <h3
            className="font-manrope font-medium text-white tracking-wide mb-3"
            style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
          >
            Categories
          </h3>

          <div className="space-y-3">
            {categories.map((cat) => {
              const percent = cat.total > 0 ? Math.round((cat.unlocked / cat.total) * 100) : 0;
              return (
                <div
                  key={cat.id}
                  onClick={() => { if (cat.available) setActiveAchievementCategory(cat.id); }}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl
                              bg-[#15111F]/85 backdrop-blur-md border border-[#9457EB]/25
                              shadow-lg shadow-black/40 transition-all
                              ${cat.available
                                ? 'cursor-pointer hover:border-[#9457EB]/60 active:scale-[0.99]'
                                : 'opacity-55'}`}
                >
                  <div className="w-[15vw] max-w-[60px] aspect-square flex-shrink-0 rounded-xl
                                  flex items-center justify-center
                                  bg-[#1A0F33] border border-[#9457EB]/45">
                    <img
                      src={cat.icon}
                      alt=""
                      aria-hidden="true"
                      className="w-[68%] h-[68%] object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-manrope font-medium text-white leading-tight truncate"
                      style={{ fontSize: 'clamp(0.92rem, 4vw, 1.05rem)' }}
                    >
                      {cat.title}
                    </h4>

                    <p
                      className="font-manrope text-[#C2BBD4] mt-0.5"
                      style={{ fontSize: 'clamp(0.68rem, 2.9vw, 0.78rem)' }}
                    >
                      {cat.available ? `${cat.unlocked} of ${cat.total} unlocked` : 'Coming soon'}
                    </p>

                    <div className="w-full h-[6px] rounded-full bg-white/12 overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 flex-shrink-0 text-[#A855F7]" strokeWidth={2} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ---------- ACHIEVEMENTS: CATEGORY DETAIL (Story Journey, etc.) ----------
  // Fully data-driven off get_achievements(). Seeding a new category in
  // public.achievements + adding its artwork to ACHIEVEMENT_ART is enough to
  // light this screen up for it — no changes needed here.
  const renderAchievementCategory = () => {
    const cat = ACHIEVEMENT_CATEGORIES.find(c => c.id === activeAchievementCategory);
    if (!cat) return null;

    const rows = achievements
      .filter(a => a.category === activeAchievementCategory)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    const unlockedCount = rows.filter(a => a.unlocked).length;
    const total   = rows.length;
    const percent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

    return (
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

        <div className="absolute inset-0 z-0">
          <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/80 via-[#0B0B14]/60 to-[#0B0B14]/85" />
        </div>

        <div
          className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
          style={{
            paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(0.75rem, 2.5vh, 1.25rem))',
            paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
            paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
            paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
          }}
        >

          {/* Back — same circular treatment as the Home category drill-down */}
          <button
            onClick={() => setActiveAchievementCategory(null)}
            aria-label="Back"
            className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center mb-4
                       bg-[#1A0F33]/70 backdrop-blur-md border border-[#9457EB]/50
                       hover:border-[#9457EB] active:scale-90 transition-all"
          >
            <Undo2 className="w-5 h-5 text-[#A855F7]" strokeWidth={2.25} />
          </button>

          {/* Title — Fraunces, matching the genre drill-down */}
          <h1
            className="font-fraunces font-bold text-white leading-[1.05] tracking-[-0.01em] mb-5"
            style={{ fontSize: 'clamp(1.9rem, 8.4vw, 2.6rem)' }}
          >
            {cat.title}
          </h1>

          {/* ---------- SUMMARY CARD ---------- */}
          <div className="rounded-2xl border border-[#9457EB]/40 bg-[#15111F]/85 backdrop-blur-md
                          shadow-lg shadow-black/50 p-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={cat.art || cat.icon}
                alt=""
                aria-hidden="true"
                className="w-[28vw] max-w-[118px] flex-shrink-0 object-contain
                           drop-shadow-[0_0_18px_rgba(168,85,247,0.45)]"
              />

              <div className="flex-1 min-w-0">
                <h2
                  className="font-manrope font-semibold text-white leading-[1.2]"
                  style={{ fontSize: 'clamp(1.05rem, 4.6vw, 1.35rem)' }}
                >
                  {unlockedCount} of {total} unlocked
                </h2>

                <p
                  className="font-manrope text-[#C2BBD4] mt-1"
                  style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.85rem)' }}
                >
                  {percent}% complete
                </p>

                <div className="w-full h-[7px] rounded-full bg-white/12 overflow-hidden mt-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- BADGE GRID ---------- */}
          <h3
            className="font-manrope font-medium text-white tracking-wide mb-3"
            style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.05rem)' }}
          >
            Achievements
          </h3>

          {achievementsLoading && rows.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 text-[#A855F7] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {rows.map((a, idx) => {
                const value    = Math.min(a.current_value || 0, a.threshold);
                const barWidth = a.threshold > 0 ? Math.min(100, Math.round((value / a.threshold) * 100)) : 0;
                const art      = ACHIEVEMENT_ART[a.id] || cat.icon;

                return (
                  <div
                    key={a.id}
                    className={`flex flex-col rounded-2xl p-3 bg-[#15111F]/85 backdrop-blur-md
                                shadow-lg shadow-black/40 transition-all
                                ${idx === rows.length - 1 && rows.length % 2 === 1 ? 'col-span-2' : ''}
                                ${a.unlocked
                                  ? 'border border-[#9457EB]/70 shadow-[0_0_18px_rgba(168,85,247,0.16)]'
                                  : 'border border-[#9457EB]/70'}`}
                  >
                                        
                        {/* Title row — full card width. The title and the badge are
                        the only things competing here, so even the longest badge
                        name clears comfortably. */}
                    <div className="flex items-start justify-between gap-1.5 mb-2.5">
                      <h4
                        className="font-manrope font-semibold text-white leading-[1.2] min-w-0 break-words"
                        style={{ fontSize: '0.85rem' }}
                      >
                        {a.title}
                      </h4>

                      {a.unlocked ? (
                        <CheckCircle2
                          className="w-[19px] h-[19px] flex-shrink-0 text-white fill-[#A855F7]"
                          strokeWidth={2.25}
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="w-[19px] h-[19px] flex-shrink-0 rounded-full
                                     border border-[#6B6484]/70 flex items-center justify-center"
                        >
                          <Lock className="w-[10px] h-[10px] text-[#6B6484]" strokeWidth={2.5} />
                        </span>
                      )}
                    </div>

                    {/* Artwork + description. Fixed px, NOT vw — this card sits
                        inside max-w-[420px], so vw units scale with the browser
                        window while the card width stays put. That mismatch is
                        what was crushing the title column on desktop. */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={art}
                        alt=""
                        aria-hidden="true"
                        className={`w-[44px] flex-shrink-0 object-contain transition-all
                                    ${a.unlocked
                                      ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                                      : 'opacity-55'}`}
                      />
                      <p
                        className="flex-1 min-w-0 font-manrope text-[#C2BBD4] leading-[1.35] break-words"
                        style={{ fontSize: '0.66rem' }}
                      >
                        {a.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

    // One shape for all three rows so the icon column, label baseline, and
    // chevron stay aligned regardless of label length.
    const ActionRow = ({ icon, label, onClick, danger = false, last = false }) => (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 text-left
                    hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors
                    ${last ? '' : 'border-b border-white/10'}`}
      >
        <span className="w-6 flex-shrink-0 flex items-center justify-center">{icon}</span>
        <span
          className={`flex-1 min-w-0 font-manrope font-medium truncate
                      ${danger ? 'text-[#F87171]' : 'text-white'}`}
          style={{ fontSize: 'clamp(0.9rem, 3.9vw, 1.02rem)' }}
        >
          {label}
        </span>
        <ChevronRight className="w-5 h-5 flex-shrink-0 text-[#A855F7]" strokeWidth={2.25} />
      </button>
    );

    return (
      <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

        {/* Artwork — same treatment as Home, Library and Search */}
        <div className="absolute inset-0 z-0">
          <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/75 via-[#0B0B14]/50 to-[#0B0B14]/85" />
        </div>

        <div
          className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
          style={{
            paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(1rem, 3.5vh, 1.75rem))',
            paddingBottom: 'clamp(1.25rem, 4vh, 2rem)',
            paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
            paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
          }}
        >

          {/* ---------- IDENTITY CARD ---------- */}
          <div className="rounded-2xl border border-[#9457EB]/35 bg-[#15111F]/85 backdrop-blur-md
                          shadow-lg shadow-black/40 p-4 mb-5">
            <div className="flex items-center gap-4">

              {/* Avatar + camera affordance */}
              <div className="relative w-[19vw] max-w-[76px] aspect-square flex-shrink-0">
                <img
                  src={userMetadata.avatar_url}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-[#9457EB]/60"
                />
                <button
                  onClick={handlePicEdit}
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center
                             bg-[#2A1B4D] border border-[#9457EB] active:scale-90 transition-transform"
                >
                  <Camera className="w-3.5 h-3.5 text-[#A855F7]" strokeWidth={2.25} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {/* Name — Fraunces, the only display-font element on this screen */}
                <div className="flex items-center gap-2 min-w-0">
                  <h2
                    className="font-fraunces font-bold text-white leading-[1.1] tracking-[-0.01em] truncate"
                    style={{ fontSize: 'clamp(1.35rem, 6vw, 1.75rem)' }}
                  >
                    {userMetadata.full_name || 'User'}
                  </h2>
                  <button
                    onClick={handleNameEdit}
                    aria-label="Edit name"
                    className="flex-shrink-0 p-1 -m-1 active:scale-90 transition-transform"
                  >
                    <Edit3 className="w-[18px] h-[18px] text-[#A855F7]" strokeWidth={2.25} />
                  </button>
                </div>

                {/* Email — copy on tap, checkmark confirms */}
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 mt-1.5 min-w-0 w-full text-left group"
                >
                  <span
                    className="font-manrope text-[#C2BBD4] truncate group-hover:text-white transition-colors"
                    style={{ fontSize: 'clamp(0.78rem, 3.4vw, 0.9rem)' }}
                  >
                    {user?.email || 'player@darkcity.com'}
                  </span>
                  {emailCopied
                    ? <Check className="w-4 h-4 flex-shrink-0 text-green-400" strokeWidth={3} />
                    : <Copy className="w-4 h-4 flex-shrink-0 text-[#A855F7]" strokeWidth={2} />}
                </button>
              </div>
            </div>
          </div>

          <br/>

          {/* ---------- ACTIONS ---------- */}
          {/* ---------- ACTIONS ---------- */}
          <div className="rounded-2xl border border-[#9457EB]/35 bg-[#15111F]/85 backdrop-blur-md
                          shadow-lg shadow-black/40 overflow-hidden">
            <ActionRow
              icon={<img src={ICONS.help} alt="" aria-hidden="true" className="w-[22px] h-[22px] object-contain" />}
              label="Help & Support"
              onClick={() => setCurrentView('support')}
            />
            <ActionRow
              icon={<img src={ICONS.logout} alt="" aria-hidden="true" className="w-[22px] h-[22px] object-contain" />}
              label="Log Out"
              onClick={() => setShowLogoutModal(true)}
            />
            <ActionRow
              icon={<img src={ICONS.deleteAccount} alt="" aria-hidden="true" className="w-[22px] h-[22px] object-contain" />}
              label="Delete Account"
              onClick={() => setShowDeleteModal(true)}
              danger
              last
            />
          </div>

          {/* ---------- MODALS ---------- */}
          {/* ---------- MODALS ---------- */}
          {(showLogoutModal || showDeleteModal) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-8">

              {/* The overlay paints authBg itself rather than blurring the
                  profile screen underneath, so the modal reads as its own
                  surface — matching the screenshots. */}
              <div className="absolute inset-0">
                <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-[#0B0B14]/80" />
              </div>

              <div className="relative w-full max-w-[300px] rounded-2xl p-5 text-center
                              bg-gradient-to-b from-[#2A1B4D] to-[#1A0F33]
                              border border-[#9457EB]/45 shadow-2xl shadow-black/70">

                <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4
                                bg-[#3B2566] border border-[#9457EB]/50">
                  <img
                    src={showLogoutModal ? ICONS.logout : ICONS.deleteAccount}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 object-contain"
                  />
                </div>

                <p
                  className="font-manrope text-white leading-[1.5] mb-5"
                  style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.9rem)' }}
                >
                  {showLogoutModal
                    ? 'Are you sure you want to Logout?'
                    : 'Are you sure you want to permanently delete your account? All your data will be lost forever.'}
                </p>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => { setShowLogoutModal(false); setShowDeleteModal(false); }}
                    className="flex-1 min-h-[42px] rounded-lg bg-[#3B2566] hover:bg-[#4A2F7A]
                               border border-[#9457EB]/30 text-white font-manrope font-semibold
                               active:scale-[0.97] transition-all"
                    style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.9rem)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showLogoutModal ? handleLogout : handleDeleteAccount}
                    className="flex-1 min-h-[42px] rounded-lg font-manrope font-semibold text-white
                               bg-gradient-to-r from-[#7C3AED] to-[#9457EB]
                               hover:from-[#8B5CF6] hover:to-[#A472F0]
                               shadow-lg shadow-purple-900/40 active:scale-[0.97] transition-all"
                    style={{ fontSize: 'clamp(0.8rem, 3.4vw, 0.9rem)' }}
                  >
                    {showLogoutModal ? 'Logout' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCustomerSupport = () => (
    <div className="flex-1 min-h-0 flex flex-col relative bg-[#1A0F33] text-white overflow-hidden font-manrope">

      <div className="absolute inset-0 z-0">
        <img src={authBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/70 via-[#0B0B14]/45 to-[#0B0B14]/80" />
      </div>

      <div
        className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar"
        style={{
          paddingTop:    'calc(env(safe-area-inset-top, 0px) + clamp(0.75rem, 2.5vh, 1.25rem))',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + clamp(1.25rem, 4vh, 2rem))',
          paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 1.5rem)',
          paddingRight:  'calc(env(safe-area-inset-right, 0px) + 1.5rem)',
        }}
      >
        <button
          onClick={() => setCurrentView('main')}
          aria-label="Back"
          className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center
                     bg-[#1A0F33]/70 backdrop-blur-md border border-[#9457EB]/50
                     hover:border-[#9457EB] active:scale-90 transition-all"
        >
          <Undo2 className="w-5 h-5 text-[#A855F7]" strokeWidth={2.25} />
        </button>

        {/* Content sits in the upper third, not centred in the viewport */}
        <div className="flex flex-col items-center text-center mt-[clamp(4rem,14vh,7rem)]">

          <h1
            className="font-fraunces font-bold text-white leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.35rem, 6vw, 1.75rem)' }}
          >
            Customer Support
          </h1>

          <img
            src={mailIcon1}
            alt=""
            aria-hidden="true"
            className="w-[min(16vw,60px)] h-[min(16vw,60px)] object-contain my-5"
          />

          <p
            className="font-manrope text-white leading-[1.5] mb-5"
            style={{ fontSize: 'clamp(0.82rem, 3.5vw, 0.95rem)' }}
          >
            Need Help ? Contact us at
          </p>

          {/* Tap to copy. mailto: is deliberately not used — on a Capacitor
              WebView with no mail client configured it silently does nothing,
              whereas the clipboard always works. */}
          <button
            onClick={handleCopySupportEmail}
            className="w-full max-w-[300px] min-h-[54px] px-5 rounded-xl flex items-center justify-center gap-3
                       bg-white/[0.07] backdrop-blur-md border border-white/15
                       hover:bg-white/[0.11] hover:border-[#9457EB]/60 active:scale-[0.98] transition-all"
          >
            <span
              className="font-manrope font-medium text-white break-all"
              style={{ fontSize: 'clamp(0.82rem, 3.5vw, 0.95rem)' }}
            >
              {SUPPORT_EMAIL}
            </span>
            {supportCopied
              ? <Check className="w-4 h-4 flex-shrink-0 text-green-400" strokeWidth={3} />
              : <Copy className="w-4 h-4 flex-shrink-0 text-white/80" strokeWidth={2} />}
          </button>

          {supportCopied && (
            <p
              className="font-manrope text-green-400 mt-3"
              style={{ fontSize: 'clamp(0.72rem, 3.1vw, 0.82rem)' }}
            >
              Copied to clipboard
            </p>
          )}
        </div>
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
      {/*
        Global font faces. You can move this to index.css or index.html later —
        see note below; the <link> approach in index.html loads faster.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=League+Spartan:wght@300;400;500;600;700;800&display=swap');
        .font-spartan  { font-family: 'League Spartan', sans-serif !important; }
        .font-fraunces { font-family: 'Fraunces', Georgia, serif !important; }
        .font-manrope  { font-family: 'Manrope', system-ui, sans-serif !important; }
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
              {currentTab === 'achievements' && (
                activeAchievementCategory ? renderAchievementCategory() : renderAchievements()
              )}
              {currentTab === 'profile' && renderProfile()}
            </div>
          )}

          {currentView === 'main' && currentTab !== 'search' && (
            <div
              className="w-full flex-shrink-0 z-30 bg-[#140F26] border-t border-white/10"
              style={{
                paddingLeft:   'calc(env(safe-area-inset-left, 0px) + 0.5rem)',
                paddingRight:  'calc(env(safe-area-inset-right, 0px) + 0.5rem)',
                paddingTop:    '0.5rem',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
              }}
            >
              <div className="flex justify-between items-center">
                <NavBtn icon={<Home />}            label="Home"         active={currentTab === 'home'}         onClick={() => navigateTo('main', 'home')} />
                <NavBtn icon={<Trophy />}          label="Achievements" active={currentTab === 'achievements'} onClick={() => navigateTo('main', 'achievements')} />
                <NavBtn iconSrc={ICONS.navLibrary} label="Library"      active={currentTab === 'library'}      onClick={() => navigateTo('main', 'library')} />
                <NavBtn icon={<User />}            label="Profile"      active={currentTab === 'profile'}      onClick={() => navigateTo('main', 'profile')} />
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

// Lucide-only. The PNG pairs were shipping their own background plates,
// which is why the bar looked like four tiles instead of four icons — no
// amount of CSS can remove a background that's part of the raster.
// iconSrc is painted as a CSS mask over a solid background colour, so the
// SVG's own fill is irrelevant and the icon always matches the label.
// Handles both icon sources: iconSrc renders the file as a CSS mask (colour
// comes from CSS, the file's own fill is discarded), icon renders a lucide
// component. Library uses the mask; the rest use lucide.
const NavBtn = ({ iconSrc, icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center gap-1 cursor-pointer group px-2 py-1.5 rounded-xl
                min-w-0 flex-1 transition-all duration-200 select-none
                ${active ? '' : 'active:scale-90'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {iconSrc ? (
        <span
          aria-hidden="true"
          className={`block w-6 h-6 transition-colors duration-300
                      ${active
                        ? 'bg-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.55)]'
                        : 'bg-[#6B6484] group-hover:bg-[#A855F7]'}`}
          style={{
            WebkitMaskImage: `url(${iconSrc})`,
            maskImage: `url(${iconSrc})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ) : (
        React.cloneElement(icon, {
          size: 23,
          strokeWidth: active ? 2.5 : 1.75,
          className: active
            ? 'text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.55)]'
            : 'text-[#6B6484] group-hover:text-[#A855F7]',
        })
      )}
    </div>

    <span
      className={`font-manrope tracking-wide whitespace-nowrap transition-colors duration-300
                  ${active ? 'text-[#A855F7] font-semibold' : 'text-[#6B6484] font-medium'}`}
      style={{ fontSize: 'clamp(9px, 2.6vw, 11px)' }}
    >
      {label}
    </span>
  </div>
);