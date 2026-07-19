import { Player } from "./models/player";
import { Gameboard } from "./models/gameboard";
import { Ship } from "./models/ship";
import {UI} from "./ui.js"

export class Controller {
    constructor () {
        this.player1 = new Player('human');
        this.player2 = new Player('computer');
        this.activePlayer = this.player1;
        this.passivePlayer = this.player2;
        this.isProcessingAttack = false;
        this.huntMode = false;
        this.huntTarget = null;

        this.startingGame();
        
    }


startingGame() {

    this.player2.randomShipPlacement();

    const p1Board = this.player1.gameboard;
    const p2Board = this.player2.gameboard;
    
    UI.showScreen('start-screen');

    this.setupResetListener();
    this.setupRandomListener();
    
    
    UI.initStartScreen(() => {
        console.log("Start button clicked - creating boards...");
  
        UI.showScreen('game-screen');

        UI.createBoard(1);

        UI.renderGameboard(p1Board, 1, true);
        UI.createShipYard();
        UI.makeShipsDraggable();
        UI.makeBoardDroppable();

        UI.initGameScreen(() => {
            if (this.player1.gameboard.ships.length < 10) {
                console.log ("Please place All your ships !!!");
                UI.errorMessage ();
                return;
            }
            console.log("Start button clicked - initiating Battle...");
            UI.createBoard(2);
            UI.renderGameboard(p2Board, 2, false);
            UI.hideShipYard();

            UI.addAttackListeners((coordinates) => {
                this.makeAttack(coordinates);
            });
        })
    });

    UI.initWinScreen();
    UI.initLoseScreen();

    // this.resetPositionsListener ();

    window.addEventListener('ship to place', (e) => {
        const data = e.detail;
        console.log("Data received:", data.head, data.size, data.orientation);

        const ship = new Ship (data.size);
        const placeShip = this.player1.gameboard.placeShip (ship, data.head, data.orientation);

        if (placeShip) {
            console.log ('Ship placed');
            console.log (this.player1.gameboard.ships)
            UI.removeShipFromTheYard();   
            UI.renderGameboard(p1Board, 1, true);
        } else console.log ('not placed !')

    });

}



setupShips(player) {
    

    const configs = [
            {size: 4, head: [5,0], dir: 'horizontal'},
            {size: 3, head: [0,2], dir: 'vertical'},
            {size: 3, head: [7,3], dir: 'horizontal'},
            {size: 2, head: [0,0], dir: 'horizontal'},
            {size: 2, head: [4,5], dir: 'vertical'},
            {size: 2, head: [3,8], dir: 'vertical'},
            {size: 1, head: [9,6], dir: 'horizontal'},
            {size: 1, head: [6,7], dir: 'horizontal'},
            {size: 1, head: [9,9], dir: 'horizontal'},
            {size: 1, head: [7,9], dir: 'horizontal'},
        ];

        configs.forEach(cfg => {
            const ship = new Ship(cfg.size);
            player.gameboard.placeShip(ship, cfg.head, cfg.dir);
        });
}

switchPlayer() {
    [this.activePlayer, this.passivePlayer] = [this.passivePlayer, this.activePlayer];
}

makeAttack(coordinates) {
    console.log(`blocked sectors`, this.activePlayer.type, this.passivePlayer.gameboard.attackedBlocked);
    if (this.isProcessingAttack) return;
    this.isProcessingAttack = true;

    const result = this.passivePlayer.gameboard.receiveAttack(coordinates);

    const playerNum = this.passivePlayer === this.player2 ? 2 : 1;
    UI.renderAction(this.passivePlayer.gameboard, playerNum);

    if (result) {
        const ship = this.passivePlayer.gameboard.board[coordinates[0]][coordinates[1]];
        
        if (ship) {
            if (this.activePlayer.type === 'computer') {
            this.activePlayer.registerHit(coordinates[0], coordinates[1]);
            }
        }

        if (ship && ship.isSunk()) {
            if (this.activePlayer.type === 'computer') {
                this.activePlayer.resetHuntMode();
            }

            const resultData = this.passivePlayer.gameboard.findAllShipCoords(coordinates);
            UI.renderSunkShip(playerNum, resultData.shipCoordinates);
            UI.renderBlockedCells(playerNum, resultData.blockedCoordinates);
        }

        if (this.checkWin()) {
            this.isProcessingAttack = true;
            if (this.activePlayer.type === 'human') {
            console.log("Congratulations! Winner:", this.activePlayer.type);
            UI.showScreen('win-screen');
            return;
            } else {
                console.log("Game Over! Winner:", this.activePlayer.type);
                UI.showScreen('lose-screen');
                return;
            }
        }

    } else {
        this.switchPlayer();
    }

    if (this.activePlayer.type === 'computer') {
        setTimeout(() => {
            let coords = this.activePlayer.makeBestAttack(this.passivePlayer.gameboard);

            while (this.passivePlayer.gameboard.attackedBlocked.has(`${coords[0]},${coords[1]}`)) {
                coords = this.activePlayer.makeBestAttack(this.passivePlayer.gameboard);
            }
            this.isProcessingAttack = false;
            this.makeAttack(coords);
        }, 1000);
    } else {
        this.isProcessingAttack = false;
    }
}

checkWin() {
    return this.passivePlayer.gameboard.areAllSunk();
}

setupResetListener() {
    const resetBtn = document.getElementById('reset-ships-btn');

    if (!resetBtn) {
        console.warn('Reset button not found in DOM');
        return;
    }

    resetBtn.addEventListener ('click', (e) => {
        this.resetPlayerShips();
    })
}

resetPlayerShips() {
    

    console.log("Resetting player ships...");

    this.player1.resetShips();

    // Refresh UI
    UI.clearGameboard();
    UI.renderGameboard(this.player1.gameboard, 1, true);
    UI.clearShipYard(); 
    UI.createShipYard();
    UI.makeShipsDraggable();
    
    console.log("Ships reset complete");
}

setupRandomListener() {
    console.log('initiated!')
    const randomBtn = document.getElementById('random-btn');

    if (!randomBtn) {
        console.warn('Random button not found in DOM');
        return;
    }

    randomBtn.addEventListener ('click', () => {
        if (this.player1.gameboard.ships.length === 0) {
            console.log('if');
            this.player1.randomShipPlacement();
            UI.renderGameboard(this.player1.gameboard, 1, true);
            UI.clearShipYard(); 

        } else {
            this.player1.resetShips();
            UI.clearGameboard();
            UI.clearShipYard(); 

            this.player1.randomShipPlacement();
            UI.renderGameboard(this.player1.gameboard, 1, true);
            console.log ("else");
        }
    })
}


}