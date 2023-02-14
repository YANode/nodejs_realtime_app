const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

//Idea Service
class IdeaService {
    constructor() {
        this.ideas = [];
    };

    async find() {
        return this.ideas;
    };

    async create(data) {
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        };

        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    };
};


const app = express(feathers());

//parse JSON
app.use(express.json());
//config socket.io realtime APIs
app.configure(socketio());
//enable REST service
app.configure(express.rest());
//registered service
app.use('/ideas', new IdeaService());


//new connection connect to stream chanel
app.on('connection', conn => app.channel('stream').join(conn));
//publish chanel to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;
app
    .listen(PORT)
    .on('listening', () =>
        console.log(`Realtime server running to port ${PORT}`)
    );


/*app.service('ideas').create({
    text: 'Build a cool app',
    tech: 'Node.js',
    viewer: 'ANode',
    time: moment().format('H:mm:s a')
});*/
