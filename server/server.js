const options = {
    cors: {
        origin: '*',
    }
}
const io = require('socket.io')(options);

io.on('connection', client => {
    client.emit('init', { data : 'hello world'});
});

io.listen(3000);

