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
   
    this.setupShips(this.player1);
    this.setupShips(this.player2);
    
    UI.createPlayground();
    UI.createBoard(1);
    UI.createBoard(2);

    UI.renderGameboard(this.player1.gameboard, 1, true);
    UI.renderGameboard(this.player2.gameboard, 2, false);

    UI.addAttackListeners((coordinates) => {
    this.makeAttack(coordinates);
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
            console.log("Game Over! Winner:", this.activePlayer.type);
            return;
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


}