const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')
const fs = require('fs')


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
// Read data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'))

const importData = async () => {
    try{
        await Tour.create(tours)
        console.log("Created Successful");
        process.exit()
    } catch(err){   
        console.log(err);
    }
}
const removeData = async () => {
    try{
        await Tour.deleteMany()
        console.log('Delete Success');
        process.exit()
    } catch(error)
    {
        console.log(error);
    }
}
if(process.argv[2] === '--import')
{
    importData()
}
if(process.argv[2] === '--delete')
{
    removeData()
}