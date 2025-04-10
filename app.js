const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(cors());

const dbConnection = require("./utils/dbConnection");
const rateLimiter = require('./middleware/rateLimit');
app.use(rateLimiter);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const {
    All_Model_Relationship
} = require("./utils/all_Models_Relationship");
All_Model_Relationship();

const userRoutes = require("./appRoute");
userRoutes.routes(app);

dbConnection.sync();

app.listen(5000 || process.env.PORT, () => {
    console.log(`Server connected on port ${process.env.PORT}`)
})