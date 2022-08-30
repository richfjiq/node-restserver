const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';

    // Middleware
    this.middleware();

    // read and parse body
    this.app.use(express.json());

    // App routes
    this.routes();
  }

  middleware() {
    // CORS
    this.app.use(cors());

    // public directory
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.usersPath, require('../routes/users'));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log('Server running on port:', this.port)
    );
  }
}

module.exports = Server;