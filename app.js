import createError from 'http-errors'
import express from 'express';
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan';
import router from './routes/index'
import expressJwt from 'express-jwt'
import config from './config/index'
import './mongodb/db.js';

const app = express();

// 跨域设置
app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin || 'http://localhost:8080' || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.sendStatus(200);
	} else {
	    next();
	}
});

// 定义签名
const secret = config.session.secret
//使用中间件验证token合法性
app.use(expressJwt({
  secret: secret,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {//自定义getToken 默认有这个函数 
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {//支持 get
        token = req.query.token.split(' ')[1];
    }
    console.log("Token %s",token);
    return token;
  }
}).unless({
  path: ['/public/*', '/api/back/login']
}))

//拦截器
app.use(function (err, req, res, next) {
  //当token验证失败时会抛出如下错误
  if (req.method !== 'OPTIONS') {
    if (err.name === 'UnauthorizedError') {   
      //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      res.status(401).send({
        code: 401,
        sucess: false,
        message: 'token 验证失败, 请重新登录'
      });
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10000kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
