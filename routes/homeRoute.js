const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/homeController");

let HC = new HomeController();

router.get("/",HC.index);
router.get("/acessoNegado",HC.acessoNegado);






module.exports = router;