import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { writeBatch, query, where, getDocs } from 'firebase/firestore';

export interface UserData {
  id: string;
  username: string;
  bio: string;
  profession: string;
  profileImage: string | null;
  profileImageId: string | null;
  socialHandles: Array<{
    platform: string;
    url: string;
  }>;
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  theme: {
    background: string;
    backgroundImage: string | null;
    backgroundImageId: string | null;
    gradientStyle: string;
    buttonStyle: string;
    cardStyle: string;
    animation: string;
    opacity: number;
    blurAmount: number;
    useCustomGradient: boolean;
    customGradient?: {
      color1: string;
      color2: string;
      angle: number;
    };
  };
}

export async function getPublicPage(userId: string, profileId: string): Promise<UserData | null> {
  try {
    const profileRef = doc(db, "users", userId, "profiles", profileId);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: profileId,
        username: data.username || '',
        bio: data.bio || '',
        profession: data.profession || '',
        profileImage: data.profileImage || null,
        profileImageId: data.profileImageId || null,
        socialHandles: data.socialHandles || [],
        links: data.links || [],
        theme: {
          background: data.theme?.background || 'gradient',
          backgroundImage: data.theme?.backgroundImage || null,
          backgroundImageId: data.theme?.backgroundImageId || null,
          gradientStyle: data.theme?.gradientStyle || 'midnight',
          buttonStyle: data.theme?.buttonStyle || 'rounded',
          cardStyle: data.theme?.cardStyle || 'glass',
          animation: data.theme?.animation || 'none',
          opacity: data.theme?.opacity ?? 0.7,
          blurAmount: data.theme?.blurAmount ?? 0,
          useCustomGradient: data.theme?.useCustomGradient || false,
          customGradient: data.theme?.customGradient || {
            color1: '#121063',
            color2: '#1a0038',
            angle: 135,
          },
        },
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching public page:', error);
    return null;
  }
}

export async function getUserProfile(userId: string, profileId: string): Promise<UserData | null> {
  if (!userId || !profileId) {
    console.warn("Invalid userId or profileId passed to getUserProfile");
    return null;
  }

  try {
    const profileRef = doc(db, "users", userId, "profiles", profileId); // 👈 split into segments
    const docSnap = await getDoc(profileRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function saveUserProfile(userId: string, newUserData: UserData) {
  try {
    const profilesRef = collection(db, "users", userId, "profiles");
    const newProfileRef = doc(profilesRef);
    const profileId = newProfileRef.id;

    // Write the user data to Firestore
    await setDoc(newProfileRef, newUserData);

    return profileId;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

export async function updateProfiles(userId: string, profileId: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    if (!userId || !profileId) {
      throw new Error('Invalid userId or profileId');
    }

    if (userId === profileId) {
      throw new Error('Profile ID cannot be the same as User ID');
    }

    const profileRef = doc(db, `users/${userId}/profiles/${profileId}`);
    await setDoc(profileRef, updates, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function saveLinks(userId: string, profileId: string, links: Array<{ id: string; title: string; url: string; theme?: any }>) {
  try {
    if (userId === profileId) {
      throw new Error('Profile ID cannot be the same as User ID');
    }

    const profileRef = doc(db, "users", userId, "profiles", profileId);
    await setDoc(profileRef, { links }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving links:', error);
    throw error;
  }
}

export async function saveTheme(userId: string, profileId: string, theme: any) {
  try {
    if (userId === profileId) {
      throw new Error('Profile ID cannot be the same as User ID');
    }

    const profileRef = doc(db, `users/${userId}/profiles/${profileId}`);
    await setDoc(profileRef, { theme }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
}

// Gets all profiles for a user
export async function getAllProfiles(userId: string): Promise<UserData[]> {
  try {
    const profilesRef = collection(db, `users/${userId}/profiles`);
    const querySnapshot = await getDocs(profilesRef);
    
    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(doc => ({
      ...(doc.data() as UserData),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting all profiles:', error);
    throw error;
  }
}

export async function deleteProfile(userId: string, profileId: string): Promise<boolean> {
  try {
    const profileRef = doc(db, `users/${userId}/profiles/${profileId}`);
    await setDoc(profileRef, { deleted: true }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}