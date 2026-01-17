I will implement the requested features and fix the blackboard bug.

### 1. Fix Blackboard Bug
-   **Root Cause**: The blackboard canvas is initialized when hidden (`display: none`), causing its dimensions to be 0.
-   **Fix**: Update the navigation logic in `script.js` to call `resizeBlackboard()` whenever the user switches to the Blackboard view.

### 2. Add Theme Support (Light / Dark / Auto)
-   **CSS**: Refactor `style.css` to use CSS variables for colors. Create a `.light-mode` class.
-   **Logic**:
    -   Add a Theme selector (Light/Dark/Auto) to the settings.
    -   Implement "Auto" mode to respect the system's `prefers-color-scheme`.
    -   Persist the user's choice in `localStorage`.
    -   Ensure the Blackboard card remains dark in all themes for better visibility.

### 3. Settings Menu Improvements
-   **Dropdowns**: Replace the button groups for **Language** and **Font** with `<select>` dropdown lists in `index.html` and update `script.js` to handle change events.
-   **About Section**: Add an "About" button in the settings menu that opens a modal with project information.

### 4. Implementation Steps
1.  **Modify `style.css`**: Define CSS variables and Light Mode styles.
2.  **Modify `index.html`**:
    -   Update the settings menu structure (add Theme select, replace buttons with selects, add About button).
    -   Add the "About" modal HTML.
3.  **Modify `script.js`**:
    -   Update navigation to fix the blackboard bug.
    -   Implement theme switching logic (including Auto detection).
    -   Update event listeners for the new dropdowns.
    -   Add logic for the About modal.
    -   Add necessary translations.
