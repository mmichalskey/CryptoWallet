const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//conn ect to database
// ES6 promises
mongoose.Promise = Promise;
mongoose.connect(config.database, { useMongoClient: true, promiseLibrary: global.Promise });

mongoose.connection.on('connected', ()=> {
    console.log(`Connected to database at ${new Date()}`);
});

mongoose.connection.on('error', (err)=> {
    console.log(`Database error: ${error} at ${new Date()}`);
});

const app = express();

const users = require('./routes/users');

const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//bodyparser middleware
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('/', (req, res)=>{
    res.send('Invalid endpoint.');
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname), 'public/index.html');
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
})