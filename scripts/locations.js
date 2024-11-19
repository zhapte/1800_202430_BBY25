// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBF_dSkOi2ZkHU1NUjgQ7Ba89VSIlMKJl0",
    authDomain: "bby25-ed23e.firebaseapp.com",
    projectId: "bby25-ed23e",
    storageBucket: "bby25-ed23e.firebasestorage.app",
    messagingSenderId: "675789470983",
    appId: "1:675789470983:web:64ec71f1f240db006199a2D",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Google Maps Variables
let map, service, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12,
    });
    infoWindow = new google.maps.InfoWindow();
}

function findNearbyRecyclingDepots() {
    const locationInput = document.getElementById("").value;
    const keyword = locationInput || "recycling center";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);

                const request = {
                    location: userLocation,
                    radius: '5000',
                    keyword: keyword,
                };

                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, async (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        displayResults(results);

                        try {
                            await addDoc(collection(db, "searchResults"), {
                                userLocation,
                                keyword,
                                results: results.map((place) => ({
                                    name: place.name,
                                    vicinity: place.vicinity,
                                })),
                                timestamp: new Date(),
                            });
                            console.log("Search results saved to Firestore.");
                        } catch (error) {
                            console.error("Error saving results: ", error);
                        }
                    } else {
                        document.getElementById("result").innerText = "No recycling depots found nearby.";
                    }
                });
            },
            () => {
                document.getElementById("result").innerText = "Geolocation not supported or access denied.";
            }
        );
    } else {
        document.getElementById("result").innerText = "Geolocation is not supported by this browser.";
    }
}

function displayResults(results) {
    let resultHTML = "<h2>Nearby Recycling Depots:</h2><ul>";
    results.forEach((place) => {
        resultHTML += `<li>${place.name} - ${place.vicinity}</li>`;
    });
    resultHTML += "</ul>";
    document.getElementById("result").innerHTML = resultHTML;
}
