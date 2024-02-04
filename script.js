//  script.js

var level = [5, 5, 5, 5, 5, 5, 5];
//true - blue, false - red
var turn = false;
var board, players;
var won = false;

function start(p) {
    "use strict";
    players = p;

    resetBoard();
    createBoxes();

    hidePopups();
    showBoard();
    
    
}

function hidePopups() {
    document.getElementById("popup-container").style.visibility = "hidden";
    document.getElementById("popup-container").style.opacity = "0";

    document.getElementById("one-player-button").style.opacity = "0";
    document.getElementById("two-player-button").style.opacity = "0";

    // disable buttons
    document.getElementById("one-player-button").onclick = "";
    document.getElementById("two-player-button").onclick = "";
}

function showBoard() {
    document.getElementById("board").style.opacity = "1";
    document.getElementById("board").style.visibility = "visible";
}

function resetBoard() {
    board = [[0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]];
}

function createBoxes() {
    "use strict";
    let html = "";

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            html+= `<div onclick="move(${j});" id="row${i}col${j}" class="square">
                        <div 
                            style="transform: translate(calc(50vw / 7 / 8), calc(50vw / 7 * ${-i * 1 + 0.125}));" 
                            class="piece" id="row${i}col${j}-piece">
                        </div>
                    </div>`;
        }
    }

    document.getElementById("board").innerHTML = html;
    
}

function move(col) {
    "use strict";
    // don't let move if invalid move or game is over
    if (level[col] < 0 || won) { return; }

    // don't let move for the computer
    if (players == 1 && turn == -1) { return; }

    add_piece_to_board(col, (turn ? "blue" : "red"));

    // check if any player has won
    if (checkWin(level[col], col)) {
        win(level[col], col);
        return;
    }

    // set up for next turn
    turn = !turn;
    level[col]--;

    // move for the computer
    if (players == 1) {
        aiMove();
    }
}

function add_piece_to_board(col, color) {
    // add piece to visual board
    document.getElementById(`row${level[col]}col${col}-piece`).classList.add(color);
    document.getElementById(`row${level[col]}col${col}-piece`).style.opacity = 1;
    document.getElementById(`row${level[col]}col${col}-piece`).style.transform = "translate(calc(50vw / 7 / 8), calc(50vw / 7 / 8))";
    
    // add piece to board in code
    board[level[col]][col] = turn ? 1 : -1;    
}

// returns if a given coordinate is in bounds
function inBounds(row, col) {
    "use strict"
    return !(row > 5 || row < 0 || col > 6 || col < 0);
}

// checks if a player has won
function checkWin(row, col) {
    const directions = [[1, -1], [1, 0], [1, 1], [0, 1]];
    for (let i = 0; i < directions.length; i++) {
        // check for in-bounds in each direction before checking
        if (checkWinCondition(row, col, directions[i][0], directions[i][1])) {
            return true;
        }
    }
    return false;
}

// checkWin helper
// row = row of placed piece
// col = column of placed piece
// x = increased col to check
// y = increased row to check
function checkWinCondition(row, col, x, y) {
    "use strict";
    let originalPiece = board[row][col];

    // booleans on if to explore in either direction
    let pos_explore = true;
    let neg_explore = true;

    let pos_value = 0;
    let neg_value = 0;

    // extend in opposite directions to find a win
    for (let i = 1; i <= 3 && (pos_explore || neg_explore); i++) {
        // check pos piece and potentially add
        if (pos_explore && inBounds(row + (y * i), col + (x * i))) {
            if (board[row + (y * i)][col + (x * i)] == originalPiece) {
                pos_value++;
            }
            else {
                pos_explore = false;
            }
        }
        else {
            pos_explore = false;
        }


        if (neg_explore && inBounds(row - (y * i), col - (x * i))) {
            if (neg_explore && board[row - (y * i)][col - (x * i)] == originalPiece) {
                neg_value++;
            }
            else {
                neg_explore = false;
            }
        }
        else {
            neg_explore = false;
        }
    }

    return ((pos_value + neg_value) >= 3);

}

function win(row, col) {
    "use strict";
    won = true;
    let winner = board[row][col] == 1 ? "Blue" : "Red";

    // highlight winning combination
    let winning_pieces = document.getElementsByClassName(winner.toLowerCase());
    console.log(winning_pieces);
    for (let i = 0; i < winning_pieces.length; i++) {
        // winning_pieces[i].classList.remove("red");
        console.log("hi");
    }
    // hide non-winning combination



    // add popup to play again
    document.getElementById("popup-header").innerHTML = `${winner} Wins!!!`
    document.getElementById("popup-header").style.color = winner === "Red" ? "#FD8A8A" : "#9EA1D4";

    showPopups();
}

function showPopups() {
    document.getElementById("popup-container").style.transition = "all 4.5s ease";
    document.getElementById("popup-container").style.visibility = "visible";
    document.getElementById("popup-container").style.opacity = "0.9";

    document.getElementById("one-player-button").style.opacity = "0.9";
    document.getElementById("two-player-button").style.opacity = "0.9";

    // disable buttons
    document.getElementById("one-player-button").onclick = "start(1)";
    document.getElementById("two-player-button").onclick = "start(2)";
}

function find_winning_combination() {
    
}


