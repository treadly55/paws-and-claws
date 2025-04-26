/* /src/main.js */
/* Corrected version with dynamic font size */

// Import the CSS file
import './style.css';

// --- 1. Unified Data Array ---
const contentData = [
    { id: 1, name: "Panda", image: "/images/bg1.jpg" },
    { id: 2, name: "Rhino", image: "/images/bg2.jpg" },
    { id: 3, name: "Lion", image: "/images/bg3.jpg" },
    { id: 4, name: "Zebra", image: "/images/bg4.jpg" }
];

// --- 2. State Variables ---
let currentIndex = 0;
let isImageTransitionComplete = false;
let isWordAnimationComplete = false;
let isContentReady = false;
let isTransitioning = false; // Tracks if animations/fades are active

// --- Timeout IDs ---
let enableButtonTimeoutId = null;
let imageReadyTimeoutId = null;
let wordReadyTimeoutId = null;

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

// --- Constants for Font Size Calculation ---
const MAX_FONT_SIZE_REM = 7;   // Max size for short words (tune this)
const MIN_FONT_SIZE_REM = 2.5;   // Smallest allowed size (tune this)
const SHRINK_THRESHOLD_LENGTH = 5; // Start shrinking font size *after* this many characters (tune this)

/**
 * Calculates an appropriate font size based on word length.
 * @param {string} wordString - The word to calculate font size for.
 * @returns {number} - The calculated font size in rem.
 */
function calculateFontSize(wordString) {
    const wordLength = wordString.length;
    let calculatedSizeRem;

    if (wordLength <= SHRINK_THRESHOLD_LENGTH) {
        calculatedSizeRem = MAX_FONT_SIZE_REM;
    } else {
        const scaleFactor = SHRINK_THRESHOLD_LENGTH / wordLength;
        calculatedSizeRem = MAX_FONT_SIZE_REM * scaleFactor;
        calculatedSizeRem = Math.max(MIN_FONT_SIZE_REM, calculatedSizeRem);
        calculatedSizeRem = Math.min(MAX_FONT_SIZE_REM, calculatedSizeRem); // Safety clamp max
    }
    console.log(`[DEBUG] Word: "${wordString}" (${wordLength} chars), Calculated Font Size: ${calculatedSizeRem.toFixed(2)}rem`);
    return calculatedSizeRem;
}

// --- 4. displayFallingWord Helper Function ---
// --- >>> CORRECTED: Calls calculateFontSize and adds class <<< ---
function displayFallingWord(wordString, containerElement) {
    const existingH1 = containerElement.querySelector('.falling-word');
    if (existingH1) {
        existingH1.remove();
    }

    const newH1 = document.createElement('h1');
    newH1.classList.add('falling-word'); // <<< FIXED: Add class back

    // --- Call calculateFontSize and apply style ---
    const dynamicFontSizeRem = calculateFontSize(wordString); // <<< FIXED: Call the function
    newH1.style.fontSize = `${dynamicFontSizeRem}rem`;       // <<< FIXED: Apply calculated size
    // ----------------------------------------------

    const letters = wordString.split('');
    letters.forEach((letter, index) => {
        const newSpan = document.createElement('span');
        newSpan.textContent = letter;
        const delay = 1.0 + index * 0.1;
        newSpan.style.animationDelay = `${delay}s`;
        newH1.appendChild(newSpan);
    });
    containerElement.appendChild(newH1);
}


// --- 5. checkIfReady Function (Unchanged from your version) ---
function checkIfReady() {
    console.log(`[DEBUG] Checking readiness: ImageComplete=${isImageTransitionComplete}, WordComplete=${isWordAnimationComplete}`);
    if (isImageTransitionComplete && isWordAnimationComplete) {
        isContentReady = true;
        isTransitioning = false; // Clear busy flag
        console.log(`%c>>> Content is now fully ready! (isTransitioning = false) <<<`, 'color: lightgreen; font-weight: bold;');

        // Reset individual flags for the next cycle check
        isImageTransitionComplete = false;
        isWordAnimationComplete = false;
    }
}
// --- End checkIfReady Function ---


