//  script.js

const SEARCH_DEPTH = 5;
const SEARCH_DIRECTIONS = [[1, -1], [1, 0], [1, 1], [0, 1]];

//true - blue, false - red
var turn = false;
var board, players;
var level;
var won = false;
var canMove;

function start(p) {
    "use strict";
    players = p;

    resetBoard();
    createBoxes();

    hidePopups();
    showBoard();
    
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hidePopups() {
    document.getElementById("popup-container").style.visibility = "hidden";
    document.getElementById("popup-container").style.opacity = "0";

    document.getElementById("one-player-button").style.opacity = "0";
    document.getElementById("two-player-button").style.opacity = "0";

    // disable buttons
    document.getElementById("popup-container").style.pointerEvents = "none";
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

    level = [5, 5, 5, 5, 5, 5, 5];

    turn = false;

    won = false;

    canMove = true;
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

async function move(col) {
    "use strict";
    // don't let move if invalid move or game is over
    if (level[col] < 0 || won) { return; }

    // don't let move for the computer
    if (players == 1 && turn) { return; }

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
        await sleep(500);
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
    for (let i = 0; i < SEARCH_DIRECTIONS.length; i++) {
        if (checkWinCondition(row, col, SEARCH_DIRECTIONS[i][0], SEARCH_DIRECTIONS[i][1])) {
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
            if (board[row - (y * i)][col - (x * i)] == originalPiece) {
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

    return ((pos_value + neg_value + 1) >= 4);

}

async function win(row, col) {
    "use strict";
    won = true;
    const winner = board[row][col] == 1 ? "Blue" : "Red";
    const loser = board[row][col] == 1 ? "Red" : "Blue";

    // fade non-winning combination
    const winning_pieces = find_winning_combination(row, col);
    let non_winning_pieces = document.getElementsByClassName("piece");
    for (let i = non_winning_pieces.length - 1; i >= 0; i--) {
        // skip winning pieces
        if (winning_pieces.includes(non_winning_pieces[i].id)) {
            continue;
        }
        // skip hidden pieces
        if (non_winning_pieces[i].style.opacity = "0") {
            continue;
        }
        non_winning_pieces[i].style.transition = "all 4.5s ease";
        non_winning_pieces[i].style.opacity = "0.2";
    }

    // wait for animations
    await sleep(2500);

    // hide board
    document.getElementById("board").style.opacity = "0";
    document.getElementById("board").style.visibility = "hidden";

    // add popup to play again
    document.getElementById("popup-header").innerHTML = `${winner} Wins!!!`
    document.getElementById("popup-header").style.color = winner === "Red" ? "#FD8A8A" : "#9EA1D4";

    // wait for animations
    await sleep(2500);

    // delete board html
    document.getElementById("board").innerHTML = "";

    showPopups();

    // wait for animations last time
    await sleep(2000);
    
    // reenable popup buttons
    document.getElementById("popup-container").style.pointerEvents = "auto";

    // reset transition changes
    document.getElementById("popup-container").style.transition = "all 0.5s ease;";
}

function showPopups() {
    document.getElementById("popup-container").style.transition = "all 4.5s ease";
    document.getElementById("popup-container").style.visibility = "visible";
    document.getElementById("popup-container").style.opacity = "1";

    document.getElementById("one-player-button").style.opacity = "1";
    document.getElementById("two-player-button").style.opacity = "1";
}

function find_winning_combination(row, col) {
    let i;
    
    // find which direction was the winning direction
    for (i = 0; i < SEARCH_DIRECTIONS.length; i++) {
        if (checkWinCondition(row, col, SEARCH_DIRECTIONS[i][0], SEARCH_DIRECTIONS[i][1])) {
            break;
        }
    }

    // find pieces associated with win
    let list_of_pieces = [`row${row}col${col}-piece`];
    let counter = 1;
    // expand in positive and negative directions
    for (let j = 1; j <= 3; j++) {
        for (let k of [-1, 1]) {
            let temp_row = row + (k * j * SEARCH_DIRECTIONS[i][1]);
            let temp_col = col + (k * j * SEARCH_DIRECTIONS[i][0]);
            // check if part of winning combination
            if (inBounds(temp_row, temp_col) && board[temp_row][temp_col] == board[row][col]) {
                counter++;
                list_of_pieces.push(`row${temp_row}col${temp_col}-piece`);

                if (counter == 4) {
                    return list_of_pieces;
                }
            }
        }
    }

    return [];
}


function aiMove() {
    let col = find_best_move(SEARCH_DEPTH);

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
        // skip columns that are full
        if (board[0][i] != 0) {
            continue;
        }

        // execute move temporarily
        board[level[i]][i] = 1;
        if (checkWin(level[i], i)) {
            // unexecute move
            board[level[i]][i] = 0;
            return [i, (100000 * depth)];
        }
        level[i]--;
        turn = !turn;


        let move_val = find_best_min_move(alpha, beta, depth - 1)[1];
        if (move_val >= max_val) {
            best_col = i;
            max_val = move_val;
        }
        if (move_val > alpha) {
            alpha = move_val;
        }

        // unexecute move
        level[i]++;
        board[level[i]][i] = 0;
        turn = !turn;

        if (depth == SEARCH_DEPTH) {
            console.log(`Column: ${i}, Weight: ${move_val}`);
        }

        // alpha-beta pruning
        // if (alpha >= beta) {
        //     break;
        // }
    }
    if (depth == SEARCH_DEPTH) {
        console.log(``);
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
        // skip columns that are full
        if (board[0][i] != 0) {
            continue;
        }

        // execute move temporarily
        board[level[i]][i] = -1;
        if (checkWin(level[i], i)) {
            // unexecute move
            board[level[i]][i] = 0;
            return [i, (-100000 * depth)];
        }
        level[i]--;
        turn = !turn;


        let move_val = find_best_max_move(alpha, beta, depth - 1)[1];
        if (move_val <= min_val) {
            best_col = i;
            min_val = move_val;
        }
        if (move_val < beta) {
            beta = move_val;
        }

        // unexecute move
        level[i]++;
        board[level[i]][i] = 0;
        turn = !turn;

        // alpha-beta pruning
        // if (alpha >= beta) {
        //     break;
        // }
    }

    if (best_col == -1) {
        return 0;
    }

    return [best_col, min_val];

}


// calculates current game score
function calculate_score() {

    let score = 0;
    for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 6; col++) {
            if (board[row][col] == 0) {
                continue;
            }

            for (let i = 0; i < SEARCH_DIRECTIONS.length; i++) {
                let add = score_possible(row, col, SEARCH_DIRECTIONS[i][0], SEARCH_DIRECTIONS[i][1], 1);
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