// background.js

let cartItems = [];

const shelfLifeData = [
  { class: "Fruit & Vegetable", subClass: "Apples", minShelfLife: 30, maxShelfLife: 60 },
  { class: "Fruit & Vegetable", subClass: "Bananas", minShelfLife: 5, maxShelfLife: 7 },
  { class: "Fruit & Vegetable", subClass: "Berries & Cherries", minShelfLife: 3, maxShelfLife: 7 },
  { class: "Fruit & Vegetable", subClass: "Leafy Greens (Lettuce, Spinach)", minShelfLife: 3, maxShelfLife: 5 },
  { class: "Fruit & Vegetable", subClass: "Root Vegetables (Carrots, Potatoes)", minShelfLife: 30, maxShelfLife: 60 },
  { class: "Fruit & Vegetable", subClass: "Tomatoes", minShelfLife: 7, maxShelfLife: 10 },
  { class: "Dairy & Eggs", subClass: "Milk", minShelfLife: 7, maxShelfLife: 10 },
  { class: "Dairy & Eggs", subClass: "Yogurt", minShelfLife: 7, maxShelfLife: 14 },
  { class: "Dairy & Eggs", subClass: "Cheese", minShelfLife: 14, maxShelfLife: 60 },
  { class: "Dairy & Eggs", subClass: "Eggs", minShelfLife: 21, maxShelfLife: 30 },
  { class: "Bakery & Bread", subClass: "Bread (Sliced, Rolls)", minShelfLife: 5, maxShelfLife: 7 },
  { class: "Bakery & Bread", subClass: "Pastries & Desserts", minShelfLife: 2, maxShelfLife: 5 },
  { class: "Bakery & Bread", subClass: "Bagels", minShelfLife: 5, maxShelfLife: 7 },
  { class: "Pantry", subClass: "Canned Goods", minShelfLife: 365, maxShelfLife: 365 },
  { class: "Pantry", subClass: "Pasta", minShelfLife: 365, maxShelfLife: 365 },
  { class: "Pantry", subClass: "Rice", minShelfLife: 365, maxShelfLife: 365 },
  { class: "Pantry", subClass: "Spices", minShelfLife: 365, maxShelfLife: 365 },
  { class: "Meat & Seafood", subClass: "Fresh Meat (Beef, Chicken, Pork)", minShelfLife: 1, maxShelfLife: 5 },
  { class: "Meat & Seafood", subClass: "Fresh Seafood", minShelfLife: 1, maxShelfLife: 3 },
  { class: "Meat & Seafood", subClass: "Processed Meats (Sausages, Deli)", minShelfLife: 5, maxShelfLife: 7 },
  { class: "Meat & Seafood", subClass: "Frozen Meat & Seafood", minShelfLife: 90, maxShelfLife: 365 },
  { class: "Frozen Foods", subClass: "Frozen Vegetables", minShelfLife: 365, maxShelfLife: 365 },
  { class: "Frozen Foods", subClass: "Ice Cream", minShelfLife: 60, maxShelfLife: 180 },
  { class: "Frozen Foods", subClass: "Frozen Meals", minShelfLife: 180, maxShelfLife: 365 }
];

function findShelfLife(itemName) {
  const item = shelfLifeData.find(data => itemName.includes(data.subClass));
  return item ? { minShelfLife: item.minShelfLife, maxShelfLife: item.maxShelfLife } : null;
}

function setReminder(itemName, shelfLife, token) {
  const purchaseDate = new Date();
  const expirationDate = new Date(purchaseDate);
  expirationDate.setDate(purchaseDate.getDate() + shelfLife.minShelfLife);

  const task = {
    title: `Consume ${itemName}`,
    due: expirationDate.toISOString()
  };

  fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(response => response.json())
  .then(data => console.log('Task created:', data))
  .catch(error => console.error('Error creating task:', error));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCartItems') {
    cartItems = request.items;
    console.log('Cart items received and stored in background.js:', cartItems);
  } else if (request.action === 'setReminders') {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving token:', chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      cartItems.forEach(item => {
        const shelfLife = findShelfLife(item);
        if (shelfLife) {
          setReminder(item, shelfLife, token);
        } else {
          console.log(`No shelf life data found for ${item}`);
        }
      });

      sendResponse({ success: true });
    });

    return true; // Keeps the message channel open for async sendResponse
  }
});