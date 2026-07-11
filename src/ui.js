export const UI = (() => {
  
    function renderGameboard(gameboard) {
        const board = gameboard.board;
        const boardUI = document.getElementById('playerBoard')

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

    function createBoard() {
        const board = document.createElement ('div');
        board.classList.add('board');
        board.id = 'playerBoard'
        for (let i = 0; i < 10; i++) {
                for (let j=0; j < 10; j++) {
                    const cell = document.createElement ('div');
                    cell.dataset.x = j;
                    cell.dataset.y = i;
                    cell.classList.add ('cell');
                    board.appendChild(cell);
                }
        }
        document.body.appendChild(board);
    }











    return {
        renderGameboard,
        createBoard
    }


})();


