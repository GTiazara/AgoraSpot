const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const debug = require('debug')('myapp:server');


// Import routes
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const addEventRouter = require('./routes/add_event_api');
const getEventRouter = require('./routes/get_all_events');
const joinEventRouter = require('./routes/join_event_api');
const cleanUpEventRouter = require('./routes/clean_up_events');
const randomLocationFactRouter = require('./routes/random_location_fact');
const EventChatRouter = require('./routes/event_chat_api');

// Create the Express app
const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ 
  // origin: "*", // Allow all origins
  // methods: ["GET","OPTIONS","PATCH","DELETE","POST","PUT"],
  // allowedHeaders: ["Content-Type"]
}));

// Define routes
// app.use('/', getEventRouter);

// Serve Vue static files from 'public/vue-dist'
// app.use(express.static(path.join(__dirname, 'public/dist')));

// // Catch all other routes and serve your index.html for the Vue app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
// });
app.use('/', getEventRouter);
app.use('/agoraback/api/add_event', addEventRouter);
app.use('/agoraback/api/get_events', getEventRouter);
app.use('/agoraback/api/add_participant', joinEventRouter);
app.use('/agoraback/api/clean_up_event', cleanUpEventRouter);
app.use('/agoraback/api/random_location_fact_api', randomLocationFactRouter);
app.use('/agoraback/api/event_chat_api', EventChatRouter);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const createError = require('http-errors');
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}, // Hide stack trace in production
  });
});

// Initialize the server
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create and start the HTTP server
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }});
io.on('connection', function(socket) {
  console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
      console.log("message reveibelsfsfsdqfd")
      console.log(data)
        io.emit('MESSAGE', data)
    });

    socket.on('disconnect', () => {
      console.log("Client disconnected:", socket.id);
  });

});

// Helper functions
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Named pipe
  }

  if (port >= 0) {
    return port; // Port number
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

// Export the app for testing and modularity
module.exports = app;
