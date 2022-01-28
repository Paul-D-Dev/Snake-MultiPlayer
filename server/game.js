const { GRID_SIZE } = require('./constants');

function initGame() {
    const state = createGameState();
    randomFood(state);
    return state
}
function createGameState() {
    return {
        players: [{
            pos: {
                x: 3,
                y: 10
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                {x: 1, y: 10},
                {x: 2, y: 10},
                {x: 3, y: 10},
            ],
        },
            {
            pos: {
                x: 18,
                y: 10
            },
            vel: {
                x: -1,
                y: 0
            },
            snake: [
                {x: 20, y: 10},
                {x: 19, y: 10},
                {x: 18, y: 10},
            ],
        }],
        food: {},
        gridSize: GRID_SIZE,
        active: true
    }
}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    // PlayerOne moves faster than velocity
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    // if PlayerOne goes out of the Paint game
    if (
        playerOne.pos.x < 0
        || playerOne.pos.x > GRID_SIZE
        || playerOne.pos.y < 0
        || playerOne.pos.y > GRID_SIZE
    ) {
        return 2; // return player winner
    }

    // if PlayerTwo goes out of the Paint game
    if (
        playerTwo.pos.x < 0
        || playerTwo.pos.x > GRID_SIZE
        || playerTwo.pos.y < 0
        || playerTwo.pos.y > GRID_SIZE
    ) {
        return 1;
    }

    // PlayerOne eats food
    if(
        state.food.x === playerOne.pos.x
        && state.food.y === playerOne.pos.y
    ) {
        playerOne.snake.push({ ...playerOne.pos});
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        randomFood(state);
    }

    // PlayerTwo eats food
    if(
        state.food.x === playerTwo.pos.x
        && state.food.y === playerTwo.pos.y
    ) {
        playerTwo.snake.push({ ...playerTwo.pos});
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
        randomFood(state);
    }

    // PlayerOne moves
    if(playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            // Snake eats himself
            if (
                cell.x === playerOne.pos.x
                && cell.y === playerOne.pos.y
            ) {
                return 2;
            }
        }

        // Snake is moving
        playerOne.snake.push({ ...playerOne.pos});
        // Remove the last element Snake's array
        playerOne.snake.shift();
    }

    // PlayerTwo moves
    if(playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            // Snake eats himself
            if (
                cell.x === playerTwo.pos.x
                && cell.y === playerTwo.pos.y
            ) {
                return 1;
            }
        }

        // Snake is moving
        playerTwo.snake.push({ ...playerTwo.pos});
        // Remove the last element Snake's array
        playerTwo.snake.shift();
    }

    return false;
}

function randomFood(state) {
    const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }

    // Check if food is spawn in snake's parts
    for (let cell of state.players[0].snake) {
        // Food is spawn in snake's parts
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    for (let cell of state.players[1].snake) {
        // Food is spawn in snake's parts
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    state.food = food
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37: { // left
            return { x: -1, y: 0}
        }
        case 38: { // down
            return { x: 0, y: -1}
        }
        case 39: { // right
            return { x: 1, y: 0}
        }
        case 40: { // up
            return { x: 0, y: 1}
        }
    }
}
module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity
}
