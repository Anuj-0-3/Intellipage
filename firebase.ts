import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAgrvYMI6xGG8D031xPRep9cCWRkyMaVw4",
    authDomain: "intellipage-a0465.firebaseapp.com",
    projectId: "intellipage-a0465",
    storageBucket: "intellipage-a0465.firebasestorage.app",
    messagingSenderId: "499202487097",
    appId: "1:499202487097:web:34be5b012b57644b08aee8",
    measurementId: "G-VR4SVMSSFF"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db=getFirestore(app);

  export {db};
  