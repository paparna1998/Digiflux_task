const allModels = require('../utils/allModels');
const jwt = require('jsonwentoken');
const { validationResult } = require('express-validation')

const tokenVerify = async (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const inputToken = req.header('Authorization');

    if (!inputToken) {
        return res.status(403).json({ message: "inavlid token." })
    } else {
        const token = inputToken.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, async (error, result) => {
            if (error) {
                return res.status(403).json({ message: "Unauthorize access." })
            }
        })

        try {
            const user = await allModels.Admin_Model.findById(result.id);
            if (!user) {
                return res.status(422).json({ message: "User not found" })
            }
            req.user = user;
            next()
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = tokenVerify;