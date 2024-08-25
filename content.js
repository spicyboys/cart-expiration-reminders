// content.js

// Function to collect items from the cart
function collectCartItems() {
    const itemElements = document.querySelectorAll('a.sc-5e657bf5-0.sc-b8625da9-1');
    
    console.log('Collecting cart items...');
    const items = Array.from(itemElements).map(item => item.textContent.trim());
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

// Run the function after the page is fully loaded
window.addEventListener('load', () => {
    collectCartItems(); // Initial collection
    observeCartChanges(); // Set up observer for dynamic updates
});