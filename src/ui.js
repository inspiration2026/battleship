export const UI = (() => {
  
    
    
    
    function renderAction (gameboard, playerNumber, hits, miss) {
        const board = gameboard.board;
        const boardUI = document.getElementById(`playerBoard${playerNumber}`)
        for (let x = 0; x <10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (hits.has(`${x},${y}`)) {
                    cell.dataset.hit = true;
                    cell.classList.add('hit');
                    renderSunkShip(playerNumber, [x,y]);
                };
                if (miss.has(`${x},${y}`)) {
                    cell.dataset.miss = true;
                    cell.classList.add('miss');
                } 
            }
        }
    }
    
    
    function renderGameboard(gameboard, playerNumber) {
        const board = gameboard.board;
        const boardUI = document.getElementById(`playerBoard${playerNumber}`)

        for (let x = 0; x <10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (board[x][y] !== null) {
                    cell.dataset.ship = true;
                    cell.classList.add('ship');
                } else {
                    cell.dataset.ship = false;
                }
            }
        }

    }

    function createBoard(player) {
        const board = document.createElement ('div');
        board.classList.add('board');
        board.id = `playerBoard${player}`
        for (let i = 0; i < 10; i++) {
                for (let j=0; j < 10; j++) {
                    const cell = document.createElement ('div');
                    cell.dataset.x = j;
                    cell.dataset.y = i;
                    cell.classList.add ('cell');
                    board.appendChild(cell);
                }
        }
        const playGround = document.querySelector ('.playGround');
        playGround.appendChild(board);
    }

    function createPlayground() {
        const playGround = document.createElement ('div');
        playGround.classList.add ('playGround');
        document.body.appendChild (playGround);
    }

    function renderSunkShip(playerNumber, coordinates) {
           const boardUI = document.getElementById(`playerBoard${playerNumber}`);
           const cell = boardUI.querySelector(`[data-x="${coordinates[0]}"][data-y="${coordinates[1]}"]`);
           cell.classList.add ('sunk');
     
    }









    return {
        renderGameboard,
        createBoard,
        createPlayground, 
        renderAction,
        renderSunkShip
    }


})();


