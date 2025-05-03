/* /src/main.js */
/* Final Version: Preloading + Simplified Readiness Checks */

// Import the CSS file
import './style.css';

// --- 1. Unified Data Array ---
const farmAnimalsData = [
    {
        id: 1,
        name: "Cow",
        image: "/images/cow.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3"
    },
    {
        id: 2,
        name: "Duck",
        image: "/images/duck.png",
        sound: "/sounds/duck-quack.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 3,
        name: "Goat",
        image: "/images/goat.png",
        sound: "/sounds/dog-bark.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 4,
        name: "Pig",
        image: "/images/pig.png",
        sound: "/sounds/duck-quack.mp3",
        word:  "/sounds/hello.mp3"     
    },
    {
        id: 5,
        name: "Horse",
        image: "/images/horse.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3"
    },
    {
        id: 6,
        name: "Chicken",
        image: "/images/chicken.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3"
    }
];

const zooAnimalsData = [
    {
        id: 1,
        name: "Lion",
        image: "/images/lion.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3"
    },
    {
        id: 2,
        name: "Tiger",
        image: "/images/tiger.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 3,
        name: "Zebra",
        image: "/images/zebra.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 4,
        name: "Giraffe",
        image: "/images/giraffe.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 5,
        name: "Elephant",
        image: "/images/elephant.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 6,
        name: "Monkey",
        image: "/images/monkey.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    }
];

const oceanAnimalsData = [
    {
        id: 1,
        name: "Fish",
        image: "/images/fish.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3"
    },
    {
        id: 2,
        name: "Shark",
        image: "/images/shark.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 3,
        name: "Octopus",
        image: "/images/octopus.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 4,
        name: "Penguin",
        image: "/images/penguin.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 5,
        name: "Dolphin",
        image: "/images/dolphin.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    },
    {
        id: 6,
        name: "Starfish",
        image: "/images/starfish.png",
        sound: "/sounds/horse-neigh.mp3",
        word:  "/sounds/hello.mp3" 
    }
];

// --- NEW: Variable to hold the data array for the currently loaded level ---
let activeContentData = [];
// --- END NEW ---

// --- 2. State Variables ---
let currentIndex = 0;
let isWordAnimationComplete = false;
let isContentReady = false;
let isTransitioning = false;
let isSoundOn = true; 
let isForceMutedByOption = false;
let currentWordTapAudio = null;
let currentSoundMode = 'animal';
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
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
const animalSoundButton = document.querySelector('#btn-animal-sound');
const humanSoundButton = document.querySelector('#btn-human-sound');
const startLevel1Button = document.querySelector('#start-level-1');
const startLevel2Button = document.querySelector('#start-level-2');
const startLevel3Button = document.querySelector('#start-level-3');
const optionsButton = document.querySelector('#start-btn-settings');
const optionCheckbox1 = document.querySelector('#option-checkbox-1'); 


// --- Early Checks ---
if (!imageSectionElement) console.error("CRITICAL ERROR: #image-section not found!");
if (!animalNameDisplayElement) console.error("CRITICAL ERROR: #animal-name-display not found!");
if (!innerButton) console.error("CRITICAL ERROR: #inner-button not found!");
// if (contentData.length === 0) console.error("CRITICAL ERROR: contentData array is empty!");
if (!soundIconContainer) console.warn("WARN: Sound icon container '.icon-container' not found.");
if (!backButton) console.warn("WARN: Back button '#back-button' not found.");
if (!animalSoundButton) console.error("CRITICAL ERROR: #btn-animal-sound not found!");
if (!humanSoundButton) console.error("CRITICAL ERROR: #btn-human-sound not found!");

// --- Helper Functions ---
//
// Updates the visual selection state of the sound mode icons. //
function updateSoundModeUI() {
    // Safety check in case elements aren't found
    if (!animalSoundButton || !humanSoundButton) {
        console.error("[UI Update] Cannot update sound mode UI - buttons not found.");
        return;
    }

    console.log(`[UI Update] Setting sound mode visual state for: ${currentSoundMode}`);
    if (currentSoundMode === 'human') {
        humanSoundButton.classList.add('selected');
        animalSoundButton.classList.remove('selected');
    } else { // Default to 'animal'
        animalSoundButton.classList.add('selected');
        humanSoundButton.classList.remove('selected');
    }
}

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

//  Transitions the application view to the Options screen state.
function goToOptionsScreen() {
    console.log("[STATE] Request to transition to Options Screen state...");
    document.body.classList.remove('state-start', 'state-main');
    document.body.classList.add('state-options');
    console.log("[STATE] Body class set to: state-options");

    if (optionCheckbox1) {
        optionCheckbox1.checked = isForceMutedByOption;
        console.log(`[OPTIONS UI] Synced checkbox visual state to match isForceMutedByOption: ${isForceMutedByOption}`);
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
    const nextIndex = (currentIndex + 1) % activeContentData.length;
    showItemAtIndex(nextIndex);
}

function goToPreviousItem() {
    if (isTransitioning) { // Double check busy state before navigating
       console.log("[NAV] Ignored goToPreviousItem: Transition in progress.");
       return;
    }
    console.log("[NAV] Going to previous item...");
    // Ensure wrap-around works correctly for negative numbers
    const prevIndex = (currentIndex - 1 + activeContentData.length) % activeContentData.length;
    showItemAtIndex(prevIndex);
}

// END Helper functions 

// --- >>> NEW: Function to Display Content at a Specific Index <<< ---
/**
 * Updates the UI to show the item at the given index and manages transitions.
 * @param {number} newIndex - The index of the item in activeContentData  to display.
 */

function showItemAtIndex(newIndex) {
    console.log(`[DISPLAY] Request to show item at index: ${newIndex}`);

    // --- Check if active data is available ---
    if (!activeContentData || activeContentData.length === 0) {
        console.error("[DISPLAY] Cannot show item: activeContentData is empty or not set.");
        // Optional: Display an error message to the user on the screen
        isTransitioning = false; // Ensure we don't get stuck
        return;
    }

    // Basic index validation using active data length
    if (newIndex < 0 || newIndex >= activeContentData.length) {
        console.error(`[DISPLAY] Invalid index requested: ${newIndex} for data length ${activeContentData.length}`);
        // Optional: Maybe wrap around? Or just stop? For now, stop.
        isTransitioning = false; // Ensure we aren't stuck
        return;
    }
    // --- End Checks ---

    console.log(`[DISPLAY] Showing item for index: ${newIndex}`);
    isTransitioning = true; // Mark app as busy
    isContentReady = false; // Content is about to change
    isWordAnimationComplete = false; // Reset word flag

    // Clear previous timers related to word animation/readiness
    clearTimeout(wordReadyTimeoutId);
    // clearTimeout(enableButtonTimeoutId); // This timer was likely removed earlier

    // Update the global index
    currentIndex = newIndex;
    const newItem = activeContentData[currentIndex]; // Use activeContentData

    // Check if newItem exists (it should, due to checks above, but good practice)
    if (!newItem) {
         console.error(`[DISPLAY] Error: No item found at index ${currentIndex} in activeContentData.`);
         isTransitioning = false;
         return;
    }

    console.log(`[DISPLAY] Item Data:`, newItem); // Log the specific item data

    // Update Background
    if (imageSectionElement && newItem.image) {
        imageSectionElement.style.backgroundImage = `url(${newItem.image})`;
        console.log(`[DISPLAY] Background updated to: ${newItem.image}`);
    } else if (!imageSectionElement) {
        console.error('[DISPLAY] Cannot update background: #image-section missing.');
    } else if (!newItem.image) {
         console.warn(`[DISPLAY] Item at index ${currentIndex} has no image URL.`);
    }

    // Update Word Display & Start Animation Timer
    if (animalNameDisplayElement && newItem.name) {
        displayFallingWord(newItem.name, animalNameDisplayElement);
        console.log(`[DISPLAY] Word display updated to: ${newItem.name}`);

        // Calculate word animation time (using newItem.name.length)
        const wordLength = newItem.name.length;
        const baseDelayMs = 1000; // Ensure these match your CSS/expectations
        const incrementDelayMs = 100;
        const keyframeDurationMs = 1000;
        const totalWordAnimationTimeMs = baseDelayMs + (wordLength > 0 ? (wordLength - 1) * incrementDelayMs : 0) + keyframeDurationMs;

        console.log(`[DISPLAY DEBUG] Calculated Word Anim Time for index ${currentIndex}: ${totalWordAnimationTimeMs}ms`);

        wordReadyTimeoutId = setTimeout(() => {
            console.log(`[DISPLAY DEBUG] Word animation finished for index ${currentIndex}.`);
            isWordAnimationComplete = true;
            checkIfReady(); // Checks readiness and sets isTransitioning = false
        }, totalWordAnimationTimeMs);

    } else if (!animalNameDisplayElement) {
        console.error('[DISPLAY] Cannot update word display: #animal-name-display missing.');
        isTransitioning = false; // Clear flag if display fails
    } else {
        // No name? Still need to clear transitioning state eventually.
        console.warn(`[DISPLAY] No name found for item at index ${currentIndex}.`);
        // If no name, word animation doesn't run, so set flags immediately or after short delay
        isWordAnimationComplete = true; // No animation to wait for
        checkIfReady(); // Clear isTransitioning flag
        // Alternatively, could skip directly to isTransitioning = false if checkIfReady causes issues
        // isTransitioning = false;
    }
}


// --- >>> NEW: Handler for Word Area Tap <<< ---
/**
 * Handles clicks/taps on the animal name display area to replay the current sound.
 * Prevents re-triggering while the sound is already playing from a word tap.
 * @param {Event} event - The click event object (optional, not strictly needed now).
 */

function handleWordTap(event) { // event parameter may not be used if only called by handlePress
    // 1. Check if a sound triggered by this function is currently playing
    if (currentWordTapAudio && !currentWordTapAudio.ended) {
        console.log("[SOUND] Word tap/Button press ignored, previous sound still playing.");
        return; // Don't overlap sounds triggered by this specific interaction
    }

    // 2. Get the CURRENT item data and perform checks
    if (currentIndex < 0 || currentIndex >= activeContentData.length) {
        console.error("[SOUND] Invalid currentIndex for sound playback.");
        return;
    }
    const currentItem = activeContentData[currentIndex];
    if (!currentItem) {
         console.error(`[SOUND] Cannot play sound: Missing item data for index ${currentIndex}.`);
         return;
    }

    // --- 3. NEW LOGIC: Determine which sound URL to use based on mode ---
    let soundUrlToPlay;         // Variable to hold the chosen URL
    let soundTypeDescription;   // Variable for logging purposes

    if (currentSoundMode === 'human') {
        soundUrlToPlay = currentItem.word; // Get URL from the 'word' key
        soundTypeDescription = "Spoken Word";

        // Check if the 'word' property exists and is a valid string URL
        if (!soundUrlToPlay || typeof soundUrlToPlay !== 'string') {
             console.warn(`[SOUND] Missing or invalid 'word' URL for item '${currentItem.name}' (index ${currentIndex}). Cannot play human sound.`);
             // Optional: Could fallback to animal sound here, but for now we just stop.
             return;
        }
    } else { // Default is 'animal' mode
        soundUrlToPlay = currentItem.sound; // Get URL from the 'sound' key
        soundTypeDescription = "Animal Sound";

        // Check if the 'sound' property exists and is a valid string URL
        if (!soundUrlToPlay || typeof soundUrlToPlay !== 'string') {
             console.warn(`[SOUND] Missing or invalid 'sound' URL for item '${currentItem.name}' (index ${currentIndex}). Cannot play animal sound.`);
             // Stop if the required sound URL is missing/invalid
             return;
        }
    }
    console.log(`[SOUND] Mode: ${currentSoundMode}. Attempting to play ${soundTypeDescription}: ${soundUrlToPlay}`);
    // --- END NEW LOGIC ---

    // 4. Call playSound function (this checks the global 'isSoundOn' mute state)
    // Pass the dynamically determined soundUrlToPlay
    const newAudio = playSound(soundUrlToPlay);

    // 5. Handle audio events & store reference (existing logic, updated logs)
    if (newAudio) {
        // Store reference to prevent overlap from THIS function's triggers
        currentWordTapAudio = newAudio;

        // Add listener for when THIS specific sound finishes
        newAudio.onended = () => {
            // Use the description variable in the log
            console.log(`[SOUND] Playback finished for ${soundTypeDescription}: ${soundUrlToPlay}`);
            // Clear the reference ONLY if it's still pointing to this audio object
            if (currentWordTapAudio === newAudio) {
                currentWordTapAudio = null;
            }
        };

        // Add listener for errors during playback for THIS instance
        newAudio.onerror = () => {
            // Use the description variable in the log
            console.error(`[SOUND] Error during playback for ${soundTypeDescription}: ${soundUrlToPlay}`);
            // Clear the reference if it was this audio object that failed
            if (currentWordTapAudio === newAudio) {
                currentWordTapAudio = null;
            }
        };
    }
    // If newAudio is null (because sound is globally muted by isSoundOn), nothing further happens here.
}
// --- End handleWordTap Function ---

 //Initializes the main application view state.//
function initializeMainApp() {
    console.log("[SETUP] Initializing Main App view...");
    // Set Initial Sound Icon State   
    // Set initial visual state for the new sound mode icons
    updateSoundModeUI();
    updateMainSoundIconVisualState();
   // --- End initial sync ---

    if (activeContentData.length > 0) {
        showItemAtIndex(currentIndex);       
    } else { console.error("Cannot initialize: activeContentData is empty."); }
}

/**
 * Sets the active dataset, preloads images, resets index, and starts the main app view.
 * @param {Array} dataArray - The array of content objects for the selected level.
 * @param {string} levelName - A descriptive name for logging (e.g., "Farm Animals").
 */
function loadLevelAndStart(dataArray, levelName) {
    console.log(`[LOAD LEVEL] Request to load level: ${levelName}`);

    // Basic validation of the data array
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        console.error(`[LOAD LEVEL] Error: Data array for ${levelName} is empty or invalid. Cannot load level.`);
        // Optional: Display an error message to the user on the start screen here
        alert(`Error: Could not load data for ${levelName}.`); // Simple alert for now
        return; // Stop execution if data is invalid
    }

    // --- Core Level Loading Logic ---
    console.log(`[LOAD LEVEL] Setting active data for <span class="math-inline">\{levelName\} \(</span>{dataArray.length} items).`);
    activeContentData = dataArray; // Set the global active data

    console.log("[LOAD LEVEL] Resetting currentIndex to 0.");
    currentIndex = 0; // Reset index for the new dataset

    console.log(`[LOAD LEVEL] Preloading images for ${levelName}...`);
    preloadAllImages(activeContentData); // Preload images for the selected level

    console.log("[LOAD LEVEL] Transitioning to main app screen...");
    goToMainApp(); // Transition to the main view
    // --- End Core Level Loading Logic ---
}


// Transitions the view from start screen to main app
function goToMainApp() {
    console.log("[STATE] Request to transition to Main App state...");
    // Remove other potential state classes
    document.body.classList.remove('state-start', 'state-options'); // Added 'state-options'
    // Add the main state class
    document.body.classList.add('state-main');
    console.log("[STATE] Body class set to: state-main");
    // Initialize the main app view (this call should already exist)
    initializeMainApp();
}

// --- >>> Sound Toggle Function <<< ---
function toggleSoundState() {
    if (!soundIconContainer) return; // Safety check

    isSoundOn = !isSoundOn; // Toggle the state
    console.log(`[SOUND] Sound state toggled. isSoundOn: ${isSoundOn}`);

    // Update classes efficiently
    updateMainSoundIconVisualState();
}
// --- End Sound Toggle Function ---

/**
 * Plays a sound if sound is enabled.
 * @param {string} soundUrl - The path to the audio file.
 * @returns {HTMLAudioElement | null} - The created Audio object or null if not played.
 */

// --- >>> Function to Play Sound <<< ---
function playSound(soundUrl) {
        // --- Check override option FIRST ---
        if (isForceMutedByOption) {
            console.log(`[SOUND] Playback skipped (Force Muted by Option): ${soundUrl}`);
            return null; // Don't play if force-muted
        }
        // --- END Check override ---

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



// --- Trigger Image Preloading ---
if (activeContentData .length > 0) {
    preloadAllImages(activeContentData );
}

// --- Set Initial Body State Class ---
document.body.classList.remove('state-main');
document.body.classList.add('state-start');
console.log("[STATE] Initial state set to: state-start");




// --- Event Listeners ---

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

if (optionsButton) {
    optionsButton.addEventListener('click', goToOptionsScreen);
    console.log("[SETUP] Options button listener attached.");
}

if (startLevel1Button) {
    // Call loadLevelAndStart, passing the specific data array and level name
    startLevel1Button.addEventListener('click', () => loadLevelAndStart(farmAnimalsData, "Farm Animals"));
    console.log("[SETUP] Level 1 (Farm) button listener attached.");
} else {
    console.warn("WARN: Level 1 button not found, listener not attached.");
}

if (startLevel2Button) {
    startLevel2Button.addEventListener('click', () => loadLevelAndStart(zooAnimalsData, "Zoo Animals"));
    console.log("[SETUP] Level 2 (Zoo) button listener attached.");
} else {
    console.warn("WARN: Level 2 button not found, listener not attached.");
}

if (startLevel3Button) {
    startLevel3Button.addEventListener('click', () => loadLevelAndStart(oceanAnimalsData, "Ocean Animals"));
    console.log("[SETUP] Level 3 (Ocean) button listener attached.");
} else {
    console.warn("WARN: Level 3 button not found, listener not attached.");
}


if (optionCheckbox1) {
    optionCheckbox1.addEventListener('change', (event) => {
        // Get the new checked state (true or false) from the event
        const isChecked = event.target.checked;
        console.log(`[OPTIONS] Checkbox changed. New checked state: ${isChecked}`);

        // Update the global state variable based on the checkbox
        isForceMutedByOption = isChecked;
        console.log(`[STATE] isForceMutedByOption set to: ${isForceMutedByOption}`);

        // --- Action for next step: Update main sound icon visuals ---
        // We will define updateMainSoundIconVisualState in the next phase,
        // but we need to call it here so the icon updates immediately when
        // the checkbox state changes.
        console.log("[OPTIONS] Calling updateMainSoundIconVisualState() after checkbox change.");
        updateMainSoundIconVisualState();
        // --- End action for next step ---

    });
    console.log("[SETUP] Options checkbox 'change' listener attached.");
}

function updateMainSoundIconVisualState() {
    if (!soundIconContainer) {
        console.warn("[UI Sync] Cannot update main sound icon: container not found.");
        return;
    }

    // --- Determine Effective Mute State (for Opacity) ---
    const effectivelyMuted = isForceMutedByOption || !isSoundOn;
    console.log(`[UI Sync] Updating main sound icon. ForceMute=${isForceMutedByOption}, SoundOn=${isSoundOn}, EffectivelyMuted=${effectivelyMuted}`);

    // --- 1. Handle Opacity based on Effective Mute State, force 0 if isForceMutedByOption is true ---
    if (isForceMutedByOption) {
        soundIconContainer.style.opacity = '0'; // force opacity to 0 when force muted
    } else if (effectivelyMuted) {
        soundIconContainer.style.opacity = '0.1'; // use 0.1 for muted by toggle
    } else {
        soundIconContainer.style.opacity = '1'; // restore full opacity
    }

    // --- 2. Handle SVG Visibility based on *underlying* isSoundOn State ---
    // Remove previous state first for clean toggle
    soundIconContainer.classList.remove('state-sound-on', 'state-sound-off');

    if (isSoundOn) {
        soundIconContainer.classList.add('state-sound-on');
        console.log("[UI Sync] Setting icon state class to: state-sound-on");
    } else {
        soundIconContainer.classList.add('state-sound-off');
        console.log("[UI Sync] Setting icon state class to: state-sound-off");
    }
}


// Sound Mode Toggle Listeners
if (animalSoundButton) {
    animalSoundButton.addEventListener('click', () => {
        // --- Play sound immediately on any click ---
        console.log("[SOUND] Playing UI sound for animal icon click.");
        // Replace with your actual sound file path
        playSound('/sounds/toggle.mp3');
        // --- End sound playback ---

        // Only update state and UI if the mode is actually changing
        if (currentSoundMode !== 'animal') {
            console.log("[MODE TOGGLE] Animal sound selected via click (mode changing).");
            currentSoundMode = 'animal'; // Update the state variable
            updateSoundModeUI();      // Update the button visuals
        } else {
             console.log("[MODE TOGGLE] Animal sound already selected (mode not changing).");
        }
    });
    console.log("[SETUP] Animal sound mode button listener attached.");
} else {
    console.warn("WARN: Animal sound button not found, listener not attached.");
}

if (humanSoundButton) {
    humanSoundButton.addEventListener('click', () => {
        // --- Play sound immediately on any click ---
        console.log("[SOUND] Playing UI sound for human icon click.");
         // Replace with your actual sound file path
        playSound('/sounds/toggle.mp3');
        // --- End sound playback ---

        // Only update state and UI if the mode is actually changing
        if (currentSoundMode !== 'human') {
            console.log("[MODE TOGGLE] Human sound selected via click (mode changing).");
            currentSoundMode = 'human'; // Update the state variable
            updateSoundModeUI();     // Update the button visuals
        } else {
            console.log("[MODE TOGGLE] Human sound already selected (mode not changing).");
        }
    });
    console.log("[SETUP] Human sound mode button listener attached.");
} else {
    console.warn("WARN: Human sound button not found, listener not attached.");
}

//  Word Area Tap Listener 
if (animalNameDisplayElement) {
    animalNameDisplayElement.addEventListener('click', handleWordTap);
    console.log("[SETUP] Word tap listener attached to #animal-name-display.");
} 
// --- >>> Swipe Navigation Listeners on Image Section <<< ---
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

    console.log("[SETUP] Swipe listeners attached to #image-section.")
} 

// --- Main Button interaction logic --- //
if (innerButton && imageSectionElement && animalNameDisplayElement) {
    // --- handlePress function body (REVISED with isTransitioning check) ---
    const handlePress = (event) => {
        // Log the event type
        console.log(`[HANDLE PRESS] Function called by event type: ${event.type}`);
    
        // Keep touchstart prevention
        if (event.type === 'touchstart') {
            event.preventDefault();
        }
    
        // Apply visual depressed effect
        if (innerButton) { // Safety check
            innerButton.classList.add('button-depressed');
        }
    
        // Trigger the existing word tap logic FIRST
        console.log("[SOUND] Main button pressed, triggering word tap sound logic.");
        handleWordTap(); // Reuse the function for tapping the word area
    
        // --- Check if safe to animate: Only bounce if falling animation is complete ---
        if (isTransitioning) {
            // If true, the initial animation is likely still running. Log and do nothing more for bounce.
            // Corrected log message below:
            console.log("[HANDLE PRESS] Bounce prevented: Initial word animation still in progress (isTransitioning = true).");
        } else {
            // If false, the initial animation is finished. Proceed with bounce logic.
            console.log("[HANDLE PRESS] Word animation complete (isTransitioning = false). Attempting bounce.");
    
            // --- This is the bounce logic block, now inside the 'else' ---
            const wordDisplayContainer = document.querySelector('#animal-name-display'); // Find the container div
    
            if (wordDisplayContainer) {
                // Find the H1 element *inside* the container
                const currentWordElement = wordDisplayContainer.querySelector('h1.falling-word');
    
                // Check if the H1 element was actually found
                if (currentWordElement) {
                    console.log("[HANDLE PRESS] Found h1. Adding '.apply-text-bounce' class.");
                    // Add the bounce animation class (Moved inside the check)
                    currentWordElement.classList.add('apply-text-bounce');
    
                    // --- PHASE 3 CODE: Listener to remove class after animation ---
                    console.log("[HANDLE PRESS] Attaching one-time 'animationend' listener to remove bounce class.");
    
                    // Define what happens when the animation finishes
                    const handleBounceEnd = () => {
                        console.log("[ANIMATION END] Bounce animation finished. Removing '.apply-text-bounce' class.");
                        // Check if element still exists before removing class (extra safety)
                        if (currentWordElement) {
                            currentWordElement.classList.remove('apply-text-bounce');
                        }
                        // No need to manually remove the listener because we use { once: true }
                    };
    
                    // Attach the listener.
                    // { once: true } ensures the listener automatically cleans itself up after firing once.
                    currentWordElement.addEventListener('animationend', handleBounceEnd, { once: true });
                    // --- END PHASE 3 CODE ---
    
                } else {
                     // Corrected placement for this error log
                    console.error("[HANDLE PRESS] Error: Could not find h1.falling-word element inside #animal-name-display to animate.");
                }
            } else {
                console.error("[HANDLE PRESS] Error: Could not find #animal-name-display container.");
            }
            // --- End bounce logic block ---
        }
        // --- END isTransitioning CHECK ---
    
    }; // End handlePress function

    // --- handleRelease  ---
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
    if (activeContentData .length === 0) console.error("- activeContentData  array is empty.");
    if (innerButton) innerButton.disabled = true;
}
// --- End Button Interaction ---

// --- Enable Transitions ---
setTimeout(() => {
    document.body.classList.add('transitions-ready');
}, 0);
// --- End Enable transitions ---