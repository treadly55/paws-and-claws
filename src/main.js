/* /src/main.js */
/* Final Version: Preloading + Simplified Readiness Checks */

// Import the CSS file
import './style.css';

// --- 1. Unified Data Array ---
const contentData = [
    { id: 1, name: "Panda", image: "/images/bg1.jpg" },
    { id: 2, name: "Rhino", image: "/images/bg2.jpg" },
    { id: 3, name: "Lion", image: "/images/bg3.jpg" },
    { id: 4, name: "Zebra", image: "/images/bg4.jpg" },
    // Add more words/images
];

// --- 2. State Variables ---
let currentIndex = 0;
let isWordAnimationComplete = false;
let isContentReady = false;
let isTransitioning = false;
let isSoundOn = true; // Assume sound starts ON

// --- Timeout IDs ---
let enableButtonTimeoutId = null;       // For button re-enable (tied to word anim)
let wordReadyTimeoutId = null;        // For word anim completion check

// --- Constants ---
const IMAGE_TRANSITION_DURATION_MS = 1000; // Keep for reference if CSS uses it, but JS timer removed
// Font size constants
const MAX_FONT_SIZE_REM = 7;
const MIN_FONT_SIZE_REM = 2.5;
const SHRINK_THRESHOLD_LENGTH = 5;

// --- 3. Select DOM Elements ---
const imageSectionElement = document.querySelector('#image-section');
const animalNameDisplayElement = document.querySelector('#animal-name-display');
const innerButton = document.querySelector('#inner-button');
// --- >>> NEW: Select Sound Icon Container <<< ---
const soundIconContainer = document.querySelector('.icon-container');

// --- Early Checks ---
if (!imageSectionElement) console.error("CRITICAL ERROR: #image-section not found!");
if (!animalNameDisplayElement) console.error("CRITICAL ERROR: #animal-name-display not found!");
if (!innerButton) console.error("CRITICAL ERROR: #inner-button not found!");
if (contentData.length === 0) console.error("CRITICAL ERROR: contentData array is empty!");
if (!soundIconContainer) console.warn("WARN: Sound icon container '.icon-container' not found.");

// --- Helper Functions ---

/**
 * Initiates download for all images in the provided data array. (Step 1)
 */
function preloadAllImages(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        console.warn("[PRELOAD] No data provided for preloading.");
        return;
    }
    console.log(`[PRELOAD] Starting preload for ${dataArray.length} images...`);
    dataArray.forEach((item, index) => {
        if (item.image && typeof item.image === 'string') {
            const img = new Image();
            img.onload = () => { /* Optional log */ };
            img.onerror = () => { console.error(`[PRELOAD] Failed: ${item.image}`); };
            img.src = item.image;
        } else { console.warn(`[PRELOAD] Invalid image path at index ${index}.`); }
    });
}

/**
 * Calculates font size based on word length.
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
        calculatedSizeRem = Math.min(MAX_FONT_SIZE_REM, calculatedSizeRem);
    }
    console.log(`[DEBUG] Word: "${wordString}" (${wordLength} chars), Font Size: ${calculatedSizeRem.toFixed(2)}rem`);
    return calculatedSizeRem;
}

/**
 * Displays the falling word animation.
 */
