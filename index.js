const express = require('express');
const connectToDb = require('./db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express()
const port = 8000

app.use(express.json())
app.use(cookieParser());

//enabling cors
const cors = require('cors')
app.use(cors())


app.use('/api/auth', require("./routes/auth"));
app.use('/api/users', require("./routes/users"));
app.use('/api/posts', require("./routes/posts"));
app.use('/api/categories', require("./routes/categories"));


// using multer to store images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, 'image' + '-' + uniqueSuffix + '.jpeg')
        cb(null, 'image.jpeg') //file.fieldName to get name from form
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json({ success: true, message: "Uploaded successfully" })
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
    connectToDb();
})