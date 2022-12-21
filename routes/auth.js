const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const JWT_SECRET = "thisisjwtsecret";

//Route 1 : to create a new user
router.post(
  "/createUser",

  [
    //applying validation in square bracket through express-validator
    body("emailId").isEmail(),
    body("name", "name must be atlaest of length 5 ").isLength({ min: 5 }),
    body(
      "password",
      "password must be atlaest of length 5 and atmost 12"
    ).isLength({ min: 5, max: 12 }),
  ],

  //this is the func
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //here using await because if we dnt await here it will alway show the email error
      let user = await User.findOne({ emailId: req.body.emailId });
      if (user) {
        return res.status(400).json({
          error: "The email is already registered. Use different email address",
        });
      }
      //both will return promise that's why we use await to wait for the result otherwise will give error
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        emailId: req.body.emailId,
        password: securePass,
      });
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err), res.json({ error: "please enter different emailid" });
      // });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.send(req.body);
      // res.json({ authtoken });
      res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: "some error occured" });
    }
  }
);

//Route 2: to login
router.post(
  "/login",
  [
    //applying validation in square bracket through express-validator
    body("emailId").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { emailId, password } = req.body;
    try {
      let user = await User.findOne({ emailId });

      if (!user) {
        return res
          .status(400)
          .json({ error: "You are not register. Kindly register first" });
      }
      const passwordCompare = bcrypt.compareSync(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Password incorrect" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.send(req.body);
      res.json({ authtoken });
      //here using await because if we dnt await here it will alway show the email error
    } catch (error) {
      return res.status(400).json({ error: "some error occured" });
    }
  }
);
//Route 3: get user
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    let getuser = await User.findById(userid).select("-password");
    res.send(getuser);
  } catch (error) {
    return res.status(500).json({ error: "internal error" });
  }
});

module.exports = router;
