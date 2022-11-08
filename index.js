const express = require('express');
const connectToDb = require('./db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cors = require('cors')

const app = express()
const port = 8000

app.use(express.json())
app.use(cookieParser());

//enabling cors
app.use(cors())


app.use('/api/auth', require("./routes/auth"));
app.use('/api/users', require("./routes/users"));
app.use('/api/posts', require("./routes/posts"));
app.use('/api/categories', require("./routes/categories"));


// using multer to store images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/images')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json({ success: true, filePath: file.filename })
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
    connectToDb();
})