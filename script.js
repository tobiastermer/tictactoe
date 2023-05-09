let fields = [];
let emptyFields = [];
let currentPlayer = 1;
let currentShape = 'circle';
let winner;
let gameOver = false;
let player2 = 'human';
let numberOfMoves = 0;
let checkFields = [
    { "row1": [0, 1, 2] },
    { "row2": [3, 4, 5] },
    { "row3": [6, 7, 8] },
    { "row4": [0, 3, 6] },
    { "row5": [1, 4, 7] },
    { "row6": [2, 5, 8] },
    { "row7": [0, 4, 8] },
    { "row8": [2, 4, 6] }
];

function fillShape(id) {
    if (!fields[id] && !gameOver) {
        fields[id] = currentPlayer;
        document.getElementById(`${currentShape}-${id}`).classList.remove('d-none');
        numberOfMoves++;
        checkForWin()
        switchPlayer();
        checkForComputerAsPlayer2()
    }
}

function checkForWin() {
    checkWinner(fields[0], fields[1], fields[2], 'line1', 'scaleX(1)');
    checkWinner(fields[3], fields[4], fields[5], 'line2', 'scaleX(1)');
    checkWinner(fields[6], fields[7], fields[8], 'line3', 'scaleX(1)');
    checkWinner(fields[0], fields[3], fields[6], 'line4', 'rotate(90deg) scaleX(1)');
    checkWinner(fields[1], fields[4], fields[7], 'line5', 'rotate(90deg) scaleX(1)');
    checkWinner(fields[2], fields[5], fields[8], 'line6', 'rotate(90deg) scaleX(1)');
    checkWinner(fields[0], fields[4], fields[8], 'line7', 'rotate(45deg) scaleX(1)');
    checkWinner(fields[2], fields[4], fields[6], 'line8', 'rotate(-45deg) scaleX(1)');
    if (winner || numberOfMoves == 9) {
        finishGame();
    }
}

function checkWinner(field1, field2, field3, lineId, transform) {
    if (field1 && field1 === field2 && field2 === field3) {
        winner = field1;
        document.getElementById(lineId).style.transform = transform;
        return true;
    }
    return false;
}
function checkForComputerAsPlayer2() {
    if (player2 == 'computer' && currentPlayer == 2) {
        playComputer();
    }
}

function playComputer() {
    // Strategie: 1. Eigenen Sieg herbeiführen oder gegnerischen verhindern, 2. in die Mitte, 3. Zufall
    let strategies = [playComputerStrategyWinNotLoose, playComputerStrategyMiddle, playComputerStrategyRandom];
    getEmptyFields();
    let selectedField = '';

    for (let strategy of strategies) {
        let field = strategy();
        if (field >= 0) {
            selectedField = field;
            break;
        }
    }

    setTimeout(() => {
        fillShape(selectedField);
    }, 1000);
}

function playComputerStrategyWinNotLoose() {
    // Eigenen Sieg herbeiführen oder gegnerischen Sieg verhindern
    // zunächst Player 2 (Computer), dann Player 1 prüfen
    for (i = 2; i >= 1; i--) {
        let fieldIndex;
        fieldIndex = checkAllRowsForWin(i);
        if (fieldIndex >= 0) {
            return fieldIndex;
        }
    }
    return -1;
}

function checkAllRowsForWin(player) {
    let fieldIndex;
    for (let i = 0; i < checkFields.length; i++) {
        const rowName = Object.keys(checkFields[i])[0];
        const rowValues = checkFields[i][rowName];
        const field1 = rowValues[0];
        const field2 = rowValues[1];
        const field3 = rowValues[2];
        fieldIndex = checkRowForWin(player, field1, field2, field3);
        if (fieldIndex >= 0) {
            return fieldIndex;
        }
    }
    return -1;
}

function checkRowForWin(player, index1, index2, index3) {
    if (fields[index1] == player && fields[index2] == player && !fields[index3]) {
        return index3;
    } else if (fields[index2] == player && fields[index3] == player && !fields[index1]) {
        return index1;
    } else if (fields[index3] == player && fields[index1] == player && !fields[index2]) {
        return index2;
    }
    return -1;
}

function playComputerStrategyMiddle() {
    if (!fields[4]) {
        return 4;
    }
}

function playComputerStrategyRandom() {
    let randomField = emptyFields[Math.floor(Math.random() * emptyFields.length)];
    return randomField;
}

function getEmptyFields() {
    emptyFields.length = 0;
    for (i = 0; i < 9; i++) {
        if (!fields[i]) {
            emptyFields.push(i);
        }
    }
}

function finishGame() {
    gameOver = true;
    setTimeout(function () {
        document.getElementById('game-over').classList.remove('d-none')
        document.getElementById('btn-restart').classList.remove('d-none')
    }, 1250)
}

function switchPlayer() {
    if (currentShape == 'cross') {
        currentShape = 'circle';
        document.getElementById('player1').classList.remove('player-inactive');
        document.getElementById('player2').classList.add('player-inactive');
        currentPlayer = 1;
    } else {
        currentShape = 'cross';
        document.getElementById('player1').classList.add('player-inactive');
        document.getElementById('player2').classList.remove('player-inactive');
        currentPlayer = 2;
    }
}

function selectPlayer2(humanOrComputer) {
    if (humanOrComputer == 'human') {
        document.getElementById('btn-dropdown').innerHTML = 'Spieler 2';
        player2 = 'human';
    } else {
        document.getElementById('btn-dropdown').innerHTML = 'Computer';
        player2 = 'computer';
    }
    checkForComputerAsPlayer2();
}

function restart() {
    cleanLines();
    cleanTable();
    document.getElementById('game-over').classList.add('d-none');
    document.getElementById('btn-restart').classList.add('d-none');
    fields.length = 0;
    winner = '';
    gameOver = false;
    numberOfMoves = 0;
    checkForComputerAsPlayer2()
}

function cleanLines() {
    for (i = 1; i < 9; i++) {
        document.getElementById(`line${i}`).style.transform = 'scaleX(0)';
    }
}

function cleanTable() {
    for (i = 0; i < 9; i++) {
        document.getElementById(`cross-${i}`).classList.add('d-none');
        document.getElementById(`circle-${i}`).classList.add('d-none');
    }
}