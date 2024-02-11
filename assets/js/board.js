const HUMAN_CLASS = 'x';
const AI_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('.cell');
let humanTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    humanTurn = true;
    document.getElementById("restartButton").style.display = "none";

    cells.forEach(cell => {
        cell.classList.remove(HUMAN_CLASS);
        cell.classList.remove(AI_CLASS);
        cell.innerText = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    const cell = e.target;
    if (!humanTurn || !isValidMove(cell)) return;
    placeMark(cell, HUMAN_CLASS);
    if (checkWin(HUMAN_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        humanTurn = false;
        setTimeout(() => {
            aiTurn();
            if (checkWin(AI_CLASS)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            }
            humanTurn = true;
        }, 500);
    }
}


function aiTurn() {
    const bestMove = getBestMove();
    const randomMove = Math.random() < 0.40; // Introduce aleatoriedad en el 40% de los movimientos
    if (randomMove) {
        const emptyCells = [...cells].filter(cell => !cell.classList.contains(HUMAN_CLASS) && !cell.classList.contains(AI_CLASS));
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        placeMark(emptyCells[randomIndex], AI_CLASS);
    } else {
        placeMark(cells[bestMove], AI_CLASS);
    }
}


function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains(HUMAN_CLASS) && !cells[i].classList.contains(AI_CLASS)) {
            cells[i].innerText = 'O';
            cells[i].classList.add(AI_CLASS);
            let score = minimax(cells, 0, false);
            cells[i].innerText = '';
            cells[i].classList.remove(AI_CLASS);
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(cells, depth, isMaximizing) {
    if (checkWin(HUMAN_CLASS)) {
        return -10 + depth;
    } else if (checkWin(AI_CLASS)) {
        return 10 - depth;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].classList.contains(HUMAN_CLASS) && !cells[i].classList.contains(AI_CLASS)) {
                cells[i].innerText = 'O';
                cells[i].classList.add(AI_CLASS);
                let score = minimax(cells, depth + 1, false);
                cells[i].innerText = '';
                cells[i].classList.remove(AI_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].classList.contains(HUMAN_CLASS) && !cells[i].classList.contains(AI_CLASS)) {
                cells[i].innerText = 'X';
                cells[i].classList.add(HUMAN_CLASS);
                let score = minimax(cells, depth + 1, true);
                cells[i].innerText = '';
                cells[i].classList.remove(HUMAN_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function endGame(draw) {
    if (humanTurn && !draw) {
        window.location.href = "./pages/proposal.html";
    } else {
        document.getElementById("restartButton").style.display = "block";
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(HUMAN_CLASS) || cell.classList.contains(AI_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerHTML = marks[currentClass];
}


const marks = {
    'x': '<img src="./assets/img/icons/heart-icon.png" alt="heart-icon" />',
    'o': '<img src="./assets/img/icons/cross-icon.png" alt="heart-icon" />'
}

function isValidMove(cell) {
    return !cell.classList.contains(HUMAN_CLASS) && !cell.classList.contains(AI_CLASS);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