// --- 6. Initial State Setup (Unchanged from your version) ---
const IMAGE_TRANSITION_DURATION_MS = 1000; // 1.0s (Ensure this matches CSS)
if (contentData.length > 0) {
    const initialItem = contentData[currentIndex];

    if (imageSectionElement) {
        imageSectionElement.style.backgroundImage = `url(${initialItem.image})`;
        console.log(`Initial background set to: ${initialItem.image}`);
        isImageTransitionComplete = false;
        clearTimeout(imageReadyTimeoutId);
        imageReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Initial Image transition finished.");
            isImageTransitionComplete = true;
            checkIfReady();
        }, IMAGE_TRANSITION_DURATION_MS);
    } else {
        console.error('Cannot set initial background: #image-section not found.');
    }

    if (animalNameDisplayElement) {
        displayFallingWord(initialItem.name, animalNameDisplayElement); // Will now use calculateFontSize
        console.log(`Initial word displayed: ${initialItem.name}`);
        const wordLength = initialItem.name.length;
        const baseDelayMs = 1000;
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
        isWordAnimationComplete = false;
        clearTimeout(wordReadyTimeoutId);
        wordReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Initial Word animation finished.");
            isWordAnimationComplete = true;
            checkIfReady();
        }, totalWordAnimationTimeMs);
    } else {
        console.error('Cannot display initial word: #animal-name-display not found.');
    }
} else {
    console.error("Cannot initialize: contentData is empty.");
}
// --- End Initial State Setup ---


// --- 7. Button Interaction Logic (Unchanged from your version) ---
if (innerButton && imageSectionElement && animalNameDisplayElement && contentData.length > 0) {

    const handlePress = (event) => {
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        // Guard Clause
        if (isTransitioning) {
            console.log("[INFO] Ignored press: Transition already in progress.");
            return;
        }

        // Set Busy Flag
        isTransitioning = true;
        console.log("[DEBUG] Starting transition, isTransitioning = true");

        // Start Press Sequence
        innerButton.disabled = true;
        console.log(`[DEBUG] Button disabled at: ${performance.now()}`);
        innerButton.classList.add('button-depressed');

        // Reset Readiness Flags
        isContentReady = false;
        isImageTransitionComplete = false;
        isWordAnimationComplete = false;
        console.log("[DEBUG] Readiness flags reset.");

        // Clear previous readiness timers
        clearTimeout(imageReadyTimeoutId);
        clearTimeout(wordReadyTimeoutId);
        clearTimeout(enableButtonTimeoutId);

        // Update Content
        currentIndex = (currentIndex + 1) % contentData.length;
        const newItem = contentData[currentIndex];
        const newImageUrl = newItem.image;
        const newWord = newItem.name;

        // Update Background & Start Image Timer
        imageSectionElement.style.backgroundImage = `url(${newImageUrl})`;
        console.log(`Background change triggered for: ${newImageUrl}`);
        imageReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Image transition finished.");
            isImageTransitionComplete = true;
            checkIfReady();
        }, IMAGE_TRANSITION_DURATION_MS);

        // Update Word & Start Word Timer (+ Button Re-enable)
        displayFallingWord(newWord, animalNameDisplayElement); // Will now use calculateFontSize
        console.log(`Word change triggered for: ${newWord}`);

        // Calculate word animation time
        const wordLength = newWord.length;
        const baseDelayMs = 1000;
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
        console.log(`[DEBUG] Word: "${newWord}", Length: ${wordLength}, Total Anim Time: ${totalWordAnimationTimeMs}ms`);

        // Set timeout for word animation completion AND button re-enabling
        wordReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Word animation finished.");
            isWordAnimationComplete = true;
            innerButton.disabled = false; // Re-enable button
            console.log(`[DEBUG] Button re-enabled at: ${performance.now()}`);
            checkIfReady(); // Check readiness now
        }, totalWordAnimationTimeMs);

        enableButtonTimeoutId = wordReadyTimeoutId;

    }; // End handlePress

    const handleRelease = (event) => {
        innerButton.classList.remove('button-depressed');
    };

    // Attach Listeners
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress);
    innerButton.addEventListener('mouseup', handleRelease);
    innerButton.addEventListener('touchend', handleRelease);
    innerButton.addEventListener('mouseleave', handleRelease);
    innerButton.addEventListener('touchcancel', handleRelease);

} else {
     // Error logging & initial disable
    console.error("Button Interaction Setup Failed:");
    if (!innerButton) console.error("- #inner-button missing.");
    if (!imageSectionElement) console.error("- #image-section missing.");
    if (!animalNameDisplayElement) console.error("- #animal-name-display missing.");
    if (contentData.length === 0) console.error("- contentData array is empty.");
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