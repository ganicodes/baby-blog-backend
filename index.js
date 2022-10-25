const express = require('express')
const connectToDb = require('./db')
const app = express()
const port = 8000
require('dotenv').config()

app.use(express.json())

//enabling cors
const cors = require('cors')
app.use(cors())

app.use('/api/auth', require("./routes/auth"));



app.listen(port, () => {
    console.log(`Server running at ${port}`)
    connectToDb();
})