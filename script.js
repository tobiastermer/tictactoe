let fields = [];
let emptyFields = [];
let currentPlayer = 1;
let currentShape = 'circle';
let winner;
let gameOver = false;
let player2 = 'human';
let numberOfMoves = 0;

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
    let strategies = [playComputerStrategy1, playComputerStrategy2, playComputerStrategy3];
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

function playComputerStrategy1() {
    // Eigenen Sieg herbeiführen oder gegnerischen Sieg verhindern
    // zunächst Player 2 (Computer), dann Player 1 prüfen
    for (i = 2; i >= 1; i--) {
        if (fields[0] == i && fields[1] == i && !fields[2]) {
            return 2;
        } else if (fields[1] == i && fields[2] == i && !fields[0]) {
            return 0;
        } else if (fields[2] == i && fields[0] == i && !fields[1]) {
            return 1;
        } else if (fields[3] == i && fields[4] == i && !fields[5]) {
            return 5;
        } else if (fields[4] == i && fields[5] == i && !fields[3]) {
            return 3;
        } else if (fields[5] == i && fields[3] == i && !fields[4]) {
            return 4;
        } else if (fields[6] == i && fields[7] == i && !fields[8]) {
            return 8;
        } else if (fields[7] == i && fields[8] == i && !fields[6]) {
            return 6;
        } else if (fields[8] == i && fields[6] == i && !fields[7]) {
            return 7;
        } else if (fields[0] == i && fields[3] == i && !fields[6]) {
            return 6;
        } else if (fields[3] == i && fields[6] == i && !fields[0]) {
            return 0;
        } else if (fields[6] == i && fields[0] == i && !fields[3]) {
            return 3;
        } else if (fields[1] == i && fields[4] == i && !fields[7]) {
            return 7;
        } else if (fields[4] == i && fields[7] == i && !fields[1]) {
            return 1;
        } else if (fields[7] == i && fields[1] == i && !fields[4]) {
            return 4;
        } else if (fields[2] == i && fields[5] == i && !fields[8]) {
            return 8;
        } else if (fields[5] == i && fields[8] == i && !fields[2]) {
            return 2;
        } else if (fields[8] == i && fields[2] == i && !fields[5]) {
            return 5;
        } else if (fields[0] == i && fields[4] == i && !fields[8]) {
            return 8;
        } else if (fields[4] == i && fields[8] == i && !fields[0]) {
            return 0;
        } else if (fields[8] == i && fields[0] == i && !fields[4]) {
            return 4;
        } else if (fields[2] == i && fields[4] == i && !fields[6]) {
            return 6;
        } else if (fields[4] == i && fields[6] == i && !fields[2]) {
            return 2;
        } else if (fields[6] == i && fields[2] == i && !fields[4]) {
            return 4;
        };
    }
}

function playComputerStrategy2() {
    if (!fields[4]) {
        return 4;
    }
}

function playComputerStrategy3() {
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