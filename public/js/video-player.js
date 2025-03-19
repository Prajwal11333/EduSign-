// Import Firebase auth
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { updateUIForAuthState } from './auth-state.js';

// Initialize Firebase auth
const auth = getAuth();

// Handle video player page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a video player page
    if (window.location.pathname.includes('/videolib/')) {
        // Get the video container
        const videoContainer = document.querySelector('.anchor');
        const videoElement = document.querySelector('video');
        
        // Check authentication state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in, show video
                if (videoContainer) {
                    videoContainer.style.display = 'block';
                }
                if (videoElement) {
                    videoElement.controls = true;
                    videoElement.style.pointerEvents = 'auto';
                }
                
                // Remove any login prompts
                const loginPrompt = document.querySelector('.video-login-prompt');
                if (loginPrompt) {
                    loginPrompt.remove();
                }
            } else {
                // User is not logged in, hide video
                if (videoContainer) {
                    videoContainer.style.display = 'none';
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
        });
    }
});

// Update UI based on current auth state
auth.onAuthStateChanged(user => {
    updateUIForAuthState(user);
});