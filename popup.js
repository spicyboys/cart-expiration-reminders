// popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Function to update cart information in the popup
  function updateCartInfo() {
    console.log('Sending message to get cart items...');
    chrome.runtime.sendMessage({ action: 'getCartItems' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving cart items:', chrome.runtime.lastError.message);
        document.getElementById('cart-info').textContent = 'Failed to load cart items.';
        return;
      }

      console.log('Received response:', response);

      const items = response.items || [];
      const cartInfo = document.getElementById('cart-info');
      cartInfo.textContent = `You have ${items.length} item(s) in your cart.`;
    });
  }

  // Update cart info when the popup is opened
  updateCartInfo();

  // Handle the button click to set reminders
  document.getElementById('set-reminder').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'setReminders' }, function(response) {
      if (chrome.runtime.lastError || !response.success) {
        console.error('Error setting reminders:', response ? response.error : chrome.runtime.lastError.message);
        alert('Failed to set reminders.');
      } else {
        console.log('Reminders set successfully');
        alert('Reminders set successfully!');
        updateCartInfo();  // Update the cart info after setting reminders
      }
    });
  });
});