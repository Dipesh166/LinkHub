import { doc, getDoc, setDoc, collection, collectionGroup, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { writeBatch, query, where, getDocs } from 'firebase/firestore';
import { nanoid } from 'nanoid';

export interface UserData {
  id: string;
  slug: string; // Add slug field
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
        slug: data.slug,
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

    // Generate random string using nanoid (3 characters)
    const randomString = nanoid(3);
    
    // Generate slug (username-randomString)
    const slug = `${newUserData.username}-${randomString}`.toLowerCase();

    // Add slug to user data
    const userDataWithSlug = {
      ...newUserData,
      slug: slug.toLowerCase(),
      id: profileId
    };

    // Create a compound index for slug uniqueness check
    const slugExists = await checkSlugExists(slug);
    if (slugExists) {
      throw new Error('This slug already exists. Please try again.');
    }

    // Write the user data to Firestore
    await setDoc(newProfileRef, userDataWithSlug);

    return profileId;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// Add new function to check slug uniqueness
async function checkSlugExists(slug: string): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      const profilesRef = collection(db, "users", userDoc.id, "profiles");
      const profilesSnapshot = await getDocs(
        query(profilesRef, where("slug", "==", slug))
      );

      if (!profilesSnapshot.empty) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking slug existence:', error);
    throw error;
  }
}

// Add new function to get profile by slug
export async function getPublicPageBySlug(slug: string): Promise<UserData | null> {
  try {
    // Normalize the slug to lowercase for consistent comparison
    const normalizedSlug = slug.toLowerCase();
    
    // Create a collection group query to search across all profile subcollections
    const profilesQuery = query(
      collectionGroup(db, 'profiles'),
      where('slug', '==', normalizedSlug),
      limit(1)
    );

    const querySnapshot = await getDocs(profilesQuery);

    if (querySnapshot.empty) {
      return null;
    }

    // Get the first (and should be only) matching document
    const profileDoc = querySnapshot.docs[0];
    const data = profileDoc.data();

    return {
      id: profileDoc.id,
      slug: data.slug,
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
  } catch (error) {
    console.error('Error fetching public page by slug:', error);
    return null;
  }
}

export async function updateProfiles(userId: string, profileId: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    

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