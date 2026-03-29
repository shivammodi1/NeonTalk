const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/token");


const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Sign Up Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout
const logout = (req, res) => {
  try {
    // console.log("Logout route hit");  
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signUp, login, logout };
