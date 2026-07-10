import {Gameboard} from "../models/gameboard.js"
import { Ship } from "../models/ship.js";

describe ('Tests for placement', () => {
    let ship;
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship(3);
        gameboard.placeShip(ship, [1,1], 'horizontal');
    });

    test ('Ship placement Head', () => {
        expect(gameboard.hasShipAt([1,1])).toBe(true);
    });
    test ('Ship placement Tail', () => {
        expect(gameboard.hasShipAt([3,1])).toBe(true);
    });
    test ('Ship placement (No Ship)', () => {
        expect(gameboard.hasShipAt([4,1])).toBe(false);
    });
});

describe ('Tests for Receive/Miss attack', () => {
    let ship;
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship(2);
        gameboard.placeShip(ship,[2,1],'horizontal');
    });

    test ('Hit', () => {
        gameboard.receiveAttack([2,1]);
        expect(ship.hits).toBeGreaterThan(0);
    });
    test ('Hit same square', () => {
        gameboard.receiveAttack([2,1]);
        gameboard.receiveAttack([2,1]);
        expect(ship.hits).toBe(1);
    });
    test ('Miss', () => {
        gameboard.receiveAttack([4,1]);
        expect(ship.hits).toBe(0);
    });
    test ('Miss tracking', () => {
        gameboard.receiveAttack([4,1]);
        expect(gameboard.missed).toContain("1,4");
    });
});

describe ('Sunk report', () => {
    let ship;
    let ship2;
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship(2);
        ship2 = new Ship(3);
        gameboard.placeShip(ship,[2,1],'horizontal');
        gameboard.placeShip(ship2,[4,4],'vertical');
    });

    test ('not all ships are sunk', () => {
        gameboard.receiveAttack([2,1]);
        gameboard.receiveAttack([3,1]);
        gameboard.receiveAttack([4,4]);
        gameboard.receiveAttack([4,5]);

        expect(gameboard.areAllSunk()).toBe(false);
    });
    test ('All ships are sunk', () => {
        gameboard.receiveAttack([2,1]);
        gameboard.receiveAttack([3,1]);
        gameboard.receiveAttack([4,4]);
        gameboard.receiveAttack([4,5]);
        gameboard.receiveAttack([4,6]);

        expect(gameboard.areAllSunk()).toBe(true);
    });
});

