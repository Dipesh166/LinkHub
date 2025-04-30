import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserData {
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

export async function getPublicPage(pageId: string): Promise<UserData | null> {
  try {
    const docRef = doc(db, 'users', pageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
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

export async function saveUserProfile(userId: string, data: Partial<UserData>) {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { ...data }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

export async function saveLinks(userId: string, links: Array<{ id: string; title: string; url: string; theme?: any }>) {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { links }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving links:', error);
    throw error;
  }
}

export async function saveTheme(userId: string, theme: any) {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { theme }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
}