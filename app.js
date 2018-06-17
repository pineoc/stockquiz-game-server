
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var MobileDetect = require('mobile-detect');
var winston = require('winston');
var moment_t = require('moment-timezone');

var http = require('http');
var path = require('path');
var fs = require('fs');
var os = require('os');

var app = express();

var logger = new (winston.Logger)({
    // 아래에서 설명할 여러개의 transport를 추가할 수 있다.
    transports: [
        new (winston.transports.File)({
            name: 'exception-file',
            filename: __dirname+'/../log/exception/error.log',
            level: 'error',
            json:false,
            timestamp:function(){
                return moment_t().tz("Asia/Seoul").format('YYYY-MM-DD HH:mm:ss');
            }
        })
    ]
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('dev'));

var loggerAll = new (winston.Logger)({
    transports: [
      new winston.transports.DailyRotateFile({
        timestamp: function(){
                var d = moment_t().tz("Asia/Seoul").format();
                return d.substring(0,d.length-6);
        },
        filename:__dirname+'/../log/dayLog/d.log',
        colorize:true,
        json:false,
        datePattern:'.yyyy-MM-dd'
        })
    ]
  });
var winstonStream = {
    write: function(msg, encoding){
        loggerAll.info(msg);
    }
};
app.use(express.logger({
        format : 'dev',
        stream: winstonStream
}));

app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

process.on('uncaughtException',function(exception){
    console.log('uncaughtException occurred: ' + exception.stack);
    logger.error('exception on ',exception);
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/sign',user.sign);
app.post('/login',user.login);
app.post('/getUserData',user.getUserData);
app.post('/emailReq',user.emailSend);
app.get('/emailSign/:emailToken',user.emailSign);
app.get('/notice',routes.notice);

app.get('/dayChk',user.getDayChk);
app.post('/reqDayChk',user.reqDayChk);

app.post('/quizData',routes.quizData);
app.post('/quizRes',routes.quizRes);

app.post('/getExam',routes.getExamData);
app.post('/examRes',routes.examRes);

app.post('/tipQuiz',routes.tipQuizReq);

app.post('/getQuestData',routes.getQuestData);
app.post('/updateQuestData',routes.updateQuestData);

app.post('/buyRuby',user.buyRuby);
app.post('/buyLife',user.buyLife);

app.post('/chargeRuby',user.chargeRuby);
app.post('/chargeLife',user.chargeLife);

app.post('/useTip',user.useTip);
app.post('/useRuby',user.useRuby);

app.post('/openGoldTip',user.openGoldTipStage);


app.get('/data/:string',function(req,res){
    var recvData = req.params;
    var split = recvData.string;
    var md = req.headers['user-agent'];
    if(typeof md !== 'undefined'){
        res.send('wrong approach');
        return;
    }
    if(split.search('..')!=0){
        res.send('<p>잘못된접근입니다.</p>');
        return;
    }
    else{
        var file = __dirname+'/../chart/'+split;
        var filestream = fs.createReadStream(file);

        filestream.on('open',function(){
            filestream.pipe(res);
        });
        filestream.on('error',function(err){
            if(err){
                res.json({result:'F'});
            }
        });
    }
});
app.get('/emailImageData/:string',function(req,res){
    var recvData = req.params;
    var split = recvData.string;
    if(split.search('..')!=0){
        res.send('<p>잘못된접근입니다.</p>');
        return;
    }
    else{
        var file = __dirname+'/public/img/'+split;
        var filestream = fs.createReadStream(file);

        filestream.on('open',function(){
            filestream.pipe(res);
        });
        filestream.on('error',function(err){
            if(err){
                res.json({result:'F'});
            }
        });
    }
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('stockQuiz server on');
});


//server configure file
var confData = fs.readFileSync('./config.json');
var data = JSON.parse(confData);
console.log('server Version : ',data.serverVersion);

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
GLOBAL.addressData = addresses[0];