function aiMove() {
    let col = find_best_move(4);

    add_piece_to_board(col, "blue")

    // check if any player has won
    if (checkWin(level[col], col)) {
        win(level[col], col);
    }

    turn = !turn;
    level[col]--;
}


// Finds the best move for the computer and returns a column and its associated value
function find_best_move(depth) {
    let alpha = -Infinity;
    let beta = Infinity;
    return find_best_max_move(alpha, beta, depth)[0];
}

// Finds the best move for MAX (computer) player and returns [move, weight]
function find_best_max_move(alpha, beta, depth) {
    if (depth == 0) {
        // return heuristic score of board
        return [-1, calculate_score()];
    }

    // sets the first move to column 0
    let best_col = -1;
    let max_val = -Infinity;

    // find the best score
    for (let i of [3, 2, 4, 1, 5, 0, 6]) {
        // pruning
        if (alpha >= beta) {
            return [best_col, max_val];
        }
        // skip columns that are full
        if (board[0][i] != 0) {
            continue;
        }

        // execute move temporarily
        board[level[i]][i] = 1;
        if (checkWin(level[i], i)) {
            // unexecute move
            board[level[i]][i] = 0;
            
            return [i, Infinity];
        }
        level[i]--;
        turn = !turn;


        let move_val = find_best_min_move(alpha, beta, depth - 1)[1];
        if (move_val >= max_val) {
            best_col = i;
            max_val = move_val;
            if (max_val >= alpha) {
                alpha = max_val;
            }
        }

        // unexecute move
        level[i]++;
        board[level[i]][i] = 0;
        turn = !turn;
    }

    if (best_col == -1) {
        return 0;
    }

    return [best_col, max_val];

}


// Finds the best move for MIN (user) player and returns [move, weight]
function find_best_min_move(alpha, beta, depth) {
    if (depth == 0) {
        // return heuristic score of board
        return [-1, calculate_score()];
    }

    // sets the first move to column 0
    let best_col = -1;
    let min_val = Infinity;

    // find the best score
    for (let i of [3, 2, 4, 1, 5, 0, 6]) {
        // pruning
        if (alpha >= beta) {
            return [best_col, min_val];
        }
        // skip columns that are full
        if (board[0][i] != 0) {
            continue;
        }

        // execute move temporarily
        board[level[i]][i] = -1;
        if (checkWin(level[i], i)) {
            // unexecute move
            board[level[i]][i] = 0;
            
            return [i, -Infinity];
        }
        level[i]--;
        turn = !turn;


        let move_val = find_best_max_move(alpha, beta, depth - 1)[1];
        if (move_val <= min_val) {
            best_col = i;
            min_val = move_val;
            if (min_val <= beta) {
                beta = min_val;
            }
        }

        // unexecute move
        level[i]++;
        board[level[i]][i] = 0;
        turn = !turn;
    }

    if (best_col == -1) {
        return 0;
    }

    return [best_col, min_val];

}


// calculates current game score
function calculate_score() {
    const directions = [[1, -1], [1, 0], [1, 1], [0, 1]];

    let score = 0;
    for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 6; col++) {
            if (board[row][col] == 0) {
                continue;
            }

            for (let i = 0; i < directions.length; i++) {
                add = score_possible(row, col, directions[i][0], directions[i][1], 1);
                // console.log(directions[i]);
                // console.log(`row: ${row}, col: ${col}`);
                // console.log(`added ${add}`);
                // console.log("");
                score+= add;
            }

        }
    }
    return score;
}

// calculate_score for individual square/"scoring direction"
function score_possible(row, col, x, y) {
    "use strict";
    let originalPiece = board[row][col];

    // booleans on if to explore in either direction
    let pos_explore = true;
    let neg_explore = true;

    let pos_value = 0;
    let pos_value_pot = 0;
    let neg_value = 0;
    let neg_value_pot = 0;

    // extend in opposite directions to find a win
    for (let i = 1; i <= 3 && (pos_explore || neg_explore); i++) {
        // check pos piece valid
        if (pos_explore && inBounds(row + (y * i), col + (x * i))) {
            // if same color, add many points
            if (board[row + (y * i)][col + (x * i)] == originalPiece) {
                pos_value++;
                pos_value_pot++;
            }
            // if empty, add some points
            else if (board[row + (y * i)][col + (x * i)] == 0) {
                pos_value_pot++;
            }
            else {
                pos_explore = false;
            }
        }

        // check neg piece valid
        if (neg_explore && inBounds(row - (y * i), col - (x * i))) {
            // if same color, add many points
            if (board[row - (y * i)][col - (x * i)] == originalPiece) {
                neg_value++;
                neg_value_pot++;
            }
            // if empty, add some points
            else if (board[row - (y * i)][col - (x * i)] == 0) {
                neg_value_pot++;
            }
            else {
                neg_explore = false;
            }
        }
    }

    let total = 0;
    if (pos_value + neg_value + 1 >= 4) {
        return board[row][col] * Infinity;
    }
    if (pos_value_pot + neg_value_pot + 1 >= 4) {
        total+= ((pos_value + neg_value + 1) * 3) ** 2;
    }
    total+= pos_value_pot + neg_value_pot + 1;
    

    return board[row][col] * total;
}