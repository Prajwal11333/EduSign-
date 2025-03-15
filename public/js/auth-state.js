// auth-state.js - Manages user authentication state and UI visibility

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1ELcXA-sFGJxnGUJc6U3xgWeB4-f7nxY",
    authDomain: "edusign-e315e.firebaseapp.com",
    projectId: "edusign-e315e",
    storageBucket: "edusign-e315e.firebasestorage.app",
    messagingSenderId: "354617663673",
    appId: "1:354617663673:web:d36a17e9ff19e2492f7b68",
    measurementId: "G-XBT16KY57X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to check if user is logged in and update UI accordingly
function updateUIBasedOnAuthState() {
    auth.onAuthStateChanged((user) => {
        console.log("Auth state changed:", user ? "Logged in" : "Not logged in");
        
        const loginBtn = document.getElementById('login-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const mobileLoginLink = document.getElementById('mobile-login-link');
        
        // Elements that should only be visible when logged in
        const loggedInOnlyElements = document.querySelectorAll('.logged-in-only');
        
        if (user) {
            // User is signed in
            console.log('User is logged in as:', user.email);
            
            // Hide login button and show user dropdown
            if (loginBtn) loginBtn.style.display = 'none';
            if (userDropdown) {
                userDropdown.style.display = 'block';
                
                // Update user info in the dropdown
                const userName = document.getElementById('user-name');
                if (userName) {
                    // Use displayName if available, otherwise use email
                    userName.textContent = user.displayName || user.email;
                }
                
                // Update avatar if user has a photo URL
                const userAvatar = document.getElementById('user-avatar');
                if (userAvatar && user.photoURL) {
                    userAvatar.src = user.photoURL;
                }
            }
            
            // Update mobile menu
            if (mobileLoginLink) {
                mobileLoginLink.textContent = 'My Account';
                mobileLoginLink.href = '/dashboard';
            }
            
            // Show elements that should only be visible when logged in
            loggedInOnlyElements.forEach(element => {
                element.style.display = 'block';
            });
        } else {
            // User is signed out
            console.log('User is logged out');
            
            // Show login button and hide user dropdown
            if (loginBtn) loginBtn.style.display = 'block';
            if (userDropdown) userDropdown.style.display = 'none';
            
            // Reset mobile menu
            if (mobileLoginLink) {
                mobileLoginLink.textContent = 'Log In';
                mobileLoginLink.href = '/login';
            }
            
            // Hide elements that should only be visible when logged in
            loggedInOnlyElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    });
}

// Add logout functionality
function setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            signOut(auth).then(() => {
                // Sign-out successful
                console.log('User signed out successfully');
                window.location.href = '/'; // Redirect to homepage after logout
            }).catch((error) => {
                // An error happened
                console.error('Error signing out:', error);
                alert('Error signing out. Please try again.');
            });
        });
    }
}

// Initialize authentication state management
document.addEventListener('DOMContentLoaded', () => {
    console.log("Auth state manager initialized");
    updateUIBasedOnAuthState();
    setupLogout();
});