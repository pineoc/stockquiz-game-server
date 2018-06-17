
/*
 * GET home page.
 */

var db = require('./DB');
var fs = require('fs');
var async = require('async');
var MobileDetect = require('mobile-detect');

//각 스테이지에 대한 게임진행에 필요한 데이터
var VStageGameData = {
    stage : [
    {},//0
    {//1
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//2
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//3
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//4
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//5
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//6
        cate : [1],
        subCate : [1],
        question : 1
    },
    {//7
        cate : [1],
        subCate : [1],
        question : 1
    },
        //ch2-1 --------------1
    {//8
        cate : 1,
        subCate : [1,2],
        question : 4
    },
    {//9
        cate : 1,
        subCate : [1,2],
        question : 5
    },
    {//10
        cate : 1,
        subCate : [1,2],
        question : 6
    },
    {//11
        cate : 1,
        subCate : [1,2],
        question : 7
    },
        //ch2-2 --------------2
    {//12
        cate : 2,
        subCate : [3,4],
        question : 4
    },
    {//13
        cate : 2,
        subCate : [3,4],
        question : 6
    },
    {//14
        cate : 2,
        subCate : [1,4],
        question : 7
    },
    {//15
        cate : 2,
        subCate : [1,4],
        question : 8
    },
        //ch3-1 --------------3
    {//16
        cate : 3,
        subCate : [5,6],
        question : 4
    },
    {//17
        cate : 3,
        subCate : [5,6],
        question : 5
    },
    {//18
        cate : 3,
        subCate : [3,6],
        question : 6
    },
    {//19
        cate : 3,
        subCate : [1,6],
        question : 7
    },
        //ch3-2 --------------4
    {//20
        cate : 4,
        subCate : [7,8],
        question : 4
    },
    {//21
        cate : 4,
        subCate : [7,8],
        question : 6
    },
    {//22
        cate : 4,
        subCate : [5,8],
        question : 7
    },
    {//23
        cate : 4,
        subCate : [3,8],
        question : 8
    },
        //ch4-1 --------------5
    {//24
        cate : 5,
        subCate : [9,10],
        question : 4
    },
    {//25
        cate : 5,
        subCate : [9,10],
        question : 5
    },
    {//26
        cate : 5,
        subCate : [7,10],
        question : 6
    },
    {//27
        cate : 5,
        subCate : [5,10],
        question : 7
    },
        //ch4-2 --------------6
    {//28
        cate : 6,
        subCate : [11,12],
        question : 4
    },
    {//29
        cate : 6,
        subCate : [11,12],
        question : 6
    },
    {//30
        cate : 6,
        subCate : [9,12],
        question : 7
    },
    {//31
        cate : 6,
        subCate : [7,12],
        question : 8
    },
        //ch5-1 --------------7
    {//32
        cate : 7,
        subCate : [13,14],
        question : 4
    },
    {//33
        cate : 7,
        subCate : [13,14],
        question : 5
    },
    {//34
        cate : 7,
        subCate : [11,14],
        question : 6
    },
    {//35
        cate : 7,
        subCate : [9,14],
        question : 7
    },
        //ch5-2 --------------8
    {//36
        cate : 8,
        subCate : [15,16],
        question : 4
    },
    {//37
        cate : 8,
        subCate : [15,16],
        question : 6
    },
    {//38
        cate : 8,
        subCate : [13,16],
        question : 7
    },
    {//39
        cate : 8,
        subCate : [11,16],
        question : 8
    },
        //ch6-1 --------------9
    {//40
        cate : 9,
        subCate : [17,18],
        question : 4
    },
    {//41
        cate : 9,
        subCate : [17,18],
        question : 5
    },
    {//42
        cate : 9,
        subCate : [15,18],
        question : 6
    },
    {//43
        cate : 9,
        subCate : [13,18],
        question : 7
    },
        //ch6-2 --------------10
    {//44
        cate : 10,
        subCate : [19,20],
        question : 4
    },
    {//45
        cate : 10,
        subCate : [19,20],
        question : 6
    },
    {//46
        cate : 10,
        subCate : [17,20],
        question : 7
    },
    {//47
        cate : 10,
        subCate : [15,20],
        question : 8
    },
        //ch7-1 --------------11
    {//48
        cate : 11,
        subCate : [21,22],
        question : 4
    },
    {//49
        cate : 11,
        subCate : [21,22],
        question : 5
    },
    {//50
        cate : 11,
        subCate : [19,22],
        question : 6
    },
    {//51
        cate : 11,
        subCate : [17,22],
        question : 7
    },
        //ch7-2 --------------12
    {//52
        cate : 12,
        subCate : [23,24],
        question : 4
    },
    {//53
        cate : 12,
        subCate : [23,24],
        question : 6
    },
    {//54
        cate : 12,
        subCate : [21,24],
        question : 7
    },
    {//55
        cate : 12,
        subCate : [19,24],
        question : 8
    },
        //ending stage-----------
    {//56
        cate : 12,
        subCate : [1,25],
        question : 20
    }
    ]
};
var stageDataGoalGame = [
    0,3,3,3,3,3,3,6,//1ch
    4,5,6,7,4,6,7,8,//2
    4,5,6,7,4,6,7,8,//3
    4,5,6,7,4,6,7,8,//4
    4,5,6,7,4,6,7,8,//5
    4,5,6,7,4,6,7,8,//6
    4,5,6,7,4,6,7,8,//7
    20
];

