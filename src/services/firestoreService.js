// firestoreService.js
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure this path is correct based on your project structure

export const fetchUserType = async (uid) => {
  console.log('Fetching user type for UID:', uid); // Debug log
  const adminDoc = await getDoc(doc(db, 'admin', uid));
  if (adminDoc.exists()) {
    return 'admin';
  }

  const staffDoc = await getDoc(doc(db, 'staff', uid));
  if (staffDoc.exists()) {
    return 'staff';
  }

  const customerDoc = await getDoc(doc(db, 'customer', uid));
  if (customerDoc.exists()) {
    return 'customer';
  }

  throw new Error(`User with UID ${uid} does not exist in any collection`);
};

export const createUserProfile = async (uid, profileData, userType) => {
  console.log('Creating user profile for UID:', uid, 'User Type:', userType); // Debug log
  await setDoc(doc(db, userType, uid), profileData);
};
