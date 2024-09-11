const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };

  const result = Joi.isSchema(schema, req.body);
  if (result.error) {
    console.log(result.error);
    return res.status(400).send(result.error);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).send(token);
  } catch (e) {
    res.send(e);
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const savedUser = await user.save();
  const token = jwt.sign({ _id: savedUser._id }, "secretKey");
  res.send(token);
});

module.exports = router;
