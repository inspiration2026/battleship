import { Gameboard } from "./gameboard"
import { Ship } from "./ship";

export class Player {
    constructor (type) {
        this.gameboard = new Gameboard;
        this.type = type;
    }


    makeRandomAttack(opponentGameboard) {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100; // safety

    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        attempts++;
    } while (
        attempts < maxAttempts && 
        (opponentGameboard.hits.has(`${x},${y}`) || 
         opponentGameboard.missed.has(`${x},${y}`))
    );

    return [x, y];
    }


}