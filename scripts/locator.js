let map, service, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12,
    });
    infoWindow = new google.maps.InfoWindow();
}

function findNearbyRecyclingDepots() {
    const locationInput = document.getElementById("locationInput").value;

    // If the user hasn't entered anything, use "recycling center" as default
    const keyword = locationInput || 'recycling center';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {=
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);

                const request = {
                    location: userLocation,
                    radius: '5000', // radius in meters
                    keyword: keyword,
                };

                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        displayResults(results);
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

const functions = require("firebase-functions");
const axios = require("axios");

// Set up Google Maps API key as environment variable
const googleMapsApiKey = functions.config().googlemaps.key;

exports.getNearbyRecyclingDepots = functions.https.onRequest(async (req, res) => {
    try {
        const { lat, lng, keyword = "recycling center" } = req.query;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,
                keyword,
                key: googleMapsApiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Error fetching data from Google Maps API");
    }
});

// locator.js

async function findNearbyRecyclingDepots() {
    const searchQuery = document.getElementById('locationInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ""; // Clear previous results
  
    if (!searchQuery) {
      resultDiv.innerHTML = "<p>Please enter a location to search.</p>";
      return;
    }
  
    try {
      const depotsRef = firebase.firestore().collection("recyclingDepots");
      const snapshot = await depotsRef.get();
  
      if (snapshot.empty) {
        resultDiv.innerHTML = "<p>No depots found in the database.</p>";
        return;
      }
  
      let results = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.location.toLowerCase().includes(searchQuery)) {
          results.push(data);
        }
      });
  
      if (results.length > 0) {
        results.forEach((depot) => {
          const depotDiv = document.createElement('div');
          depotDiv.className = "depot";
          depotDiv.innerHTML = `
            <h3>${depot.name}</h3>
            <p><strong>Location:</strong> ${depot.location}</p>
            <p><strong>Description:</strong> ${depot.description || "No description available."}</p>
            <p><strong>City</strong> ${depot.city}</p>
          `;
          resultDiv.appendChild(depotDiv);
        });
      } else {
        resultDiv.innerHTML = "<p>No depots match your search query.</p>";
      }
    } catch (error) {
      console.error("Error fetching depots:", error);
      resultDiv.innerHTML = "<p>Unable to fetch data. Please try again later.</p>";
    }
  }
  
