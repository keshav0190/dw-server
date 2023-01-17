const express = require('express');
const cors = require("cors");
const router = require('./routes');

const app = express();
app.use(express.json());
var corsOptions = {
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(router);
app.use(express.json());
app.listen(8080, () => console.log('server listening on port 8080'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Test." });
  });

