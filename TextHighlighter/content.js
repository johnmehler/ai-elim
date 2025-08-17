// Text-level highlighter - highlights actual text content like Word highlighting
function highlightText(targetElement = document.body) {
  // Only process visible elements to reduce computational load
  const elements = targetElement.querySelectorAll('p, div, span');
  
  // Process in smaller batches to avoid blocking the main thread
  const batchSize = 10;
  let currentIndex = 0;
  
  function processBatch() {
    const endIndex = Math.min(currentIndex + batchSize, elements.length);
    
    for (let i = currentIndex; i < endIndex; i++) {
      processElement(elements[i]);
    }
    
    currentIndex = endIndex;
    
    // Continue processing if there are more elements
    if (currentIndex < elements.length) {
      requestAnimationFrame(processBatch);
    }
  }
  
  processBatch();
}

function processElement(element) {
  // Skip if already processed
  if (element.dataset.highlighted) {
    return;
  }
  
  // Skip if element is not visible
  if (!isElementVisible(element)) {
    return;
  }
  
  const textContent = element.textContent.trim();
  
  // Check if element has 50+ characters of text
  if (textContent.length > 50) {
    // Find all text nodes in this element
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      node => {
        // Filter out whitespace-only nodes during traversal
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // Use DocumentFragment for batch DOM operations
    if (textNodes.length > 0) {
      textNodes.forEach(textNode => {
        // Skip if text node is already inside a highlighted span
        if (textNode.parentNode.classList && textNode.parentNode.classList.contains('highlight-orange')) {
          return;
        }
        
        // Only highlight text nodes that are substantial content (50+ characters)
        if (textNode.textContent.trim().length < 50) {
          return;
        }
        
        const span = document.createElement('span');
        span.className = 'highlight-orange';
        span.textContent = textNode.textContent;
        textNode.parentNode.replaceChild(span, textNode);
      });
    }
  }
  
  // Mark as processed
  element.dataset.highlighted = 'true';
}

// Check if element is in viewport or close to it
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  // Include elements slightly outside viewport for smoother scrolling
  const margin = 100;
  
  return rect.bottom >= -margin && 
         rect.top <= windowHeight + margin &&
         rect.right >= -margin && 
         rect.left <= windowWidth + margin;
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightText);
} else {
  highlightText();
}

// Handle dynamic content with throttling and debouncing
let timeoutId;
let lastRun = 0;
const throttleDelay = 250; // Minimum time between runs
const debounceDelay = 100;

const observer = new MutationObserver((mutations) => {
  const now = Date.now();
  
  // Only process mutations that actually add text content
  const hasTextChanges = mutations.some(mutation => 
    mutation.type === 'childList' && 
    Array.from(mutation.addedNodes).some(node => 
      node.nodeType === Node.ELEMENT_NODE && 
      node.textContent.trim().length > 0
    )
  );
  
  if (!hasTextChanges) return;
  
  clearTimeout(timeoutId);
  
  // Throttle: if enough time has passed, run immediately
  if (now - lastRun >= throttleDelay) {
    lastRun = now;
    // Only process the specific mutation targets, not entire document
    const targets = [...new Set(mutations.map(m => m.target).filter(t => t.nodeType === Node.ELEMENT_NODE))];
    targets.forEach(target => highlightText(target));
  } else {
    // Debounce: schedule for later
    timeoutId = setTimeout(() => {
      lastRun = Date.now();
      highlightText();
    }, debounceDelay);
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true,
  // Only observe what we care about
  attributes: false,
  characterData: false
});