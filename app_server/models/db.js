const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

// Function to connect to MongoDB
const connect = () => {  
    setTimeout(() => mongoose.connect(dbURI, {}), 1000);
};

// Monitor connection events
mongoose.connection.on('connected', () => {  
    console.log(`Mongoose connected to ${dbURI}`);  
});  

mongoose.connection.on('error', err => {  
    console.log('Mongoose connection error: ', err);  
});  

mongoose.connection.on('disconnected', () => {  
    console.log('Mongoose disconnected');  
});

// Windows-specific listener
if (process.platform === 'win32') {  
    const rl = readLine.createInterface({  
        input: process.stdin,  
        output: process.stdout  
    });  
    rl.on('SIGINT', () => {  
        process.emit("SIGINT");  
    });  
}

// Graceful shutdown function
const gracefulShutdown = (msg) => {  
    mongoose.connection.close(() => {  
        console.log(`Mongoose disconnected through ${msg}`);  
    });  
};

// Shutdown event listeners
process.once('SIGUSR2', () => {  
    gracefulShutdown('nodemon restart');  
    process.kill(process.pid, 'SIGUSR2');  
});  

process.on('SIGINT', () => {  
    gracefulShutdown('app termination');  
    process.exit(0);  
});  

process.on('SIGTERM', () => {  
    gracefulShutdown('app shutdown');  
    process.exit(0);  
});  

// Connect to MongoDB
connect();

// Import Mongoose schema
require('./travlr');
module.exports = mongoose;
