import { initializeApp, getApps, getApp } from "firebase/app";
import "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtbLGou44rIOt8Be7rkKbKDKy_silwyDU",
  authDomain: "chat-app-b77d5.firebaseapp.com",
  projectId: "chat-app-b77d5",
  storageBucket: "chat-app-b77d5.appspot.com",
  messagingSenderId: "798921592451",
  appId: "1:798921592451:web:0ffb9ad33b066a7d0055b6",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
// const auth = getAuth();

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, auth };
