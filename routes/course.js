const router = require("express").Router();
const Course = require("../models/course");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses) return res.send(courses).status(200);
    else return res.send("No courses found").status(404);
  } catch (error) {
    res.send(error).status(500);
  }
  res.send("get All courses");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    return course ? res.send(course) : res.send("Course not found").status(404);
  } catch (error) {
    res.send(error).status(500);
  }
  res.send("get course by id");
});

router.post("/", async (req, res) => {
  const courseData = req.body;
  try {
    const course = await new Course(courseData).save();
    if (course) {
      return res.status(201).send(course);
    } else {
      return res.send("error creating course").status(500);
    }
  } catch (error) {
    return res.send("error creating course").status(500);
  }
  res.send("create new course");
});

module.exports = router;
