/* /src/main.js */
/* Reviewed & Corrected: Saturday, 26 April 2025 */

// Import the CSS file
import './style.css';

// --- Select Elements ---
// Select the elements needed for functionality
// const appElement = document.querySelector('#app'); // No longer strictly needed? Review if used elsewhere.
const imageSectionElement = document.querySelector('#image-section');
const innerButton = document.querySelector('#inner-button');
const fullscreenButton = document.querySelector('#fullscreen-btn');

// --- Early Check for Critical Elements ---
// It's good practice to check if essential elements exist early on.
if (!imageSectionElement) {
    console.error('CRITICAL ERROR: #image-section element not found! Background images cannot be set.');
}
if (!innerButton) {
    console.error('CRITICAL ERROR: #inner-button element not found! Button interactions cannot be set up.');
}


// --- Background Image Setup ---
const backgroundImages = [
    '/images/bg1.jpg', // Image 1 (Make sure this file exists!)
    '/images/bg2.jpg', // Image 2 (Make sure this file exists!)
    '/images/bg3.jpg', // Image 3 (Make sure this file exists!)
    '/images/bg4.jpg', // Image 4 (Make sure this file exists!)
];
let currentBackgroundIndex = 0;

// Set the initial background image on page load - TARGET #image-section
// CORRECTED: Check imageSectionElement existence directly here.
if (imageSectionElement && backgroundImages.length > 0) {
    imageSectionElement.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
    // CORRECTED: Update log message
    console.log(`Initial background set on #image-section to: ${backgroundImages[currentBackgroundIndex]}`);
} else if (!imageSectionElement) {
    // Log error again if trying to set background on non-existent element
    console.error('Cannot set initial background: #image-section not found.');
}
// --- End Background Image Setup / Initial Load ---


// --- Inner Button Interaction ---
// CORRECTED: Setup listeners only if BOTH innerButton AND imageSectionElement exist,
// because handlePress modifies imageSectionElement.
if (innerButton && imageSectionElement) {

    const handlePress = (event) => {
        // Prevent default touch behavior (like ghost clicks)
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        // Add visual feedback class
        innerButton.classList.add('button-depressed');

        // --- Background Change Logic - TARGET #image-section ---
        // Cycle through images
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
        const newImageUrl = backgroundImages[currentBackgroundIndex];

        // Set the new background image (imageSectionElement is guaranteed to exist here
        // because of the outer 'if' check)
        imageSectionElement.style.backgroundImage = `url(${newImageUrl})`;

        // CORRECTED: Update log message
        console.log(`Background on #image-section changed to: ${newImageUrl}`);

        // Optional logging:
        // console.log('Event: Press', event.type);
    };

    const handleRelease = (event) => {
        // Remove visual feedback class
        innerButton.classList.remove('button-depressed');
        // Optional logging:
        // console.log('Event: Release', event.type);
    };

    // Attach Event Listeners for press/release actions
    innerButton.addEventListener('mousedown', handlePress);
    innerButton.addEventListener('touchstart', handlePress); // Use preventDefault inside handler
    innerButton.addEventListener('mouseup', handleRelease);
    innerButton.addEventListener('touchend', handleRelease);
    innerButton.addEventListener('mouseleave', handleRelease); // Handle mouse leaving button while pressed
    innerButton.addEventListener('touchcancel', handleRelease); // Handle touch interruption

} else {
    // Log if setup failed, indicating which element was missing (if not already logged)
    if (!innerButton) console.error('Button event listeners not attached: #inner-button missing.');
    if (!imageSectionElement) console.error('Button event listeners not attached: #image-section missing (needed for background change).');
}
// --- End Inner Button Interaction ---


// --- Fullscreen Logic ---
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
        toggleFullscreen();
    });
} else {
    // Log if fullscreen button isn't found (non-critical)
    console.warn('Fullscreen button #fullscreen-btn not found.');
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen()
            .then(() => {
                // Add class to body for CSS styling hooks (e.g., changing icon)
                document.body.classList.add('is-fullscreen');
            })
            .catch((err) => {
                // Log errors if fullscreen request fails
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
    } else {
        // Exit fullscreen (if API exists)
        if (document.exitFullscreen) {
            document.exitFullscreen()
                .then(() => {
                    // Remove styling class from body
                    document.body.classList.remove('is-fullscreen');
                })
                .catch((err) => {
                    // Log errors if exiting fullscreen fails
                    console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
                });
        }
    }
}

// Listen for changes in fullscreen state (e.g., user pressing ESC)
// Ensure the body class stays in sync with the actual fullscreen state.
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('is-fullscreen');
    } else {
        document.body.classList.add('is-fullscreen');
    }
});
// --- End Fullscreen Logic ---


// --- Enable transitions after initial render fix ---
// Add class to body slightly after load to enable CSS transitions
// without animating the initial state.
setTimeout(() => {
    document.body.classList.add('transitions-ready');
    // console.log('Transitions Ready.');
}, 0);
// --- End Enable transitions ---