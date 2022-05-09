const { check } = require('express-validator');
module.exports = [
    check('username').exists().withMessage('Username không được để trống').notEmpty().withMessage('Username không được để trống').isNumeric().withMessage('Phải là số').isLength(10).withMessage('Username phải phòm 10 ký tự số'),
    check('password').exists().withMessage('Password không được để trống').notEmpty().withMessage('Password không được để trống')
    .isLength({ min: 6 }).withMessage('Password gồm 6 ký tự trở lên'),
];