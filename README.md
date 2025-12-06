# 31Golfers

[![CI](https://github.com/nadmanfaisal/31Golfers/actions/workflows/build.yml/badge.svg)](https://github.com/nadmanfaisal/31Golfers/actions/workflows/build.yml)
[![CD](https://github.com/nadmanfaisal/31Golfers/actions/workflows/push.yml/badge.svg)](https://github.com/nadmanfaisal/31Golfers/actions/workflows/push.yml)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/nadmanfaisal/31Golfers)](https://github.com/nadmanfaisal/31Golfers/releases)


**31Golfers** is a comprehensive golf game tracking and scheduling application designed to enhance the golfing experience. Whether you're a casual player or a serious golfer, this app helps you track your games, manage scores, and stay updated with course-specific weather forecasts. It features robust offline capabilities, ensuring you can continue your game even without an internet connection.

## Features

*   **User Authentication**: Secure sign-up and login functionality.
*   **Guest Mode**: Jump straight into a game without an account. Games are stored locally and can be synced later.
*   **Game Management**: Create new games, add players, and track strokes hole-by-hole.
*   **Offline Support**: Seamlessly create and finish games while offline. Changes are automatically synchronized when you're back online.
*   **Game History**: View past games, scores, and performance statistics.
*   **Weather Integration**: Get real-time and forecasted weather updates tailored to specific golf courses.
*   **Cross-Platform**: Built with Expo to run smoothly on both Android and iOS devices.

## Tech Stack

### Frontend
*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
*   **Styling**: React Native StyleSheet
*   **State Management/Networking**: React Context, Axios

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: JWT (JSON Web Tokens)
*   **Scheduling**: node-cron (for background tasks like weather updates)

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Expo Go app](https://expo.dev/client) on your mobile device (for testing)
*   A running instance of MongoDB (local or cloud-hosted via MongoDB Atlas)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nadmanfaisal/31Golfers.git
cd 31Golfers
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and add your environment variables:

```env
PORT=3000
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/31golfers?retryWrites=true&w=majority"
JWT_SECRET="your_super_secret_key"
WEATHER_API_KEY="your_weather_api_key"
```

Generate the Prisma client:

```bash
npx prisma generate
```

Start the backend server:

```bash
npm run dev
# or for production
npm start
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend` directory if required (e.g., for API Base URL):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Start the Expo development server:

```bash
npx expo start
```

### 4. Running the App

*   After running `npx expo start`, you will see a QR code in your terminal.
*   Scan the QR code with the **Expo Go** app on your Android or iOS device.
*   Alternatively, you can press `a` to run on an Android Emulator or `i` to run on an iOS Simulator.

## Project Structure

*   **/backend**: Contains the Node.js/Express API, database schema, and server logic.
    *   `src/api`: API routes and controllers.
    *   `src/database`: Prisma schema and database connection logic.
    *   `src/jobs`: Background jobs (e.g., weather fetching).
*   **/frontend**: Contains the React Native Expo application.
    *   `app`: Expo Router file-based routing structure.
    *   `components`: Reusable UI components.
    *   `hooks`: Custom React hooks.
    *   `api`: Frontend API integration services.
