import { Ship } from "./ship.js";

export class Gameboard {
    constructor () {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.missed = new Set();
        this.hits = new Set();
        this.blockedSectors = new Set();
    }

    placeShip (ship, head, direction) {
        const x = head[0];
        const y = head[1];
    // Checks
        if (x <0 || x >9 || y <0 || y >9) return;
        let error = false;

        if ((direction === "horizontal" && x+ship.size >9) ||
         ((direction === "vertical") && y+ship.size >9)) {
            return;
        if (direction === "horizontal")  {
            for (let i = 0; i<ship.size; i++) {
                if (this.board[x+i][y] !== null) {
                    error = true;
                    break;
                }
            }
            } else if (direction === "vertical") {
                for(let i = 0; i<ship.size; i++) {
                    if (this.board[x][y+i] !== null) {
                        error = true;
                        break;
                    }
                };
            };
        };

        if (direction === "horizontal") {
            for (let i = 0; i<ship.size; i++) {
                if (this.blockedSectors.has(`${x+i},${y}`)) {
                    error = true;
                    break;
                }
            }
        } else if (direction === "vertical") {
            for(let i = 0; i<ship.size; i++) {
                if (this.blockedSectors.has(`${x},${y+i}`)) {
                        error = true;
                        break;
                    }
            }
        }

        
        if (error) return;

    // Placement of the ship
        for(let i = 0; i<ship.size; i++) {
            if (direction === "horizontal") {
                this.board[x+i][y] = ship;
                this.addBlockSectors([x+i,y]);
            }
            if (direction === "vertical") {
                this.board[x][y+i] = ship;
                this.addBlockSectors([x,y+i]);
            }
        }

        this.ships.push(ship);

    }

    hasShipAt (coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];

        if (this.board[x][y] !== null) {
            return true
        } else return false;
        
    }

    receiveAttack (coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];

        if (this.board[x][y] === null) {
            this.missed.add(`${x},${y}`);
            return false;
        } else {
            if (this.hits.has(`${x},${y}`)) {
                return
                } else {
                    const ship = this.board[x][y];
                    ship.hit();
                    if (ship.isSunk()) return ("Ship is Sunk");
                    this.hits.add(`${x},${y}`);
                    return true;
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

    addBlockSectors (coordinates) {
        const x = coordinates[0] ;
        const y = coordinates[1];

        const positions = [];
        positions.push (`${x},${y}`);
        positions.push (`${x+1},${y}`);
        positions.push (`${x+1},${y+1}`);
        positions.push (`${x},${y+1}`);
        positions.push (`${x-1},${y+1}`);
        positions.push (`${x-1},${y}`);
        positions.push (`${x-1},${y-1}`);
        positions.push (`${x},${y-1}`);
        positions.push (`${x+1},${y-1}`);


        for (let pos of positions) {
            if (!this.blockedSectors.has(pos)) {
                this.blockedSectors.add(pos);
            }
            
        }
    }
}