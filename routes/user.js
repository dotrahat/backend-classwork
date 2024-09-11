const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// get all users
router.get("/", auth, async (req, res) => {
  if (req.query) {
    const users = await User.find(req.query);
    return res.send(users);
  }

  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    console.log("Error getting users from db: ", e);
    return res.status(500).send("Error getting users");
  }

  return res.send("All Users");
});

// get user by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    return res.send(user);
  } catch (e) {
    console.log("Error getting user from db: ", e);
    return res.status(500).send("Error getting user");
  }
});

// create new user
router.post("/", async (req, res) => {
  const existsAlready = await User.exists({ email: req.body.email });
  if (existsAlready) return res.status(400).send("User already exists");

  const user = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  const newUser = new User(user);

  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (error) {
    console.log("Error saving user in db: ", error);
    return res.status(500).send("Error creating user");
  }

  return res.send({ "user POST request with data:": req.body });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.send("Invalid user ID").status(400);
  }

  try {
    const userExists = await User.exists({ _id: id });

    if (!userExists) {
      return res.send("User not found").status(404);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.send(updatedUser);
  } catch (error) {
    console.log("Error updating user in db: ", error);
    return res.send("Error updating user").status(500);
  }

  return res.send("user PUT request for user ID, ", req.params.id);
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const isIDValid = isValidObjectId(id);
  if (!isIDValid) return res.status(400).send("Invalid ID");

  try {
    const user = await User.findById(id);
    const newUserData = { ...user, ...req.body };
    const updatedUser = await User.updateOne({ _id: id }, newUserData);

    return res.send(updatedUser);
  } catch (error) {
    console.log("Error updating user fields", error);
    return res.send(error);
  }

  return res.send("user PATCH request for user ID, ", req.params.id);
});

router.delete("/:id", (req, res) => {
  return res.send("user DELETE request for user ID, ", req.params.id);
});

module.exports = router;
