const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const app = express();

//MongonDB config
const db = require('./config/keys').mongoURI;


const users = require('./routers/api/users');
const profiles = require('./routers/api/profiles');
//const upload = require('./routers/api/upload');
const juheData = require('./routers/api/juhedata');

//配置express的静态目录
app.use('/public', express.static(path.join(__dirname, 'public')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 引入bodyParser中间件(放在路由分配之前。否则是undefined)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//连接数据库
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB is connecting....')
}).catch((err) => {
    console.log('MongoDB connected Error:' + err)
})

//使用中间件实现跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})


// passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);


//使用routers
app.use('/api/users', users);
app.use('/api/profile', profiles);
//app.use('/api/upload', upload);
app.use('/api/juhedata', juheData);

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
