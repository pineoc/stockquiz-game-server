
/*
 * GET users listing.
 */

const crypto = require('crypto');
const email = require('emailjs');
const fs = require('fs');
const async = require('async');
const winston = require('winston');
const moment = require('moment');

const db = require('./DB');

const server = email.server.connect({
  user: '****@gmail.com',
  password: '****',
  host: 'smtp.gmail.com',
  ssl: true,
});
const cronJob = require('cron').CronJob;

const serverKey = '****';

const page = 'http://braveimg.cafe24.com:3000/';

// server configure file
const confData = fs.readFileSync('./config.json');
const cdata = JSON.parse(confData);

exports.list = function (req, res) {
  res.redirect(page);
};

/*
 * setting job for ranking data, on friday
 *
 * */
const job = new cronJob({
  cronTime: '05 00 00 * * 0-6',
  onTick: () => {
    // Runs every day
    // at 00:00:05 AM.

    // console.log('reset time : ',time);
    db.pool.getConnection((err, connection) => {
      if (err) {
        console.log('error on reset data conn pool', err);
      } else {
        // set curr Money and earnRate
        connection.query('UPDATE member SET logined=0, lifeAllUsed=0,' +
          'vipLoginCount=IF(vipLoginBit = 0 AND vipLoginCount >= 1,vipLoginCount-1,vipLoginCount),' +
          'vipLifeAllUsedCount=IF(vipLifeAllUsedBit=0 AND vipLifeAllUsedCount>=1,vipLifeAllUsedCount-1,vipLifeAllUsedCount),' +
          'vipLoginBit=0,vipLifeAllUsedBit=0,examCount=IF(vipLevel=3,5,3)', [], (err2, result) => {
          if (err2) {
            console.log('error on reset data query', err2);
          } else if (result.affectedRows >= 1) {
            console.log('day job affected.');
          } else {
            console.log('no reset job1');
          }
          connection.release();
        });// query
      }
    });// conn pool
  },
  start: false,
  timeZone: 'Asia/Seoul',
});

const job2 = new cronJob({
  cronTime: '05 00 00 1 * *',
  onTick: () => {
    // Runs every month
    // at 00:00:05 AM.

    db.pool.getConnection((err, connection) => {
      if (err) {
        console.log('error on reset data conn pool', err);
      } else {
        // set curr Money and earnRate
        connection.query('UPDATE member SET loginCount=0', [], (err2, result) => {
          if (err2) {
            console.log('error on reset data query', err2);
          } else if (result.affectedRows >= 1) {
            console.log('month job affected.');
          } else {
            console.log('no reset job2');
          }
          connection.release();
        });// query
      }
    });// conn pool
  },
  start: false,
  timeZone: 'Asia/Seoul',
});
job.start();
job2.start();


/*
 * [post] sign on server
 * req : phoneKey
 * res : ID, ruby, maxStage, currStage,
 *       ch4Perm, ch5Perm, ch6Perm, ch7Perm,
 * */
