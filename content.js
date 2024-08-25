// content.js

// Function to collect items from the cart
function collectCartItems() {
    const itemElements = document.querySelectorAll('a.sc-b8625da9-2.dlduhl');
    
    console.log('Collecting cart items...');
    const items = Array.from(itemElements).map(item => {
        return {
            name: item.textContent.trim(),
            url: item.href
        };
    });
    console.log('Items to send to background script:', items);

    // Send the items back to the background script
    chrome.runtime.sendMessage({ action: 'updateCartItems', items: items });
}

// Function to observe changes in the cart
function observeCartChanges() {
    const cartContainer = document.querySelector('div'); // Adjust selector as necessary for the main cart container

    if (cartContainer) {
        const observer = new MutationObserver(() => {
            console.log('Cart items updated, collecting new items...');
            collectCartItems();
        });

        observer.observe(cartContainer, { childList: true, subtree: true });
        console.log('MutationObserver set up to watch for changes in the cart.');
    } else {
        console.log('Cart container not found.');
    }
}

// Function to scrape product page for classification codes
function scrapeProductPage(url, callback) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Scrape the necessary data from the product page
          const classA = doc.querySelector('.breadcrumb .class-a').textContent.trim();
          const codeA = doc.querySelector('.breadcrumb .code-a').textContent.trim();
          const classB = doc.querySelector('.breadcrumb .class-b').textContent.trim();
          const codeB = doc.querySelector('.breadcrumb .code-b').textContent.trim();
          const classC = doc.querySelector('.breadcrumb .class-c').textContent.trim();
          const codeC = doc.querySelector('.breadcrumb .code-c').textContent.trim();
          
          callback({
              classA,
              codeA,
              classB,
              codeB,
              classC,
              codeC
          });
      })
      .catch(error => {
          console.error('Error scraping product page:', error);
          callback(null);
      });
}

// Run the function after the page is fully loaded
window.addEventListener('load', () => {
    collectCartItems(); // Initial collection
    observeCartChanges(); // Set up observer for dynamic updates
});
