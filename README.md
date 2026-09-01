# Moloi Plumbers CC Website Template

Welcome to the Moloi Plumbers CC website template! This project provides a fully functional and interactive homepage for a plumbing company, designed to be easily customizable for client use.

## Project Structure

The project is organized as follows:

```
moloi-plumbers-template
├── src
│   ├── index.html           # Main HTML file for the web application
│   ├── components           # Contains reusable HTML components
│   │   ├── header.html      # Header section with logo and navigation
│   │   ├── hero.html        # Hero section with a call-to-action
│   │   ├── services.html    # Services offered by the company
│   │   └── footer.html      # Footer section with contact info
│   ├── css                  # Stylesheets for the website
│   │   ├── styles.css       # Main styles for layout and design
│   │   └── utilities.css     # Utility classes for quick styling
│   ├── js                   # JavaScript files for functionality
│   │   ├── main.js          # Main JavaScript file for initialization
│   │   ├── ui.js            # Handles user interface interactions
│   │   └── services.js      # Manages service data loading
│   ├── data                 # Contains data files
│   │   └── services.json    # Structured data about services
│   └── locales              # Localization files
│       └── en.json         # English localization strings
├── package.json             # npm configuration file
├── .gitignore               # Files to ignore in version control
└── README.md                # Project documentation
```

## Getting Started

To get started with the Moloi Plumbers CC website template, follow these steps:

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd moloi-plumbers-template
   ```

2. **Install Dependencies**: 
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the Application**: 
   You can use a local server to view the application. For example, you can use `live-server` or any other local server of your choice:
   ```bash
   npx live-server src
   ```

4. **Customize the Template**: 
   - Update the content in `src/components/header.html`, `src/components/hero.html`, and `src/components/services.html` to reflect your company's information.
   - Modify the styles in `src/css/styles.css` and `src/css/utilities.css` as needed.
   - Update the service offerings in `src/data/services.json`.

## Features

- Responsive design suitable for all devices.
- Easy-to-update components for quick customization.
- JavaScript functionality for dynamic content and user interactions.
- Localization support for future language adaptations.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Feel free to reach out if you have any questions or need further assistance!