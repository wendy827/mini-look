const express = require('express');
const request = require('request');
const querystring = require('querystring');
const router = express.Router();

/*
  根据时间戳返回该时间点前或后的笑话列表 
*/
router.post('/jokelist', (req, res) => {
    const queryData = querystring.stringify({
        sort: req.body.sort || 'desc', //desc:指定时间之前发布的，asc:指定时间之后发布的
        time: String(Date.now()).substr(0, 10),
        page: req.body.page,
        pagesize: req.body.pagesize,
        key: "你的key"
    });

    const queryUrl = 'http://v.juhe.cn/joke/content/list.php?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});

/*
    获取最新的笑话
 */
router.post('/jokelistnew', (req, res) => {
    const queryData = querystring.stringify({
        page: req.body.page,
        pagesize: req.body.pagesize,
        key: "你的key"
    });

    const queryUrl = 'http://v.juhe.cn/joke/content/text.php?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});

/*随机获取笑话 */
router.post('/jokelistrandom', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key"
    });

    const queryUrl = 'http://v.juhe.cn/joke/randJoke.php?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});


/**
 * 新闻头条
 * type:top(头条，默认),shehui(社会),guonei(国内),guoji(国际),yule(娱乐),tiyu(体育)junshi(军事),keji(科技),caijing(财经),shishang(时尚)
 */
router.post('/toutiao', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key",
        type: req.body.type
    });

    const queryUrl = 'http://v.juhe.cn/toutiao/index?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});

/**
 * 图书分类目录
 */
router.get('/booktype', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key"
    });

    const queryUrl = 'http://apis.juhe.cn/goodbook/catalog?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});

/**
 * 根据分类获取图书
 */
router.post('/booklist', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key",
        catalog_id: req.body.catalog_id,
        pn: req.body.pn,
        rn: req.body.rn
    });

    const queryUrl = 'http://apis.juhe.cn/goodbook/query?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});



/**
 * 历史事件列表（v1.0）
 * @param v  	string	版本，当前：1.0
 * @param month  int	月份，如：10
 * @param day  	int	日，如：1
 */
router.post('/historyeventold', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key",
        v: "1.0",
        month: req.body.month,
        day: req.body.day
    });

    const queryUrl = 'http://api.juheapi.com/japi/toh?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});


/**
 * 历史事件列表（v2.0）
 * @param date,格式:月/日 如:1/1,/10/1,12/12 如月或者日小于10,前面无需加0
 */
router.post('/historyevent', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key",
        date: req.body.date
    });

    const queryUrl = 'http://v.juhe.cn/todayOnhistory/queryEvent.php?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});


/**
 * 历史事件详情
 * @param e_id 	事件id
 */
router.post('/historydetail', (req, res) => {
    const queryData = querystring.stringify({
        key: "你的key",
        e_id: req.body.e_id
    });

    const queryUrl = 'http://v.juhe.cn/todayOnhistory/queryDetail.php?' + queryData;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonObj = JSON.parse(body);
            if (jsonObj.error_code == 0) {
                res.json({
                    success: true,
                    code: jsonObj.error_code,
                    data: jsonObj.result
                });
            } else {
                res.json({
                    success: false,
                    code: jsonObj.error_code,
                    msg: jsonObj.reason
                });
            }
        } else {
            res.json({
                success: false,
                code: response.statusCode || 500,
                msg: "请求异常"
            });
        }
    });
});


module.exports = router;