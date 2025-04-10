const express = require('express');
const router = express.Router;
const { body, query } = require('express-validator');
const Auth_Contoller = require('../controller/auth');
const tokenVerify = require('../middleware/tokenVerify');

router.post('/signup', [
    body('name').notEmpty().message('name is required'),
    body('emailId').notEmpty().message('emailId is required'),
    body('password').notEmpty().message('password is required'),
    body('roleId').notEmpty().message('roleId is required'),
], Auth_Contoller.authSignUp)

router.post('/login', [
    body('emailId').notEmpty().message('emailId is required'),
    body('password').notEmpty().message('password is required'),
], Auth_Contoller.authLogin)

router.get('/admin/users', tokenVerify, Auth_Contoller.GetUsers)

module.exports = router;