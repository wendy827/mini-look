const express = require('express');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const keys = require("../../config/keys");
const router = express.Router();

const User = require('../../models/users');

// 引入验证方法
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// $route  POST /register
// @desc   用户注册
// @access public
router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.json({ success: false, msg: "邮箱已被注册!", code: 202 });
            } else {
                var avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    avatar
                });

                //密码加密
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json({ success: true, msg: "注册成功", code: 200, data: user }))
                            .catch(err => console.log(err));
                    });
                });
            }

        })
})


// $route  POST /login
// @desc   用户登录
// @access public
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.json({ success: false, msg: "用户不存在！", code: 202 })
            }

            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { id: user.id, name: user.name };
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                msg: "登录成功",
                                data: "Bearer " + token
                            });
                        })
                    } else {
                        return res.status(400).json({ success: false, msg: "密码错误!", code: 202 });
                    }
                })
        })

})

// $route  GET /current
// @desc   获取当前登录用户信息
// @access private
// router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({
//         id: req.user.id,
//         name: req.user.name,
//         email: req.user.email
//     });
// })
router.get("/current", (req, res, next) => {
    passport.authenticate('jwt',
        { session: false },
        function (err, user, info) {
            if (user) {
                return res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            } else if (info) {
                return res.json({
                    success: false,
                    code: 2002,
                    msg: info.message
                })
            }

        })(req, res, next);
})

module.exports = router;
