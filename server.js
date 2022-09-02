const mongoose = require('mongoose')
const app = require('./app');
const port = 3000
const dotenv = require('dotenv')
// const Tour = require('./models/tourModel')


dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,   
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(con => {
        // console.log(con.connections)
        console.log("Connect Success");
    })
    .catch(err => console.error("ERROR", err.message))

app.listen(port, function () {
    console.log(`Server listening on port ${port}`)
})
