/* /src/main.js */
/* Final Version with Button Disable during Animation */

// Import the CSS file
import './style.css';

// --- 1. Unified Data Array ---
const contentData = [
    { id: 1, name: "Panda", image: "/images/bg1.jpg" },
    { id: 2, name: "Tiger", image: "/images/bg2.jpg" },
    { id: 3, name: "Koala", image: "/images/bg3.jpg" },
    { id: 4, name: "Eagle", image: "/images/bg4.jpg" },
    // Add more items here
];

// --- 2. Initialize Current Index ---
let currentIndex = 0;

// --- Add variable to store disable timeout ---
let enableButtonTimeoutId = null;

// --- 3. Select DOM Elements ---
const imageSectionElement = document.querySelector('#image-section');
const animalNameDisplayElement = document.querySelector('#animal-name-display');
const innerButton = document.querySelector('#inner-button');
const fullscreenButton = document.querySelector('#fullscreen-btn');

// --- Early Checks ---
if (!imageSectionElement) console.error("CRITICAL ERROR: #image-section not found!");
if (!animalNameDisplayElement) console.error("CRITICAL ERROR: #animal-name-display not found!");
if (!innerButton) console.error("CRITICAL ERROR: #inner-button not found!");
if (contentData.length === 0) console.error("CRITICAL ERROR: contentData array is empty!");


// --- 4. displayFallingWord Helper Function (Unchanged) ---
function displayFallingWord(wordString, containerElement) {
    const existingH1 = containerElement.querySelector('.falling-word');
    if (existingH1) {
        existingH1.remove();
    }
    const newH1 = document.createElement('h1');
    newH1.classList.add('falling-word');
    const letters = wordString.split('');
    letters.forEach((letter, index) => {
        const newSpan = document.createElement('span');
        newSpan.textContent = letter;
        const delay = 1.0 + index * 0.1; // Base delay 1.0s, increment 0.1s
        newSpan.style.animationDelay = `${delay}s`;
        newH1.appendChild(newSpan);
    });
    containerElement.appendChild(newH1);
}


// --- 5. Initial State Setup (Unchanged) ---
if (imageSectionElement && contentData.length > 0) {
    imageSectionElement.style.backgroundImage = `url(${contentData[currentIndex].image})`;
    console.log(`Initial background set to: ${contentData[currentIndex].image}`);
}
if (animalNameDisplayElement && contentData.length > 0) {
    displayFallingWord(contentData[currentIndex].name, animalNameDisplayElement);
    console.log(`Initial word displayed: ${contentData[currentIndex].name}`);
}


// --- 6. Button Interaction Logic ---
if (innerButton && imageSectionElement && animalNameDisplayElement && contentData.length > 0) {

  const handlePress = (event) => {
    if (event.type === 'touchstart') {
        event.preventDefault();
    }

    // --- >>> 1. DISABLE BUTTON IMMEDIATELY <<< ---
    innerButton.disabled = true;
    console.log(`[DEBUG] Button disabled at: ${performance.now()}`); // Log timestamp

    innerButton.classList.add('button-depressed');

    // --- Update Content Based on Unified Data ---
    currentIndex = (currentIndex + 1) % contentData.length;
    const newItem = contentData[currentIndex];
    const newImageUrl = newItem.image;
    const newWord = newItem.name;

    // Update Background Image
    imageSectionElement.style.backgroundImage = `url(${newImageUrl})`;
    // console.log(`Background changed to: ${newImageUrl}`); // Keep logs minimal for debugging timing

    // Update Falling Word (This happens synchronously)
    displayFallingWord(newWord, animalNameDisplayElement);
    // console.log(`Word changed to: ${newWord}`);

    // --- >>> 2. CALCULATE ANIMATION DURATION <<< ---
    const wordLength = newWord.length;
    const baseDelayMs = 1000; // 1.0s in ms
    const incrementDelayMs = 100; // 0.1s in ms
    const keyframeDurationMs = 1000; // 1s in ms

    const lastLetterStartTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0);
    const totalAnimationTimeMs = lastLetterStartTimeMs + keyframeDurationMs;

    // --- >>> Log Calculation Results <<< ---
    console.log(`[DEBUG] Word: "${newWord}", Length: ${wordLength}`);
    console.log(`[DEBUG] Last letter starts: ${lastLetterStartTimeMs}ms`);
    console.log(`[DEBUG] Total animation time calculated: ${totalAnimationTimeMs}ms`);
    console.log(`[DEBUG] Setting timeout to re-enable button at: ${performance.now()}`);

    // --- >>> 3. SET TIMEOUT TO RE-ENABLE BUTTON <<< ---
    clearTimeout(enableButtonTimeoutId); // Clear previous timeout just in case

    enableButtonTimeoutId = setTimeout(() => {
        // --- >>> Log when timeout callback runs <<< ---
        console.log(`[DEBUG] Timeout fired at: ${performance.now()}. Re-enabling button.`);
        innerButton.disabled = false;
        // console.log("Button re-enabled."); // Included in debug log
    }, totalAnimationTimeMs);

    // --- >>> Alternative Test: Fixed Duration <<< ---
    // Uncomment the block below and comment out the block above
    // to test with a fixed 5-second delay instead of calculated time.
    /*
    const FIXED_DELAY_MS = 5000; // Test with 5 seconds
    console.log(`[DEBUG] Using FIXED delay of ${FIXED_DELAY_MS}ms`);
    clearTimeout(enableButtonTimeoutId);
    enableButtonTimeoutId = setTimeout(() => {
         console.log(`[DEBUG] FIXED Timeout fired at: ${performance.now()}. Re-enabling button.`);
         innerButton.disabled = false;
    }, FIXED_DELAY_MS);
    */

};

    const handleRelease = (event) => {
        // Only remove depressed class, don't re-enable here
        innerButton.classList.remove('button-depressed');
    };

    // Attach listeners (Unchanged)
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress);
    innerButton.addEventListener('mouseup', handleRelease);
    innerButton.addEventListener('touchend', handleRelease);
    innerButton.addEventListener('mouseleave', handleRelease);
    innerButton.addEventListener('touchcancel', handleRelease);

} else {
    console.error("Button Interaction Setup Failed:");
    if (!innerButton) console.error("- #inner-button missing.");
    if (!imageSectionElement) console.error("- #image-section missing.");
    if (!animalNameDisplayElement) console.error("- #animal-name-display missing.");
    if (contentData.length === 0) console.error("- contentData array is empty.");
    // Disable button from the start if setup failed
    if(innerButton) innerButton.disabled = true;
}
// --- End Button Interaction ---


// --- Fullscreen Logic (Unchanged) ---
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullscreen);
} else {
    console.warn('Fullscreen button #fullscreen-btn not found.');
}
function toggleFullscreen() { /* ... unchanged ... */
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .then(() => { document.body.classList.add('is-fullscreen'); })
            .catch((err) => { console.error(`Error enabling full-screen: ${err.message} (${err.name})`); });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
                .then(() => { document.body.classList.remove('is-fullscreen'); })
                .catch((err) => { console.error(`Error exiting full-screen: ${err.message} (${err.name})`); });
        }
    }
 }
document.addEventListener('fullscreenchange', () => { /* ... unchanged ... */
    if (!document.fullscreenElement) {
        document.body.classList.remove('is-fullscreen');
    } else {
        document.body.classList.add('is-fullscreen');
    }
});
// --- End Fullscreen Logic ---


// --- Enable Transitions (Unchanged) ---
setTimeout(() => {
    document.body.classList.add('transitions-ready');
}, 0);
// --- End Enable transitions ---