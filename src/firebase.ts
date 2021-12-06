import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// const firebaseApp = firebase.initializeApp(firebaseConfig)
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// } else {
//   firebase.app();
// }

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
// export const storage = firebase.storage();
export const provider = new GoogleAuthProvider();
