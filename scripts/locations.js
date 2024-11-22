
function displayCards() {
    const container = document.getElementById("cardContainer"); // Your container for cards

    db.collection("recyclingDepots").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const item = doc.data();

            const listItem = document.createElement("li");
            listItem.classList.add("item");
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.alt}" class="rimg" />
                <div class="text-container">
                    <div class="name"><b>Name: </b>${item.name}</div>
                    <div class="location"><b>Location: </b>${item.location}</div>
                    <div class="city"><b>City: </b>${item.city}</div>
                    <div class="description"><b>Description: </b>${item.description}</div>
                </div>
            `;
            itemList.appendChild(listItem);
        });
    })
}
displayCards();