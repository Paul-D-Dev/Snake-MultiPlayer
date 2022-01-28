# Snake-MultiPlayer

## Context
In purpose to increase my skills in Javascript and Socket, I decided to create a multiplayer's snake.
I could use a canvas to display game, snakes, food. I used Sockets to 
handle moves from player in real time. 

## Tasks done
- Paint a canvas
- Controls snake
- Update moves' snake by frame
- Detected collisions
- Determine the winner
- Set up Sockets (connections, emits, listeners)
- Sockets : Room (select, join, emit, update state, limited particpants)



## Stacks
- HTML5
- CSS3
- Javascript
- [Socket.io](https://socket.io/)


## Clone project
    git clone https://github.com/Paul-D-Dev/Snake-MultiPlayer.git
    cd snake-multiplayer

Open 2 terminals,
In the first :

    cd server
    npm i
    npx nodemon server.js

In the second : 

    cd frontend
    npx live-sever