function displayFallingWord(wordString, containerElement) {
    const existingH1 = containerElement.querySelector('.falling-word');
    if (existingH1) existingH1.remove();
    const newH1 = document.createElement('h1');
    newH1.classList.add('falling-word');
    const dynamicFontSizeRem = calculateFontSize(wordString);
    newH1.style.fontSize = `${dynamicFontSizeRem}rem`;
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

/**
 * Checks if content cycle is complete (now only based on word animation). (Step 4)
 */
function checkIfReady() {
    // --- >>> MODIFIED: Only check word completion <<< ---
    console.log(`[DEBUG] Checking readiness: WordComplete=${isWordAnimationComplete}`);
    if (isWordAnimationComplete) { // Only depends on word now
        isContentReady = true;
        isTransitioning = false; // Clear busy flag
        console.log(`%c>>> Word Animation Complete! Content cycle ready. (isTransitioning = false) <<<`, 'color: lightgreen; font-weight: bold;');
        // --- >>> MODIFIED: Reset only word flag <<< ---
        // isImageTransitionComplete = false; // Removed
        isWordAnimationComplete = false; // Reset word flag for next cycle
    }
}

/**
 * Initializes the main application view state. (Step 5)
 */
function initializeMainApp() {
    console.log("[SETUP] Initializing Main App view...");
    isTransitioning = false;
    isContentReady = false;

    // --- >>> NEW: Set Initial Sound Icon State <<< ---
    if (soundIconContainer) {
        soundIconContainer.classList.toggle('state-sound-on', isSoundOn);
        soundIconContainer.classList.toggle('state-sound-off', !isSoundOn);
        console.log(`[SETUP] Initial sound icon state set: ${isSoundOn ? 'ON' : 'OFF'}`);
    }
    // --- End NEW ---


    if (contentData.length > 0) {
        const initialItem = contentData[currentIndex];

        if (imageSectionElement) {
            imageSectionElement.style.backgroundImage = `url(${initialItem.image})`;
            console.log(`Initial background set to: ${initialItem.image}`);
            // --- >>> REMOVED image readiness timer logic <<< ---
            // isImageTransitionComplete = false;
            // clearTimeout(imageReadyTimeoutId);
            // imageReadyTimeoutId = setTimeout(...);
            // --- End Removal ---
        } else { console.error('Cannot set initial background: #image-section not found.'); }

        if (animalNameDisplayElement) {
            displayFallingWord(initialItem.name, animalNameDisplayElement);
            console.log(`Initial word displayed: ${initialItem.name}`);
            // Calculate word animation time (unchanged)
            const wordLength = initialItem.name.length;
            const baseDelayMs = 1000;
            const incrementDelayMs = 100;
            const keyframeDurationMs = 1000;
            const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
            // Start word animation timer (unchanged)
            isWordAnimationComplete = false;
            clearTimeout(wordReadyTimeoutId);
            wordReadyTimeoutId = setTimeout(() => {
                console.log("[DEBUG] Initial Word animation finished.");
                isWordAnimationComplete = true;
                checkIfReady(); // Simplified checkIfReady is called
            }, totalWordAnimationTimeMs);
        } else { console.error('Cannot display initial word: #animal-name-display not found.'); }
    } else { console.error("Cannot initialize: contentData is empty."); }
}

/**
 * Transitions the view from start screen to main app.
 */
function goToMainApp() {
    console.log("[STATE] Transitioning to Main App state...");
    document.body.classList.remove('state-start');
    document.body.classList.add('state-main');
    console.log("[STATE] Body class set to: state-main");
    initializeMainApp();
}

// --- >>> Sound Toggle Function <<< ---
function toggleSoundState() {
    if (!soundIconContainer) return; // Safety check

    isSoundOn = !isSoundOn; // Toggle the state
    console.log(`[SOUND] Sound state toggled. isSoundOn: ${isSoundOn}`);

    // Update classes efficiently
    soundIconContainer.classList.toggle('state-sound-on', isSoundOn);
    soundIconContainer.classList.toggle('state-sound-off', !isSoundOn);

    // TODO: Add actual audio mute/unmute logic here later
    // Example:
    // if (isSoundOn) {
    //   unmuteAllAudio();
    // } else {
    //   muteAllAudio();
    // }
}
// --- End Sound Toggle Function ---


// --- Trigger Image Preloading (Step 2) ---
if (contentData.length > 0) {
    preloadAllImages(contentData);
}

// --- Set Initial Body State Class ---
document.body.classList.remove('state-main');
document.body.classList.add('state-start');
console.log("[STATE] Initial state set to: state-start");


// --- Event Listeners ---

// Start Button Listeners
const startButtons = document.querySelectorAll('.start-button');
if (startButtons.length > 0) {
    console.log(`[SETUP] Found ${startButtons.length} start button(s). Attaching listeners...`);
    startButtons.forEach(button => {
        button.addEventListener('click', goToMainApp);
    });
} else {
    console.warn("No start buttons found with class '.start-button'.");
}

// --- >>> NEW: Sound Icon Listener <<< ---
if (soundIconContainer) {
    soundIconContainer.addEventListener('click', toggleSoundState);
    console.log("[SETUP] Sound toggle listener attached.");
} // Warning if not found already logged earlier


// Main Button (#inner-button) Interaction Logic (Step 6)
if (innerButton && imageSectionElement && animalNameDisplayElement && contentData.length > 0) {

    const handlePress = (event) => {
        if (event.type === 'touchstart') event.preventDefault();

        // Guard clause (unchanged)
        if (isTransitioning) {
            console.log("[INFO] Ignored press: Transition already in progress.");
            return;
        }
        // Set busy flag (unchanged)
        isTransitioning = true;
        console.log("[DEBUG] Starting transition, isTransitioning = true");

        // Disable button, add class (unchanged)
        innerButton.disabled = true;
        console.log(`[DEBUG] Button disabled at: ${performance.now()}`);
        innerButton.classList.add('button-depressed');

        // Reset Readiness Flags
        isContentReady = false;
        // isImageTransitionComplete = false; // <<< REMOVED
        isWordAnimationComplete = false;   // Keep
        console.log("[DEBUG] Readiness flags reset.");

        // Clear previous timers
        // clearTimeout(imageReadyTimeoutId); // <<< REMOVED
        clearTimeout(wordReadyTimeoutId);   // Keep
        clearTimeout(enableButtonTimeoutId); // Keep

        // Update Content (unchanged)
        currentIndex = (currentIndex + 1) % contentData.length;
        const newItem = contentData[currentIndex];
        const newImageUrl = newItem.image;
        const newWord = newItem.name;

        // Update Background (Set directly, no timer)
        imageSectionElement.style.backgroundImage = `url(${newImageUrl})`;
        console.log(`Background change triggered for: ${newImageUrl}`);
        // --- >>> REMOVED image readiness timer logic <<< ---
        // imageReadyTimeoutId = setTimeout(...);
        // --- End Removal ---

        // Update Word & Start Word Timer (+ Button Re-enable) (Unchanged)
        displayFallingWord(newWord, animalNameDisplayElement);
        console.log(`Word change triggered for: ${newWord}`);

        const wordLength = newWord.length;
        const baseDelayMs = 1000;
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
        console.log(`[DEBUG] Word: "${newWord}", Length: ${wordLength}, Total Anim Time: ${totalWordAnimationTimeMs}ms`);

        wordReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Word animation finished.");
            isWordAnimationComplete = true;
            innerButton.disabled = false; // Re-enable button
            console.log(`[DEBUG] Button re-enabled at: ${performance.now()}`);
            checkIfReady(); // Call simplified checkIfReady
        }, totalWordAnimationTimeMs);

        enableButtonTimeoutId = wordReadyTimeoutId;

    }; // End handlePress

    const handleRelease = (event) => {
        innerButton.classList.remove('button-depressed');
    };

    // Attach Main Button Listeners (unchanged)
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress);
    // ... rest of listeners

} else {
    // Error logging & initial disable (unchanged)
    console.error("Main Button Interaction Setup Failed:");
    // ... detailed error logging ...
    if(innerButton) innerButton.disabled = true;
}



// --- Enable Transitions (Unchanged) ---
setTimeout(() => {
    document.body.classList.add('transitions-ready');
}, 0);
// --- End Enable transitions ---