// content.js

// Function to collect items from the cart
function collectCartItems() {
    // Ensure we select the broader parent container for the items
    const cartContainer = document.querySelector('body');  // Starting from the body to ensure we are within the document

    if (cartContainer) {
        console.log('Cart container found:', cartContainer);

        // Now find the specific item elements within the broader container
        const itemElements = cartContainer.querySelectorAll('.sc-1397b7ba-3');

        console.log('Number of elements:', itemElements.length);

        const items = [];
        itemElements.forEach(item => {
            const label = item.querySelector('#item-label');
            if (label) {
                const itemName = label.textContent.trim();
                const itemUrl = item.closest('a') ? item.closest('a').href : '';  // Get the URL if it exists

                items.push({
                    name: itemName,
                    url: itemUrl
                });
            }
        });

        console.log('Items collected:', items);

        if (items.length === 0) {
            console.warn('No items were found. Check if the selectors match the structure of the cart page.');
        }

        chrome.runtime.sendMessage({ action: 'updateCartItems', items: items }, function(response) {
            console.log('Items sent to background script:', response);
        });
    } else {
        console.warn('Cart container not found. The selectors may need adjustment.');
    }
}

// Function to observe changes in the cart
function observeCartChanges() {
    const cartContainer = document.querySelector('body');  // Start with a broad selector

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

// Run the collection and observation when the page is fully loaded
window.addEventListener('load', () => {
    console.log('Page loaded, starting item collection...');
    collectCartItems(); // Initial collection
    observeCartChanges(); // Set up observer for dynamic updates
});