const settings = require('../config/settings.json')
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {

      return await res.send(settings)

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

  module.exports = router