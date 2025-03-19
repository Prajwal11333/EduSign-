 $(".Introdropdown1,.Introdropdown2,.Introdropdown3").hide();
                $(".section-1").on("click", function () {
                    $(".Introdropdown1").toggle();
                });
                $(".section-2").on("click", function () {
                    $(".Introdropdown2").toggle();
                });
                $(".section-3").on("click", function () {
                    $(".Introdropdown3").toggle();
                });
                
                $(document).ready(function () {
                    $(".common").on("click", function () {
                        const videoId = $(this).data("id");
                        
                        $.ajax({
                            url: `/tutorials/basics/${videoId}`,
                            type: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                // Update video source and title
                                $(".anchor video source").attr("src", data.videos.video);
                                $(".anchor h2").text(data.videos.title);
                                
                                // Important: Need to reload the video element after changing source
                                $(".anchor video")[0].load();
                                $(".anchor video")[0].play();
                            },
                            error: function(err) {
                                console.error("Error loading video:", err);
                            }
                        });
                    });
                });
// Import auth state functions
import { updateUIForAuthState } from './auth-state.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Initialize Firebase auth
const auth = getAuth();

document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    const user = auth.currentUser;
    
    // Set up click handlers for section toggles
    setupSectionToggles();
    
    // Set up click handlers for video items
    setupVideoClickHandlers();
});

// Function to set up section toggles
function setupSectionToggles() {
    // Section 1
    const section1 = document.querySelector('.section-1');
    const clickSection1 = document.querySelector('.clicksection1');
    
    if (section1 && clickSection1) {
        section1.addEventListener('click', function() {
            clickSection1.classList.toggle('active');
        });
    }
    
    // Section 2
    const section2 = document.querySelector('.section-2');
    const clickSection2 = document.querySelector('.clicksection2');
    
    if (section2 && clickSection2) {
        section2.addEventListener('click', function() {
            clickSection2.classList.toggle('active');
        });
    }
    
    // Section 3
    const section3 = document.querySelector('.section-3');
    const clickSection3 = document.querySelector('.clicksection3');
    
    if (section3 && clickSection3) {
        section3.addEventListener('click', function() {
            clickSection3.classList.toggle('active');
        });
    }
}

// Function to set up video click handlers
function setupVideoClickHandlers() {
    // Get all video items
    const videoItems = document.querySelectorAll('.common[data-id]');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoId = this.getAttribute('data-id');
            
            // Check if user is logged in
            if (auth.currentUser) {
                // User is logged in, redirect to video page
                window.location.href = `/videolib/${videoId}`;
            } else {
                // User is not logged in, redirect to login page
                window.location.href = '/login';
            }
        });
    });
}

// Update UI based on current auth state
auth.onAuthStateChanged(user => {
    updateUIForAuthState(user);
});