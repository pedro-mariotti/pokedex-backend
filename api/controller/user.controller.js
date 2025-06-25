// import User from "../model/User.js";
import {saveUser, loginUser} from "../services/user.services.js";

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const register = async (req, res, next) => {
    const { username, password, email } = req.body;

    // Validação de entrada no controller
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }
    if(password.length < 6) {        
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Chama o serviço. Se um erro for lançado, o handler irá capturá-lo.
    const newUser = await saveUser({ username, password, email });
    
    // Responde com 201 Created em caso de sucesso
    res.status(201).json({
        message: "User registered successfully",
        user: newUser,
    });
};

export const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const { token, user } = await loginUser({ username, password });

    res.status(200).json({
        message: "Login successful",
        token,
        userId: user.id, // Mantém a consistência com o que o frontend espera
    });
}
