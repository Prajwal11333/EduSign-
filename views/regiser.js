 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
 const analytics = getAnalytics(app);

 const email = document.getElementById("login-email").value;
 const password = document.getElementById("login-password").value;

 //submit button
 const submit = document.getElementById('login-submit-btn');
 submit.addEventListener("click", function (event) {
     event.preventDefault();
     alert(5);
 })