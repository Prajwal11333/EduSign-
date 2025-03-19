// Import Firebase auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase configuration - use the same config as your register.js
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

// DOM elements
const userMenu = document.getElementById('user-menu');
const loginBtn = document.getElementById('login-btn');
const loggedInOnlyElements = document.querySelectorAll('.logged-in-only');

// Check if on the tutorials page
const isTutorialsPage = window.location.pathname.includes('/baiscs');

// Function to update UI based on authentication state
function updateUIForAuthState(user) {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        
        // Hide login button
        if (loginBtn) loginBtn.style.display = 'none';
        
        // Show logged-in-only navigation items
        loggedInOnlyElements.forEach(element => {
            element.style.display = 'block';
        });
        
        // Create user profile menu
        createUserProfileMenu(user);
        
        // Enable video access if on tutorials page
        if (isTutorialsPage || window.location.pathname.includes('/basics')) {
            enableVideoAccess();
        }

        // Attach click handlers to video links
        attachVideoClickHandlers();
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Show login button
        if (loginBtn) loginBtn.style.display = 'block';
        
        // Hide logged-in-only navigation items
        loggedInOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Reset user menu to default state
        if (userMenu) {
            userMenu.innerHTML = `<a href="/login" class="btn login-btn" id="login-btn">Log In</a>`;
        }
        
        // Disable video access if on tutorials page
        if (isTutorialsPage || window.location.pathname.includes('/basics')) {
            disableVideoAccess();
        }

        // Attach click handlers to video links that redirect to login
        attachLoginRedirectHandlers();
    }
}

// Function to create user profile menu with dropdown
function createUserProfileMenu(user) {
    if (!userMenu) return;
    
    // Get user display name and photo
    const displayName = user.displayName || user.email.split('@')[0];
    const photoURL = user.photoURL || '/assets/imgs/default-profile.png';
    
    // Create profile menu HTML
    userMenu.innerHTML = `
        <div class="user-profile-menu">
            <div class="profile-trigger">
                <img src="${photoURL}" alt="Profile" class="profile-img">
                <span class="username">${displayName}</span>
                <i class="fa fa-chevron-down"></i>
            </div>
            <div class="profile-dropdown">
                <ul>
                    <li><a href="/profile">My Profile</a></li>
                    <li><a href="/my-documents">My Documents</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="#" id="logout-btn">Log Out</a></li>
                </ul>
            </div>
        </div>
    `;
    
    // Add event listener for profile dropdown toggle
    const profileTrigger = document.querySelector('.profile-trigger');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', () => {
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }
    
    // Add event listener for logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                window.location.href = '/';
            }).catch((error) => {
                console.error('Error signing out:', error);
            });
        });
    }
}

// Function to enable video access for logged-in users
function enableVideoAccess() {
    // For the tutorials page with video list
    if (isTutorialsPage) {
        // Remove any locked overlays
        const lockedOverlays = document.querySelectorAll('.locked-overlay');
        lockedOverlays.forEach(overlay => overlay.remove());
        
        // Remove locked class from video containers
        const videoContainers = document.querySelectorAll('.video-container, .anchor');
        videoContainers.forEach(container => {
            container.classList.remove('video-locked');
        });
        
        // Enable video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            video.controls = true;
            video.style.pointerEvents = 'auto';
        });
    }
    
    // For individual video pages
    if (window.location.pathname.includes('/videolib')) {
        // Remove any login prompts
        const loginPrompts = document.querySelectorAll('.video-login-prompt');
        loginPrompts.forEach(prompt => prompt.remove());
        
        // Show video player
        const videoPlayer = document.querySelector('.anchor');
        if (videoPlayer) {
            videoPlayer.style.display = 'block';
        }
    }
}

