import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC27EearYILdRZtjwZiV_EtYO3NxUF5tVE",
  authDomain: "pixel-buds.firebaseapp.com",
  projectId: "pixel-buds",
  storageBucket: "pixel-buds.firebasestorage.app",
  messagingSenderId: "548614755980",
  appId: "1:548614755980:web:c1bbbdde8b10e096134da9",
  measurementId: "G-2ZKZ1EZKV5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to get or create a local user ID
export const getLocalUserId = () => {
  let id = localStorage.getItem('pixel_studios_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('pixel_studios_user_id', id);
  }
  return id;
};

export const saveProfileToFirebase = async (profile: any) => {
  try {
    await setDoc(doc(db, "users", profile.id), profile);
  } catch (e) {
    console.error("Error saving profile:", e);
    // Fallback to local storage only if firebase fails
    localStorage.setItem('pixel_studios_profile', JSON.stringify(profile));
  }
};

export const getProfileFromFirebase = async (id: string) => {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error("Error getting profile:", e);
  }
  const local = localStorage.getItem('pixel_studios_profile');
  return local ? JSON.parse(local) : null;
};
