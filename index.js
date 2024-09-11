require("dotenv").config();

const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const connectDatabase = require("./db");

connectDatabase();

app.use(express.json());
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/course", courseRouter);

app.get("/", (req, res) => {
  res.send("Server is up");
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port ", process.env.PORT);
});
