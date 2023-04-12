const express = require("express");
const router = express.Router();

const api = require("../controller/apiController");

router.post("/monitoring", api.monitoringController);
router.post("/embed", api.getEmbedController);
router.post("/player", api.getSourcePlayer);
router.post("/animes", api.getAllListAnimeController);
router.post("/details", api.getDetailsAnimeControler);

module.exports = router;