exports.sign = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;
    // console.log('recvData on sign : ', data);

    const shasum = crypto.createHash('sha512');
    // ID = sha512(phoneKey + currTime + serverKey)
    shasum.update((data.phoneKey.toString() + serverKey));

    const ID = shasum.digest('hex');
    const signStageData = VStageData;

    db.pool.getConnection((err, conn) => {
      if (err) {
        console.log('error on pool sign, ERR : ', err);
        res.json({ result: 'F', code: 1 });
        // return;
      } else {
        conn.query(
          'INSERT INTO member(ID,stageData,questData) VALUES(?,?,?)',
          [ID, JSON.stringify(signStageData), JSON.stringify(VQuestData)],
          (errq, result) => {
            if (errq) {
              if (errq.code === 'ER_DUP_ENTRY') {
                // if exists, login use exist ID
                conn.query('SELECT * FROM member WHERE ID=?', [ID], (errq2, result2) => {
                  if (errq2) {
                    console.log('err SELECT sign, ERR : ', errq2);
                    res.json({ result: 'F', code: 1 });
                    conn.release();
                    // return;
                  } else if (result2.length === 1) {
                    // console.log('success login exists');
                    const tmp = result2[0];
                    tmp.result = 'S';
                    tmp.server = cdata.serverVersion;
                    tmp.dayChkVersion = cdata.dayChkVersion;
                    res.json(tmp);
                    conn.release();
                  } else { // no id
                    console.log('no id');
                    res.json({ result: 'F', code: 2 });
                    conn.release();
                    // return;
                  }
                });
              } else {
                console.log('error on sign, ERR : ', errq);
                res.json({ result: 'F', code: 1 });
                conn.release();
                // return;
              }
            } else if (result.affectedRows === 1) {
              conn.query('SELECT * FROM member WHERE ID=?', [ID], (errq2, result2) => {
                if (errq2) {
                  console.log('err SELECT sign, ERR : ', errq2);
                  res.json({ result: 'F', code: 1 });
                  conn.release();
                  // return;
                } else if (result2.length === 1) {
                  result2[0].result = 'S';
                  result2[0].server = cdata.serverVersion;
                  result2[0].dayChkVersion = cdata.dayChkVersion;
                  res.json(result2[0]);
                  conn.release();
                } else { // no id
                  res.json({ result: 'F', code: 2 });
                  conn.release();
                  // return;
                }
              });
            } else {
              res.json({ result: 'F', code: 1 });
              conn.release();
              // return;
            }
          },
        );
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [post] login on server
 * req : ID
 * res : result.
 *       ruby, maxStage, currStage,
 *       ch4Perm, ch5Perm, ch6Perm, ch7Perm,
 * */
exports.login = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    db.pool.getConnection((err, conn) => {
      if (err) {
        res.json({ result: 'F', code: 1 });
        // return;
      } else {
        conn.query('SELECT * FROM member WHERE ID=?', [data.ID], (errq, result) => {
          if (errq) {
            console.log('error on login, ERR : ', err);
            res.json({ result: 'F', code: 1 });
            conn.release();
            // return;
          } else if (result.length === 1) {
            conn.query('UPDATE member SET currStage=maxStage,' +
              ' ruby = IF(ruby>rubyLimit,ruby,IF(ruby + FLOOR((UNIX_TIMESTAMP()-firstRubyDecTime)/rubyTime)>rubyLimit,rubyLimit,ruby + FLOOR((UNIX_TIMESTAMP()-firstRubyDecTime)/rubyTime))),' +
              ' life = IF(life>lifeLimit,life,IF(life + FLOOR((UNIX_TIMESTAMP()-firstLifeDecTime)/lifeTime)>lifeLimit,lifeLimit,life + FLOOR((UNIX_TIMESTAMP()-firstLifeDecTime)/lifeTime)))' +
              ' WHERE ID=?', [data.ID], (errq2, result2) => {
              if (errq2) {
                console.log('error on login update ruby life, ERR : ', err);
                res.json({ result: 'F', code: 1 });
                conn.release();
                // return;
              } else if (result2.affectedRows === 1) {
                conn.query('SELECT * FROM member WHERE ID=?', [data.ID], (errq3, result3) => {
                  if (errq) {
                    res.json({ result: 'F', code: 1 });
                    conn.release();
                    // return;
                  } else if (result3.length === 1) {
                    result3[0].result = 'S';
                    result3[0].server = cdata.serverVersion;
                    result3[0].dayChkVersion = cdata.dayChkVersion;
                    res.json(result3[0]);
                    conn.release();
                  } else {
                    // console.log('error on login, ERR : ', err);
                    res.json({ result: 'F', code: 2 });
                    conn.release();
                    // return;
                  }
                });
              } else {
                // console.log('no affected login update ruby life, ERR');
                res.json({ result: 'F', code: 1 });
                conn.release();
                // return;
              }
            });
          } else {
            // no id
            // console.log('error on login, ERR : ', err);
            res.json({ result: 'F', code: 2 });
            conn.release();
          }
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};
/*
 * [post]
 * req : ID, email
 * res : result
 * */
exports.emailSend = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    // shasum
    const shasum2 = crypto.createHash('sha512');
    shasum2.update(data.ID);
    const resData2 = shasum2.digest('hex');

    const resString = `${page}EmailSign/${resData2}`;

    const message = {
      text: 'i hope this works',
      from: 'braveImagineer <brave.imagineer@gmail.com>',
      to: `you <${data.email}>`,
      subject: '레알증권차트퀴즈게임 <어서와 주식> 인증메일입니다!',
      attachment: [
        {
          data: `${'<html>안녕하세요, 어서와 주식 GM 대박선생입니다.<br/><br/>' +
            '우선 저희의 레알증권차트퀴즈게임 <어서와 주식>을 애용해주신 점 매우 감사드립니다<br/><br/>' +
            '본 이메일주소는, 향후에 보다 나은 서비스를 제공해드리기 위해 수집되고 있습니다<br/><br/>' +
            '루비 10개 획득을 위한 아래 인증 url을 클릭해주세요!<p><a href="'}${resString}">${resString}</a></p>` +
            '다시 한 번 진심으로 감사합니다!</html>',
          alternative: true,
        },
      ],
    };
    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, (err) => {
      if (err) {
        // console.log('error email sending : ', err);
        res.json({ result: 'F', code: 1 });
        return;
      }

      db.pool.getConnection((errq, conn) => {
        if (errq) {
          // console.log('error on emailSign : ', err);
          res.json({ result: 'F', code: 1 });
        } else {
          const stmt = 'UPDATE member SET email=?,emailToken=? WHERE ID=?';
          // shasum
          const emailSrc = crypto.createHash('sha512');
          emailSrc.update(data.ID);
          const emailToken = emailSrc.digest('hex');
          conn.query(stmt, [data.email, emailToken, data.ID], (err2, result) => {
            if (err2) {
              // console.log('error on query emailSend : ', err2);
              conn.release();
              res.json({ result: 'F', code: 1 });
              // return;
            } else if (result.changedRows === 1 && result.affectedRows === 1) {
              // console.log('success msg');
              res.json({ result: 'S' });
            } else {
              // console.log('error on emailSend, no changed : ', err2);
              res.json({ result: 'F', code: 1 });
            }
          });
          conn.release();
        }
      });
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [get]
 * req : emailToken
 *
 * ruby 추가 후에 emailToken 삭제
 * */
exports.emailSign = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.params;
    // console.log('recvData on emailSign : ', data);

    db.pool.getConnection((err, conn) => {
      if (err) {
        console.log('error on emailSign : ', err);
        res.send('<p>인증에 오류가 발생하였습니다.<br/>다시 시도해 주세요.</p><img src="/emailImageData/e-mail_2.png">');
        return;
      }
      conn.beginTransaction((errT) => {
        if (errT) {
          console.log('error db transaction', errT);
          res.send('<p>인증에 오류가 발생하였습니다.<br/>다시 시도해 주세요.</p><img src="/emailImageData/e-mail_2.png">');
          conn.release();
          return;
        }
        const stmt2 = 'UPDATE member SET emailToken=? WHERE emailToken=?';
        conn.query(stmt2, [null, data.emailToken], (err2, result) => {
          if (err2) {
            console.log('error on emailSign emailToken q : ', err2);
            conn.rollback();
            conn.release();
            res.send('<p>이메일 인증을 성공하였습니다.</p><img src="/emailImageData/e-mail_1.png">');
          } else if (result.affectedRows === 1 && result.changedRows === 1) {
            // console.log('success emailSign');
            conn.commit((errC) => {
              if (errC) {
                res.json({ result: 'F' });
                conn.rollback();
                conn.release();
                console.log('emailSign commit error:', errC);
                // return;
              }
            });
            res.send('<p>이메일 인증을 성공하였습니다.</p><img src="/emailImageData/e-mail_1.png">');
            conn.release();
          } else {
            console.log('error on emailSign, no emailToken changed');
            res.send('<p>이미 이메일 인증을 하셨습니다.</p><img src="/emailImageData/e-mail_3.png">');
            conn.rollback();
            conn.release();
            // return;
          }
        });
      });
    });
  } else if (process.argv[2] === 2) {
    res.send('<p>현재 점검중입니다.</p>');
  } else if (process.argv[2] === 3) {
    res.send('<p>긴급 점검중입니다.</p>');
  } else {
    res.send('<p>예상치 못한 에러가 발생하였습니다.</p>');
  }
};

/*
 * [post]
 * req : ID
 * res : result
 * */
exports.getUserData = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;
    // console.log('recvData on dataUpdate : ', data);

    db.pool.getConnection((err, conn) => {
      if (err) {
        console.log('err P dataUpdate, ERR : ', err);
        res.json({ result: 'F', code: 1 });
      } else {
        conn.query('SELECT * FROM member WHERE ID=?', [data.ID], (errq, result) => {
          if (errq) {
            console.log('err SELECT dataUpdate, ERR : ', err);
            res.json({ result: 'F', code: 1 });
            conn.release();
            // return;
          } else if (result.length == 1) {
            // console.log('success RE SELECT DATA, result');
            result[0].result = 'S';
            result[0].server = cdata.serverVersion;
            result[0].dayChkVersion = cdata.dayChkVersion;
            res.json(result[0]);
            conn.release();
          } else {
            // no id
            console.log('no data dataUpdate');
            res.json({ result: 'F', code: 2 });
            conn.release();
            // return;
          }
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [get] get day check
 * req :
 * res : dayChk[]
 * */
exports.getDayChk = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    // console.log('recvData on dayChk');
    const data = VDayChkData;
    data.result = 'S';
    res.json(data);
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [post]
 * req : ID, dayId
 * res : ruby,rubyTIme,rubyLimit
 *       life,lifeTime,lifeLimit
 * */
// TODO: REMOVE switch switch
exports.reqDayChk = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    let vipLevel = 0;
    data.type = VDayChkData.dayChk[parseInt(data.dayId, 10)].type;

    db.pool.getConnection((err, conn) => {
      // id check
      if (err) {
        console.log('error on pool checkValidation on daychk, ERR : ', err);
        res.json({ result: 'F', code: 1 });
      } else {
        const stmt = 'SELECT loginCount,vipLevel,ruby,rubyLimit,rubyTime,life,lifeLimit,lifeTime,logined FROM member WHERE ID=?';
        conn.query(stmt, [data.ID], (errq, result) => {
          if (errq) {
            console.log('error on query checkValidation on daychk, ERR : ', err);
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          } else if ((result[0].loginCount === (data.dayId - 1) || result[0].loginCount === 0) && result[0].logined == 0) {
            vipLevel = result[0].vipLevel;
            // console.log('vipLevel data chk 0 : ',vipLevel);
            let stmt2 = '';
            let args = [];
            let firstVal = 0;
            let secondVal = 0;
            let thirdVal = 0;
            // TODO: REMOVE switch switch
            switch (parseInt(data.type)) {
              case 1: {
                // ruby
                stmt2 = 'UPDATE member SET ruby=(ruby+?),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                switch (vipLevel) {
                  case 0: {
                      firstVal = result[0].ruby;
                      secondVal = firstVal + reward;
                      thirdVal = secondVal;
                      reward = reward;
                    }
                    break;
                  case 1:
                    {
                      firstVal = result[0].ruby;
                      secondVal = firstVal + reward;
                      thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                    }
                    break;
                  case 2:
                    {
                      firstVal = result[0].ruby;
                      secondVal = firstVal + reward;
                      thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                    }
                    break;
                  case 3:
                    {
                      firstVal = result[0].ruby;
                      secondVal = firstVal + reward;
                      thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                    }
                    break;
                }
                args = [reward, data.ID];
              }
                break;
              case 2:
                { // rubyTime
                  stmt = 'UPDATE member SET rubyTime=IF(rubyTime-?>240,rubyTime-?,240),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                  var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                  switch (vipLevel) {
                    case 0:
                      {
                        firstVal = result[0].rubyTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal;
                        reward = reward;
                      }
                      break;
                    case 1:
                      {
                        firstVal = result[0].rubyTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      }
                      break;
                    case 2:
                      {
                        firstVal = result[0].rubyTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      }
                      break;
                    case 3:
                      {
                        firstVal = result[0].rubyTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      }
                      break;
                  }
                  args = [reward, reward, data.ID];
                }
                break;
              case 3:
                { // rubyLimit(rubyMax)
                  stmt = 'UPDATE member SET rubyLimit=(rubyLimit+?),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                  var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                  switch (vipLevel) {
                    case 0:
                      {
                        firstVal = result[0].rubyLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal;
                        reward = reward;
                      }
                      break;
                    case 1:
                      {
                        firstVal = result[0].rubyLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      }
                      break;
                    case 2:
                      {
                        firstVal = result[0].rubyLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      }
                      break;
                    case 3:
                      {
                        firstVal = result[0].rubyLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      }
                      break;
                  }
                  args = [reward, data.ID];
                }
                break;
              case 4:
                { // life
                  stmt = 'UPDATE member SET life=(life+?),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                  var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                  switch (vipLevel) {
                    case 0:
                      {
                        firstVal = result[0].life;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal;
                        reward = reward;
                      }
                      break;
                    case 1:
                      {
                        firstVal = result[0].life;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      }
                      break;
                    case 2:
                      {
                        firstVal = result[0].life;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      }
                      break;
                    case 3:
                      {
                        firstVal = result[0].life;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      }
                      break;
                  }
                  args = [reward, data.ID];
                }
                break;
              case 5:
                { // lifeTime
                  stmt = 'UPDATE member SET lifeTime=IF(lifeTime-?>210,lifeTime-?,210),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                  var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                  switch (vipLevel) {
                    case 0:
                      {
                        firstVal = result[0].lifeTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal;
                        reward = reward;
                      }
                      break;
                    case 1:
                      {
                        firstVal = result[0].lifeTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      }
                      break;
                    case 2:
                      {
                        firstVal = result[0].lifeTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      }
                      break;
                    case 3:
                      {
                        firstVal = result[0].lifeTime;
                        secondVal = firstVal - reward;
                        thirdVal = secondVal - VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      }
                      break;
                  }
                  args = [reward, reward, data.ID];
                }
                break;
              case 6:
                { // lifeLimit(lifeMax)
                  stmt = 'UPDATE member SET lifeLimit=(lifeLimit+?),' +
                    ' loginCount=loginCount+1,logined=1 WHERE ID=?';
                  var reward = VDayChkData.dayChk[parseInt(data.dayId)].value;
                  switch (vipLevel) {
                    case 0:
                      {
                        firstVal = result[0].lifeLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal;
                        reward = reward;
                      }
                      break;
                    case 1:
                      {
                        firstVal = result[0].lifeLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v1Value;
                      }
                      break;
                    case 2:
                      {
                        firstVal = result[0].lifeLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v2Value;
                      }
                      break;
                    case 3:
                      {
                        firstVal = result[0].lifeLimit;
                        secondVal = firstVal + reward;
                        thirdVal = secondVal + VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                        reward += VDayChkData.dayChk[parseInt(data.dayId)].v3Value;
                      }
                      break;
                  }
                  args = [reward, data.ID];
                }
                break;
            }
            conn.query(stmt, args, (errq, result) => {
              if (errq) {
                console.log('error on query daychk update, ERR 1: ', errq);
                res.json({ result: 'F', code: 1 });
                conn.release();
              }
              else if (result.affectedRows === 1 && result.changedRows === 1) {
                const stmt2 = 'SELECT * FROM member WHERE ID=?';
                conn.query(stmt2, [data.ID], (errq2, result2) => {
                  if (errq2) {
                    console.log('error on query daychk, ERR 2: ', errq2);
                    res.json({ result: 'F', code: 1 });
                    conn.release();
                    return;
                  }
                  else if (result2.length > 0) {
                    const resultData = {
                      result: 'S',
                      life: result2[0].life,
                      lifeTime: result2[0].lifeTime,
                      lifeLimit: result2[0].lifeLimit,
                      ruby: result2[0].ruby,
                      rubyTime: result2[0].rubyTime,
                      rubyLimit: result2[0].rubyLimit,
                      firstVal: firstVal,
                      secondVal: secondVal,
                      thirdVal: thirdVal,
                      type: data.type,
                      loginCount: result2[0].loginCount,
                      logined: result2[0].logined,
                    };
                    res.json(resultData);
                  }
                  else {
                    res.json({ result: 'F', code: 1 });
                    conn.release();
                    return;
                  }
                });
              }
              else {
                if (data.type === 2 || data.type === 4) {
                  console.log('time limit maxed');
                  res.json({ result: 'F', code: 2 });
                }
                else {
                  console.log('no changed');
                  res.json({ result: 'F', code: 1 });
                }
              }
            });
          } else {
            console.log('loginCount not enough');
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          }
          conn.release();
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [post]
 * req : ID
 * res : result, ruby
 * */
exports.chargeRuby = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    db.pool.getConnection((err, conn) => {
      if (err) {
        console.log('error on pool chargeRuby, ERR : ', err);
        res.json({ result: 'F', code: 1 });
        return;
      }

      const stmt = 'UPDATE member SET ' +
          ' ruby=IF(ruby < rubyLimit AND (UNIX_TIMESTAMP()-firstRubyDecTime) >= rubyTime ,ruby+1,ruby),' +
          ' firstRubyDecTime=IF(ruby <= rubyLimit AND (UNIX_TIMESTAMP()-firstRubyDecTime) >= rubyTime ,firstRubyDecTime+rubyTime,firstRubyDecTime)' +
          ' WHERE ID=?';

      conn.query(stmt, [data.ID], (errq, result) => {// 수정
        if (errq) {
          res.json({ result: 'F', code: 1 });
          conn.release();
          return;
        } else if (result.affectedRows === 1 && result.changedRows == 1) {
          const stmt2 = 'SELECT * FROM member WHERE ID=?';
          conn.query(stmt2, [data.ID], (errq2, result2) => {
            if (errq2) {
              res.json({ result: 'F', code: 1 });
              conn.release();
              return;
            } else if (result2.length > 0) {
              res.json({
                result: 'S',
                firstRubyDecTime: result2[0].firstRubyDecTime,
                ruby: result2[0].ruby,
              });
            } else {
              res.json({ result: 'F', code: 1 });
              conn.release();
              return;
            }
          });
        } else {
          res.json({ result: 'F', code: 2 });
        }
        conn.release();
      });
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [post]
 * req : ID
 * res : result, life
 * */
exports.chargeLife = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    db.pool.getConnection((err, conn) => {
      if (err) {
        res.json({ result: 'F', code: 1 });
      } else {
        const stmt = 'UPDATE member SET ' +
          ' life=IF(life < lifeLimit AND ((UNIX_TIMESTAMP()-firstLifeDecTime) >= lifeTime) ,life+1,life),' +
          ' firstLifeDecTime=IF(life <= lifeLimit AND (UNIX_TIMESTAMP()-firstLifeDecTime) >= lifeTime ,firstLifeDecTime+lifeTime,firstLifeDecTime)' +
          ' WHERE ID=?';
        conn.query(stmt, [data.ID], (errq, result) => {
          if (errq) {
            console.log('error on query charge Life, ERR 1: ', errq);
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          } else if (result.affectedRows === 1 && result.changedRows === 1) {
            const stmt2 = 'SELECT * FROM member WHERE ID=?';
            conn.query(stmt2, [data.ID], (errq2, result2) => {
              if (errq2) {
                console.log('error on get user data on charge life, ERR 2: ', errq2);
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              } else if (result2.length > 0) {
                res.json({
                  result: 'S',
                  firstLifeDecTime: result2[0].firstLifeDecTime,
                  life: result2[0].life,
                });
              } else {
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              }
            });
          } else {
            // console.log('no charged life, not enough time');
            res.json({ result: 'F', code: 2 });
          }
          conn.release();
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

const stmtReturnFunc = (from, to) => {
  let stmt = '';
  switch (from) {
    case 0:
      {
        if (to == 1) {
          stmt = 'vipLoginCount=10,vipLifeAllUsedCount=10,rubyLimit=rubyLimit+9, ';
          return stmt;
        } else if (to == 2) {
          stmt = 'vipLoginCount=20,vipLifeAllUsedCount=20,rubyLimit=rubyLimit+16,' +
            'rubyTime=IF(rubyTime-30>240,rubyTime-30,240),lifeLimit=lifeLimit+2, ';
          return stmt;
        }
      }
      break;
    case 1:
      {
        if (to == 2) {
          stmt = 'vipLoginCount=20,vipLifeAllUsedCount=20,rubyLimit=rubyLimit+7,' +
            'rubyTime=IF(rubyTime-30>240,rubyTime-30,240),lifeLimit=lifeLimit+2,';
          return stmt;
        } else if (to == 3) {
          stmt = 'vipLoginCount=30,vipLifeAllUsedCount=30,rubyLimit=rubyLimit+16,' +
            'rubyTime=IF(rubyTime-60>240,rubyTime-60,240),lifeLimit=lifeLimit+5,' +
            'lifeTime=IF(lifeTime-60>210,rubyTime-60,210),examCount=5, ';
          return stmt;
        }
      }
      break;
    case 2:
      {
        if (to == 3) {
          stmt = 'vipLoginCount=30,vipLifeAllUsedCount=30,rubyLimit=rubyLimit+9,' +
            'rubyTime=IF(rubyTime-60>240,rubyTime-60,240),lifeLimit=lifeLimit+3,' +
            'lifeTime=IF(lifeTime-30>210,rubyTime-60,210),examCount=5, ';
          return stmt;
        }
      }
      break;
    case 3:
      {
        stmt = '';
        return stmt;
      }
      break;
    default:
      break;
  }
};

/*
 * [post]
 * req : ID, itemIdx
 * res : result, ruby
 * check for iab, receiptData, signatureData
 * */
exports.buyRuby = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const md = req.headers['user-agent'];
    // console.log(md);
    if (typeof md !== 'undefined') {
      res.send('wrong approach');
      return;
    }

    const data = req.body;
    const logger = new (winston.Logger)({
      // 아래에서 설명할 여러개의 transport를 추가할 수 있다.
      transports: [
        // File transport 추가
        new (winston.transports.File)({
          name: 'info-file',
          filename: `${__dirname}/../log/${moment().format('YYYY_MM_DD')}_buyRubyLog.log`,
          level: 'info',
          json: false,
          timestamp() {
            return moment().format('YYYY-MM-DD HH:mm:ss');
          },
        }),
        new (winston.transports.File)({
          name: 'error-file',
          filename: `${__dirname}/../log/error.log`,
          level: 'error',
          json: false,
        }),
      ],
    });
    logger.info('start buyRuby sequence ID:', data.ID);

    db.pool.getConnection((err, conn) => {
      if (err) {
        // console.log('err P buyRuby logging, ERR : ',err);
        logger.info('error ruby logging pool');
      } else {
        const stmt = 'INSERT INTO iabdata(mem_ID,mem_idNum,itemNum,buytime)values(?,(SELECT idx FROM member WHERE ID=?),?,NOW());';
        conn.query(stmt, [data.ID, data.ID, parseInt(data.itemIdx)], (errq, result) => {
          if (errq) {
            console.log('err SELECT buyRuby INSERT log, ERR : ', errq);
            logger.info('error ruby logging query');
          } else {
            // console.log('buyruby logging success');
          }
          conn.release();
        });
      }
    });

    db.pool.getConnection((err, conn) => {
      // id check
      if (err) {
        console.log('err P buyRuby, ERR : ', err);
        logger.info(`userID : ${data.ID}, buyRubyitem : ${data.itemIdx} fail`);
        res.json({ result: 'F', code: 1 });
        return;
      }

      const stmt = 'SELECT item5buy,vipLevel FROM member WHERE ID=?';
      conn.query(stmt, [data.ID], (errq, result) => {
        if (errq) {
          logger.info('userID : ' + data.ID + ', buyRubyitem : ' + data.itemIdx + ' fail');
          res.json({ result: 'F', code: 1 });
          conn.release();
          return;
        } else if (result.length > 0) {
          conn.beginTransaction((errT) => {
            const item5buyBit = result[0].item5buy;
            const vipLevel = result[0].vipLevel;
            let stmt2 = '';
            switch (parseInt(data.itemIdx, 10)) {
              case 1:
                {
                  // 4,5,6,7장 열기, 루비 150개
                  stmt2 = 'UPDATE member SET ch4Perm=1,ch5Perm=1,ch6Perm=1,ch7Perm=1,' +
                      'vipLevel=3,ruby=ruby+150,rubyLimit=rubyLimit+25,rubyTime=IF(rubyTime-60>240,rubyTime-60,240),' +
                      'lifeLimit=lifeLimit+5,lifeTime=IF(lifeTime-60>210,rubyTime-60,210),examCount=5,' +
                      'vipLoginCount=30,vipLifeAllUsedCount=30 ' +
                      'WHERE ID=?';
                }
                break;
              case 2:
                {
                  // 루비 30개, vipLevel+1
                  var beneText = '';
                  var rubyText = 'ruby=ruby+30 ';
                  if (vipLevel === 1) {
                    beneText = stmtReturnFunc(vipLevel, 2);
                    rubyText = 'ruby=ruby+33 ';
                  } else if (vipLevel === 2) {
                    beneText = stmtReturnFunc(vipLevel, 3);
                    rubyText = 'ruby=ruby+36 ';
                  } else if (vipLevel === 3) {
                    rubyText = 'ruby=ruby+45 ';
                  }
                  stmt2 = 'UPDATE member SET vipLevel=IF(vipLevel>0 AND vipLevel<3,vipLevel+1,vipLevel),' +
                      beneText + rubyText +
                      'WHERE ID=?';
                }
                break;
              case 3:
                {
                  // 루비 100개, vipLevel+1
                  var beneText = '';
                  var rubyText = 'ruby=ruby+100 ';
                  if (vipLevel === 1) {
                    beneText = stmtReturnFunc(vipLevel, 2);
                    rubyText = 'ruby=ruby+110 ';
                  } else if (vipLevel === 2) {
                    beneText = stmtReturnFunc(vipLevel, 3);
                    rubyText = 'ruby=ruby+120 ';
                  } else if (vipLevel === 3) {
                    rubyText = 'ruby=ruby+150 ';
                  }
                  stmt2 = 'UPDATE member SET vipLevel=IF(vipLevel<3,vipLevel+1,vipLevel),' +
                      beneText + rubyText +
                      'WHERE ID=?';
                }
                break;
              case 4:
                {
                  // 루비 200개, vipLevel+2
                  var beneText = '';
                  var rubyText = 'ruby=ruby+200 ';
                  if (vipLevel === 1) {
                    beneText = stmtReturnFunc(vipLevel, 3);
                    rubyText = 'ruby=ruby+220 ';
                  } else if (vipLevel === 2) {
                    beneText = stmtReturnFunc(vipLevel, 3);
                    rubyText = 'ruby=ruby+240 ';
                  } else if (vipLevel === 3) {
                    rubyText = 'ruby=ruby+300 ';
                  }
                  stmt2 = 'UPDATE member SET vipLevel=IF(vipLevel<2,vipLevel+2,3),' +
                      beneText + rubyText +
                      'WHERE ID=?';
                }
                break;
              case 5:
                {
                  // 4,5장 열기, 루비 30개, vipLevel+1
                  var beneText = '';
                  if (vipLevel === 0)
                    beneText = stmtReturnFunc(vipLevel, 1);
                  else if (vipLevel === 1)
                    beneText = stmtReturnFunc(vipLevel, 2);
                  else if (vipLevel === 2)
                    beneText = stmtReturnFunc(vipLevel, 3);
                  stmt2 = 'UPDATE member SET ch4Perm=1,ch5Perm=1,' +
                      'vipLevel=IF(vipLevel<3,vipLevel+1,vipLevel),ruby=ruby+30,' +
                      beneText +
                      'item5buy=1 ' +
                      'WHERE ID=?';
                }
                break;
              case 6:
                {
                  // 제 6, 7장 열기, 루비 80개, vipLevel+1
                  if (item5buyBit === 0) {
                    stmt2 = 'UPDATE member SET vipLevel=vipLevel WHERE ID=?'
                  } else {
                    var beneText = '';
                    if (vipLevel === 0)
                      beneText = stmtReturnFunc(vipLevel, 1);
                    else if (vipLevel === 1)
                      beneText = stmtReturnFunc(vipLevel, 2);
                    else if (vipLevel === 2)
                      beneText = stmtReturnFunc(vipLevel, 3);
                    stmt2 = 'UPDATE member SET ch6Perm=1,ch7Perm=1,' +
                        'vipLevel=IF(vipLevel<3,vipLevel+1,vipLevel),' +
                        beneText +
                        'ruby=ruby+80 ' +
                        'WHERE ID=?';
                  }
                }
                break;
              default:
                {
                  // none
                }
                break;
            }
            conn.query(stmt2, [data.ID], (errq2, result2) => {
              if (errq2) {
                logger.info('userID : ' + data.ID + ', buyRubyitem : ' + data.itemIdx + ' fail');
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return;
              }
              else if (result2.affectedRows === 1 && result2.changedRows === 1) {
                // data update success
                conn.query('SELECT * FROM member WHERE ID=?', [data.ID], (errq3, result3) => {
                  if (errq3) {
                    // error
                    res.json({ result: 'F', code: 1 });
                    conn.rollback();
                    conn.release();
                    return;
                  } else if (result3.length > 0) {
                    conn.commit((errC) => {
                      if (err) {
                        res.json({ result: 'F', code: 1 });
                        conn.rollback();
                        conn.release();
                        logger.info('userIdx : ' + result3[0].idx.toString() + ', buyRubyitem : ' + data.itemIdx + ' fail');
                        return;
                      } else {
                        res.json({
                          result: 'S',
                          ruby: result3[0].ruby,
                          rubyLimit: result3[0].rubyLimit,
                          rubyTime: result3[0].rubyTime,
                          lifeLimit: result3[0].lifeLimit,
                          lifeTime: result3[0].lifeTime,
                          ch4Perm: result3[0].ch4Perm,
                          ch5Perm: result3[0].ch5Perm,
                          ch6Perm: result3[0].ch6Perm,
                          ch7Perm: result3[0].ch7Perm,
                          item5buy: result3[0].item5buy,
                          vipLoginCount: result3[0].vipLoginCount,
                          vipLifeAllUsedCount: result3[0].vipLifeAllUsedCount,
                          vipLevelFrom: vipLevel,
                          vipLevelTo: result3[0].vipLevel,
                        });
                        conn.release();
                        logger.info('userIdx : ' + result3[0].idx.toString() + ', buyRubyitem : ' + data.itemIdx + ' success');
                        logger.info('end buyRuby sequence ID:', data.ID);
                      }
                    });
                  } else {
                    // no data
                    logger.info('userID : ' + data.ID + ', buyRubyitem : ' + data.itemIdx + ' fail');
                    res.json({ result: 'F', code: 1 });
                    conn.rollback();
                    conn.release();
                    return;
                  }
                });
              }
              else {
                logger.info('userID : ' + data.ID + ', buyRubyitem : ' + data.itemIdx + ' fail');
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return;
              }
            });
          });
        }
        else {
          logger.info('userID : ' + data.ID + ', buyRubyitem : ' + data.itemIdx + ' fail');
          res.json({ result: 'F', code: 1 });
          conn.release();
        }
      });
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 * [post] buy life
 * req : ID
 * res : result, life
 * */
exports.buyLife = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    db.pool.getConnection((err, conn) => {
      if (err) {
        res.json({ result: 'F', code: 1 });
      } else {
        const stmt = 'UPDATE member SET' +
          ' life=IF(ruby>=10,lifeLimit,life),' +
          ' firstRubyDecTime = IF(ruby>=rubyLimit,UNIX_TIMESTAMP(),firstRubyDecTime),' +
          ' ruby=IF(ruby>=10,ruby-10,ruby)' +
          ' WHERE ID=?';
        conn.query(stmt, [data.ID], (errq, result) => {// 수정
          if (errq) {
            res.json({ result: 'F', code: 1 });
            conn.release();
          } else if (result.affectedRows === 1 && result.changedRows === 1) {
            const stmt2 = 'SELECT * FROM member WHERE ID=?';
            conn.query(stmt2, [data.ID], (errq2, result2) => {
              if (errq2) {
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              } else if (result2.length > 0) {
                res.json({
                  result: 'S',
                  life: result2[0].life,
                  ruby: result2[0].ruby,
                  firstRubyDecTime: result2[0].firstRubyDecTime,
                });
                conn.release();
              } else {
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              }
            });
          } else {
            res.json({ result: 'F', code: 2 });
            conn.release();
            return;
          }
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};

/*
 *[post] use tip
 * req : ID, ruby
 * res : result, ruby
 * */
exports.useTip = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;
    // console.log('recvData on use tip');

    db.pool.getConnection((err, conn) => {
      if (err) {
        res.json({ result: 'F', code: 1 });
      } else {
        const stmt = 'UPDATE member SET' +
          ' firstRubyDecTime = IF(ruby>=rubyLimit,UNIX_TIMESTAMP(),firstRubyDecTime),' +
          ' ruby=IF(ruby>=?,ruby-?,ruby),' +
          ' honeyTipCount=honeyTipCount+1 ' +
          ' WHERE ID=?';
        conn.query(stmt, [parseInt(data.ruby), parseInt(data.ruby), data.ID], (errq, result) => {// 수정
          if (errq) {
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          } else if (result.affectedRows == 1 && result.changedRows == 1) {
            const stmt2 = 'SELECT * FROM member WHERE ID=?';
            conn.query(stmt2, [data.ID], (errq2, result2) => {
              if (errq2) {
                // console.log('err SELECT useTip, ERR 2: ', errq2);
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              } else if (result2.length > 0) {
                res.json({
                  result: 'S',
                  ruby: result2[0].ruby,
                  firstRubyDecTime: result2[0].firstRubyDecTime,
                  honeyTipCount: result2[0].honeyTipCount,
                });
              } else {
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              }
            });
          } else {
            // console.log('no ruby');
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          }
          conn.release();
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};
/*
 * [post] use ruby
 * req : ID, ruby
 * res : result, ruby
 * */
exports.useRuby = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;
    // console.log('recvData on use ruby');

    db.pool.getConnection((err, conn) => {
      if (err) {
        // console.log('error on pool useRuby, ERR : ', err);
        res.json({ result: 'F', code: 1 });
      } else {
        const stmt = 'UPDATE member SET' +
          ' firstRubyDecTime = IF(ruby>=rubyLimit,UNIX_TIMESTAMP(),firstRubyDecTime),' +
          ' ruby=IF(ruby>=?,ruby-?,ruby)' +
          ' WHERE ID=?';
        conn.query(stmt, [parseInt(data.ruby), parseInt(data.ruby), data.ID], (errq, result) => {
          if (errq) {
            // console.log('err UPDATE useRuby, ERR 1: ', errq);
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          } else if (result.affectedRows === 1 && result.changedRows === 1) {
            const stmt2 = 'SELECT * FROM member WHERE ID=?';
            conn.query(stmt2, [data.ID], (errq2, result2) => {
              if (errq2) {
                // console.log('err SELECT useRuby, ERR 2: ', errq2);
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              } else if (result2.length > 0) {
                res.json({
                  result: 'S',
                  ruby: result2[0].ruby,
                  firstRubyDecTime: result2[0].firstRubyDecTime,
                  honeyTipCount: result2[0].honeyTipCount,
                });
              } else {
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              }
            });
          } else {
            // console.log('no ruby');
            res.json({ result: 'F', code: 1 });
            conn.release();
            return;
          }
          conn.release();
        });
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};
/*
 * [post] open goldTip
 * req : ID, idx
 * res : ruby, firstRubyDecTime, tipStagePerm
 * */
exports.openGoldTipStage = (req, res) => {
  if (process.argv[2] === 1 || typeof process.argv[2] === 'undefined') {
    const data = req.body;

    // TODO: remove this IF STATE
    if (!(data.idx === 12 || data.idx === 20 || data.idx === 28 || data.idx === 36 || data.idx === 44 || data.idx === 52)) {
      res.json({ result: 'F', code: 1 });
      return;
    }

    async.waterfall([
      function (cb) {
        // select data
        db.pool.getConnection((err, conn) => {
          if (err) {
            res.json({ result: 'F', code: 1 });
            return;
          }
          conn.query('SELECT tipStagePerm FROM member WHERE ID=?', [data.ID], (err2, result) => {
            if (err2) {
              res.json({ result: 'F', code: 1 });
              conn.release();
            } else if (result.length > 0) {
              let pos;
              switch (parseInt(data.idx, 10)) {
                case 12:
                  pos = 0;
                  break;
                case 20:
                  pos = 2;
                  break;
                case 28:
                  pos = 4;
                  break;
                case 36:
                  pos = 6;
                  break;
                case 44:
                  pos = 8;
                  break;
                case 52:
                  pos = 10;
                  break;
              }
              if (result[0].tipStagePerm[pos] === '1') {
                // console.log('already opened');
                res.json({ result: 'F', code: 2 });
                conn.release();
                return;
              } else
                conn.release();
              cb(null, result);
            } else {
              // console.log('err SELECT no data');
              res.json({ result: 'F', code: 1 });
              conn.release();
              return;
            }
          });
        });
      }, (arg1, cb) => {
        // update ruby and tipPerm and firstRubyDecTime
        db.pool.getConnection((err, conn) => {
          if (err) {
            res.json({ result: 'F', code: 1 });
            return;
          }
          conn.beginTransaction((errT) => {
            if (errT) {
              // console.log('error db transaction', errT);
              res.json({ result: 'F', code: 1 });
              return;
            }
            conn.query('UPDATE member SET' +
                ' firstRubyDecTime = IF(ruby>=rubyLimit,UNIX_TIMESTAMP(),firstRubyDecTime),' +
                ' goldTipCount=goldTipCount+1' +
                ' WHERE ID=?',
            [data.ID], (err3, result2) => {
              if (err3) {
                // console.log('err firstRubyDec, err3 : ', err3);
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return cb(2, null);
              } else {
                console.log('time setting ended');
              }
            });
            const stmt = 'UPDATE member SET ruby=IF(ruby>=?,ruby-?,ruby) WHERE ID=?';
            // stage에 따른 가격
            let price;
            switch (parseInt(data.idx)) {
              case 12:
                price = 10;
                break;
              case 20:
                price = 20;
                break;
              case 28:
                price = 35;
                break;
              case 36:
                price = 50;
                break;
              case 44:
                price = 70;
                break;
              case 52:
                price = 100;
                break;
            }
            conn.query(stmt, [price, price, data.ID], (err2, result) => {
              if (err2) {
                console.log('err ruby consume, err2 : ', err2);
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return;
              } else if (result.affectedRows === 1 && result.changedRows === 1) {
                // console.log('ruby consume success');
              } else {
                // console.log('err consume no changed');
                conn.rollback();
                conn.release();
                return cb(2, null);
              }
            });

            let permData = arg1[0].tipStagePerm;
            String.prototype.replaceAt = (index, character) => {
              return this.substr(0, index) + character + this.substr(index + character.length);
            };
            switch (parseInt(data.idx, 10)) {
              case 12:
                permData = permData.replaceAt(0, '1');
                break;
              case 20:
                permData = permData.replaceAt(2, '1');
                break;
              case 28:
                permData = permData.replaceAt(4, '1');
                break;
              case 36:
                permData = permData.replaceAt(6, '1');
                break;
              case 44:
                permData = permData.replaceAt(8, '1');
                break;
              case 52:
                permData = permData.replaceAt(10, '1');
                break;
            }
            conn.query('UPDATE member SET tipStagePerm=? WHERE ID=?', [permData, data.ID], (err4, result3) => {
              if (err4) {
                // console.log('error on corrRate q, err4 : ', err4);
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return;
              } else if (result3.affectedRows == 1 && result3.changedRows == 1) {
                // console.log("success update tipStagePerm");
                conn.commit(function (errC) {
                  if (err) {
                    res.json({ result: 'F', code: 1 });
                    conn.rollback();
                    conn.release();
                    console.log('goldTip commit error:', errC);
                    return;
                  } else {
                    conn.release();
                    cb(null, 1);
                  }
                });
              } else {
                // console.log('error on corrRate q, err4 : ', err4);
                res.json({ result: 'F', code: 1 });
                conn.rollback();
                conn.release();
                return;
              }
            });
          });
        });
      },
      function (arg2, cb) {
        // reselect data
        db.pool.getConnection((err, conn) => {
          if (err) {
            res.json({ result: 'F', code: 1 });
          } else {
            conn.query('SELECT ruby,firstRubyDecTime,tipStagePerm,goldTipCount FROM member ' +
              'WHERE ID=?', [data.ID], (err2, result) => {
              if (err2) {
                // console.log('err SELECT , err : ', err2);
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              } else if (result.length > 0) {
                conn.release();
                cb(null, result);
              } else {
                // console.log('err SELECT no data');
                res.json({ result: 'F', code: 1 });
                conn.release();
                return;
              }
            });
          }
        });
      },
    ], (err, result) => {
      if (err) {
        if (err === 2) {
          // console.log('not enought ruby');
          res.json({ result: 'F', code: 2 });
        } else {
          console.log('err waterfall : ', err);
          res.json({ result: 'F', code: 1 });
        }
      } else {
        const resultData = result[0];
        resultData.result = 'S';
        resultData.idx = parseInt(data.idx);
        res.json(resultData);
      }
    });
  } else if (process.argv[2] === 2) {
    res.json({ result: 'F', code: 4, serverCode: 2 });
  } else if (process.argv[2] === 3) {
    res.json({ result: 'F', code: 4, serverCode: 3 });
  } else {
    res.json({ result: 'F', code: 4, serverCode: 4 });
  }
};
