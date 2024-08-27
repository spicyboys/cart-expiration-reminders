# cart-expiration-reminders
This Chrome extension enhances your H-E-B online shopping experience by collecting items from your cart and setting reminders to consume them before they expire.

## Features

* **Collects Cart Items:** When you visit your H-E-B cart page (https://www.heb.com/*), the extension extracts the names of the items you've added.
* **Matches with Shelf Life Data:** It cross-references your cart items with a local database (shelf-life-reference.csv) to find estimated shelf life information.
* **Sets Google Tasks Reminders:** Using the Google Tasks API, the extension creates reminders for each item, notifying you when to consume them before they potentially expire.

## Installation

1. **Download the Extension:** Download the extension files from [link-to-your-repository](link-to-your-repository).
2. **Load as Unpacked Extension:** In Chrome, go to chrome://extensions/, enable "Developer mode", and click "Load unpacked". Select the folder containing the extension files.

## Usage

1. **Shop on H-E-B:** Add items to your cart as you normally would on the H-E-B website.
2. **Open the Extension Popup:** Click the extension icon in your browser toolbar. The popup will display the number of items in your cart.
3. **Set Reminders:** Click the "Set Reminders" button to create Google Tasks reminders based on the estimated shelf life of your cart items.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the extension.

## License

This project is licensed under the MIT License.

## Disclaimer

* **Shelf Life Accuracy:** The shelf life information is based on estimates and may vary depending on storage conditions and specific product variations.
* **Google Account Required:** You need to be logged into a Google account in Chrome to use the reminder feature.
