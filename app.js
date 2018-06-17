
/**
 * Module dependencies.
 */

const express = require('express');
const routes = require('./routes');
const user = require('./routes/user');

const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());

app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/sign', user.sign);
app.post('/login', user.login);
app.post('/getUserData', user.getUserData);
app.post('/emailReq', user.emailSend);
app.get('/emailSign/:emailToken', user.emailSign);
app.get('/notice', routes.notice);

app.get('/dayChk', user.getDayChk);
app.post('/reqDayChk', user.reqDayChk);

app.post('/quizData', routes.quizData);
app.post('/quizRes', routes.quizRes);

app.post('/getExam', routes.getExamData);
app.post('/examRes', routes.examRes);

app.post('/tipQuiz', routes.tipQuizReq);

app.post('/getQuestData', routes.getQuestData);
app.post('/updateQuestData', routes.updateQuestData);

app.post('/buyRuby', user.buyRuby);
app.post('/buyLife', user.buyLife);

app.post('/chargeRuby', user.chargeRuby);
app.post('/chargeLife', user.chargeLife);

app.post('/useTip', user.useTip);
app.post('/useRuby', user.useRuby);

app.post('/openGoldTip', user.openGoldTipStage);


app.get('/data/:string', (req, res) => {
  const recvData = req.params;
  const split = recvData.string;
  const md = req.headers['user-agent'];

  if (typeof md !== 'undefined') {
    res.send('wrong approach');
    return;
  }
  if (split.search('..') !== 0) {
    res.send('<p>잘못된접근입니다.</p>');
  } else {
    const file = `${__dirname}/../chart/${split}`;
    const filestream = fs.createReadStream(file);

    filestream.on('open', () => {
      filestream.pipe(res);
    });
    filestream.on('error', (err) => {
      if (err) {
        res.json({ result: 'F' });
      }
    });
  }
});
app.get('/emailImageData/:string', (req, res) => {
  const recvData = req.params;
  const split = recvData.string;
  if (split.search('..') !== 0) {
    res.send('<p>잘못된접근입니다.</p>');
  } else {
    const file = `${__dirname}/public/img/${split}`;
    const filestream = fs.createReadStream(file);

    filestream.on('open', () => {
      filestream.pipe(res);
    });
    filestream.on('error', (err) => {
      if (err) {
        res.json({ result: 'F' });
      }
    });
  }
});

http.createServer(app).listen(app.get('port'), () => {
  // console.log('stockQuiz server on');
});

const interfaces = os.networkInterfaces();
const addresses = [];

for (const k in interfaces) {
  for (const k2 in interfaces[k]) {
    const address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
}

global.addressData = addresses[0];
