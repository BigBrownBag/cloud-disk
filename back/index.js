const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload");
const cors = require('cors');

const app = express();
const PORT = config.get('serverPort');

app.use(fileUpload({}));
app.use(express.json());
app.use(express.static('static'));
app.use(cors({
    credentials: true,
    origin: config.get("clientUrl")
}));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        app.listen(PORT, () => {
            console.log('server started on port ', PORT);
        });
    }
    catch (e) {
        console.log(e)
    }
};

start();