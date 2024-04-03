const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.post("/", async (req, res) => {
  const { username } = req.body;
  const user = await User.create({ username });
  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/:id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params.id;
  const user = await User.findById(userId);
  let dateObject = date ? new Date(date) : new Date();
  if (!user) return res.json({ error: "User not found" });
  user.log.push({ description, duration, dateObject });
  await user.save();
  let log = [...user.log];
  // convert date to string on the log
  log = log.map((exercise) => ({
    ...exercise._doc,
    date: new Date(exercise.date).toDateString(),
  }));
  res.json({
    username: user.username,
    description,
    duration,
    date: dateObject.toDateString(),
    _id: user._id,
  });
});

router.get("/:id/logs", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return res.json({ error: "User not found" });
  let { from, to, limit } = req.query;
  from = new Date(from);
  to = new Date(to);
  let log = user.log.filter((exercise) => {
    if (from && exercise.date < from) return false;
    if (to && exercise.date > to) return false;
    return true;
  });
  if (limit) log = log.slice(0, limit);
  // convert date to string on the log
  log = log.map((exercise) => ({
    ...exercise._doc,
    date: exercise.date.toDateString(),
  }));
  res.json({ ...user._doc, log, count: user.log.length });
});

module.exports = router;
