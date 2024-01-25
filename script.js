
var level = [5, 5, 5, 5, 5, 5, 5];
//true - blue, false - red
var turn = Math.random() > 0.5;
var board = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];
var won = false;

function start() {
    "use strict";
    createBoxes();
}

function createBoxes() {
    "use strict";
    var html = "";

    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            html+= `<div onclick="move(${j});" id="row${i}col${j}" class="square"></div>`;
        }
    }

    document.getElementById("board").innerHTML+= html;
    
}

function move(col) {
    "use strict";
    // don't let move if invalid move or game is over
    if (level[col] < 0 || won) {return;}

    document.getElementById(`row${level[col]}col${col}`).innerHTML = `<div class="piece ${turn ? "blue" : "red"}"></div>`;
    board[level[col]][col] = turn ? 1 : -1;

    checkWin(level[col], col);

    turn = !turn;
    level[col]--;
}

function inBounds(row, col) {
    "use strict"
    return !(row > 5 || row < 0 || col > 6 || col < 0);
}

function checkWin(row, col) {
    const directions = [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]]
    for (var i = 0; i < directions.length; i++) {
        // check for in-bounds in each direction before checking
        if (inBounds(row + (directions[i][1] * 3), col + (directions[i][0] * 3)) && 
            checkWinCondition(row, col, directions[i][0], directions[i][1], 1)) {
            win(board[row][col] === 1 ? "Blue" : "Red");
            return;
        }
    }
}

// row = row of placed piece
// col = column of placed piece
// x = increased col to check
// y = increased row to check
// i = how far from placed piece
function checkWinCondition(row, col, x, y, i) {
    "use strict";
    if (i >= 4) {
        return true;
    }

    var piece = board[row + (y * i)][col + (x * i)];
    var originalPiece = board[row][col];
    if (piece != originalPiece) {
        return false;
    }

    return checkWinCondition(row, col, x, y, (i + 1));
}

function win(winner) {
    "use strict";
    alert(`${winner} Wins!!`);
    won = true;
}
