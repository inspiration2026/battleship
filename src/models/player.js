import { Gameboard } from "./gameboard"
import { Ship } from "./ship";

export class Player {
    constructor (type) {
        this.gameboard = new Gameboard;
        this.type = type;
        this.huntMode = false;
        this.huntHits = [];
    }

    makeBestAttack(gameboard) {
    console.log("makeBestAttack called, huntMode:", this.huntMode, "hits count:", this.huntHits.length); // debug

    if (this.huntMode && this.huntHits.length > 0) {
        return this.makeSmartAttack(gameboard);
    } else {
        return this.makeRandomAttack(gameboard);
    }
}

    makeRandomAttack(opponentGameboard) {
    let x, y, key;
    let attempts = 0;
    const maxAttempts = 300; // safety

    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        key = `${x},${y}`
        attempts++;
    } while (
        attempts < maxAttempts && 
        (opponentGameboard.hits.has(key) || 
        opponentGameboard.missed.has(key) ||
        opponentGameboard.attackedBlocked.has (key)
        )
    );

    return [x, y];
    }

    makeSmartAttack(gameboard) {
        // Try to continue in line if we have 2+ hits
        if (this.huntHits.length >= 2) {
            const direction = this.getShipDirection();
            if (direction) {
                const last = this.huntHits[this.huntHits.length - 1];
                const [dx, dy] = direction;

                let nx = last.x + dx;
                let ny = last.y + dy;

                // Try forward
                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                    const key = `${nx},${ny}`;
                    if (!gameboard.hits.has(key) && !gameboard.missed.has(key)) {
                        return [nx, ny];
                    }
                }

                // Try backward from first hit
                const first = this.huntHits[0];
                nx = first.x - dx;
                ny = first.y - dy;

                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                    const key = `${nx},${ny}`;
                    if (!gameboard.hits.has(key) && !gameboard.missed.has(key)) {
                        return [nx, ny];
                    }
                }
            }
        }

        // Simple adjacent search if no direction detected yet
        const directions = [[1,0], [-1,0], [0,1], [0,-1]];
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const last = this.huntHits[this.huntHits.length - 1];
            const nx = last.x + dx;
            const ny = last.y + dy;

            if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue;

            const key = `${nx},${ny}`;
            if (!gameboard.hits.has(key) && !gameboard.missed.has(key)) {
                return [nx, ny];
            }
        }

        // Fallback
        return this.makeRandomAttack(gameboard);
    }

    getShipDirection() {
        if (this.huntHits.length < 2) return null;

        const first = this.huntHits[0];
        const second = this.huntHits[1];

        const dx = second.x - first.x;
        const dy = second.y - first.y;

        return [dx, dy];
    }

    // Call this when we hit something
    registerHit(x, y) {
        this.huntHits.push({ x, y });
        this.huntMode = true;
        console.log ("hunt hits" , this.huntHits)
    }

    // Call this when ship is sunk
    resetHuntMode() {
        this.huntMode = false;
        this.huntHits = [];
    }

    randomShipPlacement() {
        const shipsSizes = [4,3,3,2,2,2,1,1,1,1];
        let x, y, key, direction;
        let attempts = 0;
        let placed = false;
        const maxAttempts = 300; // safety


        shipsSizes.forEach ((size) => {
            const ship = new Ship(size);
            direction = (Math.random() < 0.5 ) ? 'horizontal' : 'vertical';

            console.log(direction);

            while (!placed && attempts < maxAttempts) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            key = `[${x},${y}]`;
            attempts++;
            console.log ('attempts')
           
            placed = this.gameboard.placeShip(ship, [x,y], direction);
    
            if (!placed) {
                console.log(`Attempt ${attempts} failed for size ${size}`);
            }
            }

            if (placed) {
                console.log(`✓ Ship placed: size ${size} at ${key} (${direction})`);
                placed = false;
                attempts = 0;
                } else {
                    console.error(`Failed to place ship of size ${size} after ${maxAttempts} attempts`);
                    return false; // or handle failure
                }

        });

        return true;
    }

    resetShips() {
        if (this.gameboard) {
            this.gameboard.resetGameboard();
        }
        console.log(`${this.type || 'Player'} ships reset`);
        return this;
    }


}