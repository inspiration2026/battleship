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

        this.startingGame();
        
    }


startingGame() {
   
    this.setupShips(this.player1);
    console.log("Total ships placed:", this.player1.gameboard.ships.length);
    console.log("ships", this.player1.gameboard.board);
    
    UI.createPlayground();

    UI.createBoard(1);
    UI.createBoard(2);

    UI.renderGameboard(this.player1.gameboard, 1);
    this.setupShips(this.player2);
    UI.renderGameboard(this.player2.gameboard, 2);

    
    this.makeAttack([0,2]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);

    this.makeAttack([1,2]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);

    this.makeAttack([1,2]);

    UI.renderAction (this.player2.gameboard, 1, this.player1.gameboard.hits, this.player1.gameboard.missed);

    this.makeAttack([0,3]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);

    this.makeAttack([0,4]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);

    this.makeAttack([6,7]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);

    this.makeAttack([3,8]);

    UI.renderAction (this.player2.gameboard, 2, this.player2.gameboard.hits, this.player2.gameboard.missed);
    


}



setupShips(player) {
    let ship = new Ship(4);
    player.gameboard.placeShip(ship, [5,0], 'horizontal');
    ship = new Ship(3);
    player.gameboard.placeShip(ship, [0,2], 'vertical');
    ship = new Ship(3);
    player.gameboard.placeShip(ship, [7,3], 'horizontal');
    ship = new Ship(2);
    player.gameboard.placeShip(ship, [0,0], 'horizontal');
    ship = new Ship(2);
    player.gameboard.placeShip(ship, [4,5], 'vertical');
    ship = new Ship(2);
    player.gameboard.placeShip(ship, [3,8], 'vertical');
    ship = new Ship(1);
    player.gameboard.placeShip(ship, [9,6], 'horizontal');
    ship = new Ship(1);
    player.gameboard.placeShip(ship, [6,7], 'horizontal'); 
    ship = new Ship(1);
    player.gameboard.placeShip(ship, [9,9], 'horizontal');
    ship = new Ship(1);
    player.gameboard.placeShip(ship, [7,9], 'horizontal');

    
}

switchPlayer() {
    if (this.activePlayer === this.player1) {
        this.activePlayer = this.player2
        this.passivePlayer = this.player1;
    } else {
        this.activePlayer = this.player1;
        this.passivePlayer = this.player2;
    }
}

makeAttack(coordinates) {
    const attack = this.passivePlayer.gameboard.receiveAttack(coordinates);
    if (attack) {
        const ship = this.passivePlayer.gameboard.board[coordinates[0]][coordinates[1]];
        if (ship.isSunk()) {
            if (this.activePlayer === this.player1) {
                UI.renderSunkShip(2, coordinates);
            } else {UI.renderSunkShip(1, coordinates);}
        }
        return true
    } else {
        this.switchPlayer();
        return false
    };
    
}



}