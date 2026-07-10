export class Ship {
    constructor (size) {
        this.size = size;
        this.hits = 0;
    }

    hit () {
        this.hits++;
    }
    isSunk() {
        if (this.size > this.hits) {
            return false
        } else {return true};
    }
}