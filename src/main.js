/* /src/main.js */
/* Final Version: Preloading + Simplified Readiness Checks */

// Import the CSS file
import './style.css';

// --- 1. Unified Data Array ---
const contentData = [
    {
        id: 1,
        name: "Horse",
        image: "/images/bg1.jpg",
        sound: "/sounds/horse-neigh.mp3" 
    },
    {
        id: 2,
        name: "Duck",
        image: "/images/bg2.jpg",
        sound: "/sounds/duck-quack.mp3" 
    },
    {
        id: 3,
        name: "Lion",
        image: "/images/bg3.jpg",
        sound: "/sounds/dog-bark.mp3"   
    },
    {
        id: 4,
        name: "Zebra",
        image: "/images/bg4.jpg",
        sound: "/sounds/duck-quack.mp3"     
    }
];

// --- 2. State Variables ---
let currentIndex = 0;
let isWordAnimationComplete = false;
let isContentReady = false;
let isTransitioning = false;
let isSoundOn = true; // Assume sound starts ON
let currentWordTapAudio = null;
// --- Touch State Variables 
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
// --- Swipe Detection Constants 
const MIN_SWIPE_DISTANCE = 50; // Minimum pixels horizontally for a swipe
const MAX_VERTICAL_DISTANCE = 75; // Maximum pixels vertically allowed during horizontal swipe
const MAX_SWIPE_TIME = 500; // Maximum time in ms for a swipe gesture


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
const soundIconContainer = document.querySelector('.icon-container');
const backButton = document.querySelector('#back-button');


// --- Early Checks ---
if (!imageSectionElement) console.error("CRITICAL ERROR: #image-section not found!");
if (!animalNameDisplayElement) console.error("CRITICAL ERROR: #animal-name-display not found!");
if (!innerButton) console.error("CRITICAL ERROR: #inner-button not found!");
if (contentData.length === 0) console.error("CRITICAL ERROR: contentData array is empty!");
if (!soundIconContainer) console.warn("WARN: Sound icon container '.icon-container' not found.");
if (!backButton) console.warn("WARN: Back button '#back-button' not found.");

// --- Helper Functions ---
//
// Initiates download for all images in the provided data array. //
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
// Calculates font size based on word length 
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
 // Displays the falling word animation 
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
// Checks if content cycle is complete (now only based on word animation) 
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
// Go Back to Start Screen 
function goToStartScreen() {
    console.log("[STATE] Transitioning back to Start Screen state...");

    // 1. Switch Body Class
    document.body.classList.remove('state-main');
    document.body.classList.add('state-start');
    console.log("[STATE] Body class set to: state-start");

    // --- >>> Reset currentIndex <<< ---
    currentIndex = 0;
    console.log("[STATE] currentIndex reset to 0.");
    // --- End Reset ---
}

// --- Navigation Functions --- //
function goToNextItem() {
    if (isTransitioning) { // Double check busy state before navigating
       console.log("[NAV] Ignored goToNextItem: Transition in progress.");
       return;
    }
    console.log("[NAV] Going to next item...");
    const nextIndex = (currentIndex + 1) % contentData.length;
    showItemAtIndex(nextIndex);
}

function goToPreviousItem() {
    if (isTransitioning) { // Double check busy state before navigating
       console.log("[NAV] Ignored goToPreviousItem: Transition in progress.");
       return;
    }
    console.log("[NAV] Going to previous item...");
    // Ensure wrap-around works correctly for negative numbers
    const prevIndex = (currentIndex - 1 + contentData.length) % contentData.length;
    showItemAtIndex(prevIndex);
}

// END Helper functions 

// --- >>> NEW: Function to Display Content at a Specific Index <<< ---
/**
 * Updates the UI to show the item at the given index and manages transitions.
 * @param {number} newIndex - The index of the item in contentData to display.
 */
