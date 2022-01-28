const options = {
    cors: {
        origin: '*',
    }
}
const io = require('socket.io')(options);
const { initGame, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeId } = require('./utils');

const state = {};
const clientRooms = {}

io.on('connection', client => {
    console.log('-----user connected-----', client.id)
    client.on('keydown', handleKeyDown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);


    // Friend joins the game == Player 2
    function handleJoinGame(roomName) {
        // Search room with gameCode
        const room = io.sockets.adapter.rooms.get(roomName);

        let numClients = 0;
        if (room) numClients = room.size;

        if (numClients === 0) {
            client.emit('unknownGame');
            return;
        } else if (numClients > 1) {
            client.emit('full');
            return;
        }

        clientRooms[client.id] = roomName;
        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);

        startGameInterval(roomName);
    }


    // Player 1 launches the game
    function handleNewGame() {
        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);

        state[roomName] = initGame();
        client.join(roomName);
        // User who creates game is Player #1
        client.number = 1
        client.emit('init', 1);
    }

    /**
     * Use function inside because we want to have access to client
     * @param keyCode: string
     */
    function handleKeyDown(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) {
            return;
        }

        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if (vel) {
            // client number starts 1
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);
        if (!winner) {
            emitGameState(roomName, state[roomName])
        } else {
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE)
}

/**
 * Selects all players in the room,
 * then send a message for all players to explain gameState
 * @param roomName
 * @param state
 */
function emitGameState(roomName, state) {
    io.sockets.in(roomName)
        .emit('gameState', JSON.stringify(state));
}

/**
 * Select all players in the room
 * Then to all the game is over and tell who win
 * @param roomName: string
 * @param winner
 */
function emitGameOver(roomName, winner) {
    io.sockets.in(roomName)
        .emit('gameOver', JSON.stringify({ winner }));
}


io.listen(3000);

