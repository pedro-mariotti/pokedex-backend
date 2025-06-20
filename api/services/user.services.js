/* eslint-disable no-undef */
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const saveUser = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username,
      password: hashedPassword,
      email,
    });
    //console.log("User saved", savedUser.username);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user:", error.message); // Log detalhado no servidor
    return res.status(500).json({ message: "An error occurred while registering the user." }); // Mensagem genérica para o cliente
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("User logged in", user.username);
    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message); // Log detalhado no servidor
    return res.status(500).json({ message: "An error occurred during login." }); // Mensagem genérica para o cliente
  }
};
