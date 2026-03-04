export type BuddyType = 'poki' | 'coco';

export interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  backgroundColor: string;
  hairStyle: 'none' | 'short' | 'spiky' | 'bun' | 'ponytail' | 'sidepart' | 'curly' | 'afro' | 'buzz' | 'wavy' | 'braids';
  flipHair: boolean;
  headwear: 'none' | 'cap' | 'beanie' | 'bandana';
  headwearColor: string;
  eyeType: 'normal' | 'happy' | 'glasses' | 'sunglasses';
  mouthType: 'smile' | 'grin' | 'neutral' | 'open';
  pantsColor: string;
}

export interface FriendRequest {
  id: string;
  from_id: string;
  from_username: string;
  to_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  buddy: BuddyType;
  avatar: AvatarConfig & {
    weeklyXp: number;
    lastLeaderboardReset: string;
    medals: {
      gold: number;
      silver: number;
      bronze: number;
      participation: number;
    };
  };
  xp: number;
  gems: number;
  currency: number; // Bananas or Corn
  hearts: number;
  streak: number;
  last_active: string;
  last_streak_update: string; // To track daily streak popups
  unlocked_units: number;
  completed_lessons: string[]; // lessonIds
  friends: string[]; // userIds
  inventory: string[]; // itemIds
  equipped_items: string[]; // itemIds
  theme: 'light' | 'dark';
  is_premium?: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank';
  text: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  teachingPart: string;
  questions: Question[];
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currencyType: 'gems' | 'buddy';
  image?: string;
  type: 'streak-freeze' | 'heart-refill' | 'clothing';
}
