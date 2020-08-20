const express = require('express')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , MongoStore = require('connect-mongo')(session)
    , morgan = require('morgan')
    , cookieParser = require('cookie-parser')
    , pug = require('pug');

var app = express();
const port = process.env.PORT || 8080;
const mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017/muse';

// db conf
var db = mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

// sessions config
app.use(cookieParser('hunter2'));
app.use(session({
    secret: 'hunter2',
    store: new MongoStore({
        mongooseConnection : mongoose.connection
    }),
    saveUninitialized: true,
    resave: true
}));

app.use(morgan('dev'));

// engine conf
app.set('view engine', 'pug');
app.use(express.static('public'));

// encode post with json 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// include routes
require('./app/routes')(app);

// host and watch
app.listen(port, () => {
    console.log(`listening on ${port}`);
});