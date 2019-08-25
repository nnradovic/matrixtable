const products = require('../config/products.json')
const express = require("express");
const router = express.Router();

router.get("/",  (req, res) => {
    try {

      return  res.send(products)

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

  module.exports = router