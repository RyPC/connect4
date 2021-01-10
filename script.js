const boardWidth = 1000;
const squareLen = Math.floor(boardWidth / 7);
var level = [5, 5, 5, 5, 5, 5, 5];
var turn = true;
const pieceSize = 100;

var board = [];
var row = [0, 0, 0, 0, 0, 0, 0];
for (var i = 0; i < 6; i++) {
    board.push(row);
}


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
    document.getElementById(`row${level[col]}col${col}`).innerHTML = `<div class="piece ${turn ? "blue" : "red"}" style="height: ${pieceSize}px; width: ${pieceSize}px;"></div>`;
    turn = !turn;
    level[col]--;
    checkWin();
}

function checkWin() {

}