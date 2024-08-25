// background.js

let cartItems = [];
let shelfLifeData = [];

function parseShelfLifeCSV() {
  return new Promise((resolve, reject) => {
    fetch(chrome.runtime.getURL('shelf-life-reference.csv'))
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: results => {
            shelfLifeData = results.data;
            console.log('Shelf life data loaded:', shelfLifeData);
            resolve(shelfLifeData);
          },
          error: err => {
            console.error('Error parsing CSV:', err);
            reject(err);
          }
        });
      });
  });
}

function findItemDetails(itemName) {
  const item = shelfLifeData.find(data => itemName.includes(data['Class C']));
  if (item) {
    return {
      classA: item['Class A'],
      codeA: item['A-Code'],
      classB: item['Class B'],
      codeB: item['B-Code'],
      classC: item['Class C'],
      codeC: item['C-Code'],
      minShelfLife: parseInt(item['Minimum Shelf Life (Days)'], 10),
      maxShelfLife: parseInt(item['Maximum Shelf Life (Days)'], 10),
    };
  }
  return null;
}

function setReminder(itemDetails, token) {
  const purchaseDate = new Date();
  const expirationDate = new Date(purchaseDate);
  expirationDate.setDate(purchaseDate.getDate() + itemDetails.minShelfLife);

  const task = {
    title: `Reminder to consume ${itemDetails.classC}`,
    notes: `Item: ${itemDetails.classC}\nClass A: ${itemDetails.classA} (Code: ${itemDetails.codeA})\nClass B: ${itemDetails.classB} (Code: ${itemDetails.codeB})\nClass C: ${itemDetails.classC} (Code: ${itemDetails.codeC})\nExpires on: ${expirationDate.toDateString()}`,
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

      parseShelfLifeCSV().then(() => {
        cartItems.forEach(item => {
          const itemDetails = findItemDetails(item.name);  // Adjusted to use item.name
          if (itemDetails) {
            setReminder(itemDetails, token);
          } else {
            console.log(`No shelf life data found for ${item.name}`);
          }
        });

        sendResponse({ success: true });
      });
    });

    return true; // Keeps the message channel open for async sendResponse
  } else if (request.action === 'getCartItems') {
    console.log('Returning cart items:', cartItems);
    sendResponse({ items: cartItems });
  }
});
