export const UI = (() => {

    let currentPreviewCells = [];
    let currentOrientation = 'horizontal';
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
        var boardUI = document.getElementById("playerBoard" + playerNumber);
        if (!boardUI || !blockedCoordinates) return;

        for (var i = 0; i < blockedCoordinates.length; i++) {
            var coord = blockedCoordinates[i];
            var x = 0;
            var y = 0;

            if (Array.isArray(coord)) {
                x = coord[0];
                y = coord[1];
            } else if (typeof coord === "string") {
                var parts = coord.split(",");
                x = Number(parts[0]);
                y = Number(parts[1]);
            } else {
                continue;
            }

            var cell = boardUI.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
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

    function initWinScreen() {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => {
            location.reload();
        }); 
    }

    function createShipYard () {
        const ships = [4,3,3,2,2,2,1,1,1,1];
        const shipYard = document.getElementById('ship-yard-container');
        ships.forEach ((size, index) => {
            const ship = document.createElement('div');
            ship.style.width = `${42*size}px`;
            ship.classList.add ('ship-item');
            ship.dataset.size = size;
            ship.dataset.id = index;
            ship.draggable = true;
            shipYard.appendChild (ship);
        })
    }

    function makeShipsDraggable() {
        const ships = document.querySelectorAll('.ship-item');
        
        ships.forEach(ship => {
            ship.addEventListener('dragstart', (e) => {
                const size = parseInt(ship.dataset.size);
                const rect = ship.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const grabOffset = Math.floor(mouseX / 42);

                draggedShipData = {
                    size: size,
                    id: ship.dataset.id,
                    grabOffset: Math.min(grabOffset, size - 1)      
                };
                 
                
                e.dataTransfer.setData('text/plain', JSON.stringify(draggedShipData));
                ship.classList.add('dragging');
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
                    showPreview(x, y, draggedShipData.size, currentOrientation, draggedShipData.grabOffset);
                }
            });

            cell.addEventListener('dragleave', () => {
                clearPreview();
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                clearPreview();
                
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const size = data.size;
                const grabOffset = data.grabOffset;
                
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);

                let headX = x;
                let headY = y;

                if (currentOrientation === 'horizontal') {
                    headX = x - grabOffset;
                } else {
                    headY = y - grabOffset;
                }

                console.log(`Drop ship size ${size} at head [${headX},${headY}] orientation: ${currentOrientation}`);
                
                // Remove ship from yard
                const draggedShip = document.querySelector('.dragging');
                if (draggedShip) draggedShip.remove();
            });
        });
    }   

    function clearPreview() {
        currentPreviewCells.forEach(cell => {
            cell.classList.remove('ship-preview');
        });
        currentPreviewCells = [];
    }

    function showPreview(mouseX, mouseY, size, orientation, grabOffset = 0) {
        clearPreview();

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
        makeBoardDroppable
    };
}



)();