/* eslint-disable no-undef */
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const saveUser = async (userData) => {
  const { username, password, email } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    // Retorna o objeto do usuário sem a senha
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    // Lança um erro mais específico para chaves duplicadas (usuário/email já existe)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const err = new Error(`A user with that ${field} already exists.`);
      err.statusCode = 409; // 409 Conflict
      throw err;
    }
    // Lança outros erros para serem tratados pelo handler
    throw error;
  }
};

export const loginUser = async (credentials) => {
  const { username, password } = credentials;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    const err = new Error("Invalid username or password.");
    err.statusCode = 401; // Unauthorized
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid username or password.");
    err.statusCode = 401; // Unauthorized
    throw err;
  }

  // Se as credenciais são válidas, cria e retorna o token e os dados do usuário
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};
