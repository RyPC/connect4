const boardWidth = 1000;
const squareLen = Math.floor(boardWidth / 7);
var level = [5, 5, 5, 5, 5, 5, 5];
//true - blue, false - red
var turn = Math.random() > 0.5;
const pieceSize = 100;
var board = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];
var won = false;

function start() {

    createBoxes();

    document.getElementById("board").style.width = boardWidth + "px";
    document.getElementById("board").style.height = Math.floor(boardWidth / 7 * 6).toString() + "px";

}

function createBoxes() {

    var html = "";

    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            html+= `<div onclick="move(${i}, ${j});" style="padding:${(1 - (pieceSize / squareLen)) * 50}%; width:${squareLen}; height:${squareLen}" id="row${i}col${j}" class="square"></div>`;
        }
    }

    document.getElementById("board").innerHTML+= html;
    
}

function move(row, col) {
    if (level[col] < 0 || won) return;
    document.getElementById(`row${level[col]}col${col}`).innerHTML = `<div class="piece ${turn ? "blue" : "red"}" style="height: ${pieceSize}px; width: ${pieceSize}px;"></div>`;
    board[level[col]][col] = turn ? 1 : -1;
    turn = !turn;
    level[col]--;
    checkWin();
}

function checkWin() {
    for (var i = 5; i >= 0; i--) {
        var row = board[i];
        for (var j = 0; j < 4; j++) {
            if (row[j] != 0 && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3]) {
                win(row[j] === 1 ? "Blue" : "Red");
                return;
            }
            if (i > 2) {
                if (row[j] != 0 && row[j] === board[i - 1][j + 1] && row[j] === board[i - 2][j + 2] && row[j] === board[i - 3][j + 3]) {
                    win(row[j] === 1 ? "Blue" : "Red");
                    return;
                }
            }
            if(i < 3) {
                if (row[j] != 0 && row[j] === board[i + 1][j + 1] && row[j] === board[i + 2][j + 2] && row[j] === board[i + 3][j + 3]) {
                    win(row[j] === 1 ? "Blue" : "Red");
                    return;
                }
            }
            if (row[j] != 0 && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3]) {
                win(row[j] === 1 ? "Blue" : "Red");
                return;
            }
        }
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 7; j++) {
            if (board[i][j] != 0 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j]) {
                win(row[j] === 1 ? "Blue" : "Red");
                return;
            }
        }
    }
}

function win(winner) {
    alert(`${winner} Wins!!`);
    won = true;
}
