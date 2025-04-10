/* /src/main.js */
/* Friday, 11 April 2025 - Button Interaction + Initial Animation Fix */

// Import the CSS file (Vite handles including this in the build)
import './style.css';

// Get a reference to the button element using its ID
const innerButton = document.querySelector('#inner-button');

// Ensure the button element was found before adding listeners
if (innerButton) {

  // --- Define handler functions ---

  // Function to run when the button is pressed down
  const handlePress = (event) => {
    // Add the CSS class to change the button's appearance
    innerButton.classList.add('button-depressed');
    // Log to console for debugging (optional)
    // console.log('Event: Press', event.type);
  };

  // Function to run when the button is released
  const handleRelease = (event) => {
    // Remove the CSS class to revert the button's appearance
    innerButton.classList.remove('button-depressed');
    // Log to console for debugging (optional)
    // console.log('Event: Release', event.type);
  };

  // --- Attach Event Listeners ---

  // Listen for mouse button down and touch start events
  innerButton.addEventListener('mousedown', handlePress);
  innerButton.addEventListener('touchstart', handlePress, { passive: true });

  // Listen for mouse button up and touch end events
  innerButton.addEventListener('mouseup', handleRelease);
  innerButton.addEventListener('touchend', handleRelease);

  // Also listen for cases where interaction ends unexpectedly:
  innerButton.addEventListener('mouseleave', handleRelease);
  innerButton.addEventListener('touchcancel', handleRelease);

} else {
  // Log an error if the button element couldn't be found
  console.error('Error: Element with ID #inner-button not found.');
}

// --- NEW: Enable transitions after initial render ---
// Add a class to the body shortly after the page loads.
// CSS rules dependent on '.transitions-ready' will now apply.
// setTimeout with 0ms delay executes after the current code and browser paint.
setTimeout(() => {
  document.body.classList.add('transitions-ready');
  // console.log('Transitions Ready.'); // Optional debug log
}, 0);
// --- End NEW ---