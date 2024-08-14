require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const { Op } = require('sequelize')
const cors = require('cors')
const fs = require('fs');
const https = require('https')
const Route = require('./routes/route')
const errorHandler = require('./middleware/ErrorHandling')
const path = require('path')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000;

const app = express();


app.use(cors())
app.use(express.json())
// app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true}));
app.use('/api', Route);

// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8'); 
const certificate = fs.readFileSync('cert.pem', 'utf8'); 
const ca = fs.readFileSync('chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);

// Обработка ошибок, последний middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        
        httpsServer.listen(port, async() => {
            console.log('HTTPS Server Admin-resender-bot running on port ' + port);
               
        }); 

    } catch (error) {
        console.log('Подключение к БД сломалось!', error)
    }
}

start()