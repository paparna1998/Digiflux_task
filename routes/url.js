const express = require('express');
const router = express.Router;
const { body, query } = require('express-validator');
const Url_Contoller = require('../controller/url');
const tokenVerify = require('../middleware/tokenVerify');

router.post('/urls', [
    body('originalUrl').notEmpty().message('originalUrl is required'),
    body('customAlias').notEmpty().message('customAlias is required'),
], tokenVerify, Url_Contoller.CreateShortUrl)

router.get('/:shortCode', [
    query('shortCode').notEmpty().message('shortCode is required'),
], Url_Contoller.Url_Redirect)

router.get('/urls', tokenVerify, Url_Contoller.Get_Urls)

router.get('/urls/:id/analytics', [
    query('id').notEmpty().message('id is required'),
], tokenVerify, Url_Contoller.Get_Urls_Analytics)

router.delete('/admin/urls/:id', [
    query('id').notEmpty().message('id is required'),
], tokenVerify, Url_Contoller.Delete_Urls)

module.exports = router;