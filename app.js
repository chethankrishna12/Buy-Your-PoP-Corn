
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAw6HT97ZkgHRi8NM2FPtutOhEjbEeGOzg",
  authDomain: "pop-corn-app.firebaseapp.com",
  projectId: "pop-corn-app",
  storageBucket: "pop-corn-app.firebasestorage.app",
  messagingSenderId: "301620007109",
  appId: "1:301620007109:web:5b3fa6442db4ca1f9da0ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);








// script.js

const sizeSelect = document.getElementById("size");
const priceDisplay = document.getElementById("price");
const purchaseBtn = document.getElementById("purchaseBtn");

let totalPurchases = 0;
const sales = {
  xl: 0,
  l: 0,
  m: 0,
  s: 0,
};

// Load saved data from LocalStorage on page load
function loadSalesData() {
  const savedSales = localStorage.getItem("salesData");
  const savedTotal = localStorage.getItem("totalPurchases");

  if (savedSales) {
    Object.assign(sales, JSON.parse(savedSales));
  }

  if (savedTotal) {
    totalPurchases = parseInt(savedTotal, 10);
  }

  updateSalesSummary();
}

// Save sales data to LocalStorage
function saveSalesData() {
  localStorage.setItem("salesData", JSON.stringify(sales));
  localStorage.setItem("totalPurchases", totalPurchases);
}

// Update the sales summary section in the DOM
function updateSalesSummary() {
  document.getElementById("totalPurchases").textContent = totalPurchases;
  document.getElementById("xlCount").textContent = sales.xl;
  document.getElementById("lCount").textContent = sales.l;
  document.getElementById("mCount").textContent = sales.m;
  document.getElementById("sCount").textContent = sales.s;
}

// Handle size selection and update price
sizeSelect.addEventListener("change", () => {
  const size = sizeSelect.value;
  let price = 0;

  if (size === "xl") {
    price = 250;
  } else if (size === "l") {
    price = 200;
  } else if (size === "m") {
    price = 100;
  } else if (size === "s") {
    price = 50;
  }

  priceDisplay.textContent = `Price: ₹${price}`;
  purchaseBtn.disabled = price === 0;
});

// Handle purchase and update sales data
purchaseBtn.addEventListener("click", async() => {
  const size = sizeSelect.value;

  if (size && sales[size] !== undefined) {
    sales[size]++;
    totalPurchases++;

    saveSalesData(); // Save updated data to LocalStorage
    updateSalesSummary(); // Update the UI with new data

    try {
      await addDoc(collection(db, "purchases"), {
        size: size,
        timestamp: new Date().toISOString()
      });
      console.log("Purchase saved to Firestore");
    } catch (e) {
      console.error("Error adding purchase to Firestore: ", e);
    }

    alert(`Thank you for purchasing a ${size.toUpperCase()} popcorn!`);
  } else {
    alert("Please select a valid size.");
  }
});

// Load sales data when the page loads
loadSalesData();
