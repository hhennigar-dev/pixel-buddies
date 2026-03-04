import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Home, 
  BookOpen, 
  User, 
  ShoppingBag, 
  Trophy, 
  Heart, 
  Zap, 
  ChevronRight, 
  Check, 
  X, 
  ArrowLeft, 
  Settings, 
  Search, 
  UserPlus, 
  Sword,
  Shield,
  Star,
  Flame,
  Coins,
  Banana,
  Wheat as Corn,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  MessageCircle,
  SkipForward,
  Moon,
  Sun,
  Palette,
  LogOut,
  Mail,
  Lock,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  BuddyType, 
  AvatarConfig, 
  UserProfile, 
  Question, 
  Lesson, 
  Unit, 
  ShopItem,
  FriendRequest
} from './types';
import { UNITS, SHOP_ITEMS, POKI_IMG, COCO_IMG, POWER_UP_IMG, LOGO_IMG } from './constants';
import { generateBattleQuestion } from './services/geminiService';
import Avatar from './components/Avatar';
import AvatarBuilder from './components/AvatarBuilder';
import { supabase } from './supabase';

// --- SOUND EFFECTS ---
const playSound = (type: 'correct' | 'wrong' | 'click' | 'success') => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(110, now + 0.2); // A2
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'success') {
    osc.type = 'sine';
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.3);
    });
  }
};

// --- INITIAL STATE ---
const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#FCD5B5',
  hairColor: '#4B2816',
  clothingColor: '#3B82F6',
  backgroundColor: 'transparent',
  hairStyle: 'short',
  flipHair: false,
  headwear: 'none',
  headwearColor: '#EF4444',
  eyeType: 'normal',
  mouthType: 'smile',
  pantsColor: '#374151'
};

const INITIAL_PROFILE: UserProfile = {
  id: '',
  username: '',
  buddy: 'poki',
  avatar: {
    ...DEFAULT_AVATAR,
    weeklyXp: 0,
    lastLeaderboardReset: new Date().toISOString(),
    medals: {
      gold: 0,
      silver: 0,
      bronze: 0,
      participation: 0
    }
  },
  xp: 0,
  gems: 500,
  currency: 100,
  hearts: 5,
  streak: 0,
  last_active: new Date().toISOString(),
  last_streak_update: new Date().toISOString(),
  unlocked_units: 1,
  completed_lessons: [],
  friends: [],
  inventory: [],
  equipped_items: [],
  theme: 'light',
  is_premium: false
};

// --- UTILS ---
const PixelHeart = ({ className = "w-6 h-6", filled = true }: { className?: string, filled?: boolean }) => (
  <svg 
    viewBox="0 0 10 10" 
    className={`${className} ${filled ? 'text-red-500' : 'text-gray-300'} fill-current`}
    style={{ imageRendering: 'pixelated' }}
  >
    <path d="M2 1h2v1h2v-1h2v1h1v2h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1z" />
  </svg>
);

