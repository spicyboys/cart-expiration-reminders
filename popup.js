// popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Request the number of cart items from the background script
  chrome.runtime.sendMessage({ action: 'getCartItems' }, function(response) {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving cart items:', chrome.runtime.lastError.message);
      document.getElementById('cart-info').textContent = 'Failed to load cart items.';
      return;
    }

    const items = response.items;
    const cartInfo = document.getElementById('cart-info');
    cartInfo.textContent = `You have ${items.length} item(s) in your cart.`;
  });

  // Handle the button click to set reminders
  document.getElementById('set-reminder').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'setReminders' }, function(response) {
      if (chrome.runtime.lastError || !response.success) {
        console.error('Error setting reminders:', response ? response.error : chrome.runtime.lastError.message);
        alert('Failed to set reminders.');
      } else {
        console.log('Reminders set successfully');
        alert('Reminders set successfully!');
      }
    });
  });
});
