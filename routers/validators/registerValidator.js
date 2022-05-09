const { check } = require('express-validator');
module.exports = [
    check('email').exists().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    check('password').exists().withMessage('Password is required').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('fullname').exists().withMessage('Fullname is required').notEmpty().withMessage('Fullname is required')
    .isLength({ min: 6 }).withMessage('Fullname must be at least 6 characters long'),
];