import User from "../models/UserModal.js";
import jwt from 'jsonwebtoken';

const userRegistration = async (req, res) => {
    try {
        console.log("Request Body: ", req.body);
        const { name, email, password } = req.body;

        const isUserExist = await User.findOne({ $or: [{ email }, { name }] });

        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const userInfo = new User({
            name,
            email,
            password
        });

        await userInfo.save();

        return res.status(201).send(userInfo);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Check password
        const isPasswordCorrect = await isUserExist.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //token generating
        const expiresIn = 30 * 24 * 60  * 60 ;

        const token = jwt.sign({ _id: isUserExist._id }, process.env.JWT_SECRET, { expiresIn });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            maxAge: expiresIn * 1000
        });

        isUserExist.password = undefined;

        return res.status(200).json({ ...isUserExist.toJSON(), expiresIn });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export  {
    userRegistration,
    userLogin
}