# Hyg-Go

Hyg-Go is a streamlined travel planning application designed to simplify city travel by consolidating ticket purchases, event access, and personalised itineraries. With a focus on enhancing user experience, Hyg-Go offers features tailored to travelers, event creators, and businesses alike.

## Live Web App : [Hyg-go](https://hyg-go-one.vercel.app/)

PS: This is underdevelopment, if you want to keep track of updates register [here](https://hyg-go-one.vercel.app/register)

## Features

- **Centralized Travel Planning**: Purchase tickets, organize event access, and build personalized schedules in one place.
- **Track Plans**: Keep a secure log of all previous trips planned.
- **Streamline Flow Activities Scheduling**: Search for location, checkout activities list or map, add to basket and get optimized plan for your trip.
- **Track Time Occupied**: Progress bar indicating how full your trip is expected to be with activities selected.

## Technology Stack (Full project)

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Hosting**: Deployed on Digital Ocean VM

## Folder Structure (Front-End)
```arduino
hyg-go/
├── public/
├── src/
│   ├── components/
│   │   ├── base/ # **Reusable components** (E.g button, form) 
│   │   ├── sections/ # **Segregated sections used in pages** (E.g Header, Activity Modal)
│   ├── pages/
│   │   ├── CreatePlanPages/ # **Creating Plan Pages** (E.g Search Location, Activities Selection, Calendar)
│   │   ├── MainPage/ # **Travellers Main Pages** (E.g Planned Trips, Live Map, Wallet)
│   │   └── RegisterPage/ # **Early Access Page**
│   ├── styles/ # **Sass Globals** (E.g variables, animations, resets)
│   ├── utils/ # **Helper Functions** (E.g date formatting, api calls, localStorage)
│   ├── App.jsx # **App Routing**
│   └── main.jsx
├── .gitignore
├── package.json
├── README.md
└── package-lock.json
```

## Setup and Installation

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sid-lpcd/hyg-go.git
   cd hyg-go
   ```

2. **Install Dependencies**:
     ```bash
     npm install
     ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory with the following:
   ```env
   VITE_HYGGO_API_URL=<backend_local_url>
   VITE_HYGGO_API_URL_PRODUCTION=<backend_production_url>
   VITE_HYGGO_API_URL_WS=<websocket_local_url>
   VITE_HYGGO_API_URL_WSS_PRODUCTION=<websocket_production_url>
   VITE_MAPGL_API_KEY=<mapgl_api_key>
   VITE_ENV_TYPE=<production_or_devevelopment>
   ```

4. **Run the Application**:
     ```bash
     npm start
     ```

5. **Access the Application**:
   Navigate to `http://localhost:3000` in your browser.

## Contributions

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your branch.
4. Submit a pull request with a detailed description of your changes.

## License

Hyg-Go is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or feedback, reach out to [Sidonio Silva](https://github.com/sid-lpcd) or submit an issue on GitHub.
