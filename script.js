// Define the ASCII art for zero and one
const zero = "  ___  " + "\n" + " / _ \\ " + "\n" + "| | | |" + "\n" + "| |_| |" + "\n" + " \\___/ " + "\n";
const one = "   _   " + "\n" + "  / |  " + "\n" + "  | |  " + "\n" + "  | |  " + "\n" + "  |_|  " + "\n";

// Initialize variables
var allOnes = false;
var hour24Format = false;

var digits = [];
var ones = [];
var zeros = [];
var digitCount = 24;
var interval;

document.addEventListener("DOMContentLoaded", function() {
    // Get the parent element
    parent = document.getElementById("digits");
    
    // Create digit elements
    for (let i = 0; i < 48; i++) {
        digits.push(document.createElement("div"));
        if (i %2 === 0) {
            zeros.push(digits[i]);
            digits[i].innerText = zero;
        } else {
            ones.push(digits[i]);
            digits[i].innerText = one;
            digits[i].style.display = "none";
        }
        digits[i].classList.add("digit");
        parent.appendChild(digits[i]);
    }
    // Load settings from cookies
    const allOnesCookie = document.cookie.split('; ').find(row => row.startsWith('allOnes='));
    if (allOnesCookie) {
        allOnes = allOnesCookie.split('=')[1] === 'true';
        document.getElementById("allOnesState").textContent = allOnes ? "[X]" : "[ ]";
    }

    const hour24FormatCookie = document.cookie.split('; ').find(row => row.startsWith('hour24Format='));
    if (hour24FormatCookie) {
        hour24Format = hour24FormatCookie.split('=')[1] === 'true';
        document.getElementById("24hrsState").textContent = hour24Format ? "[X]" : "[ ]";
    }

    // Start the update loop
    update();
    setInterval(update, 1);
});

// Function to convert decimal to binary and pad it to the correct length
function dec2bin(dec) {
    let bin;
    if (hour24Format) {
        bin = (dec >>> 0).toString(2).padStart(24, "0");
    } else {
        bin = (dec >>> 0).toString(2).padStart(16, "0");
    }
    return bin;
}

// Update loop
var oldDate;
function update() {
    // Get current time
    const d = new Date();
    var hours = hour24Format ? d.getHours() : d.getHours() % 12 || 12;
    var miliseconds = (hours * 3600)*1000 + (d.getMinutes() * 60)*1000 + d.getSeconds()*1000 + d.getMilliseconds();
    var bin;
    var time

    // Calculate time per frame
    var rate;
    if (oldDate != null) {
        rate = d.getTime() - oldDate.getTime();
    }
    oldDate = d;
    console.log("Rate: " + rate + "ms");

    // Correct time for all modes
    if (allOnes) {
        if (hour24Format) {
            time = miliseconds * 16777215 / 86400 / 1000;
        } else {
            time = miliseconds * 65535 / 43200 / 1000;
        }
    } else {
        time = miliseconds / 1000;
    }

    // Set time to display
    bin = dec2bin(time);
    for (let i = 0; i < bin.length; i++) {
        if (bin[i] === "1") {
            ones[i].style.display = "flex";
            zeros[i].style.display = "none";
        } else {
            ones[i].style.display = "none";
            zeros[i].style.display = "flex";
        }
        // Hide remaining digits
        var remainingDigits = digitCount - bin.length;
        for (let j = 0; j < remainingDigits; j++) {
            ones[bin.length + j].style.display = "none";
            zeros[bin.length + j].style.display = "none";
        }
    }
}

// Toggle functions for settings
function toggleAllOnes() {
    allOnes = !allOnes;
    document.getElementById("allOnesState").innerText = allOnes ? "[x]" : "[ ]";
    document.cookie = "allOnes=" + (allOnes) + "; path=/" + "; max-age=" + (60*60*24*365);
    update();
}

function toggle24HourFormat() {
    hour24Format = !hour24Format;
    document.getElementById("24hrsState").innerText = hour24Format ? "[x]" : "[ ]";
    document.cookie = "hour24Format=" + (hour24Format) + "; path=/" + "; max-age=" + (60*60*24*365);
    update();
}

// Event listener for toggling the settings menu
var state = false;
document.addEventListener("keydown", function(event) {
    state = !state;
    if (event.code === "Escape") {
        document.getElementById("selectDiv").style.display = state ? "flex" : "none";
        document.getElementById("pre").style.display = state ? "none" : "flex";
    }
});