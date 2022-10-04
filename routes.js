const axios = require("axios");
const express = require("express");
const app = express();

app.get("/users/:id", async function ({ params: { id } }, res) {
  try {
    const { data } = await axios.get(`https://reqres.in/api/users/${id}`);
    res.status(200).json(data);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

module.exports = app;
