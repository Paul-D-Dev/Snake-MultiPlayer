const { GRID_SIZE } = require('./constants');

function createGameState() {
    return {
        player: {
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
        food: {
            x: 7,
            y: 7
        },
        gridSize: GRID_SIZE
    }
}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const playerOne = state.player;
    // PlayerOne moves faster than velocity
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    // if PlayerOne goes out of the Paint game
    if (
        playerOne.pos.x < 0
        || playerOne.pos.x > GRID_SIZE
        || playerOne.pos.y < 0
        || playerOne.pos.y > GRID_SIZE
    ) {
        return 2;
    }

    // Snake eats food
    if(
        state.food.x === playerOne.pos.x
        && state.food.y === playerOne.pos.y
    ) {
        playerOne.snake.push({ ...playerOne.pos});
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        randomFood();
    }

    // Snake moves
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

    return false;
}

function randomFood(state) {
    const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }

    // Check if food is spawn in snake's parts
    for (let cell of state.player.snake) {
        // Food is spawn in snake's parts
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    state.food = food
}

module.exports = {
    createGameState,
    gameLoop
}