async function withTimeout<T>(promise: Promise<T> | any, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise as Promise<T>, timeout]);
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && (err as any).message === "Timeout") {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

// --- MAIN APP COMPONENT ---
// --- MODALS ---
const PowerUpModal = ({ profile, setShowPowerUpModal, updateProfile, soundEnabled, playSound }: any) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 sm:p-6 backdrop-blur-sm"
    onClick={() => setShowPowerUpModal(false)}
  >
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onClick={(e) => e.stopPropagation()}
      className={`rounded-t-3xl sm:rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden border-t-4 sm:border-4 ${profile?.theme === 'dark' ? 'bg-gray-900 border-yellow-500' : 'bg-white border-yellow-400'}`}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden" />
      
      <button onClick={() => setShowPowerUpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden sm:block">
        <X className="w-6 h-6" />
      </button>
      
      <div className="mb-6 relative">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <img src={POWER_UP_IMG} alt="Power Up" className="w-32 h-32 mx-auto drop-shadow-2xl" referrerPolicy="no-referrer" />
        </motion.div>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg rotate-12 shadow-lg">HOT!</div>
      </div>
      
      <h2 className="text-4xl font-black mb-2 text-yellow-500 uppercase tracking-tighter italic">Power Up!</h2>
      <p className={`text-xl font-bold mb-8 ${profile?.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Unlock the ultimate learning experience!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
        {[
          { icon: Heart, text: "Infinite Pixel Hearts", color: "text-red-500", bg: "bg-red-50" },
          { icon: SkipForward, text: "Skip to any lesson", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Zap, text: "Double XP Boost", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Shield, text: "No more ads (forever!)", color: "text-purple-500", bg: "bg-purple-50" }
        ].map((benefit, i) => (
          <div key={i} className={`flex items-center space-x-3 p-3 rounded-2xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : `${benefit.bg} border-transparent`}`}>
            <div className={`p-2 rounded-xl bg-white shadow-sm ${benefit.color}`}>
              <benefit.icon className="w-5 h-5" />
            </div>
            <span className={`font-black text-sm ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{benefit.text}</span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={async () => {
          if (profile) {
            await updateProfile({ is_premium: true, hearts: 5 });
            alert("Power Up Activated! You now have Infinite Hearts and can skip any lesson.");
            setShowPowerUpModal(false);
            if (soundEnabled) playSound('success');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          }
        }}
        className="w-full py-5 bg-yellow-400 hover:bg-yellow-300 text-white text-2xl font-black rounded-2xl uppercase tracking-wider shadow-[0_6px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all"
      >
        Activate Now!
      </button>
      <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Simulation Purchase • No real money needed</p>
    </motion.div>
  </motion.div>
);

const RecapCutscene = ({ getBuddyImg }: any) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[150] flex items-center justify-center bg-blue-600 p-6 overflow-hidden"
  >
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-center"
    >
      <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">Recap Time!</h2>
      <div className="flex justify-center space-x-8">
        <motion.img 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          src={getBuddyImg()} 
          className="w-48 h-48 object-contain pixelated" 
          referrerPolicy="no-referrer" 
        />
      </div>
      <p className="text-2xl font-black text-blue-200 mt-8 uppercase tracking-widest animate-pulse">Reviewing missed questions...</p>
    </motion.div>
    
    {/* Pixel particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-4 h-4 bg-white/20"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: -20,
          rotate: 0
        }}
        animate={{ 
          y: window.innerHeight + 20,
          rotate: 360
        }}
        transition={{ 
          duration: Math.random() * 2 + 1, 
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2
        }}
      />
    ))}
  </motion.div>
);

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'onboarding' | 'home' | 'lesson' | 'profile' | 'shop' | 'battle' | 'leaderboard' | 'settings' | 'avatar-edit' | 'auth'>('landing');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPracticeLesson, setIsPracticeLesson] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({
    currentQuestionIndex: -1, // -1 means teaching part
    score: 0,
    wrongQuestions: [] as Question[],
    isFinished: false,
    recapMode: false
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeBattle, setActiveBattle] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [showMedalCeremony, setShowMedalCeremony] = useState(false);
  const [earnedMedal, setEarnedMedal] = useState<'gold' | 'silver' | 'bronze' | 'participation' | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [showPowerUpModal, setShowPowerUpModal] = useState(false);
  const [showRecapCutscene, setShowRecapCutscene] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // --- AUTH & SYNC ---
  useEffect(() => {
    let mounted = true;

    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth initialization timed out, forcing loading to false.");
        setLoading(false);
      }
    }, 20000); // 20 second fail-safe

    const initAuth = async (isRetry = false) => {
      if (isGuest) {
        if (mounted) setLoading(false);
        return;
      }
      
      try {
        if (mounted) {
          setNetworkError(null);
          if (isRetry) setLoading(true);
        }
        
        // Get session with timeout
        const sessionRes = await withTimeout(supabase.auth.getSession(), 20000);
        const { data: { session }, error: sessionError } = sessionRes as any;
        
        if (sessionError) throw sessionError;

        if (session?.user && mounted) {
          // Fetch profile with timeout and retry
          const profileRes = await withRetry(() => withTimeout(
            supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single(),
            30000
          ));
          const { data: profileData, error } = profileRes as any;
          
          if (error) {
            if (error.message?.includes('Failed to fetch')) {
              if (mounted) setNetworkError("Connection failed. Please check your internet.");
            } else if (error.code === 'PGRST116') {
              // No profile found, this IS a new user
              if (mounted) setView('onboarding');
            } else {
              console.error("Profile fetch error:", error);
              // Don't jump to onboarding on random errors or timeouts
              if (mounted) setNetworkError("Could not load profile. Please try refreshing.");
            }
          } else if (profileData && mounted) {
            const p = profileData as UserProfile;
            setProfile(p);
            if (!p.username || !p.buddy) {
              setView('onboarding');
            } else {
              setView('home');
            }
            setTimeout(() => checkStreak(p), 500);
          } else {
            // No profile data and no error code? Unusual, but stay on landing
            if (mounted) setView('landing');
          }
        } else if (mounted) {
          setProfile(null);
          // Only set landing if we aren't already in a valid non-app view
          if (view !== 'onboarding' && view !== 'landing' && view !== 'auth') {
            setView('landing');
          }
        }
      } catch (err: any) {
        console.error("Auth init error:", err);
        if (mounted) {
          if (err.message === "Timeout") {
            setNetworkError("Connection is very slow. Please check your internet.");
          } else if (err.message?.includes('Failed to fetch')) {
            setNetworkError("Connection failed. Please check your internet.");
          }
          // Ensure we don't stay stuck on loading
          setLoading(false);
          // Default to landing if we can't determine auth state
          if (view !== 'onboarding' && view !== 'auth') setView('landing');
        }
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isGuest || !mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profileRes = await withRetry(() => withTimeout(
            supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single(),
            30000
          ));
          const { data: profileData, error } = profileRes as any;
          
          if (profileData && mounted) {
            const p = profileData as UserProfile;
            setProfile(p);
            setTimeout(() => checkStreak(p), 500);
            if (view === 'landing' || view === 'auth') {
              if (!p.username || !p.buddy) setView('onboarding');
              else setView('home');
            }
          } else if (mounted) {
            // Only go to onboarding if we are sure there is no profile (error code PGRST116)
            if (error?.code === 'PGRST116') {
              if (view === 'landing' || view === 'auth') setView('onboarding');
            } else if (error) {
              console.error("Auth change profile fetch error:", error);
              // If it's a timeout or other error, don't jump to onboarding
              if (view === 'auth') setNetworkError("Could not load profile. Please try again.");
            }
          }
        } catch (err) {
          console.error("Profile fetch error in auth change:", err);
          // On timeout or other unexpected error, don't jump to onboarding
          // Stay on current view (likely landing or auth)
        }
      } else if (event === 'SIGNED_OUT' && mounted) {
        setProfile(null);
        setView('landing');
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [isGuest]);

  const loginAsGuest = () => {
    setIsGuest(true);
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    const guestProfile = { 
      ...INITIAL_PROFILE, 
      id: guestId, 
      username: `Guest_${guestId.slice(-4)}` 
    };
    setProfile(guestProfile);
    setOnboardingStep(1); // Skip username step for guests
    setView('onboarding');
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.id && !isGuest) {
      const channel = supabase
        .channel('profile-updates')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users', 
          filter: `id=eq.${profile.id}` 
        }, payload => {
          setProfile(payload.new as UserProfile);
        })
        .subscribe();
      
      return () => { supabase.removeChannel(channel); };
    }
  }, [profile?.id]);

  // --- BOT LOGIC ---
  const generateBots = (count: number): UserProfile[] => {
    const bots: UserProfile[] = [];
    const botNames = ["PixelMaster", "BuddyLearner", "EduChamp", "GamerGirl99", "CodeWizard", "StudyOwl", "BananaFan", "PokiFan", "CocoLover", "EduBot", "LearningLion", "SmartyPants", "QuizWhiz", "Brainiac", "PixelPioneer"];
    
    // Use current week as seed for stable bot XP
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekSeed = weekStart.getTime();
    
    // Days passed in current week (0-6)
    const daysPassed = now.getDay() + (now.getHours() / 24);

    for (let i = 0; i < count; i++) {
      const name = botNames[i % botNames.length] + (i > botNames.length ? `_${i}` : "");
      
      // Random but stable avatar for this bot
      const botSeed = weekSeed + i;
      const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };

      const botAvatar: AvatarConfig & { weeklyXp: number; lastLeaderboardReset: string; medals: any } = {
        skinColor: ['#FCD5B5', '#EAC096', '#D6A674', '#C68642'][Math.floor(seededRandom(botSeed) * 4)],
        hairColor: ['#000000', '#4B2816', '#744621', '#B67B38'][Math.floor(seededRandom(botSeed + 1) * 4)],
        clothingColor: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(seededRandom(botSeed + 2) * 4)],
        backgroundColor: 'transparent',
        hairStyle: ['short', 'spiky', 'bun', 'ponytail', 'sidepart', 'curly', 'afro', 'buzz', 'wavy', 'braids'][Math.floor(seededRandom(botSeed + 3) * 10)] as any,
        flipHair: seededRandom(botSeed + 4) > 0.5,
        headwear: seededRandom(botSeed + 5) > 0.7 ? 'cap' : 'none',
        headwearColor: '#EF4444',
        eyeType: 'normal',
        mouthType: 'smile',
        pantsColor: '#374151',
        weeklyXp: Math.floor(seededRandom(botSeed + 6) * 500 * daysPassed), // XP grows through the week
        lastLeaderboardReset: weekStart.toISOString(),
        medals: { gold: 0, silver: 0, bronze: 0, participation: 0 }
      };

      bots.push({
        id: `bot-${i}`,
        username: name,
        buddy: seededRandom(botSeed + 7) > 0.5 ? 'poki' : 'coco',
        avatar: botAvatar,
        xp: 1000,
        gems: 100,
        currency: 100,
        hearts: 5,
        streak: 5,
        last_active: now.toISOString(),
        last_streak_update: now.toISOString(),
        unlocked_units: 1,
        completed_lessons: [],
        friends: [],
        inventory: [],
        equipped_items: [],
        theme: 'light'
      });
    }
    return bots;
  };

  // Leaderboard listener
  useEffect(() => {
    if (view === 'leaderboard') {
      const fetchLeaderboard = async () => {
        let realUsers: UserProfile[] = [];
        if (!isGuest) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .order('avatar->weeklyXp', { ascending: false })
            .limit(20);
          if (data) realUsers = data as UserProfile[];
        }

        const bots = generateBots(15);
        
        // Merge and sort
        const combined = [...realUsers, ...bots];
        
        // If logged in, ensure current user is in the list
        if (profile && !combined.find(u => u.id === profile.id)) {
          combined.push(profile);
        }

        combined.sort((a, b) => (b.avatar.weeklyXp || 0) - (a.avatar.weeklyXp || 0));
        setLeaderboard(combined);
      };
      
      fetchLeaderboard();

      if (!isGuest) {
        const channel = supabase
          .channel('leaderboard-realtime')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'users'
          }, () => {
            fetchLeaderboard();
          })
          .subscribe();
        
        return () => { supabase.removeChannel(channel); };
      }
    }
  }, [view, profile?.avatar.weeklyXp]);

  // Friend Requests listener
  useEffect(() => {
    if (profile?.id && !isGuest) {
      const fetchRequests = async () => {
        const { data } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('to_id', profile.id)
          .eq('status', 'pending');
        if (data) setFriendRequests(data as FriendRequest[]);
      };
      fetchRequests();

      const channel = supabase
        .channel('friend-requests')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'friend_requests', 
          filter: `to_id=eq.${profile.id}` 
        }, () => {
          fetchRequests();
        })
        .subscribe();
      
      return () => { supabase.removeChannel(channel); };
    }
  }, [profile?.id]);

  // Battle listener
  useEffect(() => {
    if (profile?.id && !isGuest) {
      const channel = supabase
        .channel('active-battles')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'battles'
        }, payload => {
          if (payload.eventType === 'DELETE') {
            const oldBattle = payload.old as any;
            if (activeBattle?.id === oldBattle?.id) {
              setActiveBattle(null);
              setView('home');
              setBuddyMessage("Battle ended!");
            }
            return;
          }

          const battle = payload.new as any;
          if (battle && battle.players.includes(profile.id)) {
            setActiveBattle(battle);
            if (view !== 'battle') setView('battle');
          }
        })
        .subscribe();
      
      return () => { supabase.removeChannel(channel); };
    }
  }, [profile?.id, view]);

  const checkLeaderboardReset = async (p: UserProfile) => {
    const now = new Date();
    const lastReset = new Date(p.avatar.lastLeaderboardReset);
    
    // Get the most recent Sunday at 00:00
    const currentSunday = new Date(now);
    currentSunday.setDate(now.getDate() - now.getDay());
    currentSunday.setHours(0, 0, 0, 0);

    if (lastReset < currentSunday) {
      const topUsersRes = await withRetry(() => withTimeout(
        supabase
          .from('users')
          .select('id, avatar')
          .order('avatar->weeklyXp', { ascending: false })
          .limit(50),
        10000
      ));
      const { data: topUsers } = topUsersRes as any;
      
      if (topUsers) {
        const rank = topUsers.findIndex(u => u.id === p.id);
        const newMedals = { ...p.avatar.medals };
        
        if (rank === 0 && p.avatar.weeklyXp > 0) newMedals.gold++;
        else if (rank === 1 && p.avatar.weeklyXp > 0) newMedals.silver++;
        else if (rank === 2 && p.avatar.weeklyXp > 0) newMedals.bronze++;
        else if (rank > 2 && p.avatar.weeklyXp > 0) newMedals.participation++;

        updateProfile({
          avatar: {
            ...p.avatar,
            weeklyXp: 0,
            medals: newMedals,
            lastLeaderboardReset: now.toISOString()
          }
        }, p);
        
        if (p.avatar.weeklyXp > 0) {
          setEarnedMedal(rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : 'participation');
          setShowMedalCeremony(true);
        }
      } else {
        updateProfile({
          avatar: {
            ...p.avatar,
            weeklyXp: 0,
            lastLeaderboardReset: now.toISOString()
          }
        }, p);
      }
    }
  };

  const checkStreak = (p: UserProfile) => {
    checkLeaderboardReset(p);
    const now = new Date();
    const lastUpdate = new Date(p.last_streak_update);
    const lastActive = new Date(p.last_active);
    
    // If it's a new day
    if (now.toDateString() !== lastUpdate.toDateString()) {
      setShowStreakPopup(true);
      
      const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        if (p.inventory.includes('streak-freeze')) {
          const newInventory = p.inventory.filter(id => id !== 'streak-freeze');
          updateProfile({ 
            inventory: newInventory, 
            last_active: now.toISOString(),
            last_streak_update: now.toISOString()
          }, p);
          alert("Streak Freeze used! Your streak is safe.");
        } else {
          updateProfile({ 
            streak: 0, 
            last_active: now.toISOString(),
            last_streak_update: now.toISOString()
          }, p);
        }
      } else {
        // Logged in today or yesterday, update last_streak_update to show popup once per day
        updateProfile({ last_streak_update: now.toISOString() }, p);
      }
    }
  };

  useEffect(() => {
    if (!profile || !activeBattle) return;
    
    const channel = supabase
      .channel(`battle-${activeBattle.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'battles',
          filter: `id=eq.${activeBattle.id}`
        },
        (payload) => {
          console.log("Battle update received:", payload.new);
          setActiveBattle(payload.new as any);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, activeBattle?.id]);

  const checkUsernameAvailability = async (username: string) => {
    if (isGuest) return true; // Guests don't need unique usernames in DB
    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    setIsCheckingUsername(true);
    setUsernameError(null);
    try {
      // Use a faster query
      const availabilityRes = await withRetry(() => withTimeout(
        supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .limit(1),
        3000
      ));
      const { data, error } = availabilityRes as any;
      
      if (error) {
        console.error("Username check error:", error);
        return true; 
      }
      
      if (data && data.length > 0 && data[0].id !== profile?.id) {
        setUsernameError("Username is already taken");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking username:", err);
      return true; 
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>, currentProfile?: UserProfile) => {
    const p = currentProfile || profile;
    if (!p) return;
    
    const newProfile = { ...p, ...updates };
    setProfile(newProfile);

    if (isGuest) return; // Skip Supabase if guest
    
    setIsSyncing(true);
    try {
      // Username uniqueness check
      if (updates.username && updates.username !== p.username) {
        const availabilityRes = await withRetry(() => withTimeout(
          supabase
            .from('users')
            .select('id')
            .eq('username', updates.username),
          10000
        ));
        const { data } = availabilityRes as any;
        if (data && data.length > 0) {
          setIsSyncing(false);
          return;
        }
      }
      
      // Filter out fields that might not exist in the DB to avoid errors
      // We'll store is_premium in the avatar object as a fallback if the column is missing
      const dbProfile = { ...newProfile };
      
      // If we're updating is_premium, also store it in avatar metadata as backup
      if (updates.is_premium !== undefined) {
        dbProfile.avatar = {
          ...dbProfile.avatar,
          is_premium: updates.is_premium
        } as any;
      }

      // Try to upsert. If it fails due to missing column, we'll retry without it.
      try {
        const upsertRes = await withRetry(() => withTimeout(
          supabase
            .from('users')
            .upsert(dbProfile),
          15000
        ));
        const { error } = upsertRes as any;
        
        if (error && (error.message?.includes('is_premium') || error.code === 'PGRST204')) {
          // Retry without is_premium column
          const { is_premium, ...safeProfile } = dbProfile;
          await withRetry(() => withTimeout(
            supabase
              .from('users')
              .upsert(safeProfile),
            15000
          ));
        } else if (error) {
          console.error("Error updating profile:", error);
        }
      } catch (err) {
        console.error("Upsert failed, trying safe version:", err);
        const { is_premium, ...safeProfile } = dbProfile;
        await supabase.from('users').upsert(safeProfile);
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAuth = async () => {
    if (!authEmail || !authPassword) {
      alert("Please enter both email and password.");
      return;
    }
    
    setIsAuthLoading(true);
    try {
      if (isLogin) {
        const authRes = await withTimeout(
          supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          }),
          20000
        );
        const { error } = authRes as any;
        if (error) alert(error.message);
      } else {
        const signupRes = await withTimeout(
          supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
          }),
          20000
        );
        const { data, error } = signupRes as any;
        
        if (error) {
          alert(error.message);
        } else if (data.user) {
          if (!data.session) {
            alert("Signup successful! Please check your email to confirm your account before logging in.");
            setIsLogin(true);
            setIsAuthLoading(false);
            return;
          }
          // Create initial profile with a unique-ish temporary username
          const baseUsername = authEmail.split('@')[0];
          const existingUsersRes = await withRetry(() => withTimeout(
            supabase
              .from('users')
              .select('username')
              .ilike('username', `${baseUsername}%`),
            10000
          ));
          const { data: existingUsers } = existingUsersRes as any;
          
          let finalUsername = baseUsername;
          if (existingUsers && existingUsers.length > 0) {
            finalUsername = `${baseUsername}_${Math.random().toString(36).substr(2, 4)}`;
          }

          const newProfile = { ...INITIAL_PROFILE, id: data.user.id, username: finalUsername };
          const profileInsertRes = await withRetry(() => withTimeout(
            supabase.from('users').insert(newProfile),
            10000
          ));
          const { error: profileError } = profileInsertRes as any;
          
          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
          setProfile(newProfile);
          setView('onboarding');
        }
      }
    } catch (err: any) {
      if (err.message === "Timeout") {
        alert("The request timed out. Please try again.");
      } else {
        alert("An unexpected error occurred: " + err.message);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    if (!isGuest) {
      await supabase.auth.signOut();
    }
    setIsGuest(false);
    setProfile(null);
    setView('landing');
  };

  const getBuddyImg = () => {
    if (!profile) return POKI_IMG;
    const equippedClothing = SHOP_ITEMS.find(item => item.type === 'clothing' && profile.equipped_items.includes(item.id));
    if (equippedClothing && equippedClothing.image) {
      if (profile.buddy === 'poki' && equippedClothing.id === 'snout-hoodie') return equippedClothing.image;
      if (profile.buddy === 'coco' && equippedClothing.id === 'banana-jacket') return equippedClothing.image;
    }
    return profile.buddy === 'poki' ? POKI_IMG : COCO_IMG;
  };

  // --- LESSON LOGIC ---
  const startLesson = (lesson: Lesson, isPractice = false) => {
    if (!isPractice && profile && profile.hearts <= 0) {
      alert("You're out of hearts! Do a practice lesson to earn one back.");
      return;
    }
    
    setCurrentLesson(lesson);
    setIsPracticeLesson(isPractice);
    setLessonProgress({
      currentQuestionIndex: -1,
      score: 0,
      wrongQuestions: [],
      isFinished: false,
      recapMode: false
    });
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setBuddyMessage(isPractice ? "Let's practice to earn a heart back!" : `Welcome to ${lesson.title}! Let's learn about ${lesson.description.toLowerCase()}.`);
    setView('lesson');
  };

  const checkAnswer = () => {
    if (!currentLesson || selectedOption === null) return;
    
    const questions = lessonProgress.recapMode ? lessonProgress.wrongQuestions : currentLesson.questions;
    const currentQuestion = questions[lessonProgress.currentQuestionIndex];
    const correct = selectedOption === currentQuestion.answer;
    
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    
    if (correct) {
      if (soundEnabled) playSound('correct');
      setBuddyMessage("Great job! That's correct!");
      setLessonProgress(prev => ({ ...prev, score: prev.score + 1 }));
      
      // If in recap mode, remove the question from wrongQuestions after answering correctly
      if (lessonProgress.recapMode) {
        setLessonProgress(prev => {
          const newWrong = [...prev.wrongQuestions];
          newWrong.splice(prev.currentQuestionIndex, 1);
          return {
            ...prev,
            wrongQuestions: newWrong,
            // Adjust index so nextQuestion works correctly
            currentQuestionIndex: prev.currentQuestionIndex - 1
          };
        });
      }
    } else {
      if (soundEnabled) playSound('wrong');
      setBuddyMessage(`Oops! The correct answer was: ${currentQuestion.answer}`);
      
      if (!lessonProgress.recapMode) {
        setLessonProgress(prev => ({
          ...prev,
          wrongQuestions: [...prev.wrongQuestions, currentQuestion]
        }));
      } else {
        // In recap mode, if wrong, move it to the end of the queue
        setLessonProgress(prev => {
          const newWrong = [...prev.wrongQuestions];
          const [failed] = newWrong.splice(prev.currentQuestionIndex, 1);
          newWrong.push(failed);
          return {
            ...prev,
            wrongQuestions: newWrong,
            currentQuestionIndex: prev.currentQuestionIndex - 1 // Stay at same logical position (which is now the next item)
          };
        });
      }

      // Subtract heart if not premium
      if (!profile?.is_premium) {
        const newHearts = Math.max(0, (profile?.hearts || 0) - 1);
        updateProfile({ hearts: newHearts });
        
        if (newHearts === 0) {
          setTimeout(() => {
            alert("You ran out of Pixel Hearts! The lesson has stopped.");
            setView('home');
            setCurrentLesson(null);
          }, 1500);
        }
      }
    }
  };

  const nextQuestion = () => {
    if (!currentLesson) return;
    
    const questions = lessonProgress.recapMode ? lessonProgress.wrongQuestions : currentLesson.questions;
    
    if (lessonProgress.currentQuestionIndex < questions.length - 1) {
      setLessonProgress(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setBuddyMessage("What do you think about this one?");
    } else {
      // Finished current set
      if (!lessonProgress.recapMode && lessonProgress.wrongQuestions.length > 0) {
        setShowRecapCutscene(true);
        setTimeout(() => {
          setShowRecapCutscene(false);
          setLessonProgress(prev => ({
            ...prev,
            recapMode: true,
            currentQuestionIndex: 0
          }));
          setBuddyMessage("Let's review the ones you missed!");
          setSelectedOption(null);
          setIsAnswerChecked(false);
        }, 2000);
      } else {
        // Truly finished
        setLessonProgress(prev => ({ ...prev, isFinished: true }));
        if (soundEnabled) playSound('success');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        // Update profile
        const xpGained = 20;
        const gemsGained = 10;
        const currencyGained = 50;
        
        updateProfile({
          xp: (profile?.xp || 0) + xpGained,
          avatar: {
            ...profile?.avatar!,
            weeklyXp: (profile?.avatar.weeklyXp || 0) + xpGained,
          },
          gems: (profile?.gems || 0) + gemsGained,
          currency: (profile?.currency || 0) + currencyGained,
          completed_lessons: Array.from(new Set([...(profile?.completed_lessons || []), currentLesson.id])),
          streak: (profile?.streak || 0) + 1,
          last_active: new Date().toISOString(),
          hearts: isPracticeLesson ? Math.min(5, (profile?.hearts || 0) + 1) : (profile?.hearts || 0)
        });
      }
    }
  };

  // --- FRIENDS LOGIC ---
  const acceptFriendRequest = async (request: FriendRequest) => {
    if (!profile) return;
    
    // Update request status
    await withRetry(() => withTimeout(
      supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', request.id),
      10000
    ));
    
    // Add to friends list for both
    await withRetry(() => withTimeout(supabase.rpc('add_friend', { user_id: profile.id, friend_id: request.from_id }), 10000));
    await withRetry(() => withTimeout(supabase.rpc('add_friend', { user_id: request.from_id, friend_id: profile.id }), 10000));
    
    updateProfile({ friends: [...profile.friends, request.from_id] });
  };

  // --- SHOP LOGIC ---
  const buyItem = (item: ShopItem) => {
    if (!profile) return;
    
    if (profile.inventory.includes(item.id)) {
      // Toggle equip
      const isEquipped = profile.equipped_items.includes(item.id);
      const newEquipped = isEquipped 
        ? profile.equipped_items.filter(id => id !== item.id)
        : [...profile.equipped_items, item.id];
      updateProfile({ equipped_items: newEquipped });
      return;
    }

    const canAfford = item.currencyType === 'gems' 
      ? profile.gems >= item.price 
      : profile.currency >= item.price;
      
    if (!canAfford) {
      alert("Not enough currency!");
      return;
    }
    
    const updates: Partial<UserProfile> = {};
    if (item.currencyType === 'gems') {
      updates.gems = profile.gems - item.price;
    } else {
      updates.currency = profile.currency - item.price;
    }
    
    if (item.type === 'heart-refill') {
      updates.hearts = 5;
    } else if (item.type === 'streak-freeze' || item.type === 'clothing') {
      updates.inventory = [...profile.inventory, item.id];
    }
    
    updateProfile(updates);
    if (soundEnabled) playSound('success');
  };

  // --- BATTLE LOGIC ---
  const findFriends = async () => {
    if (!searchQuery) return;
    const searchRes = await withRetry(() => withTimeout(
      supabase
        .from('users')
        .select('*')
        .ilike('username', `%${searchQuery}%`),
      10000
    ));
    const { data } = searchRes as any;
    if (data) setSearchResults(data);
  };

  const sendFriendRequest = async (input: string) => {
    if (!profile || !input) return;
    
    setIsSyncing(true);
    try {
      let targetId = input;
      
      // If input doesn't look like a UUID, try to find by username
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)) {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('username', input)
          .single();
        
        if (error || !data) {
          alert("User not found by username.");
          setIsSyncing(false);
          return;
        }
        targetId = data.id;
      }

      if (targetId === profile.id) {
        alert("You cannot add yourself!");
        setIsSyncing(false);
        return;
      }

      const insertRes = await withRetry(() => withTimeout(
        supabase
          .from('friend_requests')
          .insert({
            from_id: profile.id,
            to_id: targetId,
            from_username: profile.username,
            status: 'pending'
          }),
        10000
      ));
      const { error } = insertRes as any;
      if (error) {
        if (error.code === '23505') alert("Request already sent!");
        else throw error;
      } else {
        alert("Friend request sent!");
      }
    } catch (err) {
      console.error("Friend request error:", err);
      alert("Error sending request.");
    } finally {
      setIsSyncing(false);
    }
  };

  const startBattle = async (friendId: string) => {
    if (!profile) return;
    setIsSyncing(true);
    try {
      setBuddyMessage("Generating a battle question...");
      const question = await generateBattleQuestion("YouTube Content Creation");
      
      const battleData = {
        players: [profile.id, friendId],
        status: 'active',
        currentQuestion: question,
        scores: { [profile.id]: 0, [friendId]: 0 },
        startTime: new Date().toISOString()
      };
      
      const battleRes = await withRetry(() => withTimeout(
        supabase
          .from('battles')
          .insert(battleData)
          .select()
          .single(),
        5000
      ));
      const { data, error } = battleRes as any;
      
      if (error) throw error;
      if (data) {
        setActiveBattle(data);
        setView('battle');
      }
    } catch (err) {
      console.error("Battle start error:", err);
      alert("Could not start battle. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const MedalCeremony = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
      >
        {/* Confetti-like particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: 0, opacity: 1 }}
            animate={{ 
              y: [0, -100, 200], 
              x: [0, (i % 2 === 0 ? 1 : -1) * (Math.random() * 100)],
              opacity: [1, 1, 0] 
            }}
            transition={{ duration: 2, delay: Math.random() * 0.5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: ['#FBBF24', '#3B82F6', '#10B981', '#F87171'][i % 4] }}
          />
        ))}

        <div className="relative mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-lg relative z-10 ${
              earnedMedal === 'gold' ? 'bg-yellow-400' : 
              earnedMedal === 'silver' ? 'bg-gray-300' : 
              earnedMedal === 'bronze' ? 'bg-orange-400' : 'bg-blue-400'
            }`}
          >
            <Trophy className="w-16 h-16 text-white fill-current" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-black mb-2 uppercase italic text-gray-800">
          {earnedMedal === 'gold' ? 'Gold Medalist!' : 
           earnedMedal === 'silver' ? 'Silver Medalist!' : 
           earnedMedal === 'bronze' ? 'Bronze Medalist!' : 'Great Job!'}
        </h2>
        <p className="text-gray-500 font-bold mb-8">
          You finished the week strong! Your new medal has been added to your profile.
        </p>
        
        <button 
          onClick={() => setShowMedalCeremony(false)}
          className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all"
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );

  // --- RENDER HELPERS ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
      />
      {networkError ? (
        <div className="max-w-md">
          <p className="text-red-500 font-bold mb-4">{networkError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all"
          >
            Retry
          </button>
          <div className="mt-4">
            <button 
              onClick={loginAsGuest}
              className="text-blue-500 hover:underline font-bold"
            >
              Continue as Guest instead
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 font-bold animate-pulse">Initializing Pixel Buddies...</p>
      )}
    </div>
  );

  // --- LANDING PAGE ---
  if (view === 'landing') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex flex-col items-center"
      >
        <img 
          src="https://i.ibb.co/vrKmXSM/PIXEL-BUDDIES.png" 
          alt="PIXEL BUDDIES" 
          className="w-64 h-auto object-contain mb-4"
          referrerPolicy="no-referrer"
        />
        <p className="text-xl text-gray-500 font-medium">Master YouTube with Poki & Coco</p>
      </motion.div>
      
      <div className="space-y-4 w-full max-w-xs">
        <button 
          onClick={() => setView('auth')}
          className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#22c55e] active:translate-y-1 active:shadow-none transition-all"
        >
          Get Started
        </button>
        <button 
          onClick={loginAsGuest}
          className="w-full py-4 bg-white border-2 border-gray-200 text-gray-500 font-black rounded-2xl uppercase tracking-wider hover:bg-gray-50 transition-all"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );

  // --- AUTH VIEW ---
  if (view === 'auth') return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className={`text-4xl font-black mb-2 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-gray-500 font-bold">{isLogin ? 'Log in to continue your journey' : 'Join the creator community'}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleAuth}
          disabled={isAuthLoading}
          className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
        >
          {isAuthLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span>{isLogin ? 'Logging In...' : 'Signing Up...'}</span>
            </div>
          ) : (
            isLogin ? 'Log In' : 'Sign Up'
          )}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm uppercase"><span className="bg-white px-2 text-gray-400 font-black">Or</span></div>
        </div>

        <button 
          onClick={loginAsGuest}
          className="w-full py-4 bg-white border-2 border-gray-200 text-gray-500 font-black rounded-2xl uppercase tracking-wider hover:bg-gray-50 transition-all"
        >
          Continue as Guest
        </button>

        <p className="text-center font-bold text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );

  // --- ONBOARDING ---
  if (view === 'onboarding') return (
    <div className={`min-h-screen flex flex-col p-6 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className={`w-full h-4 rounded-full mb-12 overflow-hidden ${profile?.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <motion.div 
            className="bg-green-500 h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${(onboardingStep + 1) * 25}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {onboardingStep === 0 && (
            <motion.div 
              key="step0"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <h2 className={`text-3xl font-black mb-8 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>What should we call you?</h2>
              <div className="w-full max-w-md space-y-2">
                <input 
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full p-4 border-2 rounded-2xl text-xl font-bold focus:border-blue-500 outline-none transition-all ${
                    usernameError ? 'border-red-500' : profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
                  }`}
                  value={profile?.username || ''}
                  onChange={(e) => {
                    setProfile(prev => ({ ...(prev || INITIAL_PROFILE), username: e.target.value }));
                    setUsernameError(null);
                  }}
                />
                {usernameError && <p className="text-red-500 font-bold text-sm">{usernameError}</p>}
              </div>
              <button 
                disabled={!profile?.username || isCheckingUsername}
                onClick={async () => {
                  const isAvailable = await checkUsernameAvailability(profile?.username || '');
                  if (isAvailable) setOnboardingStep(1);
                }}
                className="mt-8 px-12 py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
              >
                {isCheckingUsername ? 'Checking...' : 'Continue'}
              </button>
            </motion.div>
          )}

          {onboardingStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <h2 className={`text-3xl font-black mb-8 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Choose your learning buddy!</h2>
              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <button 
                  onClick={() => { setProfile(prev => ({ ...(prev!), buddy: 'poki' })); setOnboardingStep(2); }}
                  className={`p-6 rounded-3xl border-4 transition-all ${
                    profile?.buddy === 'poki' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : (profile?.theme === 'dark' ? 'border-gray-800 hover:border-gray-700' : 'border-gray-100 hover:border-gray-200')
                  }`}
                >
                  <img src={POKI_IMG} alt="Poki" className="w-32 h-32 mx-auto mb-4 object-contain" referrerPolicy="no-referrer" />
                  <p className={`text-xl font-black ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Poki the Pig</p>
                </button>
                <button 
                  onClick={() => { setProfile(prev => ({ ...(prev!), buddy: 'coco' })); setOnboardingStep(2); }}
                  className={`p-6 rounded-3xl border-4 transition-all ${
                    profile?.buddy === 'coco' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : (profile?.theme === 'dark' ? 'border-gray-800 hover:border-gray-700' : 'border-gray-100 hover:border-gray-200')
                  }`}
                >
                  <img src={COCO_IMG} alt="Coco" className="w-32 h-32 mx-auto mb-4 object-contain" referrerPolicy="no-referrer" />
                  <p className={`text-xl font-black ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Coco the Monkey</p>
                </button>
              </div>
            </motion.div>
          )}

          {onboardingStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="flex-1 flex flex-col items-center"
            >
              <h2 className={`text-3xl font-black mb-8 text-center ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Customize your avatar!</h2>
              <AvatarBuilder 
                initialConfig={profile?.avatar || DEFAULT_AVATAR} 
                theme={profile?.theme}
                onSave={(config) => {
                  setProfile(prev => ({ ...(prev!), avatar: { ...prev!.avatar, ...config } }));
                  setOnboardingStep(3);
                }}
                saveLabel="Looks Good!"
              />
            </motion.div>
          )}

          {onboardingStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-8 relative">
                <Avatar config={profile?.avatar!} size="xl" className="mx-auto" allowOverflow />
                <img 
                  src={getBuddyImg()} 
                  className="w-20 h-20 absolute -bottom-4 -right-4 object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className={`text-4xl font-black mb-4 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>You're all set, {profile?.username}!</h2>
              <p className="text-xl text-gray-500 mb-12">Ready to become a YouTube legend?</p>
              <button 
                onClick={async () => {
                  if (profile) {
                    await updateProfile(profile);
                    setView('home');
                  }
                }}
                className="px-16 py-5 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#22c55e] active:translate-y-1 active:shadow-none transition-all"
              >
                Let's Go!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
          <button 
            onClick={logout}
            className="text-gray-400 font-bold hover:text-gray-600 transition-all flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Not you? Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  // --- MAIN APP LAYOUT ---
  const Sidebar = () => (
    <div className={`hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 border-r-2 border-gray-100 p-4 z-50 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex items-center space-x-3 px-4 mb-12">
        <img 
          src={LOGO_IMG} 
          alt="PIXEL BUDDIES" 
          className="w-full h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {isSyncing && (
        <div className="px-4 mb-4 flex items-center space-x-2 text-xs font-bold text-blue-400 animate-pulse">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full" />
          <span>Syncing...</span>
        </div>
      )}
      
      <nav className="flex-1 px-4 space-y-2">
        {[
          { icon: Home, label: 'Learn', view: 'home' },
          { icon: Trophy, label: 'Leaderboard', view: 'leaderboard' },
          { icon: ShoppingBag, label: 'Shop', view: 'shop' },
          { icon: User, label: 'Profile', view: 'profile' },
          { icon: Settings, label: 'Settings', view: 'settings' },
        ].map(item => (
          <button 
            key={item.label}
            onClick={() => setView(item.view as any)}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl font-black uppercase tracking-wider transition-all ${
              view === item.view 
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-100' 
                : profile?.theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-6 h-6 pixelated" />
            <span>{item.label}</span>
          </button>
        ))}

        {!profile?.is_premium && (
          <button 
            onClick={() => setShowPowerUpModal(true)}
            className="w-full flex items-center space-x-4 p-4 rounded-2xl font-black uppercase tracking-wider bg-yellow-400 text-white shadow-[0_4px_0_0_#ca8a04] hover:bg-yellow-300 transition-all mt-4"
          >
            <img src={POWER_UP_IMG} className="w-6 h-6" alt="Power Up" />
            <span>Power Up!</span>
          </button>
        )}
      </nav>
      
      <div className={`p-4 rounded-2xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex items-center space-x-3 mb-2">
          <PixelHeart className="w-5 h-5" />
          <span className="font-black text-xs uppercase tracking-tighter">
            {profile?.is_premium ? 'Infinite' : `${profile?.hearts} Hearts`}
          </span>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <Flame className="w-5 h-5 text-orange-500 fill-current" />
          <span className="font-black">{profile?.streak}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span className="font-black">{profile?.gems}</span>
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t-2 flex justify-around p-4 z-50 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      {[
        { icon: Home, view: 'home' },
        { icon: Trophy, view: 'leaderboard' },
        { icon: ShoppingBag, view: 'shop' },
        { icon: User, view: 'profile' },
        { icon: Settings, view: 'settings' },
      ].map(item => (
        <button 
          key={item.view}
          onClick={() => setView(item.view as any)}
          className={`p-2 rounded-xl ${view === item.view ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <item.icon className="w-7 h-7 pixelated" />
        </button>
      ))}
      {!profile?.is_premium && (
        <button 
          onClick={() => setShowPowerUpModal(true)}
          className="p-2 rounded-xl text-yellow-500"
        >
          <img src={POWER_UP_IMG} className="w-7 h-7" alt="Power Up" />
        </button>
      )}
    </div>
  );

  // --- HOME / LEARN VIEW ---
  if (view === 'home') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-2xl mx-auto p-6">
        {profile?.hearts === 0 && !profile?.is_premium && (
          <div className="mb-8 p-6 bg-red-100 border-2 border-red-200 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PixelHeart className="w-10 h-10" />
              <div>
                <h4 className="text-xl font-black text-red-700 uppercase tracking-tighter">Out of Pixel Hearts!</h4>
                <p className="text-red-600 font-bold">Do a practice lesson to earn one back.</p>
              </div>
            </div>
            <button 
              onClick={() => startLesson(UNITS[0].lessons[0], true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl uppercase tracking-wider shadow-[0_4px_0_0_#ef4444] active:translate-y-1 active:shadow-none transition-all"
            >
              Practice
            </button>
          </div>
        )}
        {UNITS.map(unit => (
          <div key={unit.id} className="mb-12">
            <div className={`p-6 rounded-3xl mb-8 text-white shadow-lg ${
              unit.id % 3 === 1 ? 'bg-blue-500' : unit.id % 3 === 2 ? 'bg-green-500' : 'bg-purple-500'
            }`}>
              <h2 className="text-xl font-black uppercase tracking-widest opacity-80 mb-1">Unit {unit.id}</h2>
              <h3 className="text-3xl font-black mb-2">{unit.title}</h3>
              <p className="font-bold opacity-90">{unit.description}</p>
            </div>

            <div className="flex flex-col items-center space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-0 w-2 bg-gray-100 -z-10" />
              
              {unit.lessons.map((lesson, idx) => {
                const isCompleted = profile?.completed_lessons.includes(lesson.id);
                const isUnlocked = idx === 0 || profile?.completed_lessons.includes(unit.lessons[idx-1].id) || profile?.is_premium;
                const offset = Math.sin(idx * 0.8) * 60;

                return (
                  <motion.button
                    key={lesson.id}
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && startLesson(lesson)}
                    style={{ x: offset }}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-yellow-400 shadow-[0_6px_0_0_#ca8a04]' 
                        : isUnlocked 
                          ? 'bg-blue-500 shadow-[0_6px_0_0_#2563eb]' 
                          : 'bg-gray-200 shadow-[0_6px_0_0_#e5e7eb]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-10 h-10 text-white" strokeWidth={4} />
                    ) : isUnlocked ? (
                      <Star className="w-10 h-10 text-white fill-current" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-2 px-4 rounded-xl opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {lesson.title}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );

  // --- LESSON VIEW ---
  if (view === 'lesson' && currentLesson) {
    const questions = lessonProgress.recapMode ? lessonProgress.wrongQuestions : currentLesson.questions;
    const currentQuestion = lessonProgress.currentQuestionIndex === -1 ? null : questions[lessonProgress.currentQuestionIndex];
    const progress = lessonProgress.currentQuestionIndex === -1 
      ? 0 
      : ((lessonProgress.currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className={`min-h-screen flex flex-col ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
        {/* Header */}
        <div className="p-6 flex items-center space-x-6 max-w-4xl mx-auto w-full">
          <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600">
            <X className="w-8 h-8" />
          </button>
          <div className={`flex-1 h-4 rounded-full overflow-hidden ${profile?.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <motion.div 
              className="h-full bg-green-500" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <PixelHeart className="w-6 h-6" />
            <span className={`font-black ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {profile?.is_premium ? '∞' : profile?.hearts}
            </span>
          </div>
        </div>

        <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col">
          <AnimatePresence mode="wait">
            {lessonProgress.isFinished ? (
              <motion.div 
                key="finished"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="mb-8 flex items-end justify-center space-x-4">
                  <div className="relative">
                    <Avatar config={profile?.avatar!} size="xl" allowOverflow />
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-8 -right-8 bg-yellow-400 p-4 rounded-2xl shadow-lg z-20"
                    >
                      <Trophy className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                  <motion.img 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    src={getBuddyImg()} 
                    className="w-40 h-40 object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <h2 className={`text-4xl font-black mb-4 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Lesson Complete!</h2>
                <div className="grid grid-cols-3 gap-4 w-full mb-12">
                  <div className={`p-4 rounded-2xl border-2 ${profile?.theme === 'dark' ? 'bg-orange-900/20 border-orange-900/40' : 'bg-orange-50 border-orange-100'}`}>
                    <p className="text-xs font-black text-orange-500 uppercase mb-1">Total XP</p>
                    <p className="text-2xl font-black text-orange-600">+20</p>
                  </div>
                  <div className={`p-4 rounded-2xl border-2 ${profile?.theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
                    <p className="text-xs font-black text-blue-500 uppercase mb-1">Gems</p>
                    <p className="text-2xl font-black text-blue-600">+10</p>
                  </div>
                  <div className={`p-4 rounded-2xl border-2 ${profile?.theme === 'dark' ? 'bg-green-900/20 border-green-900/40' : 'bg-green-50 border-green-100'}`}>
                    <p className="text-xs font-black text-green-500 uppercase mb-1">{profile?.buddy === 'poki' ? 'Corn' : 'Bananas'}</p>
                    <p className="text-2xl font-black text-green-600">+50</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView('home')}
                  className="w-full py-5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all"
                >
                  Continue
                </button>
              </motion.div>
            ) : lessonProgress.currentQuestionIndex === -1 ? (
              <motion.div 
                key="teaching"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-start space-x-6 mb-12">
                  <img src={getBuddyImg()} className="w-32 h-32 object-contain" referrerPolicy="no-referrer" />
                  <div className={`flex-1 border-2 rounded-3xl p-6 relative shadow-sm ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className={`absolute -left-3 top-8 w-6 h-6 border-l-2 border-b-2 rotate-45 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`} />
                    <p className={`text-xl font-bold leading-relaxed ${profile?.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{currentLesson.teachingPart}</p>
                  </div>
                </div>
                <div className="flex-1" />
                <button 
                  onClick={() => setLessonProgress(prev => ({ ...prev, currentQuestionIndex: 0 }))}
                  className="w-full py-5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all"
                >
                  I'm Ready!
                </button>
              </motion.div>
            ) : currentQuestion ? (
              <motion.div 
                key={currentQuestion.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-start space-x-4 mb-8">
                  <img src={getBuddyImg()} className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                  <div className={`flex-1 border-2 rounded-2xl p-4 relative ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className={`absolute -left-2 top-6 w-4 h-4 border-l-2 border-b-2 rotate-45 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`} />
                    <p className={`font-bold ${profile?.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{buddyMessage}</p>
                  </div>
                </div>

                <h2 className={`text-2xl font-black mb-8 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{currentQuestion.text}</h2>

                <div className="space-y-3 flex-1">
                  {currentQuestion.options?.map(option => (
                    <button
                      key={option}
                      disabled={isAnswerChecked}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full p-4 text-left rounded-2xl border-2 font-bold transition-all ${
                        selectedOption === option 
                          ? isAnswerChecked 
                            ? isCorrect 
                              ? 'bg-green-50 border-green-500 text-green-700' 
                              : 'bg-red-50 border-red-500 text-red-700'
                            : 'bg-blue-50 border-blue-500 text-blue-700'
                          : isAnswerChecked && option === currentQuestion.answer
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className={`mt-8 p-6 rounded-3xl transition-all ${
                  isAnswerChecked 
                    ? isCorrect ? 'bg-green-100' : 'bg-red-100'
                    : 'bg-transparent'
                }`}>
                  {isAnswerChecked && (
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                      </div>
                      <p className={`text-xl font-black ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect ? 'Amazing!' : 'Not quite...'}
                      </p>
                    </div>
                  )}
                  <button 
                    disabled={selectedOption === null}
                    onClick={isAnswerChecked ? nextQuestion : checkAnswer}
                    className={`w-full py-5 font-black rounded-2xl uppercase tracking-wider transition-all ${
                      selectedOption === null 
                        ? 'bg-gray-200 text-gray-400' 
                        : isAnswerChecked
                          ? isCorrect 
                            ? 'bg-green-500 hover:bg-green-400 text-white shadow-[0_4px_0_0_#22c55e]' 
                            : 'bg-red-500 hover:bg-red-400 text-white shadow-[0_4px_0_0_#ef4444]'
                          : 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_0_0_#3b82f6]'
                    }`}
                  >
                    {isAnswerChecked ? 'Continue' : 'Check'}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // --- PROFILE VIEW ---
  if (view === 'profile') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative mb-6">
              <Avatar config={profile?.avatar!} size="xl" allowOverflow />
              <img 
                src={getBuddyImg()} 
                className="w-24 h-24 absolute -bottom-4 -right-4 object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-3xl font-black mb-2">{profile?.username}</h2>
            <p className="text-gray-500 font-bold mb-6">Joined {new Date(profile?.last_active!).toLocaleDateString()}</p>
            
            <div className="flex space-x-2 w-full">
              <button 
                onClick={() => setView('avatar-edit')}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
              >
                <Palette className="w-5 h-5" />
                <span>Edit Avatar</span>
              </button>
              <button 
                onClick={() => {
                  setView('onboarding');
                  setOnboardingStep(1);
                }}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-black rounded-xl uppercase tracking-wider shadow-[0_4px_0_0_#22c55e] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
              >
                <UserCircle className="w-5 h-5" />
                <span>Buddy</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className={`p-6 rounded-3xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <h3 className="text-xl font-black mb-6">Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border-2 text-center ${profile?.theme === 'dark' ? 'bg-orange-900/20 border-orange-900/40' : 'bg-orange-50 border-orange-100'}`}>
                  <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2 fill-current" />
                  <p className="text-2xl font-black text-orange-600">{profile?.streak}</p>
                  <p className="text-xs font-black text-orange-400 uppercase">Streak</p>
                </div>
                <div className={`p-4 rounded-2xl border-2 text-center ${profile?.theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2 fill-current" />
                  <p className="text-2xl font-black text-blue-600">{profile?.xp}</p>
                  <p className="text-xs font-black text-blue-400 uppercase">Total XP</p>
                </div>
                <div className={`p-4 rounded-2xl border-2 text-center ${profile?.theme === 'dark' ? 'bg-yellow-900/20 border-yellow-900/40' : 'bg-yellow-50 border-yellow-100'}`}>
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2 fill-current" />
                  <p className="text-2xl font-black text-yellow-600">{profile?.gems}</p>
                  <p className="text-xs font-black text-yellow-400 uppercase">Gems</p>
                </div>
                <div className={`p-4 rounded-2xl border-2 text-center ${profile?.theme === 'dark' ? 'bg-green-900/20 border-green-900/40' : 'bg-green-50 border-green-100'}`}>
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-black text-green-600">{profile?.completed_lessons.length}</p>
                  <p className="text-xs font-black text-green-400 uppercase">Lessons</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <h3 className="text-xl font-black mb-4">Medal Collection</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white fill-current" />
                  </div>
                  <p className="font-black">{profile?.avatar.medals.gold}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Gold</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white fill-current" />
                  </div>
                  <p className="font-black">{profile?.avatar.medals.silver}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Silver</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-400 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white fill-current" />
                  </div>
                  <p className="font-black">{profile?.avatar.medals.bronze}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Bronze</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-400 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <p className="font-black">{profile?.avatar.medals.participation}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Entry</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">Friends</h3>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    className={`px-4 py-2 rounded-xl border-2 outline-none focus:border-blue-500 ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    onKeyDown={(e) => e.key === 'Enter' && sendFriendRequest((e.target as HTMLInputElement).value)}
                  />
                  <button className="p-2 bg-blue-500 text-white rounded-xl"><UserPlus className="w-6 h-6" /></button>
                </div>
              </div>
              
              {friendRequests.length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase">Pending Requests</p>
                  {friendRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-blue-100">
                      <span className="font-bold text-blue-700">{req.from_username}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => acceptFriendRequest(req)} className="p-1 bg-green-500 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                        <button className="p-1 bg-red-500 text-white rounded-lg"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {profile?.friends.length === 0 ? (
                  <p className="col-span-2 text-center text-gray-400 font-bold py-8">No friends yet. Add some!</p>
                ) : (
                  profile?.friends.map(friendId => (
                    <div key={friendId} className={`p-4 rounded-2xl border-2 flex items-center justify-between ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="font-bold">Friend</span>
                      </div>
                      <button 
                        onClick={() => startBattle(friendId)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl uppercase text-xs tracking-wider shadow-[0_3px_0_0_#ef4444] active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        Battle
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );

  // --- LEADERBOARD VIEW ---
  if (view === 'leaderboard') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-4 bg-yellow-400 rounded-3xl shadow-lg">
            <Trophy className="w-10 h-10 text-white fill-current" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Leaderboard</h2>
        </div>
        <div className={`rounded-3xl border-2 overflow-hidden ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4 pixelated" />
              <p className="text-gray-500 font-bold">No one on the leaderboard yet. Be the first!</p>
            </div>
          ) : (
            leaderboard.map((user, idx) => {
              const isMe = user.id === profile?.id;
              const isBot = user.id.startsWith('bot-');
              
              return (
                <div 
                  key={user.id} 
                  className={`p-4 flex items-center space-x-4 border-b-2 last:border-0 ${
                    isMe ? (profile?.theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50') : ''
                  } ${profile?.theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}
                >
                  <span className={`w-8 text-2xl font-black ${profile?.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{idx + 1}</span>
                  <div className="relative">
                    <Avatar config={user.avatar} size="sm" />
                    <img 
                      src={user.buddy === 'poki' ? POKI_IMG : COCO_IMG} 
                      className="w-6 h-6 absolute -bottom-1 -right-1 object-contain bg-white rounded-full border border-gray-100 p-0.5 shadow-sm" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-black">{user.username}</p>
                      {isBot && <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md font-black uppercase">Bot</span>}
                    </div>
                    <p className="text-sm font-bold text-gray-500">{user.avatar.weeklyXp} Weekly XP</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {idx === 0 ? (
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white fill-current pixelated" />
                      </div>
                    ) : idx === 1 ? (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white fill-current pixelated" />
                      </div>
                    ) : idx === 2 ? (
                      <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white fill-current pixelated" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-blue-400 fill-current pixelated" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );

  // --- SETTINGS VIEW ---
  if (view === 'settings') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-4xl font-black mb-8">Settings</h2>
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border-2 ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <h3 className="text-xl font-black mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <span className="font-bold">Dark Mode</span>
              <button 
                onClick={() => updateProfile({ theme: profile?.theme === 'light' ? 'dark' : 'light' })}
                className={`w-14 h-8 rounded-full relative transition-all ${profile?.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${profile?.theme === 'dark' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
          <button 
            onClick={logout}
            className={`w-full py-4 font-black rounded-2xl uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
              profile?.theme === 'dark' ? 'bg-red-900/20 text-red-500 hover:bg-red-900/30' : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );

  // --- AVATAR EDIT VIEW ---
  if (view === 'avatar-edit') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('profile')} className={`p-2 rounded-xl transition-all ${profile?.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <ArrowLeft className="w-8 h-8" />
          </button>
          <h2 className="text-4xl font-black">Customize Avatar</h2>
        </div>
        <AvatarBuilder 
          initialConfig={profile?.avatar!} 
          theme={profile?.theme}
          onSave={(avatarConfig) => {
            updateProfile({ avatar: { ...profile?.avatar!, ...avatarConfig } });
            setView('profile');
          }} 
          saveLabel="Save Changes"
        />
      </main>
      <BottomNav />
    </div>
  );

  // --- SHOP VIEW ---
  if (view === 'shop') return (
    <div className={`min-h-screen md:pl-64 pb-24 md:pb-0 ${profile?.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <Sidebar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-8">Shop</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-500 rounded-3xl p-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1">Gems & {profile?.buddy === 'poki' ? 'Corn' : 'Bananas'}</h2>
              <p className="font-bold opacity-90">Spend your hard-earned rewards!</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="font-black">{profile?.gems}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-xl">
                {profile?.buddy === 'poki' ? <Corn className="w-5 h-5 text-yellow-400" /> : <Banana className="w-5 h-5 text-yellow-400" />}
                <span className="font-black">{profile?.currency}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHOP_ITEMS.map(item => (
              <div key={item.id} className={`border-2 rounded-3xl p-6 flex flex-col shadow-sm ${profile?.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex-1">
                  {item.image ? (
                    <img src={item.image} className="w-24 h-24 mx-auto mb-4 object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center ${profile?.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      {item.type === 'streak-freeze' ? <Flame className="w-12 h-12 text-orange-500 pixelated" /> : <PixelHeart className="w-12 h-12" />}
                    </div>
                  )}
                  <h3 className={`text-xl font-black mb-1 ${profile?.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
                  <p className="text-sm text-gray-500 font-bold mb-4">{item.description}</p>
                </div>
                  <button 
                    onClick={() => buyItem(item)}
                    className={`w-full py-3 font-black rounded-xl flex items-center justify-center space-x-2 shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all ${
                      profile?.inventory.includes(item.id) 
                        ? profile.equippedItems.includes(item.id) ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-500 hover:bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-400'
                    }`}
                  >
                    {profile?.inventory.includes(item.id) ? (
                      <span>{profile.equippedItems.includes(item.id) ? 'Equipped' : 'Equip'}</span>
                    ) : (
                      <>
                        {item.currencyType === 'gems' ? <Star className="w-4 h-4 fill-current" /> : (profile?.buddy === 'poki' ? <Corn className="w-4 h-4" /> : <Banana className="w-4 h-4" />)}
                        <span>{item.price}</span>
                      </>
                    )}
                  </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );

  // --- BATTLE VIEW ---
  if (view === 'battle' && activeBattle) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${profile?.theme === 'dark' ? 'bg-gray-950' : 'bg-red-500'}`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-2xl w-full rounded-3xl p-8 shadow-2xl border-4 ${profile?.theme === 'dark' ? 'bg-gray-900 border-red-500 text-white' : 'bg-white border-white text-gray-800'}`}
        >
          <div className="flex items-center justify-between mb-12">
            <div className="text-center">
              <div className="relative">
                <Avatar config={profile?.avatar!} size="md" />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white">YOU</div>
              </div>
              <p className="font-black mt-3 uppercase tracking-tighter">{profile?.username}</p>
              <div className="bg-blue-100 px-4 py-1 rounded-full mt-2 font-black text-blue-600 border-2 border-blue-200">
                {activeBattle.scores[profile?.id!]} PTS
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-red-500 italic drop-shadow-lg mb-2">VS</div>
              <div className="bg-red-100 px-3 py-1 rounded-lg text-[10px] font-black text-red-600 uppercase">Battle Mode</div>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-white shadow-inner'}`}>
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white">OPP</div>
              </div>
              <p className="font-black mt-3 uppercase tracking-tighter">Opponent</p>
              <div className="bg-red-100 px-4 py-1 rounded-full mt-2 font-black text-red-600 border-2 border-red-200">
                {activeBattle.scores[activeBattle.players.find((p: string) => p !== profile?.id)!]} PTS
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl mb-8 border-2 ${profile?.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <h2 className="text-2xl font-black text-center leading-tight mb-8">
              {activeBattle.currentQuestion.text}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {activeBattle.currentQuestion.options.map((opt: string) => (
                <button 
                  key={opt}
                  onClick={async () => {
                    const isCorrect = opt === activeBattle.currentQuestion.answer;
                    if (isCorrect) {
                      if (soundEnabled) playSound('correct');
                      const newScores = { ...activeBattle.scores, [profile?.id!]: (activeBattle.scores[profile?.id!] || 0) + 1 };
                      
                      // Optimistic update
                      setActiveBattle((prev: any) => ({ ...prev, scores: newScores }));
                      
                      const nextQuestion = await generateBattleQuestion("YouTube Growth & Strategy");
                      await supabase
                        .from('battles')
                        .update({
                          scores: newScores,
                          currentQuestion: nextQuestion
                        })
                        .eq('id', activeBattle.id);
                    } else {
                      if (soundEnabled) playSound('wrong');
                      // Shake animation or feedback
                    }
                  }}
                  className={`w-full p-5 rounded-2xl border-2 font-black text-lg transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none ${
                    profile?.theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-white border-gray-200 text-gray-800 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={async () => {
              if (confirm("Are you sure you want to forfeit? You will lose XP!")) {
                await supabase.from('battles').delete().eq('id', activeBattle.id);
                setView('home');
              }
            }}
            className="w-full py-4 text-gray-400 font-black rounded-2xl uppercase tracking-widest text-xs hover:text-red-500 transition-all"
          >
            Forfeit Battle
          </button>
        </motion.div>
      </div>
    );
  }

  // --- STREAK POPUP ---
  const StreakPopup = () => (
    <AnimatePresence>
      {showStreakPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="w-16 h-16 text-orange-500 fill-current" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">{profile?.streak} Day Streak!</h3>
            <p className="text-gray-500 font-bold mb-8">You're on fire! Keep it up to reach your goals.</p>
            <button 
              onClick={() => setShowStreakPopup(false)}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#3b82f6] active:translate-y-1 active:shadow-none transition-all"
            >
              Awesome!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`font-sans selection:bg-blue-100 selection:text-blue-600 ${profile?.theme === 'dark' ? 'dark bg-gray-950' : 'bg-white'}`}>
      <StreakPopup />
      {showMedalCeremony && <MedalCeremony />}
      
      <AnimatePresence>
        {showPowerUpModal && (
          <PowerUpModal 
            profile={profile} 
            setShowPowerUpModal={setShowPowerUpModal} 
            updateProfile={updateProfile}
            soundEnabled={soundEnabled}
            playSound={playSound}
          />
        )}
        {showRecapCutscene && <RecapCutscene getBuddyImg={getBuddyImg} />}
      </AnimatePresence>

      {networkError && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-red-500 text-white p-2 text-center text-sm font-bold flex items-center justify-center space-x-2">
          <X className="w-4 h-4 cursor-pointer" onClick={() => setNetworkError(null)} />
          <span>{networkError}</span>
          <button onClick={() => window.location.reload()} className="underline ml-2">Reload</button>
        </div>
      )}

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        view === 'landing' ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-blue-50 to-white">
            <motion.div 
              initial={{ y: -50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="mb-12"
            >
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <motion.img 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    src={POKI_IMG} 
                    alt="Poki" 
                    className="w-32 h-32 object-contain drop-shadow-xl" 
                    referrerPolicy="no-referrer" 
                  />
                  <motion.img 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    src={COCO_IMG} 
                    alt="Coco" 
                    className="w-32 h-32 object-contain drop-shadow-xl" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              <h1 className="text-6xl font-black text-blue-600 mb-4 tracking-tighter uppercase italic">PIXEL BUDDIES</h1>
              <p className="text-2xl text-gray-500 font-bold uppercase tracking-widest">Master YouTube with Poki & Coco</p>
            </motion.div>
            
            <div className="space-y-6 w-full max-w-sm">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('auth')}
                className="w-full py-6 bg-green-500 hover:bg-green-400 text-white text-2xl font-black rounded-3xl uppercase tracking-widest shadow-[0_8px_0_0_#16a34a] active:translate-y-2 active:shadow-none transition-all"
              >
                Get Started
              </motion.button>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Join 1,000+ Creators Today</p>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
