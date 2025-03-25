# Weather App

This is a weather application built with [Next.js](https://nextjs.org), [React](https://reactjs.org), and [Flask](https://flask.palletsprojects.com/). It provides current weather and forecast information for various locations, along with a chatbot feature to interact with the app.

---

## Features

- **Weather Information**: View current weather and a 5-day forecast for selected locations.
- **Interactive Map**: Displays the selected location on a map.
- **Chatbot**: Ask the chatbot for weather information or general queries.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/) (v3.9 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [pip](https://pip.pypa.io/en/stable/) (comes with Python)
- [OpenWeather API Key](https://openweathermap.org/api) (required for weather data)
- [Google Maps API Key](https://developers.google.com/maps) (required for map integration)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swan0094/weather-app
cd weather-app
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```
OPEN_WEATHER_API_KEY=your_openweather_api_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace `your_openweather_api_key` and `your_google_maps_api_key` with your actual API keys.

---

### 3. Install Dependencies

#### Frontend (React/Next.js)

```bash
npm install
```

#### Backend (Flask)

Navigate to the `server` directory:

```bash
cd server
pip install -r requirements.txt
```

---

### 4. Run the Application

#### Start the Backend Server

From the `server` directory, run:

```bash
python server.py
```

The backend server will start on `http://127.0.0.1:8080`.

#### Start the Frontend

Navigate back to the root directory and run:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`.

---

## Usage

### Viewing Weather Information

1. Open the app in your browser at [http://localhost:3000](http://localhost:3000).
2. Select a location from the list to view its current weather and 5-day forecast.
3. Use the "Clear" button to reset the weather information.

### Using the Chatbot

1. Interact with the chatbot at the bottom of the page.
2. Ask questions like:
   - "What's the weather in London?"
   - "Show me the forecast for New York."
3. The chatbot will respond with the requested weather information.

---

## Project Structure

```
.
├── components/         # React components for the UI
├── models/             # TypeScript models for weather data
├── pages/              # Next.js pages
├── server/             # Flask backend
├── styles/             # CSS styles
├── utils/              # Utility functions and chatbot logic
├── .env                # Environment variables
├── package.json        # Frontend dependencies and scripts
├── requirements.txt    # Backend dependencies
└── tsconfig.json       # TypeScript configuration
```

---

## Troubleshooting

- **Missing API Keys**: Ensure your `.env` file contains valid API keys.
- **CORS Issues**: If the frontend cannot communicate with the backend, check the CORS settings in `server/server.py`.
- **Dependency Errors**: Ensure all dependencies are installed using `npm install` and `pip install -r requirements.txt`.

---

## Acknowledgments

- [OpenWeather API](https://openweathermap.org/api) for weather data.
- [Google Maps API](https://developers.google.com/maps) for map integration.
- [React Chatbot Kit](https://fredrikoseberg.github.io/react-chatbot-kit-docs/) for the chatbot functionality.
