import { Ship } from "./ship.js";

export class Gameboard {
    constructor () {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.missed = new Set;
        this.hits = new Set;
    }

    placeShip (ship, head, direction) {
    // Checks
        if (head[0] <0 || head[0] >9 || head[1] <0 || head[1] >9) return;
        let error = false;

        if ((direction === "horizontal" && head[0]+ship.size >9) ||
         ((direction === "vertical") && head[1]+ship.size >9)) {
            return;
        if (direction === "horizontal")  {
            for (let i = 0; i<ship.size; i++) {
                if (this.board[head[1]][head[0]+i] !== null) {
                    error = true;
                    break;
                }
            }
            } else if (direction === "vertical") {
                for(let i = 0; i<ship.size; i++) {
                    if (this.board[head[1]+i][head[0]] !== null) {
                        error = true;
                        break;
                    }
                };
            };
        };

        if (error) return;

    // Placement of the ship
        for(let i = 0; i<ship.size; i++) {
            if (direction === "horizontal") {
                this.board[head[1]][head[0]+i] = ship;
            }
            if (direction === "vertical") {
                this.board[head[1]+i][head[0]] = ship;
            }
        }

        this.ships.push(ship);
    
    }

    hasShipAt (coordinates) {
        if (this.board[coordinates[1]][coordinates[0]] !== null) {
            return true
        } else return false;
        
    }

    receiveAttack (coordinates) {
        if (this.board[coordinates[1]][coordinates[0]] === null) {
            this.missed.add(`${coordinates[1]},${coordinates[0]}`);
            return;
        } else {
            if (this.hits.has(`${coordinates[1]},${coordinates[0]}`)) {
                return
                } else {
                    const ship = this.board[coordinates[1]][coordinates[0]];
                    ship.hit();
                    if (ship.isSunk()) return ("Ship is Sunk");
                    this.hits.add(`${coordinates[1]},${coordinates[0]}`);
                };
        }
    }


    areAllSunk () {
        // if (this.hits.size >= 20) {
        //     return true
        // } else return false;
        let n = 0;
        this.ships.forEach ((ship) => {
            if (ship.isSunk()) {
                n++;
            }
        })
        if (n === this.ships.length) {
            return true
            } else return false;
    }
}