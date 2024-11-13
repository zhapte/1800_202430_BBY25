var total;

function calculateTotal() {
    const bottleCountInput = document.getElementById("bottleCount").value;

    // Ensure the input is a valid number
    const bottleCount = parseInt(bottleCountInput, 10);
    
    if (isNaN(bottleCount) || bottleCount < 0) {
        document.getElementById("result").innerText = "Please enter a valid number of bottles.";
        return;
    }
    
    const pricePerBottle = 0.10; // 10 cents per bottle
    total = bottleCount * pricePerBottle;
    document.getElementById("submit").classList.remove("hidden");
    // Display result with 2 decimal places
    document.getElementById("result").innerText = `Total: $${total.toFixed(2)}`;
}

function addtoprofile(){
    console.log("test");
}