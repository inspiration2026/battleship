export const UI = (() => {

    let currentPreviewCells = [];
    let draggedShipData = null;


    function createPlayground() {
        const playground = document.createElement('div');
        playground.classList.add('playground');
        document.body.appendChild(playground);
    }

    function createBoard(playerNumber) {
        console.log(`Creating board for player ${playerNumber}`);
        const wrapper = document.createElement('div');
        wrapper.classList.add('board-wrapper');

        // Column labels A-J
        const header = document.createElement('div');
        header.classList.add('board-header');
        for (let i = 0; i < 10; i++) {
            const label = document.createElement('div');
            label.classList.add('label');
            label.textContent = String.fromCharCode(65 + i);
            header.appendChild(label);
        }
        wrapper.appendChild(header);

        const rowContainer = document.createElement('div');
        rowContainer.style.display = 'flex';

        // Row labels 1-10
        const sidebar = document.createElement('div');
        sidebar.classList.add('board-sidebar');
        for (let i = 1; i <= 10; i++) {
            const label = document.createElement('div');
            label.textContent = i;
            sidebar.appendChild(label);
        }
        rowContainer.appendChild(sidebar);

        // Grid
        const board = document.createElement('div');
        board.classList.add('board');
        board.id = `playerBoard${playerNumber}`;

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                board.appendChild(cell);
            }
        }

        rowContainer.appendChild(board);
        wrapper.appendChild(rowContainer);
        document.querySelector('.playground').appendChild(wrapper);
    }

    function renderGameboard(gameboard, playerNumber, showShips = false) {
        const boardUI = document.getElementById(`playerBoard${playerNumber}`);
        const boardData = gameboard.board;

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                const hasShip = boardData[x][y] !== null;

                if (hasShip && showShips) {
                    cell.classList.add('ship');
                }
            }
        }
    }

    function clearGameboard () {
        const cells = document.querySelectorAll('.cell');
        cells.forEach ((cell) => {
            cell.classList.remove('ship');
        })

        currentPreviewCells = [];
        draggedShipData = null;

        clearErrorMessage();
    }

    function renderAction(gameboard, playerNumber) {
        const boardUI = document.getElementById(`playerBoard${playerNumber}`);

        // Update hits
        gameboard.hits.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
            const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) cell.classList.add('hit');
        });

        // Update misses
        gameboard.missed.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
            const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) cell.classList.add('miss');
        });
    }

    function renderSunkShip(playerNumber, shipCoordinates) {
        const boardUI = document.getElementById(`playerBoard${playerNumber}`);
        if (!boardUI || !shipCoordinates) return;

        shipCoordinates.forEach(coord => {
            const x = coord[0];
            const y = coord[1];

            const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) cell.classList.add('sunk');
        });
    }
    
    function renderBlockedCells(playerNumber, blockedCoordinates) {
        const boardUI = document.getElementById("playerBoard" + playerNumber);
        if (!boardUI || !blockedCoordinates) return;

        for (let i = 0; i < blockedCoordinates.length; i++) {
            const coord = blockedCoordinates[i];
            let x = 0;
            let y = 0;

            if (Array.isArray(coord)) {
                x = coord[0];
                y = coord[1];
            } else if (typeof coord === "string") {
                const parts = coord.split(",");
                x = Number(parts[0]);
                y = Number(parts[1]);
            } else {
                continue;
            }

            const cell = boardUI.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add("blocked");
            }
        }
    }

    function addAttackListeners(onAttack) {
        const opponentBoard = document.getElementById('playerBoard2');

        opponentBoard.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;

            if (cell.classList.contains('hit') || 
                cell.classList.contains('miss') || 
                cell.classList.contains('blocked')) {
                return;
            }
            
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            onAttack([x, y]); 
        });
    }

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    function initStartScreen(onStartCallback) {
        console.log("initStartScreen called - count:", ++window.initCount || (window.initCount = 1));
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log("Start button clicked!");
                onStartCallback();
            });
        }
    }

    function initGameScreen(onStartCallback) {
        const startBtn = document.getElementById('start-battle-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log("Start Battle button clicked!");
                onStartCallback();
            });
        }
    }

    function errorMessage () {
        const message = document.getElementById ('error-message');
        message.textContent = ('Please place All your ships !!!');
    }

    function clearErrorMessage () {
        const message = document.getElementById ('error-message');
        message.textContent = ('');
    }



    function hideShipYard() {
        const players = document.querySelector('.players');
        players.style.display = 'flex';
        const startBtn = document.getElementById('start-battle-btn');
        startBtn.style.display = 'none';
        const shipYard = document.querySelector('.ship-yard');
        shipYard.style.display = 'none';
        const request = document.querySelector('.request');
        request.style.display = 'none';
        const message = document.getElementById ('error-message');
        message.textContent = ('');
        const randomBtn = document.getElementById('random-btn');
        randomBtn.style.display = 'none';
        const resetShipsBtn = document.getElementById('reset-ships-btn');
        resetShipsBtn.style.display = 'none';
    }

    function initWinScreen() {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => {
            location.reload();
        }); 
    }

    function initLoseScreen() {
        const restartBtn = document.getElementById('restart-btn-lose');
        restartBtn.addEventListener('click', () => {
            location.reload();
        }); 
    }

    function createShipYard () {
        const ships = [4,3,3,2,2,2,1,1,1,1];
        const shipYard = document.getElementById('ship-yard-container');
        ships.forEach ((size) => {
            const ship = document.createElement('div');
            ship.style.width = `${42*size}px`;
            ship.classList.add ('ship-item');
            ship.dataset.size = size;
            ship.dataset.direction = 'horizontal';
            ship.draggable = true;
            shipYard.appendChild (ship);
        })

    }
    function removeShipFromTheYard () {
        const draggedShip = document.querySelector('.dragging');
        if (draggedShip) draggedShip.remove();
    }

    function findGrabOffset (direction, mouseX, mouseY) {
        if (direction === 'horizontal') {
            return Math.floor(mouseX / 42);
        } else return Math.floor(mouseY / 42);
    }
    

    function makeShipsDraggable() {
        const ships = document.querySelectorAll('.ship-item');
        
        ships.forEach(ship => {
            ship.addEventListener('dragstart', (e) => {
                const size = parseInt(ship.dataset.size);
                const rect = ship.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const direction = ship.dataset.direction;
                const grabOffset = findGrabOffset(direction, mouseX, mouseY);

                draggedShipData = {
                    size: size,
                    id: ship.dataset.id,
                    grabOffset: Math.min(grabOffset, size - 1),
                    direction: direction
                };
                 
                
                e.dataTransfer.setData('text/plain', JSON.stringify(draggedShipData));
                ship.classList.add('dragging');
            });

            ship.addEventListener('dblclick', () => {
                const size = parseInt(ship.dataset.size);
                let direction = ship.dataset.direction;
                direction = direction === 'horizontal' ?  'vertical' : 'horizontal';

                if (direction === 'vertical') {
                    ship.style.width = `42px`;
                    ship.style.height = `${42*size}px`;
                    ship.dataset.direction = 'vertical';
                } else {
                    ship.style.width = `${42*size}px`;
                    ship.style.height = `42px`;
                    ship.dataset.direction = 'horizontal';
                }
            });

            ship.addEventListener('dragend', () => {
                ship.classList.remove('dragging');
                clearPreview();
            });
        });
    }

    function makeBoardDroppable() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();  
                
                if (draggedShipData) {
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);
                    showPreview(x, y, draggedShipData.size, draggedShipData.direction, draggedShipData.grabOffset);
                }
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                clearPreview();
                
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const size = data.size;
                const grabOffset = data.grabOffset;
                const direction = data.direction;
                
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);

                let headX = x;
                let headY = y;

                if (direction === 'horizontal') {
                    headX = headX - grabOffset;
                } else {
                    headY = headY - grabOffset;
                }
                const dataToSend = {
                    size: size,
                    head: [headX,headY],
                    orientation: direction     
                }
                const event = new CustomEvent ('ship to place', {detail: dataToSend});
                window.dispatchEvent(event);

                console.log(`Drop ship size ${size} at head [${headX},${headY}] orientation: ${direction}`);
                
            }); 
        });
    }   

    function clearPreview() {
        currentPreviewCells.forEach(cell => {
            cell.classList.remove('ship-preview');
        });
        currentPreviewCells = [];
    }

    function resetShipYard() {
        const shipYard = document.getElementById('ship-yard-container');
        shipYard.innerHTML = '';
        createShipYard();
    }

    function showPreview(mouseX, mouseY, size, orientation, grabOffset = 0) {
        clearPreview();

        console.log(mouseX, mouseY, size, orientation, grabOffset);


        for (let i = 0; i < size; i++) {
            let nx = mouseX;
            let ny = mouseY;

            if (orientation === 'horizontal') {
                nx = mouseX + (i - grabOffset);
            } else {
                ny = mouseY + (i - grabOffset);
            }

            if (nx < 0 || nx > 9 || ny < 0 || ny > 9) return; // invalid

            const cell = document.querySelector(`[data-x="${nx}"][data-y="${ny}"]`);
            if (cell) {
                cell.classList.add('ship-preview');
                currentPreviewCells.push(cell);
            }
        }
    }




    return {
        createPlayground,
        createBoard,
        renderGameboard,
        renderAction,
        addAttackListeners,
        renderBlockedCells,
        renderSunkShip,
        showScreen,
        initStartScreen,
        initWinScreen,
        createShipYard,
        makeShipsDraggable,
        makeBoardDroppable,
        removeShipFromTheYard,
        initGameScreen, 
        hideShipYard,
        initLoseScreen,
        errorMessage,
        resetShipYard,
        clearGameboard
    };
}



)();