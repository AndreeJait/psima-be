const mongoose = require('mongoose');
const env = require('../env');
mongoose.connect(env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(res => {
    console.log("connect succesfully ")
}).catch(err => {
    console.log("Can't connect to db because : \n" + err)
});