// Function to disable video access for non-logged-in users
function disableVideoAccess() {
    // For the tutorials page with video list
    if (isTutorialsPage) {
        // Add locked overlays to video containers
        const videoContainers = document.querySelectorAll('.video-container, .anchor');
        videoContainers.forEach(container => {
            container.classList.add('video-locked');
            
            // Only add overlay if it doesn't already exist
            if (!container.querySelector('.locked-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'locked-overlay';
                overlay.innerHTML = `
                    <div class="lock-message">
                        <i class="fa fa-lock"></i>
                        <p>Please log in to watch this video</p>
                        <a href="/login" class="btn login-btn">Log In</a>
                    </div>
                `;
                container.appendChild(overlay);
            }
        });
        
        // Disable video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            video.controls = false;
            video.style.pointerEvents = 'none';
        });
    }
    
    // For individual video pages
    if (window.location.pathname.includes('/videolib')) {
        // Hide video player
        const videoPlayer = document.querySelector('.anchor');
        if (videoPlayer) {
            videoPlayer.style.display = 'none';
        }
        
        // Add login prompt if not already present
        const main = document.querySelector('.main');
        if (main && !document.querySelector('.video-login-prompt')) {
            const loginPrompt = document.createElement('div');
            loginPrompt.className = 'video-login-prompt';
            loginPrompt.innerHTML = `
                <div class="access-denied">
                    <h2>Access Denied</h2>
                    <p>You need to be logged in to watch this video.</p>
                    <a href="/login" class="btn primary-btn">Log In</a>
                </div>
            `;
            main.insertBefore(loginPrompt, main.firstChild);
        }
    }
}

// Function to attach click handlers to video links
function attachVideoClickHandlers() {
    const videoLinks = document.querySelectorAll('.common[data-id]');
    videoLinks.forEach(link => {
        // Remove any existing click handlers
        link.removeEventListener('click', loginRedirect);
        
        // Add click handler for video link
        link.addEventListener('click', function(e) {
            const videoId = this.getAttribute('data-id');
            if (videoId) {
                window.location.href = `/basics/${videoId}`;
            }
        });
    });
}

// Function to redirect to login when clicking video links
function loginRedirect(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/login';
}

// Function to attach login redirect handlers
function attachLoginRedirectHandlers() {
    const videoLinks = document.querySelectorAll('.common[data-id]');
    videoLinks.forEach(link => {
        // Remove any existing click handlers
        const clone = link.cloneNode(true);
        link.parentNode.replaceChild(clone, link);
        
        // Add click handler for login redirect
        clone.addEventListener('click', loginRedirect);
    });
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    updateUIForAuthState(user);
});

// Add some basic styles to the head
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* User profile menu styles */
        .user-profile-menu {
            position: relative;
        }
        
        .profile-trigger {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 24px;
            background-color: #f5f5f5;
            transition: background-color 0.3s;
        }
        
        .profile-trigger:hover {
            background-color: #e9e9e9;
        }
        
        .profile-img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 8px;
        }
        
        .username {
            font-weight: 500;
            margin-right: 8px;
        }
        
        .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 200px;
            display: none;
            z-index: 100;
        }
        
        .profile-dropdown.active {
            display: block;
        }
        
        .profile-dropdown ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .profile-dropdown ul li {
            padding: 0;
        }
        
        .profile-dropdown ul li a {
            display: block;
            padding: 12px 16px;
            text-decoration: none;
            color: #333;
            transition: background-color 0.3s;
        }
        
        .profile-dropdown ul li a:hover {
            background-color: #f5f5f5;
        }
        
        /* Video protection styles */
        .video-locked {
            position: relative;
            filter: blur(5px);
        }
        
        .locked-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
        
        .lock-message {
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            text-align: center;
            max-width: 80%;
        }
        
        .lock-message i {
            font-size: 32px;
            color: #666;
            margin-bottom: 16px;
        }
        
        .access-denied {
            text-align: center;
            padding: 48px 24px;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .access-denied h2 {
            color: #333;
            margin-bottom: 16px;
        }
        
        .access-denied p {
            margin-bottom: 24px;
            color: #666;
        }
        
        .common {
            cursor: pointer;
        }
    `;
    document.head.appendChild(styleElement);
}

// Add styles on load
addStyles();

// Export functions for use in other scripts
export { updateUIForAuthState, enableVideoAccess, disableVideoAccess };