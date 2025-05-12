const express = require("express");
const cookieParser = require("cookie-parser");
const expressEjsLayouts = require("express-ejs-layouts");
const multer = require('multer');
const fs = require('fs');
const RHome = require("./routes/homeRoute");
const RSystem = require("./routes/systemRoute");
const RProfessor = require("./routes/professorRoute");
const RAluno = require("./routes/alunoRoute");
const app = express();
const porta = 3000;

app.set("view engine", "ejs")

let upload = multer({ 
    dest: 'uploads/'
     
});


app.use(expressEjsLayouts);
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('public'));
app.use("/",RHome);
app.use("/system",RSystem);
app.use("/system/professores",RProfessor);
app.use("/system/alunos",RAluno);

app.listen(porta,function(){
    console.log("Server aberto em http://localhost:"+porta+" Hello World!");
})
