var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// var database = require('./config/database'); 	
var app = express();
var PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev')); //show tat ca request ra console 
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));  // ghi de X-HTTP-Method-Override header cua request

const homeRoutes = require('./app/routes/home.routes');
const incomesRoutes = require('./app/routes/incomes.routes');
const expesesRoutes = require('./app/routes/expenses.routes');
const reportsRoutes = require('./app/routes/reportsRoutes');

//ket noi database
const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mrzht4p.mongodb.net/transactions?retryWrites=true&w=majority`
mongoose.connect(database.myUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch(err => {
    console.error("Error: ", err);
})

//set view engine mac dinh la ejs
app.set("views", "./views");
app.set("view engine", "ejs");

//routing 
app.use('/', homeRoutes);
app.use('/', incomesRoutes);
app.use('/', expesesRoutes);
app.use('/', reportsRoutes);

app.listen(PORT, () => {
    console.log("App listening on port" + PORT);
});




