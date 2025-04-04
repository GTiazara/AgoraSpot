const express = require('express');
const router = express.Router();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const debug = require('debug')('myapp:server');
// const SSEChannel = require('sse-channel');

// Import routes
const addEventRouter = require('./routes/add_event_api');
const getEventRouter = require('./routes/get_all_events');
const joinEventRouter = require('./routes/join_event_api');
const cleanUpEventRouter = require('./routes/clean_up_events');
const randomLocationFactRouter = require('./routes/random_location_fact');
const EventChatRouter = require('./routes/event_chat_api');
const EventSendMessageRouter = require('./routes/send_chat');
const EventGetAllLastMessageRouter = require('./routes/get_last_chat_of_event');

// Create the Express app
const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ 
  // origin: "*", // Allow only your frontend
  // methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  // allowedHeaders: ["Content-Type", "Authorization"] // Add any other headers you might need
}));

// Define routes

// Serve Vue static files from 'public/vue-dist'
// app.use(express.static(path.join(__dirname, 'public/dist')));

// // Catch all other routes and serve your index.html for the Vue app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
// });xw<
app.use('/', getEventRouter);
app.use('/agoraback/api/add_event', addEventRouter);
app.use('/agoraback/api/get_events', getEventRouter);
app.use('/agoraback/api/add_participant', joinEventRouter);
app.use('/agoraback/api/clean_up_event', cleanUpEventRouter);
app.use('/agoraback/api/random_location_fact_api', randomLocationFactRouter);
app.use('/agoraback/api/event_chat_api', EventChatRouter);
app.use('/agoraback/api/send', EventSendMessageRouter);
app.use('/agoraback/api/get_all_last_message', EventGetAllLastMessageRouter);

// SSE endpoint: add clients to the channel
// app.get('/stream', (req, res) => {
//   channel.addClient(req, res);
//   console.log('Client connected to SSE');
// });


// Endpoint to broadcast messages to all connected clients
// app.post('/send', (req, res) => {
//   const { message } = req.body;
//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   console.log("message", message)
  
//   // Broadcast the message; sse-channel handles the JSON formatting if desired
//   channel.send(JSON.stringify(message));
//   res.json({ success: true });
// });
// // Catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const createError = require('http-errors');
//   next(createError(404));
// });

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


// Create an instance of sse-channel
// const channel = new SSEChannel();

// const io = require('socket.io')(server, {
//   cors: {
//     origin: "*", // Allow only your frontend
//     methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
//     allowedHeaders: ["Content-Type", "Authorization"] // Add any other headers you might need
//   }});
// io.on('connection', function(socket) {
//   console.log(socket.id)
//     socket.on('SEND_MESSAGE', function(data) {
//       console.log("message reveibelsfsfsdqfd")
//       console.log(data)
//         io.emit('MESSAGE', data)
//     });

//     socket.on('disconnect', () => {
//       console.log("Client disconnected:", socket.id);
//   });

// });

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
