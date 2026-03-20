const colors = ['rouge', 'bleu', 'vert', 'orange'];
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Moves = 2;
let player2Moves = 2;
const maxMoves = 2;
let grid = [];
let currentBlock = null;
let vsComputer = false;

const gridElement = document.getElementById('grid');
const drawBlockButton = document.getElementById('drawBlockButton');
const endTurnButton = document.getElementById('endTurnButton');
const messageElement = document.getElementById('message');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const player1MovesElement = document.getElementById('player1Moves');
const player2MovesElement = document.getElementById('player2Moves');
const player2Label = document.getElementById('player2Label');
const startButton = document.getElementById('startButton');

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
    if (vsComputer && currentPlayer === 2) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    placeBlock(row, col);
}

function placeBlock(row, col) {
    if (currentBlock && !grid[row][col]) {
        grid[row][col] = currentBlock;
        currentBlock = null;
        checkChains();
        renderGrid();
        drawBlockButton.disabled = playerMovesRemaining() === 0;
        endTurnButton.disabled = false;

        if (vsComputer && currentPlayer === 1 && playerMovesRemaining() === 0) {
            endTurnButton.disabled = true;
            endTurn();
        }
    }
}

function drawBlock() {
    if (playerMovesRemaining() <= 0) return;
    const colorIndex = Math.floor(Math.random() * colors.length);
    currentBlock = colors[colorIndex];
    const playerName = vsComputer && currentPlayer === 2 ? 'Ordinateur' : `Joueur ${currentPlayer}`;
    messageElement.textContent = `${playerName} a tiré un bloc ${currentBlock}`;
    decrementMoves();
    drawBlockButton.disabled = true;
    endTurnButton.disabled = true;
}

function endTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    resetMoves();
    const playerName = vsComputer && currentPlayer === 2 ? 'Ordinateur' : `Joueur ${currentPlayer}`;
    messageElement.textContent = `C'est au tour du ${playerName}`;
    drawBlockButton.disabled = vsComputer && currentPlayer === 2;
    endTurnButton.disabled = true;
    renderGrid();

    if (vsComputer && currentPlayer === 2) {
        setTimeout(computerTurn, 600);
    }
}

function computerTurn() {
    playComputerMove();
    if (player2Moves > 0) {
        setTimeout(playComputerMove, 600);
    } else {
        setTimeout(() => endTurn(), 600);
    }
}

function playComputerMove() {
    if (player2Moves <= 0) return;
    drawBlock();
    const emptyCells = [];
    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            if (!grid[i][j]) emptyCells.push([i, j]);
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => {
        placeBlock(r, c);
        if (player2Moves > 0) {
            setTimeout(playComputerMove, 600);
        } else {
            setTimeout(() => endTurn(), 600);
        }
    }, 600);
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
    const toRemove = new Set();

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (!grid[i][j]) continue;
            const color = grid[i][j];

            // Vérifier chaîne horizontale depuis (i,j)
            let hLen = 1;
            while (j + hLen < 5 && grid[i][j + hLen] === color) hLen++;
            if (hLen >= 3) {
                for (let k = 0; k < hLen; k++) toRemove.add(`${i},${j + k}`);
            }

            // Vérifier chaîne verticale depuis (i,j)
            let vLen = 1;
            while (i + vLen < 5 && grid[i + vLen][j] === color) vLen++;
            if (vLen >= 3) {
                for (let k = 0; k < vLen; k++) toRemove.add(`${i + k},${j}`);
            }
        }
    }

    if (toRemove.size === 0) return;

    // Compter les couleurs retirées pour le message
    const colorCounts = {};
    toRemove.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const col = grid[r][c];
        colorCounts[col] = (colorCounts[col] || 0) + 1;
        grid[r][c] = '';
    });

    const total = toRemove.size;
    if (currentPlayer === 1) {
        player1Score += total;
        player1ScoreElement.textContent = player1Score;
    } else {
        player2Score += total;
        player2ScoreElement.textContent = player2Score;
    }

    const playerName = vsComputer && currentPlayer === 2 ? 'Ordinateur' : `Joueur ${currentPlayer}`;
    const details = Object.entries(colorCounts).map(([c, n]) => `${n} ${c}`).join(', ');
    messageElement.textContent = `${playerName} a retiré ${total} blocs (${details})`;
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
    drawBlockButton.disabled = vsComputer && currentPlayer === 2;
}

function startGame() {
    vsComputer = document.querySelector('input[name="mode"]:checked').value === 'pvc';
    player2Label.firstChild.textContent = vsComputer ? 'Ordinateur: ' : 'Joueur 2: ';
    player1Score = 0;
    player2Score = 0;
    player1ScoreElement.textContent = 0;
    player2ScoreElement.textContent = 0;
    currentPlayer = 1;
    currentBlock = null;
    initializeGrid();
    resetMoves();
    drawBlockButton.disabled = false;
    endTurnButton.disabled = true;
    messageElement.textContent = "C'est au tour du Joueur 1";
}

startButton.addEventListener('click', startGame);
drawBlockButton.addEventListener('click', drawBlock);
endTurnButton.addEventListener('click', endTurn);

startGame();
