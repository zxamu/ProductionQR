import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId
};

initializeApp(firebaseConfig);

const appFirebase = initializeApp(firebaseConfig);

const database = getFirestore(appFirebase);

export { appFirebase, database };