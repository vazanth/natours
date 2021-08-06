const dotenv = require('dotenv');
const mongoose = require('mongoose');
const io = require('./socket');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.msg);
  console.log('SHUTTING DOWN THE SERVER🎇🎇');
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 8000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true, // uses to parse MongoDB connection strings
    useUnifiedTopology: true, // useUnifiedTopology option removes support for several connection options that are no longer relevant with the new topology engine
    useCreateIndex: true, //ensureIndex() dropped infavor of createIndex()
    useFindAndModify: false, //Make Mongoose use `findOneAndUpdate()` ---changed to--> findAndModify()
  })
  .then(() => console.log(`Connection Successfull`));

const server = app.listen(port, () => {
  console.log(`App Running on ${port}`);
});

const socket = io.initializeSocket(server);

socket.on('connect', (data) => {
  console.log('client connected', data);
});

process.on('unhandledRejection', (err) => {
  console.log(err, err.name, err.msg);
  console.log('SHUTTING DOWN THE SERVER🎇🎇');
  server.close(() => {
    process.exit(1);
  });
});
