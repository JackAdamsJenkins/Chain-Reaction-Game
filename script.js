const colors = ['rouge', 'bleu', 'vert', 'orange'];
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Moves = 2;
let player2Moves = 2;
const maxMoves = 2;
let grid = [];
let currentBlock = null;

const gridElement = document.getElementById('grid');
const drawBlockButton = document.getElementById('drawBlockButton');
const endTurnButton = document.getElementById('endTurnButton');
const messageElement = document.getElementById('message');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const player1MovesElement = document.getElementById('player1Moves');
const player2MovesElement = document.getElementById('player2Moves');

function initializeGrid() {
    for (let i = 0; i < 5; i++) {
        grid[i] = [];
        for (let j = 0; j < 5; j++) {
            grid[i][j] = '';
        }
    }
    renderGrid();
}

function renderGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (grid[i][j]) {
                cell.classList.add(grid[i][j]);
            }
            cell.addEventListener('click', handleCellClick);
            row.appendChild(cell);
        }
        gridElement.appendChild(row);
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (currentBlock && !grid[row][col]) {
        grid[row][col] = currentBlock;
        currentBlock = null;
        checkChains();
        renderGrid();
        drawBlockButton.disabled = playerMovesRemaining() === 0;
        endTurnButton.disabled = false; // Reactivate the "End Turn" button
    }
}

function drawBlock() {
    if (playerMovesRemaining() <= 0) {
        return;
    }
    const colorIndex = Math.floor(Math.random() * colors.length);
    currentBlock = colors[colorIndex];
    messageElement.textContent = `Joueur ${currentPlayer} a tiré un bloc ${currentBlock}`;
    decrementMoves();
    drawBlockButton.disabled = true;
    endTurnButton.disabled = true; // Deactivate the "End Turn" button
}

function endTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    resetMoves();
    messageElement.textContent = `C'est au tour du Joueur ${currentPlayer}`;
    drawBlockButton.disabled = false;
    endTurnButton.disabled = true;
    renderGrid();
}

function playerMovesRemaining() {
    return currentPlayer === 1 ? player1Moves : player2Moves;
}

function decrementMoves() {
    if (currentPlayer === 1) {
        player1Moves--;
        player1MovesElement.textContent = player1Moves;
    } else {
        player2Moves--;
        player2MovesElement.textContent = player2Moves;
    }
}

function resetMoves() {
    player1Moves = maxMoves;
    player2Moves = maxMoves;
    player1MovesElement.textContent = player1Moves;
    player2MovesElement.textContent = player2Moves;
}

function checkChains() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (grid[i][j]) {
                const color = grid[i][j];
                checkHorizontalChain(i, j, color);
                checkVerticalChain(i, j, color);
            }
        }
    }
}

function checkHorizontalChain(row, col, color) {
    let chainLength = 1;
    for (let k = col + 1; k < 5 && grid[row][k] === color; k++) {
        chainLength++;
    }
    if (chainLength >= 3) {
        removeChain(row, col, 'horizontal');
    }
}

function checkVerticalChain(row, col, color) {
    let chainLength = 1;
    for (let k = row + 1; k < 5 && grid[k][col] === color; k++) {
        chainLength++;
    }
    if (chainLength >= 3) {
        removeChain(row, col, 'vertical');
    }
}

function removeChain(row, col, direction) {
    let chainLength = 0;
    const color = grid[row][col];
    if (direction === 'horizontal') {
        for (let j = col; j < 5 && grid[row][j] === color; j++) {
            grid[row][j] = '';
            chainLength++;
        }
    } else if (direction === 'vertical') {
        for (let i = row; i < 5 && grid[i][col] === color; i++) {
            grid[i][col] = '';
            chainLength++;
        }
    }

    if (currentPlayer === 1) {
        player1Score += chainLength;
        player1ScoreElement.textContent = player1Score;
    } else {
        player2Score += chainLength;
        player2ScoreElement.textContent = player2Score;
    }

    messageElement.textContent = `Joueur ${currentPlayer} a retiré ${chainLength} blocs de couleur ${color}`;
    incrementMoves();
}

function incrementMoves() {
    if (currentPlayer === 1) {
        player1Moves++;
        player1MovesElement.textContent = player1Moves;
    } else {
        player2Moves++;
        player2MovesElement.textContent = player2Moves;
    }
    drawBlockButton.disabled = false;
}

initializeGrid();
resetMoves();

drawBlockButton.addEventListener('click', drawBlock);
endTurnButton.addEventListener('click', endTurn);
