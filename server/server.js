const options = {
    cors: {
        origin: '*',
    }
}
const io = require('socket.io')(options);
const { createGameState, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');

io.on('connection', client => {
    console.log('-----user connected-----')
    const state = createGameState();
    client.on('keydown', handleKeyDown);
    // Use function inside because we want to have access to client
    function handleKeyDown(keyCode) {
        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if (vel) state.player.vel = vel;
    }
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

