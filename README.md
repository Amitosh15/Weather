# Weather Project

A simple weather application that display current weather information for any city using the OpenWeatherMap API.

**Github Link**: https://github.com/Amitosh15/Weather

# Project Structure

Weather Project

- index.html => Main HTML file with layout
- style.css => Custom CSS style
- script.js => JavaScript for weather API functionality
- config.js => API configuration (gitignored)
- .gitignore => Git ignore rules

# Setup Instruction

**Open in browser**

- Simply open `index.html` in your web browser

# Technology Used

- **HTML5**: Sementic markup
- **CSS3**: Styling with Tailwind CSS
- **JavaScript**: API calling and DOM manipulation
- **Font Awesome**: Icon library
- **OpeanWeatherMap API**: Weather data source

# Description

**Index.html**

- Main HTML structure
- Navbar with search input and current location
- Weather card section for displaying weather
- Weather forecast section displays 5 days forecast
- Fontawesome CDN link for icons

# Style.css

- Responsive design code
- Custom styling

# script.js

- getWeather() - Fetch weather data
- getCity() - Fetch city cordinates
- Event listener for search button and enter key

# config.js

- API key stored in config.js which is ignored by git

# .gitignore

- Ignores: config.js
- Prevent sensitive files to being commited
