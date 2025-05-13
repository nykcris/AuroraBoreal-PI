const express = require("express");
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const systemController = require("../controllers/systemController");

let AMD = new authMiddlewareDirecao();
let SC = new systemController();



module.exports = router;
