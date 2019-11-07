//@desc 使用multer中间件上传文件
const express = require('express');
const multer = require('multer');
const passport = require("passport");
//新浪sdk引用
const sinaCloud = require('scs-sdk');
const pathLib = require('path');
const fs = require('fs');
const router = express.Router();

//const uploadDir = 'uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate();

//配置diskStorage来控制文件存储的位置以及文件名字等
const storage = multer.diskStorage({
    //确定图片存储的位置(如果是一个函数，则路径必须是已经存在的，否则会报错)
    destination: "uploads/",
    //文件名
    filename(req, file, cb) {
        const filenameArr = file.originalname.split('.');
        cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
    }
});

//生成的专门处理上传的一个工具，可以传入storage、limits等配置
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // 限制文件上传类型，仅可上传png,jpg格式图片
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('不支持上传该类型文件'));
        }
    }
});

let multerUpload = upload.single('file');
//接收上传图片请求的接口(单文件)
router.post('/uploadfile', (req, res, next) => {
    passport.authenticate('jwt',
        { session: false },
        function (err, user, info) {
            if (info) {
                return res.json({
                    success: false,
                    code: 2002,
                    msg: info.message
                })
            }

            multerUpload(req, res, (err) => {
                if (err) {
                    return res.json({
                        success: false,
                        code: 201,
                        msg: err.message
                    })
                }
                if (req.file) {
                    const url = '/uploads/' + req.file.filename;
                    res.json({
                        success: true,
                        code: 200,
                        data: url
                    })
                } else {
                    res.json({
                        success: false,
                        code: 201,
                        msg: '系统异常，文件上传失败'
                    })
                }
            });

        })(req, res, next);

});




//传入配置好的scs.json文件，这里面主要放新浪云的accessKey和secretKey
var scsConfig = new sinaCloud.Config({
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    sslEnabled: false
});
sinaCloud.config = scsConfig;
const uploadsCloud = multer({
    dest: '../../uploads'
})
//定义一个图片上传的临时目录，本地的
//实例化新浪云储存
const s3 = new sinaCloud.S3();

//上传方法
router.post('/uploadimgs', uploadsCloud.single('file'), (req, res) => {
    //uploads.single  是一次只传一张图片
    var pathNew = req.file.path + pathLib.parse(req.file.originalname).ext;
    //这是新的文件名
    fs.rename(req.file.path, pathNew, function (err) {
        if (err) {
            res.json({
                success: false,
                msg: "上传失败"
            });
        } else {
            let fileName = pathNew;
            let remoteFilename = req.file.originalname;
            var fileBuffer = require('fs').readFileSync(fileName);
            //上传文件
            s3.putObject({
                ACL: 'public-read',
                Bucket: 'wendy1/imgs', //上传至wendy1文件夹里的imgs文件夹里
                Key: remoteFilename,
                Body: fileBuffer
            }, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    //上传图片成功，将图片地址返回给前端
                    let path = "新浪存储路径/" + remoteFilename;
                    res.json({
                        success: true,
                        msg: "上传成功",
                        data: path
                    })
                }
            });
        }
    });
})




module.exports = router;