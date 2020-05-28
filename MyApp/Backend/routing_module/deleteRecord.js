const express = require("express");
const router = express.Router();

router.post("/:userId", async (req, res) => {
  console.log("module routing deleteRecord");
  const models = require("../models/");
  try {
    await models.user.destroy({ where: { "id": req.params.userId } });
  } catch (e) {
    console.log("エラー：", e);
  }
});

module.exports = router;