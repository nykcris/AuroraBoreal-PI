const express = require("express");
const RHome = require("./routes/homeRoute");
const RSystem = require("./routes/systemRoute");
const expressEjsLayouts = require("express-ejs-layouts");
const app = express();
const porta = 25565;

app.set("view engine", "ejs")



app.use(expressEjsLayouts);
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/",RHome);
app.use("/system",RSystem);

app.listen(porta,function(){
    console.log("Server aberto em http://localhost:"+porta+" Hello World!");
})