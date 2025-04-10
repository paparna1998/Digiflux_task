const allModels = require('../utils/allModels');
const { validationResult } = require('express-validator');

exports.CreateShortUrl = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }
    const { originalUrl, customAlias } = req.body;

    try {
        const shortCode = customAlias || uuidv4().slice(0, 6);
        const exists = await allModels.ShortUrl_Model.findOne({ where: { shortCode } });
        if (exists) {
            return res.status(400).json({ message: 'Alias already in use' });
        }
        const url = await allModels.ShortUrl_Model.create({ originalUrl, shortCode, userId: req.user.id });
        return res.json(url);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.Url_Redirect = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const { shortCode } = req.params;
    try {
        const url = await allModels.ShortUrl_Model.findOne({ where: { shortCode: shortCode } });
        if (!url) return res.status(404).json({ message: 'URL not found' });
        url.clicks++;
        await url.save();
        await allModels.Click_Model.create({ shortUrlId: url.id, userAgent: req.headers['user-agent'], referrer: req.headers.referer });
        return res.redirect(url.originalUrl);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.Get_Urls = async (req, res) => {
    try {
        const urls = await ShortURL.findAll({ where: { userId: req.user.id } });
        if (urls) {
            return res.json(urls);
        } else {
            return res.status(400).json({ message: "Urls not found." })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.Get_Urls_Analytics = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const { id } = req.params;
    try {
        const clicks = await allModels.Click_Model.findAll({ where: { shortUrlId: id } });
        if (clicks) {
            return res.json({ totalClicks: clicks.length, details: clicks });
        } else {
            return res.status(400).json({ message: "clicks not found." })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.Delete_Urls = async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(422).json({ errors: validationError.array() });
    }

    const { id } = req.params;
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({message: "You are not admin."});
        }
        await allModels.ShortUrl_Model.destroy({ where: { id: id } });
        return res.send({message: "user deleted successfully."});
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
