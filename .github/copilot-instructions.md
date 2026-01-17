# WorkBoard - AI Coding Instructions

## Project Overview

WorkBoard is a **single-page web application** that functions as a multi-purpose productivity dashboard. It's a vanilla JavaScript project (no frameworks) with three main components:

1. **Clock/Date Display** - Shows current time and date using system locale
2. **Countdown Timer** - User-configurable countdown to a target date
3. **Productivity Tools** - Stopwatch, Timer, and Blackboard (editable text area)

**Key Architecture Decision**: The entire application runs in a single HTML file with inline JavaScript and CSS. All state is persisted to `localStorage`, making it a serverless, offline-first application.

## Critical Architecture Patterns

### 1. Single-File Structure (No Build Process)
- **index.html** - Contains all HTML structure
- **style.css** - All styling (721 lines)
- **script.js** - All logic (707 lines)
- **No build tools, no bundlers, no transpilers**

**Why this matters**: Changes are immediate - just refresh the browser. No npm install, no webpack, no compilation steps.

### 2. State Management via localStorage
All persistent data is stored in localStorage with these keys:
- `countdownData` - JSON: `{name: string, date: string}`
- `blackboardContent` - Plain text content
- `workboardLang` - Language preference (en, zh-CN, zh-TW)
- `workboardFont` - Font preference (MiSans VF, JetBrains Mono, Arial, Georgia)

**Pattern**: Always wrap localStorage operations in try-catch blocks to handle quota exceeded errors gracefully.

### 3. View-Based Navigation (Card System)
The app uses a **card-based view system** where only one "card" is visible at a time:
- `mainCard` - Clock/Countdown view (default)
- `stopwatchCard` - Stopwatch view
- `timerCard` - Timer view
- `blackboardCard` - Blackboard view

**Implementation**: CSS class `.hidden` (display: none !important) controls visibility. Navigation buttons toggle active state and card visibility.

### 4. Localization System
The app supports 3 languages (English, Simplified Chinese, Traditional Chinese) with a **translation object pattern**:

```javascript
const translations = {
  en: { /* key-value pairs */ },
  'zh-CN': { /* key-value pairs */ },
  'zh-TW': { /* key-value pairs */ }
};

function t(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}
```

**Key files**: `script.js` lines 200-300 contain all translations. The `updateAllTexts()` function updates UI text when language changes.

### 5. Settings Menu Architecture
Settings are centralized in a dropdown menu (⚙️ button) containing:
- **Language selector** - 3 buttons (EN, 简, 繁)
- **Font selector** - 4 buttons (MiSans VF, JetBrains Mono, Arial, Georgia)
- **Countdown settings** - Opens the countdown modal

**Important**: The settings menu auto-closes when clicking outside or selecting an option.

## Critical Developer Workflows

