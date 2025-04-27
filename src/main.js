/* /src/main.js */
/* Corrected: Moved IMAGE_TRANSITION_DURATION_MS to global scope */

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
let isImageTransitionComplete = false;
let isWordAnimationComplete = false;
let isContentReady = false;
let isTransitioning = false;

// --- Timeout IDs ---
let enableButtonTimeoutId = null;
let imageReadyTimeoutId = null;
let wordReadyTimeoutId = null;

// --- Constants ---
// --- >>> MOVED Constant Here <<< ---
const IMAGE_TRANSITION_DURATION_MS = 1000; // 1.0s (Ensure this matches CSS)
// Font size constants
const MAX_FONT_SIZE_REM = 7;
const MIN_FONT_SIZE_REM = 2.5;
const SHRINK_THRESHOLD_LENGTH = 5;

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

// --- >>> NEW: Trigger Image Preloading <<< ---
if (contentData.length > 0) {
    preloadAllImages(contentData); // Call the preloading function
}
// --- End Trigger Image Preloading ---


// --- Set Initial Body State Class ---
document.body.classList.remove('state-main');
document.body.classList.add('state-start');
console.log("[STATE] Initial state set to: state-start");


// --- Helper Functions ---

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
    console.log(`[DEBUG] Word: "${wordString}" (${wordLength} chars), Calculated Font Size: ${calculatedSizeRem.toFixed(2)}rem`);
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
 * Checks if both image and word transitions/animations are complete.
 */
function checkIfReady() {
    console.log(`[DEBUG] Checking readiness: ImageComplete=${isImageTransitionComplete}, WordComplete=${isWordAnimationComplete}`);
    if (isImageTransitionComplete && isWordAnimationComplete) {
        isContentReady = true;
        isTransitioning = false; // Clear busy flag
        console.log(`%c>>> Content is now fully ready! (isTransitioning = false) <<<`, 'color: lightgreen; font-weight: bold;');
        isImageTransitionComplete = false; // Reset for next cycle
        isWordAnimationComplete = false;
    }
}

/**
 * Initializes the main application view state.
 */
function initializeMainApp() {
    console.log("[SETUP] Initializing Main App view...");
    isTransitioning = false;
    isContentReady = false;
    // --- >>> REMOVED const definition from here <<< ---
    // const IMAGE_TRANSITION_DURATION_MS = 1000;

    if (contentData.length > 0) {
        const initialItem = contentData[currentIndex];

        if (imageSectionElement) {
            imageSectionElement.style.backgroundImage = `url(${initialItem.image})`;
            console.log(`Initial background set to: ${initialItem.image}`);
            isImageTransitionComplete = false;
            clearTimeout(imageReadyTimeoutId);
            // Use globally defined constant
            imageReadyTimeoutId = setTimeout(() => {
                console.log("[DEBUG] Initial Image transition finished.");
                isImageTransitionComplete = true;
                checkIfReady();
            }, IMAGE_TRANSITION_DURATION_MS);
        } else { console.error('Cannot set initial background: #image-section not found.'); }

        if (animalNameDisplayElement) {
            displayFallingWord(initialItem.name, animalNameDisplayElement);
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


// --- >>> NEW: Image Preloading Function <<< ---
/**
 * Initiates download for all images in the provided data array.
 * @param {Array<object>} dataArray - The array of content data objects (e.g., contentData).
 */
function preloadAllImages(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        console.warn("[PRELOAD] No data provided for preloading.");
        return;
    }
    console.log(`[PRELOAD] Starting preload for ${dataArray.length} images...`);

    dataArray.forEach((item, index) => {
        // Check if the item has an image path
        if (item.image && typeof item.image === 'string') {
            const img = new Image(); // Create an in-memory image element

            // Optional: Log success when image is loaded into cache/memory
            img.onload = () => {
                // Keep this commented out unless debugging, can be noisy
                // console.log(`[PRELOAD] Image ${index + 1} (${item.name || 'N/A'}) loaded: ${item.image}`);
            };

            // Log errors if an image fails to load
            img.onerror = () => {
                console.error(`[PRELOAD] Failed to load image ${index + 1} (${item.name || 'N/A'}): ${item.image}`);
            };

            // Setting the src triggers the browser to start downloading the image
            img.src = item.image;
        } else {
            console.warn(`[PRELOAD] Item ${index + 1} has no valid image path.`);
        }
    });
}
// --- End Image Preloading Function ---




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

// Main Button (#inner-button) Interaction Logic
if (innerButton && imageSectionElement && animalNameDisplayElement && contentData.length > 0) {

    const handlePress = (event) => {
        if (event.type === 'touchstart') event.preventDefault();

        if (isTransitioning) {
            console.log("[INFO] Ignored press: Transition already in progress.");
            return;
        }
        isTransitioning = true;
        console.log("[DEBUG] Starting transition, isTransitioning = true");

        innerButton.disabled = true;
        console.log(`[DEBUG] Button disabled at: ${performance.now()}`);
        innerButton.classList.add('button-depressed');

        isContentReady = false;
        isImageTransitionComplete = false;
        isWordAnimationComplete = false;
        console.log("[DEBUG] Readiness flags reset.");

        clearTimeout(imageReadyTimeoutId);
        clearTimeout(wordReadyTimeoutId);
        clearTimeout(enableButtonTimeoutId);

        currentIndex = (currentIndex + 1) % contentData.length;
        const newItem = contentData[currentIndex];
        const newImageUrl = newItem.image;
        const newWord = newItem.name;

        // Update Background & Start Image Timer (Uses global constant now)
        imageSectionElement.style.backgroundImage = `url(${newImageUrl})`;
        console.log(`Background change triggered for: ${newImageUrl}`);
        imageReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Image transition finished.");
            isImageTransitionComplete = true;
            checkIfReady();
        }, IMAGE_TRANSITION_DURATION_MS); // Correctly accessed

        // Update Word & Start Word Timer (+ Button Re-enable)
        displayFallingWord(newWord, animalNameDisplayElement); // This should run now
        console.log(`Word change triggered for: ${newWord}`); // This should log now

        const wordLength = newWord.length;
        const baseDelayMs = 1000;
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
        console.log(`[DEBUG] Word: "${newWord}", Length: ${wordLength}, Total Anim Time: ${totalWordAnimationTimeMs}ms`);

        wordReadyTimeoutId = setTimeout(() => {
            console.log("[DEBUG] Word animation finished.");
            isWordAnimationComplete = true;
            innerButton.disabled = false;
            console.log(`[DEBUG] Button re-enabled at: ${performance.now()}`);
            checkIfReady();
        }, totalWordAnimationTimeMs);

        enableButtonTimeoutId = wordReadyTimeoutId;

    }; // End handlePress

    const handleRelease = (event) => {
        innerButton.classList.remove('button-depressed');
    };

    // Attach Main Button Listeners
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress);
    innerButton.addEventListener('mouseup', handleRelease);
    innerButton.addEventListener('touchend', handleRelease);
    innerButton.addEventListener('mouseleave', handleRelease);
    innerButton.addEventListener('touchcancel', handleRelease);

} else {
    console.error("Main Button Interaction Setup Failed:");
    // ... detailed error logging ...
    if(innerButton) innerButton.disabled = true;
}


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