function showItemAtIndex(newIndex) {
    // Basic index validation (optional but good)
    if (newIndex < 0 || newIndex >= contentData.length) {
        console.error(`[DISPLAY] Invalid index requested: ${newIndex}`);
        isTransitioning = false; // Ensure we aren't stuck if index was bad
        return;
    }
    console.log(`[DISPLAY] Showing item at index: ${newIndex}`);
    isTransitioning = true; // Mark app as busy
    isContentReady = false; // Content is about to change
    isWordAnimationComplete = false; // Reset word flag

    // Clear previous timers related to word animation/readiness
    clearTimeout(wordReadyTimeoutId);
    clearTimeout(enableButtonTimeoutId); // Button enable tied to word timer

    // Update the global index
    currentIndex = newIndex;
    const newItem = contentData[currentIndex];

    // Update Background
    if (imageSectionElement && newItem.image) {
        imageSectionElement.style.backgroundImage = `url(${newItem.image})`;
        console.log(`Background updated to: ${newItem.image}`);
    } else if (!imageSectionElement) {
        console.error('Cannot update background: #image-section missing.');
    }

    // Update Word Display & Start Animation Timer
    if (animalNameDisplayElement && newItem.name) {
        displayFallingWord(newItem.name, animalNameDisplayElement);
        console.log(`Word display updated to: ${newItem.name}`);

        // Calculate word animation time
        const wordLength = newItem.name.length;
        const baseDelayMs = 1000;
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;
        console.log(`[DEBUG] Word Anim Time for index ${currentIndex}: ${totalWordAnimationTimeMs}ms`);
        // Set timeout for word animation completion
        // NOTE: Button re-enabling is removed as button doesn't trigger this anymore
        wordReadyTimeoutId = setTimeout(() => {
            console.log(`[DEBUG] Word animation finished for index ${currentIndex}.`);
            isWordAnimationComplete = true;
            // innerButton.disabled = false; // Removed - button enable is separate now
            checkIfReady(); // Checks readiness and sets isTransitioning = false
        }, totalWordAnimationTimeMs);
        // enableButtonTimeoutId = wordReadyTimeoutId; // Removed

    } else if (!animalNameDisplayElement) {
        console.error('Cannot update word display: #animal-name-display missing.');
        // If word display fails, we should probably still clear the transitioning flag after a delay
        isTransitioning = false;
    } else {
        // No name? Still need to clear transitioning state
        console.warn(`No name found for item at index ${currentIndex}.`);
        isTransitioning = false; // Or maybe set a short fallback timer? For now, clear directly.
    }
}

// --- >>> NEW: Handler for Word Area Tap <<< ---
/**
 * Handles clicks/taps on the animal name display area to replay the current sound.
 * Prevents re-triggering while the sound is already playing from a word tap.
 * @param {Event} event - The click event object (optional, not strictly needed now).
 */
function handleWordTap(event) {
    // 1. Check if a word tap sound is currently playing and hasn't ended
    if (currentWordTapAudio && !currentWordTapAudio.ended) {
        console.log("[SOUND] Word tap ignored, previous tap sound still playing.");
        return; // Don't start a new sound if one is already playing from a tap
    }

    // 2. Get the sound URL for the CURRENTLY displayed item
    // Ensure currentIndex is valid and contentData exists (should be okay if app is running)
    if (currentIndex < 0 || currentIndex >= contentData.length) {
        console.error("[SOUND] Invalid currentIndex for word tap sound.");
        return;
    }
    const currentSoundUrl = contentData[currentIndex]?.sound; // Use optional chaining

    // 3. Check if there's a sound URL for the current item
    if (currentSoundUrl) {
        console.log(`[SOUND] Word tapped. Attempting to play sound for index ${currentIndex}: ${currentSoundUrl}`);

        // 4. Call playSound (which checks global mute state) and get the Audio object
        const newAudio = playSound(currentSoundUrl);

        // 5. If playSound returned an Audio object (i.e., not muted/error)
        if (newAudio) {
            // Store reference to this specific audio instance
            currentWordTapAudio = newAudio;

            // 6. Add listener for when THIS specific sound finishes
            newAudio.onended = () => {
                console.log(`[SOUND] Word tap sound finished: ${currentSoundUrl}`);
                // Only clear the global reference if it STILL points to this audio object
                // (Prevents race conditions if user clicks extremely fast)
                if (currentWordTapAudio === newAudio) {
                    currentWordTapAudio = null;
                }
            };

            // 7. Add listener for errors during playback for THIS instance
            newAudio.onerror = () => {
                console.error(`[SOUND] Error during word tap playback: ${currentSoundUrl}`);
                // Clear the reference if it was this audio object that failed
                if (currentWordTapAudio === newAudio) {
                    currentWordTapAudio = null;
                }
            };
        }
    } else {
        console.log(`[SOUND] Word tapped, but no sound associated with current item index ${currentIndex}.`);
    }
}
// --- End handleWordTap Function ---

 //Initializes the main application view state.//
