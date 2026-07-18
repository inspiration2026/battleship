import { Ship } from "./ship.js";

export class Gameboard {
    constructor () {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.missed = new Set();
        this.hits = new Set();
        this.blockedSectorsShipPlacement = new Set();
        this.attackedBlocked = new Set();
    }

    placeShip (ship, head, direction) {
        const x = head[0];
        const y = head[1];
    // Checks
        if (x <0 || x >9 || y <0 || y >9) return; false
        let error = false;

        if (direction === "horizontal" && x + ship.size -1 > 9) return false;
        if (direction === "vertical" && y + ship.size -1 > 9) return false;
    


        // Overlap check
        if (direction === "horizontal") {
            for (let i = 0; i < ship.size; i++) {
                if (this.board[x + i][y] !== null) {
                    error = true;
                    break;
                }
            }
        } else if (direction === "vertical") {
            for (let i = 0; i < ship.size; i++) {
                if (this.board[x][y + i] !== null) {
                    error = true;
                    break;
                }
            }
        }

        if (direction === "horizontal") {
            for (let i = 0; i<ship.size; i++) {
                if (this.blockedSectorsShipPlacement.has(`${x+i},${y}`)) {
                    error = true;
                    break;
                }
            }
        } else if (direction === "vertical") {
            for(let i = 0; i<ship.size; i++) {
                if (this.blockedSectorsShipPlacement.has(`${x},${y+i}`)) {
                        error = true;
                        break;
                    }
            }
        }

        
        if (error) return false;

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
        return true;

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

        if (this.attackedBlocked.has(x,y)) {
            return false;
        }

        if (this.board[x][y] === null) {
            this.missed.add(`${x},${y}`);
            return false;
        } else {
            if (this.hits.has(`${x},${y}`)) {
                return false
                } else {
                    const ship = this.board[x][y];
                    ship.hit();
                    this.hits.add(`${x},${y}`);
                    return true;
                };
        }
    }


    areAllSunk () {
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
    const [x, y] = coordinates;
    const offsets = [
        [0, 0], [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];

        for (const [dx, dy] of offsets) {
            this.blockedSectorsShipPlacement.add(`${x + dx},${y + dy}`);
        }
    }

    findAllShipCoords(coordinates) {
        let [x, y] = coordinates;
        const ship = this.board[x][y];
        
        if (!ship) return { shipCoordinates: [], blockedCoordinates: [] };

        const shipCoords = [];
        const blockedCoords = new Set();        // using Set to avoid duplicates
        const offsets = [
            [0, 0], [1, 0], [1, 1], [0, 1], [-1, 1],
            [-1, 0], [-1, -1], [0, -1], [1, -1]
        ];

        let currentX = x;
        let currentY = y;

        shipCoords.push([currentX, currentY]);

        for (let l = 1; l < ship.size; l++) {
            let found = false;

            for (const [dx, dy] of offsets) {
                const nx = currentX + dx;
                const ny = currentY + dy;

                if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue;

                if (this.board[nx][ny] === ship) {
                    const alreadyAdded = shipCoords.some(c => c[0] === nx && c[1] === ny);
                    if (!alreadyAdded) {
                        shipCoords.push([nx, ny]);
                        currentX = nx;
                        currentY = ny;
                        found = true;
                        break;
                    }
                }
            }

            if (!found) break;
        }

        // === BLOCKED COORDS LOGIC ===
        for (const [sx, sy] of shipCoords) {
            for (const [dx, dy] of offsets) {
                const bx = sx + dx;
                const by = sy + dy;
                if (bx >= 0 && bx < 10 && by >= 0 && by < 10) {
                    blockedCoords.add(`${bx},${by}`);
                    // console.log(blockedCoords);
                }
            }
        }

        for (const pos of blockedCoords) {
            this.attackedBlocked.add(pos);
        }

        // Remove ship cells from blocked
        for (const [sx, sy] of shipCoords) {
            blockedCoords.delete(`${sx},${sy}`);
        }

        return {
            shipCoordinates: shipCoords, 
            blockedCoordinates: Array.from(blockedCoords)
        };
    }
}
