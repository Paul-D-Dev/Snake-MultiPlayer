const options = {
    cors: {
        origin: '*',
    }
}
const io = require('socket.io')(options);
const { createGameState, gameLoop } = require('./game');
const { FRAME_RATE } = require('./constants');

io.on('connection', client => {
    console.log('-----user connected-----')
    const state = createGameState();
    startGameInterval(client, state);
});

function startGameInterval(client, state) {
    console.log('gameStart');
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
        if (!winner) {
            client.emit('gameState', JSON.stringify(state));
        } else {
            console.log('gameOver')
            client.emit('gameOver');
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE)
}



io.listen(3000);