exports.index = function(req, res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined'){
        res.render('index', { title: 'stockQuiz' });
    }
    else{
        res.send('<p>현재 서버 점검중입니다.</p>');
    }
};
/*
 * [post]
 * req : chapter, stage, ID
 * res : chartName,chartNum,chartAnswer,chartImg,
 *       gameNum,goalNum,limitTime,Award
 * */
exports.quizData = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined'){

        var data = req.body;
        var currStageNum = parseInt(data.stage);

        var addressData = 'http://'+GLOBAL.addressData.toString()+':3000/data/';
        //console.log(addressData);

        db.pool.getConnection(function(err,conn){
            //id check
             if(err){
                console.log('error on pool quizData, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var stmt = 'SELECT COUNT(*) cnt FROM member WHERE ID=?';
                conn.query(stmt,[data.ID],function(errq,result){//수정
                    if(errq){
                        console.log('error on query quizData, ERR : ',err);
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                    else if(result[0].cnt==1){

                    }
                    else{
                        console.log('no ID on DB');
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                    conn.release();
                });
            }
        });

        db.pool.getConnection(function(err,conn){
            if(err){
                console.log('error on pool quizData, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var stmt = 'select * from '+
                    '(SELECT idx i1,chartName cname1,chartNum cnum1, chartAnswer ca1,cate c1,subCate sc1,face f1 FROM (SELECT * FROM chart ORDER BY RAND()) AS base '+
                    'WHERE (subCate BETWEEN ? AND ?) '+
                    'GROUP BY subCate ORDER BY RAND() LIMIT 6) AS t1 '+
                    'left join '+
                    '(SELECT idx i2,chartName cname2,chartNum cnum2,chartAnswer ca2, cate c2,subCate sc2,face f2 FROM chart WHERE cate<=? ORDER BY RAND() LIMIT ?) AS t2 '+
                    'ON t1.i1 = t2.i2 '+
                    'UNION ALL '+
                    'select * from '+
                    '(SELECT idx,chartName,chartNum,chartAnswer,cate,subCate,face FROM (SELECT * FROM chart ORDER BY RAND()) AS base '+
                    'WHERE (subCate BETWEEN ? AND ?) '+
                    'GROUP BY subCate ORDER BY RAND() LIMIT 6) AS t1 '+
                    'right join '+
                    '(SELECT idx,chartName,chartNum,chartAnswer,cate,subCate,face FROM chart WHERE cate<=? ORDER BY RAND() LIMIT ?) AS t2 '+
                    'ON t2.idx =t1.idx ' +
                    'LIMIT ?';
                var subCateArr = VStageGameData.stage[currStageNum];
                var args = [
                    subCateArr.subCate[0],subCateArr.subCate[1],
                    subCateArr.cate,subCateArr.question,
                    subCateArr.subCate[0],subCateArr.subCate[1],
                    subCateArr.cate,subCateArr.question,
                    subCateArr.question
                ];
                if(currStageNum==56){
                    stmt = 'SELECT * FROM chart WHERE cate<=12 ORDER BY RAND() LIMIT 20;';
                    args.length=0;
                }
                conn.query(stmt,args,function(errq,result){
                    if(errq){
                        console.log('error on query quizData, ERR 1: ',errq);
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                    else{
                        var stmt2 = 'UPDATE member SET' +
                            ' firstLifeDecTime = IF(life>=lifeLimit,UNIX_TIMESTAMP(),firstLifeDecTime),' +
                            ' life=IF(life>0,life-1,0),' +
                            ' lifeAllUsed =IF(life=0,1,lifeAllUsed)' +
                            ' WHERE ID=?';
                        conn.query(stmt2,[data.ID],function(errq2,result2){
                            if(errq2){
                                console.log('error on query quizData, ERR 2: ',errq2);
                                res.json({result:'F',code:1});
                                conn.release();
                                return;
                            }
                            else if(result2.affectedRows==1 && result2.changedRows==1){
                                conn.query('SELECT firstLifeDecTime,life,lifeAllUsed FROM member WHERE ID=?',[data.ID],function(errq3,result3){
                                    if(errq3){
                                        console.log('error on query quizData, ERR 3: ',errq3);
                                        res.json({result:'F',code:1});
                                        conn.release();
                                        return;
                                    }else{
                                        if(currStageNum==56){
                                            result.forEach(function(elem,idx,arr){
                                                arr[idx].chartImg = addressData+arr[idx].idx.toString()+".png";
                                                arr[idx].chartTipImg = addressData+arr[idx].idx.toString()+"t.png";
                                            });
                                            res.json({
                                                result:'S',
                                                life : result3[0].life,
                                                firstLifeDecTime:result3[0].firstLifeDecTime,
                                                lifeAllUsed : result3[0].lifeAllUsed,
                                                data : result
                                            });
                                        }else{
                                            var data = [];
                                            for(var i=0;i<result.length;i++){
                                                if(result[i].i1==null){
                                                    var object = {
                                                        idx : result[i].i2,
                                                        chartName : result[i].cname2,
                                                        chartNum : result[i].cnum2,
                                                        chartAnswer : result[i].ca2
                                                    };
                                                    data.push(object);
                                                }else{
                                                    var object = {
                                                        idx : result[i].i1,
                                                        chartName : result[i].cname1,
                                                        chartNum : result[i].cnum1,
                                                        chartAnswer : result[i].ca1
                                                    };
                                                    data.push(object);
                                                }
                                                data.forEach(function(elem,idx,arr){
                                                    arr[idx].chartImg = addressData+arr[idx].idx.toString()+".png";
                                                    arr[idx].chartTipImg = addressData+arr[idx].idx.toString()+"t.png";
                                                });
                                            }
                                            res.json({
                                                result:'S',
                                                life:result3[0].life,
                                                firstLifeDecTime:result3[0].firstLifeDecTime,
                                                lifeAllUsed : result3[0].lifeAllUsed,
                                                data : data
                                            });
                                        }
                                    }
                                    conn.release();
                                });
                            }
                            else{
                                res.json({
                                    result:'F',
                                    code:3,
                                    msg : 'no life'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

/*
 * [post]
 * req : ID, stage, chapter, star, correctCount
 * res : stage, star, stageruby, ruby
 * latest version : 11/4
 * chapter에 맞는 stage인지 확인
 * 현재 문제가 있을 수 있는 상태라서 다시 손봐야할 수도 있음.
 *
 * */
exports.quizRes = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined'){
        var data = req.body;
        //console.log('recvData on quizData : ',data);

        db.pool.getConnection(function(err,conn){
            if(err){
                console.log('error on pool quizRes, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var stageData;
                var earnRuby = 0;
                var currRuby;
                var earnRubyLimit=0;
                var currRubyLimit;
                if(parseInt(data.stage)<=0 || parseInt(data.stage)>56 || parseInt(data.correctCount)<0 ||
                    parseInt(data.correctCount) > stageDataGoalGame[parseInt(data.stage)] ||
                    parseInt(data.star)<0 || parseInt(data.star)>3){

                    console.log('data err quiz res');
                    res.json({result:'F',code:3});
                    conn.release();
                    return;
                }
                conn.beginTransaction(function(errT) {
                    if (errT) {
                        console.log('error db transaction', errT);
                        res.json({result:'F',code:1});
                        return;
                    }
                    var stmt = 'SELECT stageData,ruby,rubyLimit FROM member WHERE ID=?';
                    conn.query(stmt,[data.ID],function(errq,result){//stageData를 가져오기 위한 쿼리 작업
                        if(errq){
                            console.log('err on query stageData Select err:',errq);
                            conn.rollback();
                            conn.release();
                            res.json({result:'F',code:1});
                            return;
                        }
                        else if(result.length>0){
                            stageData = JSON.parse(result[0].stageData);
                            currRuby = result[0].ruby;
                            currRubyLimit = result[0].rubyLimit;
                            var currStageNum = parseInt(data.stage);
                            stageData.stage[currStageNum].played=1;//플레이 여부 저장 
                            if(currStageNum<=6)
                            {
                                if(stageData.stage[currStageNum].ruby==0){
                                    if(parseInt(data.star)==3){
                                        currStageNum>3 ? earnRuby=2 : earnRuby=1;
                                        currStageNum>3 ? earnRubyLimit=2 : earnRubyLimit=1;
                                    }
                                    else 
                                        earnRuby=0;
                                    stageData.stage[currStageNum].ruby = earnRuby;
                                    if(stageData.stage[currStageNum].star<=parseInt(data.star))
                                        stageData.stage[currStageNum].star = parseInt(data.star);
                                }
                            }
                            else
                            {
                                if(stageData.stage[currStageNum].ruby==0){
                                //루비를 하나도 못받았을 경우
                                earnRuby = parseInt(stageData.stage[currStageNum].maxRuby/3)*parseInt(data.star);
                                    if(stageData.stage[currStageNum].star<=parseInt(data.star)){
                                        stageData.stage[currStageNum].star = parseInt(data.star);
                                        stageData.stage[currStageNum].ruby = parseInt(stageData.stage[currStageNum].maxRuby/3)*parseInt(data.star);
                                    }
                                }
                                else if(stageData.stage[currStageNum].ruby!=stageData.stage[currStageNum].maxRuby){
                                //별을 1,2개로 루비를 조금 받았을 경우
                                    if(stageData.stage[currStageNum].star>=parseInt(data.star))
                                        earnRuby=0;
                                    else
                                        earnRuby = parseInt(stageData.stage[currStageNum].maxRuby/3)*parseInt(data.star) - stageData.stage[currStageNum].ruby;
                                    if(stageData.stage[currStageNum].star<=parseInt(data.star)){
                                        stageData.stage[currStageNum].star = parseInt(data.star);
                                        stageData.stage[currStageNum].ruby = parseInt(stageData.stage[currStageNum].maxRuby/3)*parseInt(data.star);
                                    }
                                }
                                else if(stageData.stage[currStageNum].ruby==stageData.stage[currStageNum].maxRuby){
                                    //이미 최대 루비를 받은 경우
                                    earnRuby = 0;
                                    if(stageData.stage[currStageNum].star<=parseInt(data.star)){
                                        stageData.stage[currStageNum].star = parseInt(data.star);
                                        stageData.stage[currStageNum].ruby = parseInt(stageData.stage[currStageNum].maxRuby/3)*parseInt(data.star);
                                    }
                                }
                                earnRubyLimit=0;
                            }
                            var stage3StageCount = 0;
                            for(var i=1;i<57;i++){
                                if(typeof stageData.stage[i].star==='undefined')
                                    stage3StageCount += 0;
                                else{
                                    if(stageData.stage[i].star==3)
                                        stage3StageCount++;
                                }
                            }                            
                            var stmt2 = 'UPDATE member SET stageData=IF(ISNULL(stageData),stageData,?),ruby=(ruby+?),rubyLimit=(rubyLimit+?),' +
                                'star3StageCount=?, accCorrect=(accCorrect+?), maxStage = IF(maxStage<? AND ?>0 ,?,maxStage),' +
                                'tier = IF(maxStage>47,4,IF(maxStage>31,3,IF(maxStage>15,2,IF(maxStage>7,1,0)))), currStage = ?' +
                                ' WHERE ID=?';
                            conn.query(stmt2,[JSON.stringify(stageData),earnRuby,earnRubyLimit,stage3StageCount,parseInt(data.correctCount),
                                currStageNum,parseInt(data.star),currStageNum,currStageNum,data.ID],function(errq,result){
                                if(errq){
                                    console.log('err q quizRes Update err:',errq);
                                    conn.rollback();
                                    conn.release();
                                    res.json({result:'F',code:1});
                                    return;
                                }
                                else if(result.affectedRows==1){
                                    //success
                                    conn.query('SELECT * FROM member WHERE ID=?',[data.ID],function(errq2,result2){
                                        if(errq2){
                                            console.log('err q SELECT err:',errq2);
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:1});
                                            return;
                                        }
                                        else if(result2){
                                            conn.commit(function (errC) {
                                                if (errC) {
                                                    res.json({result: 'F',code:1});
                                                    conn.rollback();
                                                    conn.release();
                                                    console.log('stageData commit error:', errC);
                                                    return;
                                                }
                                                else{
                                                    //console.log('success stageData');
                                                    //console.log('result ruby : ',result2[0].ruby,earnRuby);
                                                    res.json({
                                                        result : 'S',
                                                        ruby : parseInt(result2[0].ruby),
                                                        earnRuby : parseInt(earnRuby),
                                                        rubyLimit : result2[0].rubyLimit,
                                                        maxStage : result2[0].maxStage,
                                                        star3StageCount : result2[0].star3StageCount,
                                                        accCorrect : result2[0].accCorrect,
                                                        stageData : result2[0].stageData
                                                    });
                                                    conn.release();
                                                }
                                            });
                                        }
                                        else{
                                            console.log('noData SELECT');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    });
                                }
                                else{
                                    console.log('err invalid ID');
                                    conn.rollback();
                                    conn.release();
                                    res.json({result: 'F',code:2});
                                    return;
                                }

                            });
                        }
                        else{
                            console.log('err invalid ID');
                            conn.rollback();
                            conn.release();
                            res.json({result:'F',code:2});
                            return;
                        }
                    });
                });
            }
        });
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

/*
* [post]get exam quiz data
* req : ID
* res : result,data,examCount,ruby
* */
exports.getExamData = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined'){
        var data = req.body;
        //console.log('recvData on getExam quizData : ',data);

        var addressData = 'http://'+GLOBAL.addressData.toString()+':3000/data/';
        async.waterfall([
            function(cb){
                //get tier, examCount,
                db.pool.getConnection(function(err,conn){
                    if(err){
                        console.log('err p getExam w1, ERR : ',err);
                        return cb(1,null);
                    }
                    else{
                        var stmt = 'SELECT tier,examCount,ruby,life FROM member WHERE ID=?';
                        conn.query(stmt,[data.ID],function(errq,result){//수정
                            if(errq){
                                console.log('err q getExam w1, ERR : ',err);
                                conn.release();
                                return cb(1,null);
                            }
                            else if(result){
                                if(result[0].examCount==0 && result[0].ruby<3 || result[0].tier==0 || result[0].examCount>0 && result[0].life<2){
                                    return cb(2,null);//no ruby and no examcount and invalid
                                }
                                else{
                                    conn.release();
                                    cb(null,result[0]);
                                }
                            }
                            else {
                                console.log('no ID on DB');
                                conn.release();
                                return cb(1,null);
                            }
                        });
                    }
                });
            },
            function(arg,cb){
                db.pool.getConnection(function(err,conn){
                    if(err){
                        console.log('err p getExam w2, ERR : ',err);
                        return cb(1,null);
                    }
                    else{
                        var argQ = [];
                        var stmt = '';
                        if(arg.examCount<1){
                            var cost=0;
                            arg.tier==4 ? cost=5 : cost=3;
                            argQ = [cost,cost,data.ID];
                            stmt = 'UPDATE member SET ' +
                                ' firstRubyDecTime = IF(ruby>=rubyLimit,UNIX_TIMESTAMP(),firstRubyDecTime),'+
                                ' ruby = IF(examCount=0 AND ruby>=?,ruby-?,ruby )' +
                                ' WHERE ID=?';
                        }
                        else{//use life
                            argQ = [data.ID];
                            stmt = 'UPDATE member SET ' +
                                ' firstLifeDecTime = IF(life>=lifeLimit,UNIX_TIMESTAMP(),firstLifeDecTime),' +
                                ' life = IF(examCount>0 AND life>=2,life-2,life ),' +
                                ' examCount = IF(examCount>0,examCount-1,examCount),' +
                                ' lifeAllUsed =IF(life=0,1,lifeAllUsed), ' +
                                ' examPlayed = 1 ' +
                                ' WHERE ID=?';
                        }
                        conn.query(stmt,argQ,function(errq,result){//수정
                            if(errq){
                                console.log('err q getExam w2, ERR : ',errq);
                                conn.release();
                                return cb(1,null);
                            }
                            else if(result.affectedRows==1 && result.changedRows==1){
                                conn.release();
                                cb(null,parseInt(arg.tier));
                            }
                            else{
                                console.log('no changed w2');
                                conn.release();
                                return cb(1,null);
                            }
                        });
                    }
                });
            },
            function(arg2,cb){
                db.pool.getConnection(function(err,conn){
                    if(err){
                        console.log('error P getExam w3, ERR : ',err);
                        return cb(1,null);
                    }
                    else{
                        var range = [];
                        if(arg2==1)
                            range = [1,2];
                        else if(arg2==2)
                            range = [1,4];
                        else if(arg2 == 3)
                            range = [3,8];
                        else if(arg2 == 4)
                            range = [5,13];
                        var stmt = 'SELECT * FROM chart WHERE cate BETWEEN ? AND ? ORDER BY RAND() LIMIT 10';
                        conn.query(stmt,range,function(errq,result){
                            if(errq){
                                console.log('err SELECT getExam w3, ERR: ',errq);
                                conn.release();
                                return cb(1,null);
                            }
                            else if(result){
                                result.forEach(function(elem,idx,arr){
                                    arr[idx].chartImg = addressData+arr[idx].idx.toString()+".png";
                                    arr[idx].chartTipImg = addressData+arr[idx].idx.toString()+"t.png";
                                });
                                conn.release();
                                cb(null,result);
                            }
                            else{
                                return cb(2,null);
                            }
                        });
                    }
                });
            }
        ],function(err,resultWaterfall){
            if(err){
                if(err==1){
                    console.log('err server, no change');
                    res.json({result:'F',code:1});
                }
                else if(err==2){
                    console.log('no data');
                    res.json({result:'F',code:2});
                }
                else{
                    console.log('err');
                    res.json({result:'F',code:3});
                }
            }
            else{
                db.pool.getConnection(function(err,conn){
                    if(err){
                        console.log('err p getExam wr, ERR : ',err);
                        res.json({result:'F',code:1});
                        return;
                    }
                    else{
                        var stmt = 'SELECT examCount,ruby,life,lifeAllUsed,examPlayed,' +
                            ' firstLifeDecTime, firstRubyDecTime' +
                            ' FROM member WHERE ID=?';
                        conn.query(stmt,[data.ID],function(errq,result){
                            if(errq){
                                console.log('err q getExam wr, ERR : ',errq);
                                res.json({result:'F',code:1});
                                conn.release();
                                return ;
                            }
                            else if(result){
                                var resData = {
                                    result:'S',
                                    ruby : result[0].ruby,
                                    life:result[0].life,
                                    lifeAllUsed : result[0].lifeAllUsed,
                                    examCount : result[0].examCount,
                                    examPlayed : result[0].examPlayed,
                                    firstLifeDecTime : result[0].firstLifeDecTime,
                                    firstRubyDecTime : result[0].firstRubyDecTime,
                                    data : resultWaterfall
                                };
                                res.json(resData);
                                conn.release();
                            }
                            else {
                                console.log('no ID on DB');
                                res.json({result:'F',code:1});
                                conn.release();

                            }
                        });
                    }
                });
            }
        });

    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
} ;

/*
* [post] result of examData
* req : ID, corrCount, combo
* res : ruby
* */
exports.examRes = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined') {
        var data = req.body;
        //console.log('result examData result : ',data);
        if(data.combo<0 || data.combo >10){
            res.json({result:'F',code:3});
            return;
        }
        async.waterfall([
            function(cb){
                //select data ID
                db.pool.getConnection(function(err,conn){
                    if(err){
                        return cb(1,null);
                    }else{
                        var stmt = 'SELECT * FROM member WHERE ID=?';
                        conn.query(stmt,[data.ID],function(errq,result){
                            if(errq){
                                conn.release();
                                return cb(2,null);
                            }else if(result){
                                if(result[0].tier==0){
                                    console.log('data invalid');
                                    conn.release();
                                    return cb(2,null);
                                }else{
                                    //console.log('examRes w1 success');
                                    conn.release();
                                    cb(null,result[0]);
                                }
                            }
                            else{
                                conn.release();
                                return cb(3,null);
                            }
                        });
                    }
                });

            },
            function(arg,cb){
                //update data of exam result
                db.pool.getConnection(function(err,conn){
                    if(err){
                        return cb(1,null);
                    }else{
                        conn.beginTransaction(function (errT) {
                            if (errT) {
                                conn.release();
                                return cb(1,null);
                            }
                            var stmt = 'UPDATE member SET ruby=ruby+(?*tier),examCombo=IF(examCombo<?,?,examCombo),' +
                                'accCorrect=accCorrect+? WHERE ID=?';
                            conn.query(stmt, [parseInt(data.combo),parseInt(data.combo),parseInt(data.combo),parseInt(data.corrCount),data.ID], function (errq1, result) {
                                if (errq1) {
                                    console.log('err ruby adding, errq1 : ', errq1);
                                    conn.rollback();
                                    conn.release();
                                    return cb(2,null);
                                }
                                else if(result.affectedRows==1){
                                    //console.log('ruby consume success');
                                    conn.commit(function(errC){
                                        if (err) {
                                            conn.rollback();
                                            conn.release();
                                            console.log('goldTip commit error:', errC);
                                            return cb(1,null);
                                        }
                                        else{
                                            conn.release();
                                            cb(null,1);
                                        }
                                    });
                                }
                                else{
                                    conn.rollback();
                                    return cb(2,null);
                                }
                            });
                        });
                    }
                });
            },
            function(arg,cb){
                //select data result of updated data
                db.pool.getConnection(function(err,conn){
                    if(err){
                        return cb(1,null);
                    }else{
                        var stmt = 'SELECT * FROM member WHERE ID=?';
                        conn.query(stmt,[data.ID],function(errq,result){
                            if(errq){
                                conn.release();
                                return cb(2,null);
                            }else if(result){
                                //console.log('examRes w1 success');
                                conn.release();
                                cb(null,result[0]);
                            }
                            else{
                                conn.release();
                                return cb(3,null);
                            }
                        });
                    }
                });
            }
        ],function(err,result){
            if(err!=null){
                if(err==1){
                    //conn pool error
                    console.log('system error(cp OR w)');
                    res.json({result:'F',code:1});
                }
                else if(err==2){
                    //query error
                    console.log('query error');
                    res.json({result:'F',code:1});
                }
                else if(err==3){
                    //no data
                    console.log('no data error');
                    res.json({result:'F',code:2});
                }
                else{
                    //etc error
                    console.log('etc error');
                    res.json({result:'F',code:3});
                }
            }
            else{
                //console.log('examRes wr success');
                res.json({
                    result:'S',
                    ruby : result.ruby,
                    examCombo : result.examCombo,
                    accCorrect : result.accCorrect,
                    earnRuby : result.tier*data.combo
                });
            }
        });
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

exports.tipQuizReq = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined') {
        var data = req.body;
        //console.log('recvData tipQuiz : ',req.body);

        db.pool.getConnection(function(err,conn){
            if(err){
                console.log('err p tipQuiz, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var stmt = 'UPDATE member SET' +
                    ' firstLifeDecTime=IF(life>=lifeLimit,UNIX_TIMESTAMP(),firstLifeDecTime),' +
                    ' life=IF(life>0,life-1,0),'+
                    ' lifeAllUsed =IF(life=0,1,lifeAllUsed)'+
                    ' WHERE ID=?';
                conn.query(stmt,[data.ID],function(errq,result){
                    if(errq){
                        console.log('err UPDATE tipQuiz, ERR 1: ',errq);
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                    else if(result.affectedRows==1 && result.changedRows==1){
                        var stmt2 = 'SELECT * FROM member WHERE ID=?';
                        conn.query(stmt2,[data.ID],function(errq2,result2){
                            if(errq2){
                                console.log('err SELECT tipQuiz, ERR 2: ',errq2);
                                res.json({result:'F',code:1});
                                conn.release();
                                return;
                            }
                            else{
                                res.json({
                                    result : 'S',
                                    life : result2[0].life,
                                    firstLifeDecTime : result2[0].firstLifeDecTime,
                                    lifeAllUsed : result2[0].lifeAllUsed
                                });
                                conn.release();
                            }
                        });
                    }
                    else{
                        console.log('no life');
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                });
            }
        });
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

/*
* [post] get quest data
* req : ID
* res : questData
* */
exports.getQuestData = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined') {
        var data = req.body;
        //console.log('recvData on questData : ', data);
        db.pool.getConnection(function(err,conn){
            if(err){
                console.log('error on pool questData, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var stmt = 'SELECT questData FROM member WHERE ID=?';
                conn.query(stmt,[data.ID],function(errq,result){
                    if(errq){
                        console.log('error questData, err : ',errq);
                        res.json({result:'F',code:1});
                        conn.release();
                        return;
                    }
                    else{
                        var d = JSON.parse(result[0].questData);
                        res.json({
                            result:'S',
                            questData:result[0].questData});
                    }
                    conn.release();
                });
            }
        });
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

/*
* [post] update quest result
* req : ID, questId
* res : ruby,questData
* latest version : 11/4
* 현재 필요한 값이 뭔지 정해지고 다시 작업시작
* */
exports.updateQuestData = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined') {
        var data = req.body;
        //console.log('recvData on updateQuestData : ', data);

        db.pool.getConnection(function(err,conn){
            if(err){
                console.log('error on pool updateQuest, ERR : ',err);
                res.json({result:'F',code:1});
                return;
            }
            else{
                var questData;
                var earnRuby = 0;
                var currRuby;
                var questId = parseInt(data.questId);
                var questType = 0;
                if(questId>=1 && questId<=7)
                    questType=1;
                else if(questId>=8 && questId<=14)
                    questType=2;
                else if(questId>=15 && questId<=18)
                    questType=3;
                else if(questId>=19 && questId<=26)
                    questType=4;
                else if(questId>=27 && questId<=29)
                    questType=5;
                else if(questId==30)
                    questType=6;
                else if(questId>=31 && questId<=34)
                    questType=7;
                else if(questId==35)
                    questType=8;
                else if(questId>=36 && questId<=38)
                    questType=9;


                conn.beginTransaction(function(errT) {
                    if (errT) {
                        console.log('error db transaction uq', errT);
                        res.json({result:'F',code:1});
                        return;
                    }
                    var stmt = 'SELECT * FROM member WHERE ID=?';
                    conn.query(stmt,[data.ID],function(errq,result){//questData를 가져오기 위한 쿼리 작업
                        if(errq){
                            console.log('err on query uq Select err:',errq);
                            conn.rollback();
                            conn.release();
                            res.json({result:'F',code:1});
                            return;
                        }
                        else{
                            questData = JSON.parse(result[0].questData);
                            currRuby = result[0].ruby;
                            /*
                            * 여기서  quest 데이터의 세팅을 하고 밑의 query에서 값을 재 설정
                            * */
                            if(questId==0 || questType<=0 || questType>9 || questType === 'undefined'){
                                console.log('err on data questType');
                                conn.rollback();
                                conn.release();
                                res.json({result:'F',code:1});
                                return;
                            }else{
                                switch (questType){
                                    case 1://chapter clear
                                    {
                                        if(result[0].maxStage >= parseInt(questData.quest[questId].goal) &&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('not enough maxStage 1');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:3});
                                            return;
                                        }
                                    }
                                        break;
                                    case 2://allgood count
                                    {
                                        if(result[0].star3StageCount >= parseInt(questData.quest[questId].goal)&&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('not enough star3Stage 2');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:3});
                                            return;
                                        }
                                    }
                                        break;
                                    case 3://number of correct answer
                                    {
                                        if(result[0].accCorrect >= parseInt(questData.quest[questId].goal)&&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('no update questType 3');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 4://exam combo
                                    {
                                        if(result[0].examPlayed==1 && parseInt(questData.quest[questId].chk)==0){
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }
                                        else if(result[0].examCombo >= parseInt(questData.quest[questId].goal)&&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('no update questType 4');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 5://goldTip count
                                    {
                                        if(result[0].goldTipCount >= parseInt(questData.quest[questId].goal)&&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('no update questType 5');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 6://honeytip count
                                    {
                                        if(result[0].honeyTipCount >= parseInt(questData.quest[questId].goal)&&
                                            parseInt(questData.quest[questId].chk)==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('no update questType 6');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 7://life all used, vip는 로그인시 카운트 확인해서 보여주기
                                    {
                                        if(result[0].lifeAllUsed == 1 && result[0].vipLifeAllUsedBit==0){
                                            //maxStage 이 목표값 보다 크거나 같을 경우
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                            var stmt2 = 'UPDATE member SET vipLifeAllUsedCount=IF(vipLifeAllUsedCount>0,vipLifeAllUsedCount-1,0),' +
                                                'vipLifeAllUsedBit=1' +
                                                ' WHERE ID=?';
                                            conn.query(stmt2, [data.ID], function (errq, result) {
                                                if (errq) {
                                                    console.log('err on query questData Update err:', errq);
                                                    conn.rollback();
                                                    conn.release();
                                                    res.json({result: 'F', code: 1});
                                                    return;
                                                }
                                                else if (result.affectedRows == 1 && result.changedRows == 1) {
                                                    //success
                                                }
                                            });
                                        }else{
                                            console.log('no update questType 7');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 8://email 주소 인증
                                    {
                                        if(String(result[0].email)!='null' && String(result[0].emailToken)=='null'
                                         && parseInt(questData.quest[questId].chk)==0){
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                        }else{
                                            console.log('no update questType 8');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    case 9://vip level
                                    {
                                        if(result[0].vipLoginCount>0 && result[0].vipLevel>0 && result[0].vipLoginBit==0){
                                            questData.quest[questId].chk=1;
                                            earnRuby = questData.quest[questId].reward;
                                            var stmt2 = 'UPDATE member SET vipLoginCount=IF(vipLoginCount>0,vipLoginCount-1,0),' +
                                                'vipLoginBit=1' +
                                                ' WHERE ID=?';
                                            conn.query(stmt2,[data.ID],function(errq,result){
                                                if(errq){
                                                    console.log('err on query questData Update err:',errq);
                                                    conn.rollback();
                                                    conn.release();
                                                    res.json({result:'F',code:1});
                                                    return;
                                                }
                                                else if(result.affectedRows==1&&result.changedRows==1){
                                                    //success
                                                }
                                            });
                                        }
                                        else{//vipLoginCount가 없거나 vipLevel이 낮을 경우
                                            //아무것도 안함
                                            console.log('no update questType 9');
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:2});
                                            return;
                                        }
                                    }
                                        break;
                                    default:
                                    {

                                    }
                                        break;
                                }
                            }
                            var stmt3 = 'UPDATE member SET questData=IF(ISNULL(questData),questData,?),ruby=(ruby+?) WHERE ID=?';
                            conn.query(stmt3,[JSON.stringify(questData),earnRuby,data.ID],function(errq,result){
                                if(errq){
                                    console.log('err on query questData Update err:',errq);
                                    conn.rollback();
                                    conn.release();
                                    res.json({result:'F',code:1});
                                    return;
                                }
                                else if(result.affectedRows==1&&result.changedRows==1){
                                    //success
                                    conn.query('SELECT * FROM member WHERE ID=?',[data.ID],function(errq2,result2){
                                        if(errq2){
                                            console.log('questClaim q last select err:',errq);
                                            conn.rollback();
                                            conn.release();
                                            res.json({result:'F',code:1});
                                            return;
                                        }
                                        else if(result2){
                                            conn.commit(function (errC) {
                                                if (errC) {
                                                    res.json({result: 'F',code:1});
                                                    conn.rollback();
                                                    conn.release();
                                                    console.log('questData commit error:', errC);
                                                    return;
                                                }
                                                else{
                                                    //console.log('success');
                                                    res.json({
                                                        result:'S',
                                                        ruby:result2[0].ruby,
                                                        earnRuby:earnRuby,
                                                        vipLoginCount:result2[0].vipLoginCount,
                                                        vipLoginBit : result2[0].vipLoginBit,
                                                        vipLifeAllUsedCount : result2[0].vipLifeAllUsedCount,
                                                        vipLifeAllUsedBit:result2[0].vipLifeAllUsedBit,
                                                        questData:result2[0].questData
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else{
                                    console.log('error on questdata update, no changed');
                                    conn.rollback();
                                    conn.release();
                                    res.json({result: 'F',code:2});//이미 보상 받음
                                    return;
                                }
                                conn.release();
                            });
                        }
                    });
                });
            }
        });

    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};

/*
* [get] 공지사랑
* req : none
* res : result,
*       noticeArr[{idx,string},...]
* */
exports.notice = function(req,res){
    if(process.argv[2]==1 || typeof process.argv[2]==='undefined') {
        //if noticeArr이 0일때 공지사항 없음
        var noticeFileData = fs.readFileSync('./notice.json');
        var noticeData = JSON.parse(noticeFileData);

        if(noticeData.noticeArr.length==0){
            //공지 없음
            res.json({result:'F',code:1});
        }
        else{
            //공지 있음
            var data = {};
            var arr = [];
            arr.push(noticeData.noticeArr.pop());
            arr.push(noticeData.noticeArr.pop());
            arr.push(noticeData.noticeArr.pop());
            data.result = 'S';
            data.noticeArr = arr;
            res.json(data);
        }
    }
    else if(process.argv[2]==2){
        res.json({result:'F',code:4,serverCode:2});
    }else if(process.argv[2]==3){
        res.json({result:'F',code:4,serverCode:3});
    }else{
        res.json({result:'F',code:4,serverCode:4});
    }
};