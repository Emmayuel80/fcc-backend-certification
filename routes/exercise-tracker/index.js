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
  if (!user) return res.json({ error: "User not found" });
  user.log.push({ description, duration, date });
  await user.save();
  res.json(user);
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
  res.json({ ...user._doc, log });
});

module.exports = router;