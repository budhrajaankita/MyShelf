// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyCaclUzzSGQyOMm6XXzeMgHrYMjB5VKQNQ",
    authDomain: "headshelfaware.firebaseapp.com",
    projectId: "headshelfaware",
    storageBucket: "headshelfaware.appspot.com",
    messagingSenderId: "59191765811",
    appId: "1:59191765811:web:c09c548e372018c775ac46"
    // measurementId: "G-GE6NE0181S"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// const analytics = getAnalytics(app);

export {firestore}

export default app