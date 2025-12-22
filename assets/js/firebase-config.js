// Firebase Configuration for Craft Soft Website
const firebaseConfig = {
    apiKey: "AIzaSyAvLHRgIgFq6SWkWl4Zj7IhJxZiCX5vqPc",
    authDomain: "craftsoft-admin.firebaseapp.com",
    projectId: "craftsoft-admin",
    storageBucket: "craftsoft-admin.firebasestorage.app",
    messagingSenderId: "967033749556",
    appId: "1:967033749556:web:aad0b21e16439f3af14a61"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
window.db = db;

console.log('🔥 Website Firebase initialized');
