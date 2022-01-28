const getId = (tagId) => {
    return document.getElementById(tagId);
}
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('http://localhost:3000');
// connect to events from back end socket
socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('full', handleFullGame);

const gameScreen =  getId('gameScreen');
const initialScreen =  getId('initialScreen');
const newGameButton =  getId('newGameButton');
const joinGameButton =  getId('joinGameButton');
const gameCodeInput =  getId('gameCodeInput');
const gameCodeDisplay =  getId('gameCodeDisplay');
let canvas, ctx;
let playerNumber;
let gameActive;

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);

function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function init() {
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    canvas = getId('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
    gameActive = true;
}

function keydown(e) {
    socket.emit('keydown', e.keyCode);
}

function paintGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   const food = state.food;
   const gridSize = state.gridSize;
   const size = canvas.width / gridSize // Size of pixel in the canvas -> 600/20 = 30

   ctx.fillStyle = FOOD_COLOUR;
   ctx.fillRect(food.x * size, food.y * size, size, size);

   paintPlayer(state.players[0], size, SNAKE_COLOUR);
   paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake;
    ctx.fillStyle = colour
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

function handleInit(number) {
    playerNumber = number;
}

function handleGameState(gameState) {
    if (!gameState) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
    if (!gameActive) return;
    data = JSON.parse(data);
    if (data.winner === playerNumber) {
        alert('You win !');
    } else {
        alert('You lose ...');
    }
    gameActive = false;
    reset();
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknownGame() {
    reset();
    alert('Unknown game code.');
}

function handleFullGame() {
    reset();
    alert('This game is already in progress');
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    gameCodeDisplay.innerText = '';
    initialScreen.style.display = 'block';
    gameScreen.style.display = 'none';
}
