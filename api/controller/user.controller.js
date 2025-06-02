// import User from "../model/User.js";
import {saveUser, loginUser} from "../services/user.services.js";

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const register = async (req, res) => {
    console.log("Registering user", req.body.username);
    console.log

    if (!req.body.username || !req.body.password || !req.body.email) {
        console.log("Error registering user", req.body);
        return res.status(400).json({ message: "Please input valid username, email, and password" });
    }
    if(req.body.password.length < 6) {        
        console.log("Error registering user", req.body);
        return res.status(400).json({ message: "Password too short" });
    }
    if (!isValidEmail(req.body.email)) {
        console.log("Error registering user", req.body);
        return res.status(400).json({ message: "Please input valid email" });
    }
    saveUser(req,res);
};

export const login = async (req, res) => {
    console.log("Logging in user", req.body);

    if (!req.body.username || !req.body.password) {
        console.log("Error logging in user", req.body);
        return res.status(400).json({ message: "Please input valid username and password" });
    }
    loginUser(req,res);
}