### Running the Application
```bash
# Option 1: Direct file open (simplest)
# Just double-click index.html in your browser

# Option 2: Local server (recommended for better performance)
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Testing Changes
1. **No build step required** - Just save files and refresh browser
2. **Clear browser cache** if changes don't appear (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check browser console** for errors (F12)
4. **Test in multiple browsers** - Chrome, Firefox, Safari, Edge

### Debugging localStorage Issues
If data isn't persisting:
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Check for errors in Console
4. Verify localStorage quota hasn't been exceeded (5-10MB limit)

### Adding New Features
**Pattern**: When adding a new view/card:
1. Add HTML structure in `index.html` (follow existing card pattern)
2. Add CSS styles in `style.css` (follow existing card styles)
3. Add JavaScript logic in `script.js` (follow existing module pattern)
4. Update navigation menu in HTML
5. Update navigation logic in `setupNavigation()` function

## Project-Specific Conventions

### 1. CSS Naming Convention
- **BEM-like** but simplified: `component-element--modifier`
- Examples: `countdown-tag`, `btn-start`, `settings-dropdown active`
- **No CSS frameworks** - All custom CSS

### 2. JavaScript Module Pattern
Functions are organized by feature:
- Clock functions: `updateClock()`, `updateDate()`
- Countdown functions: `loadCountdownData()`, `saveCountdownData()`, `updateCountdown()`
- Stopwatch functions: `startStopwatch()`, `stopStopwatch()`, `resetStopwatch()`
- Timer functions: `startTimer()`, `stopTimer()`, `resetTimer()`
- Blackboard functions: `loadBlackboardData()`, `saveBlackboardData()`, `clearBlackboard()`
- Localization functions: `t()`, `setLanguage()`, `updateAllTexts()`
- Settings functions: `setupSettingsMenu()`, `setFont()`, `setupFontSelector()`

### 3. Error Handling Pattern
All localStorage operations use try-catch:
```javascript
function saveData() {
  try {
    localStorage.setItem("key", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save:", error);
    alert("Save failed - storage might be full");
  }
}
```

### 4. Event Listener Pattern
Event listeners are attached in the `init()` function at the bottom of `script.js`. This ensures all DOM elements exist before attaching listeners.

### 5. Translation Key Naming
Translation keys follow a consistent pattern:
- `countdownFirst` - "Please set a countdown first"
- `countdownHasArrived` - "has arrived!"
- `countdownTimeUntil` - "Time until"
- `timerAlertFinished` - "Timer finished!"

**Rule**: Always use `t()` function for any user-facing text.

## Integration Points & Dependencies

### External Dependencies
1. **Google Fonts** (via @import in CSS):
   - JetBrains Mono (for time displays)
   - MiSans VF (for general text)

2. **Browser APIs**:
   - `localStorage` - Data persistence
   - `Date` - Time calculations
   - `navigator.language` - Locale detection
   - `setInterval` - Clock updates (1000ms)

### No External Libraries
- **No jQuery, React, Vue, or any framework**
- **No utility libraries** (Lodash, Moment.js, etc.)
- **No build tools** (Webpack, Vite, etc.)

### System Integration
- **Clipboard**: Not used (could be added for blackboard)
- **Notifications**: Not used (could be added for timer alerts)
- **Audio**: Not used (could be added for timer completion)

## Key Files & Directories

### Essential Files
- `index.html` - Single page structure
- `style.css` - All styling (721 lines)
- `script.js` - All logic (707 lines)
- `README.md` - Project overview
- `CONTRIBUTING.md` - Development guidelines
- `TODO.md` - Completed features list
- `3RDPARTY.md` - Third-party notices
- `LICENSE` - MIT License

### Asset Directory
- `assets/` - Currently contains fonts directory
  - `assets/fonts/` - Local font files (if any)

### Configuration Files
- `.github/copilot-instructions.md` - This file
- `.vscode/` - VS Code settings (if any)

## Common Patterns & Examples

### 1. View Switching
```javascript
// Hide all cards
Object.values(cards).forEach(card => card.classList.add('hidden'));
// Show specific card
if (cards[view]) {
  cards[view].classList.remove('hidden');
}
```

### 2. Settings Menu Toggle
```javascript
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent event bubbling
  settingsDropdown.classList.toggle("active");
  settingsBtn.classList.toggle("active");
});
```

### 3. Auto-Close Dropdown
```javascript
document.addEventListener("click", (e) => {
  if (!settingsDropdown.contains(e.target) && e.target !== settingsBtn) {
    settingsDropdown.classList.remove("active");
    settingsBtn.classList.remove("active");
  }
});
```

### 4. Translation Function
```javascript
function t(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}
```

### 5. Font Application
Different fonts applied to different elements:
- **Time displays** (clock, stopwatch, timer): JetBrains Mono (monospace)
- **Text displays** (date, countdown, blackboard): MiSans VF or selected font

## Important Notes for AI Agents

### DO NOT:
1. **Add build tools** - Project is intentionally single-file
2. **Add external dependencies** - Keep it vanilla JavaScript
3. **Change the single-file architecture** - This is a design decision
4. **Add authentication** - This is a local-only application
5. **Add server-side code** - This is a client-only application

### DO:
1. **Follow existing patterns** - Use the same function organization
2. **Use localStorage for persistence** - All data must persist
3. **Support all 3 languages** - When adding text, add translations
4. **Test in multiple browsers** - Ensure cross-browser compatibility
5. **Keep code self-contained** - No external libraries

### Testing Checklist
- [ ] Clock updates every second
- [ ] Date displays in correct locale format
- [ ] Countdown saves/loads from localStorage
- [ ] Stopwatch works with milliseconds
- [ ] Timer counts down and alerts
- [ ] Blackboard saves/loads content
- [ ] Language switching updates all text
- [ ] Font switching applies to all elements
- [ ] Settings menu opens/closes correctly
- [ ] Navigation between views works
- [ ] Mobile responsive design works

## Getting Started for New Contributors

1. **Read CONTRIBUTING.md** for full guidelines
2. **Open index.html in browser** to see the app
3. **Make changes in script.js or style.css**
4. **Refresh browser** to see changes immediately
5. **Test all features** before submitting changes
6. **Update TODO.md** if adding new features

## Project Status

**Current State**: All features from TODO.md are completed:
- ✅ Fixed existing bugs
- ✅ Translated to English
- ✅ Added Stopwatch, Timer, Blackboard
- ✅ Added Localization (EN, 简, 繁)
- ✅ Added navigation menu
- ✅ Added font selector
- ✅ Wrote CONTRIBUTING.md

**Next Steps**: The project is feature-complete. Future work could include:
- Additional productivity features
- More language support
- Export/import functionality
- Theme customization
- Sound notifications
