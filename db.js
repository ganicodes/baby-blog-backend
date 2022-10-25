const mongoose = require('mongoose');

const connectToDb = () => {
    try {
        mongoose.connect(process.env.MONGO_DB);
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("DB is disconnected")
})
mongoose.connection.on("connected", () => {
    console.log("Connected to DB");
})


module.exports = connectToDb