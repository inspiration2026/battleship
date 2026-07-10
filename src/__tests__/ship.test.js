import { Ship } from "../models/ship.js";

describe('Ship tests', () => {
    test('Creates ship with correct length 2', () => {
        const ship = new Ship (2);
        expect(ship.size).toBe(2);   
    });
    test('Creates ship with correct length 4', () => {
        const ship = new Ship (4);
        expect(ship.size).toBe(4);
    });
    test('Check function hit', () => {
        const ship = new Ship (4);
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    })
    test('Check function Sunk', () => {
        const ship = new Ship (3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })

    test('Check function Sunk 2', () => {
        const ship = new Ship (4);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    })
});