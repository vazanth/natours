const socket = require('socket.io');

const io='';

module.exports = {
  initializeSocket: (httpServer) => {
    io = socket(httpServer),
  },
  getSocket: () => io,
};
