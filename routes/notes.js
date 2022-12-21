const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//Route 1 : to get all the notes of a user
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    let notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    return res.status(400).json({ error: "some error occured" });
  }
});

//Route 2: to add notes of a user
router.post(
  "/addnotes",
  fetchuser,
  [
    //applying validation in square bracket through express-validator
    body("title", "title cannot be empty").notEmpty(),
    body("desription", "description must be atleast of length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, desription, tag } = req.body;
      const notes = new Notes({
        user: req.user.id,
        title,
        desription,
        tag,
      });
      const savednotes = await notes.save();
      res.json(savednotes);
    } catch (error) {
      return res.status(400).json({ error: "some error occured" });
    }
  }
);

//Route 3 : update notes
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, desription, tag } = req.body;
  //creacting a new note
  const updatedNote = {};
  if (title) {
    updatedNote.title = title;
  }
  if (desription) {
    updatedNote.desription = desription;
  }
  if (tag) {
    updatedNote.tag = tag;
  }

  //finding the note with id provided in the parameter of endpoint
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(401).send("notes not found");
  }

  //checking user if correct or not by comparing user id of note and use id of req (from middleware)
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("you are not allowed to update the notes");
  }

  //updateing the note
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: updatedNote },
    { new: true }
  );
  res.json({ note });
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("notes not found");
    }

    //checking user if correct or not by comparing user id of note and use id of req (from middleware)
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("you are not allowed to update the notes");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({
      success: "note has been successfully deleted for ",
      note: note.title,
    });
  } catch (error) {
    return res.status(400).json({ error: "some error occured" });
  }
});
module.exports = router;
