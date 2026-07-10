import { Player } from "./models/player";
import { Gameboard } from "./models/gameboard";
import { Ship } from "./models/ship";

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
    this.setupShips(this.player2);



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
    this.passivePlayer.gameboard.receiveAttack(coordinates);
    
}



}