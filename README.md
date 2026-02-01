# Tilt-Control Game

## Running the Application

This game is designed to be played on a **physical mobile device** using **Expo Go**, as it relies on the phone’s gyroscope for movement control.

1. Open the Expo Snack link in your browser:  
   https://snack.expo.dev/@johnshadwell/shadwelltiltgameapp  

2. Install the **Expo Go** app on your phone (iOS or Android).

3. Scan the QR code on the Snack page or open the project directly in Expo Go.

4. **How to play:**
   - Tilt your phone to move the player character around the screen.
   - Avoid falling obstacles that spawn and increase in difficulty over time.
   - Collect green score blocks to gain bonus points.
   - The game ends when the player collides with an obstacle.

> ⚠️ This app will not function properly in a browser emulator because gyroscope input is required. While it can be run locally, I recommend using Expo Snack for the smoothest experience.

---

## Overview

The Tilt-Control Game is a fast-paced mobile game where the player navigates a character by physically tilting their phone. The objective is to survive as long as possible while avoiding dynamically spawning obstacles and collecting score-boosting power-ups. The game progressively increases in difficulty and maintains a persistent leaderboard.

---

## Features

- Gyroscope-based player movement
- Real-time physics-driven gameplay
- Multiple obstacle types with different movement patterns
- Randomized obstacle spawning
- Collectible score blocks for bonus points
- Persistent top-3 leaderboard using local storage
- Increasing difficulty over time
- Game over detection with restart option

---

## Technology Stack

- **Framework:** React Native  
- **Platform:** Expo  
- **Languages:** JavaScript  
- **Libraries & Tools:**  
  - `react-native-game-engine`  
  - `expo-sensors` (Gyroscope)  
  - `AsyncStorage` for persistent leaderboard data  
  - `react-native-responsive-fontsize`  
  - React Hooks (`useState`, `useEffect`)  

---

## Implementation Details

- Player movement is controlled by gyroscope data, mapping tilt values to x and y position updates.
- The game loop runs continuously using `react-native-game-engine` to update positions and handle collisions.
- Multiple obstacle types are introduced as time progresses, each with unique movement behavior.
- Collision detection is handled manually using bounding box and radius checks.
- Difficulty increases over time by adjusting obstacle velocity and spawn frequency.
- A score block power-up randomly spawns and rewards bonus points upon collection.
- The top three scores are stored persistently using AsyncStorage and displayed as a leaderboard.

---

## Learning Outcomes

- Gained hands-on experience using real-time gyroscope sensor data
- Implemented a custom game loop in React Native
- Designed collision detection logic for multiple object types
- Learned to balance gameplay difficulty dynamically
- Improved understanding of performance considerations in continuous-update applications
- Practiced managing persistent state across game sessions

---

## Future Improvements

- Add sound effects and background music
- Include visual animations for collisions and power-ups
- Add difficulty modes or levels
- Implement pause and resume functionality
- Improve visual styling and UI feedback
- Add haptic feedback for collisions and power-ups

---

## Portfolio Context

This project demonstrates my ability to build real-time, sensor-driven mobile games using React Native. It highlights experience with motion-based input, game loop architecture, collision detection, and persistent leaderboard management, making it a strong example of interactive mobile development.
