const getId = (tagId) => {
    return document.getElementById(tagId);
}
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('http://localhost:3000');
// connect to events from back end socket
socket.on('gameState', handleGameState);

const gameScreen =  getId('gameScreen');
let canvas, ctx;

function init() {
    canvas = getId('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
}

function keydown(e) {
    console.log(e.keyCode);
}

init();

function paintGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   const food = state.food;
   const gridSize = state.gridSize;
   const size = canvas.width / gridSize // Size of pixel in the canvas -> 600/20 = 30

   ctx.fillStyle = FOOD_COLOUR;
   ctx.fillRect(food.x * size, food.y * size, size, size);

   paintPlayer(state.player, size, SNAKE_COLOUR);
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake;
    ctx.fillStyle = colour
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}


function handleGameState(gameState) {
    if (!gameState) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}