function initializeMainApp() {
    console.log("[SETUP] Initializing Main App view...");
    // isTransitioning = false;
    // isContentReady = false;

    // Set Initial Sound Icon State
    if (soundIconContainer) {
        soundIconContainer.classList.toggle('state-sound-on', isSoundOn);
        soundIconContainer.classList.toggle('state-sound-off', !isSoundOn);
        console.log(`[SETUP] Initial sound icon state set: ${isSoundOn ? 'ON' : 'OFF'}`);
    }
    
    if (contentData.length > 0) {
        showItemAtIndex(currentIndex); // currentIndex should be 0 here       
    } else { console.error("Cannot initialize: contentData is empty."); }
}

// Transitions the view from start screen to main app
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
}
// --- End Sound Toggle Function ---

/**
 * Plays a sound if sound is enabled.
 * @param {string} soundUrl - The path to the audio file.
 * @returns {HTMLAudioElement | null} - The created Audio object or null if not played.
 */

// --- >>> Function to Play Sound <<< ---
function playSound(soundUrl) {
    // 1. Check the global mute state FIRST
    if (!isSoundOn) {
        console.log(`[SOUND] Playback skipped (Muted): ${soundUrl}`);
        return null;
    }
    // 2. Check if a valid URL was provided
    if (!soundUrl || typeof soundUrl !== 'string') {
        console.warn(`[SOUND] Invalid or missing sound URL provided.`);
        return null; 
    }
    console.log(`[SOUND] Attempting to play: ${soundUrl}`);
    
    try {
        // 3. Create Audio object
        const audio = new Audio(soundUrl); // <<< This is the object we'll return

        // 4. Play audio
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(_ => { /* Playback started */ })
                .catch(error => { console.error(`[SOUND] Error playing ${soundUrl}:`, error); });
        }
        // --- >>> MODIFIED: Return the audio object <<< ---
        return audio;
        // --- End Modification ---

    } catch (error) {
        console.error(`[SOUND] Error creating Audio object for ${soundUrl}:`, error);
        return null; // <<< MODIFIED: Return null on error
    }
}
// --- End Play Sound Function ---



// --- Trigger Image Preloading (Step 2) ---
if (contentData.length > 0) {
    preloadAllImages(contentData);
}

// --- Set Initial Body State Class ---
document.body.classList.remove('state-main');
document.body.classList.add('state-start');
console.log("[STATE] Initial state set to: state-start");


// --- Event Listeners ---

//  Word Area Tap Listener 
if (animalNameDisplayElement) {
    animalNameDisplayElement.addEventListener('click', handleWordTap);
    console.log("[SETUP] Word tap listener attached to #animal-name-display.");
} 
// Start Button Listener
const startButtons = document.querySelectorAll('.start-button');
if (startButtons.length > 0) {
    console.log(`[SETUP] Found ${startButtons.length} start button(s). Attaching listeners...`);
    startButtons.forEach(button => {
        button.addEventListener('click', goToMainApp);
    });
} else {
    console.warn("No start buttons found with class '.start-button'.");
}
// Back Button Listener
if (backButton) {
    backButton.addEventListener('click', goToStartScreen);
    console.log("[SETUP] Back button listener attached.");
} 
// Sound Icon Listener 
if (soundIconContainer) {
    soundIconContainer.addEventListener('click', toggleSoundState);
    console.log("[SETUP] Sound toggle listener attached.");
} 


