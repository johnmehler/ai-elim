Below is a detailed outline and guide for creating a simple Firefox extension that uses HTML, CSS, and JavaScript to highlight text in a `<div>` with a light orange background if the text exceeds 50 characters. The guide includes instructions for Claude Code to follow in creating the prototype.

---

### Outline for the Firefox Extension

**Extension Name**: TextHighlighter  
**Purpose**: Detects `<div>` elements on a webpage with text content longer than 50 characters and applies a light orange background to those elements.  
**Components**:
1. **Manifest File (`manifest.json`)**: Defines the extension's metadata, permissions, and content script injection.
2. **Content Script (`content.js`)**: JavaScript file that runs on webpages to detect and style `<div>` elements.
3. **CSS File (`styles.css`)**: Defines the light orange background style.
4. **Optional HTML**: Not strictly necessary for this extension, as it modifies existing webpage content, but can be included for a popup or options page if desired.

**Functionality**:
- The extension injects a content script into all webpages.
- The script scans all `<div>` elements on the page.
- For each `<div>`, it checks if the text content (excluding HTML) is longer than 50 characters.
- If true, it applies a CSS class to set a light orange background.

---

### Instructions for Claude Code to Create the Prototype

Below are step-by-step instructions for Claude Code to develop the Firefox extension prototype. These instructions are precise, clear, and tailored to ensure the prototype meets the requirements.

#### Step 1: Set Up the Project Structure
Create a new directory called `TextHighlighter` with the following files:
- `manifest.json`
- `content.js`
- `styles.css`

#### Step 2: Create the Manifest File (`manifest.json`)
This file defines the extension’s metadata and specifies that the content script and CSS should be injected into all webpages.

**Instructions for Claude Code**:
- Create a file named `manifest.json`.
- Add the following JSON content:
  ```json
  {
    "manifest_version": 3,
    "name": "TextHighlighter",
    "version": "1.0",
    "description": "Highlights divs with text longer than 50 characters in light orange.",
    "permissions": [],
    "content_scripts": [
      {
        "matches": ["<all_urls>"],
        "js": ["content.js"],
        "css": ["styles.css"]
      }
    ]
  }
  ```
- Ensure the file is valid JSON with no trailing commas or syntax errors.
- Note that `<all_urls>` allows the extension to run on all webpages. No additional permissions are needed since we’re only modifying DOM styles.

#### Step 3: Create the Content Script (`content.js`)
This JavaScript file will:
- Find all `<div>` elements on the page.
- Check the text content length of each `<div>`.
- Apply a CSS class to qualifying `<div>` elements.

**Instructions for Claude Code**:
- Create a file named `content.js`.
- Add the following JavaScript code:
  ```javascript
  document.addEventListener('DOMContentLoaded', () => {
    // Get all div elements
    const divs = document.getElementsByTagName('div');
    
    // Loop through each div
    for (let div of divs) {
      // Get the text content, excluding HTML tags
      const textContent = div.textContent.trim();
      
      // Check if text length exceeds 50 characters
      if (textContent.length > 50) {
        // Add the highlight class
        div.classList.add('highlight-orange');
      }
    }
  });
  ```
- Ensure the script runs after the DOM is fully loaded using `DOMContentLoaded`.
- Use `textContent` to get plain text, excluding HTML tags, and `trim()` to remove leading/trailing whitespace.
- Add the `highlight-orange` class to `<div>` elements where the text length exceeds 50 characters.

#### Step 4: Create the CSS File (`styles.css`)
This file defines the light orange background style for highlighted `<div>` elements.

**Instructions for Claude Code**:
- Create a file named `styles.css`.
- Add the following CSS code:
  ```css
  .highlight-orange {
    background-color: #ffe4b5; /* Light orange color (peachpuff) */
  }
  ```
- Use the hex color `#ffe4b5` (peachpuff) for a light orange background. Ensure the class name matches `highlight-orange` as used in `content.js`.
- Keep the CSS minimal and specific to avoid affecting other elements.

#### Step 5: Test the Extension
Provide instructions for testing the extension to ensure it works as expected.

**Instructions for Claude Code**:
- Create a README or comment block in one of the files (e.g., `manifest.json`) with the following testing instructions:
  ```
  Testing the Extension:
  1. Open Firefox.
  2. Go to `about:debugging#/runtime/this-firefox`.
  3. Click "Load Temporary Add-on".
  4. Select the `manifest.json` file from the TextHighlighter directory.
  5. Visit any webpage with <div> elements containing text.
  6. Verify that divs with text longer than 50 characters have a light orange background.
  7. Check the browser console (F12 > Console) for any errors.
  ```
- Ensure the extension loads without errors and applies the background color correctly.

#### Step 6: Additional Notes for Claude Code
- **Error Handling**: Add a try-catch block in `content.js` if you anticipate potential errors (e.g., accessing `textContent` on restricted elements). Example:
  ```javascript
  try {
    const textContent = div.textContent.trim();
    if (textContent.length > 50) {
      div.classList.add('highlight-orange');
    }
  } catch (error) {
    console.error('Error processing div:', error);
  }
  ```
- **Optimization**: If the webpage has many `<div>` elements, consider debouncing or throttling the script execution, but for simplicity, the current approach is sufficient.
- **Compatibility**: Ensure the code uses standard JavaScript and CSS compatible with modern Firefox versions (Manifest V3).
- **No HTML File**: Since the extension modifies existing webpage content, no HTML file is needed. If a popup is desired later, you can add a `popup.html` and update the manifest accordingly.

#### Step 7: Deliverables
Package the following files in the `TextHighlighter` directory:
- `manifest.json`
- `content.js`
- `styles.css`

Provide a brief comment in each file explaining its purpose, e.g.:
- In `manifest.json`: `// Defines the extension metadata and content script injection.`
- In `content.js`: `// Content script to highlight divs with text longer than 50 characters.`
- In `styles.css`: `// Styles for highlighting divs with a light orange background.`

---

### Additional Guidance for You (the User)
- **Testing Locally**: Follow the testing instructions provided above to load the extension in Firefox.
- **Debugging**: Use Firefox’s Developer Tools (F12) to inspect `<div>` elements and verify the `highlight-orange` class is applied correctly.
- **Extending the Extension**: If you want to add features (e.g., a toggle button, user-defined character limit, or different colors), let me know, and I can provide further guidance.
- **Submitting to Add-ons Store**: If you plan to publish, ensure you follow Mozilla’s Add-ons guidelines and test thoroughly.

If you need clarification or additional features, feel free to ask!