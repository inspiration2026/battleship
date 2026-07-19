# Battleship

A modern, fully-featured Battleship game built with vanilla JavaScript.

<image-card alt="Battleship Game Screenshot" src="./screenshot.png" ></image-card>

## 🎮 Features

- **Drag & Drop** ship placement
- **Random Placement** button for quick human ship setup
- **Advanced AI** with "Hunt Mode" — a smart targeting algorithm that hunts for ships after a hit
- Ship rotation (using double click)
- Real-time **overlap prevention** and **boundary checking**
- Clean, responsive interface with win/lose screens
- **Blocked sectors** around ships (no adjacent ships)
- Reset ships functionality during placement phase

## ✨ Highlight Features

- **Smart Human Placement**: Click the **"Random"** button to instantly place all your ships validly
- **Intelligent AI Opponent**: 
  - Uses probability-based targeting
  - Switches to **Hunt Mode** after hitting a ship to efficiently sink it
  - Never makes illegal moves
- Fully working drag & drop with validation
- Beautiful UI feedback

## 🛠️ Technologies Used

- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Modular OOP design

## 📁 Project Structure

battleship/
├── src/
│   ├── _tests_/                    
│   │   ├── gameboard.test.js
│   │   ├── player.test.js
│   │   └── ship.test.js
│   ├── models/
│   │   ├── gameboard.js
│   │   ├── player.js
│   │   └── ship.js
│   ├── styles/
│   │   └── style.css
│   ├── appController.js
│   ├── index.js
│   ├── template.html
│   └── ui.js
├── .gitignore
├── babel.config.js
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
├── screenshot.png
└── webpack.config.js


## 🎯 How to Play

11. Place your ships on your board:
   - Drag & drop from the shipyard, **or**
   - Click the **"Random"** button for instant valid placement
2. Press **"Start Game"** when all ships are placed
3. Click on the enemy grid to attack
4. First to sink all opponent ships wins!

**Pro tip:** Use the **Double Click** while in a ship yard to rotate ships.

## 🚀 Getting Started

### Prerequisites
- Node.js and npm

### Running Locally

npm run build      # Build with webpack
npm start          # Open in browser (if using webpack-dev-server)

## 🧪 Testing
npm test           # Run Jest tests

## 🧪 Future Improvements

- Sound effects & animations
- Multiple AI difficulty levels
- Statistics & score tracking
- Online multiplayer (future)

## 📝 Author

**Roman Suslov**  
Personal project / The Odin Project curriculum

---