// --- >>> NEW: Swipe Navigation Listeners on Image Section <<< ---
if (imageSectionElement) {
    // --- Touch Start ---
    imageSectionElement.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now(); 
    }, { passive: true }); 

    // --- >>> NEW: Touch Move Listener <<< ---
    imageSectionElement.addEventListener('touchmove', (event) => {
        // If touch didn't start properly, exit
        if (touchStartX === 0 || touchStartY === 0) {
            return;
        }
        // Get current touch position
        const touch = event.touches[0];
        const touchMoveX = touch.clientX;
        const touchMoveY = touch.clientY;

        // Calculate movement delta
        const deltaX = touchMoveX - touchStartX;
        const deltaY = touchMoveY - touchStartY;

        // --- Prevent Vertical Scroll/Bounce During Horizontal Swipe ---
        // If horizontal movement is greater than vertical movement...
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // ...this is likely a horizontal swipe, prevent default vertical scroll/bounce action
            event.preventDefault();
        }
        // Otherwise (vertical move > horizontal), allow default browser scroll

    }, { passive: false });

    // --- Touch End ---
    imageSectionElement.addEventListener('touchend', (event) => {
        if (isTransitioning) {
            console.log("[SWIPE] Ignored touchend: Transition in progress.");
            return;
        }
        if (touchStartX === 0 || touchStartTime === 0) {
            return;
        }
        // Get the touch point where finger was lifted
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const touchEndTime = Date.now();
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;

        if (Math.abs(deltaX) >= MIN_SWIPE_DISTANCE &&
            Math.abs(deltaY) <= MAX_VERTICAL_DISTANCE &&
            deltaTime <= MAX_SWIPE_TIME)
        {
            console.log("[SWIPE] Detected!");
            // Horizontal Swipe Detected! Determine direction.
            if (deltaX < 0) {
                // Swiped Left (Next)
                console.log("[SWIPE] Direction: Left (Next)");
                goToNextItem(); // Call the function to show next item
            } else {
                // Swiped Right (Previous)
                console.log("[SWIPE] Direction: Right (Previous)");
                goToPreviousItem(); // Call the function to show previous item
            }
            // Note: goToNext/PreviousItem calls showItemAtIndex which sets isTransitioning = true
        } else {
            // console.log("[SWIPE] Movement did not meet swipe criteria.");
        }

        // Reset start variables for the next touch interaction
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;

    }, { passive: true }); // Use passive: true as we aren't preventing default scroll here

    // --- Touch Cancel ---
    // Optional: Handle cases where touch is interrupted (e.g., browser gesture)
    imageSectionElement.addEventListener('touchcancel', (event) => {
        console.log("[SWIPE] Touch Cancelled");
        // Reset start variables
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;
    }, { passive: true });

    console.log("[SETUP] Swipe listeners attached to #image-section.");

} 

// --- Main Button interaction logic --- //
if (innerButton && imageSectionElement && animalNameDisplayElement && contentData.length > 0) {

    // --- handlePress function body ---
    const handlePress = (event) => {
        // Keep touchstart prevention
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        // Apply visual depressed effect
        if (innerButton) { // Safety check
            innerButton.classList.add('button-depressed');
        }

        // Trigger the existing word tap logic
        // (plays current sound, checks mute, handles word tap replay prevention)
        console.log("[SOUND] Main button pressed, triggering word tap sound logic.");
        handleWordTap(); // Reuse the function for tapping the word area

    }; // End MODIFIED handlePress

    // --- handleRelease unchanged ---
    const handleRelease = (event) => {
        if (innerButton) { // Safety check
            innerButton.classList.remove('button-depressed');
        }
    };

    // --- Attach Main Button Listeners (Unchanged) ---
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress);
    innerButton.addEventListener('mouseup', handleRelease);
    innerButton.addEventListener('touchend', handleRelease);
    innerButton.addEventListener('mouseleave', handleRelease);
    innerButton.addEventListener('touchcancel', handleRelease);

} else {
    // Error logging & initial disable (Unchanged)
    console.error("Main Button Interaction Setup Failed:");
    if (!innerButton) console.error("- #inner-button missing.");
    if (!imageSectionElement) console.error("- #image-section missing.");
    if (!animalNameDisplayElement) console.error("- #animal-name-display missing.");
    if (contentData.length === 0) console.error("- contentData array is empty.");
    if (innerButton) innerButton.disabled = true;
}
// --- End Button Interaction ---

// --- Enable Transitions ---
setTimeout(() => {
    document.body.classList.add('transitions-ready');
}, 0);
// --- End Enable transitions ---