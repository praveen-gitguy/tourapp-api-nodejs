const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });


const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("DB connection successful"));

const server = app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));

process.on('unhandledRejection', err =>
{
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => process.exit(1));
});

process.on('uncaughtException', err =>
{
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    server.close(() => process.exit(1));
});