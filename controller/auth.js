const jwt = require('jsonwebtoken');
const allModels = require('../utils/allModels');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

exports.authSignUp = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const { name, emailId, password } = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const addUser = await allModels.UserModel.create({
            name: name,
            emailId: emailId,
            password: hashPassword,
        })

        if (addUser) {
            return res.json({ message: "user created successfully.", admin: addUser })
        } else {
            return res.status(422).json({ message: "Something went wrong." })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.authLogin = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const { emailId, password } = req.body;

    try {
        const findUser = allModels.UserModel.findOne({
            where: {
                emailId: emailId,
            }
        })

        if (!findUser) {
            return res.status(422).json({ message: "user not found" })
        }

        let passwordMatch = await bcrypt.compare(password, findUser.password)
        if (!passwordMatch) {
            return res.status(422).json({ message: "password mismatch." })
        }

        const token = jwt.sign({
            id: findUser.id,
            emailId: emailId,
            isAdmin: user.isAdmin
        }, process.env.SECRET);

        return res.json({ message: "user Successfully login", user: findUser, token: token })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.GetUsers = async (req, res) => {

    try {
        if (!req.user.isAdmin) return res.status(403).json({message: "You are not Admin"});
        const users = await allModels.UserModel.findAll();
        if(users){
            return res.json(users);
        }else{
            return res.status(400).json({message: "user not found."});
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

