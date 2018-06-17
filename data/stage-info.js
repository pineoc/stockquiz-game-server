
// 각 스테이지에 대한 게임진행에 필요한 데이터
const VStageGameData = {
  stage: [
    {}, // 0
    { // 1
      cate: [1],
      subCate: [1],
      question: 1,
    },
    { // 2
      cate: [1],
      subCate: [1],
      question: 1,
    },
    {// 3
      cate: [1],
      subCate: [1],
      question: 1,
    },
    {// 4
      cate: [1],
      subCate: [1],
      question: 1,
    },
    {// 5
      cate: [1],
      subCate: [1],
      question: 1,
    },
    {// 6
      cate: [1],
      subCate: [1],
      question: 1,
    },
    {// 7
      cate: [1],
      subCate: [1],
      question: 1,
    },
    // ch2-1 --------------1
    {// 8
      cate: 1,
      subCate: [1, 2],
      question: 4,
    },
    {// 9
      cate: 1,
      subCate: [1, 2],
      question: 5,
    },
    {// 10
      cate: 1,
      subCate: [1, 2],
      question: 6,
    },
    {// 11
      cate: 1,
      subCate: [1, 2],
      question: 7,
    },
    // ch2-2 --------------2
    {// 12
      cate: 2,
      subCate: [3, 4],
      question: 4,
    },
    {// 13
      cate: 2,
      subCate: [3, 4],
      question: 6,
    },
    {// 14
      cate: 2,
      subCate: [1, 4],
      question: 7,
    },
    {// 15
      cate: 2,
      subCate: [1, 4],
      question: 8,
    },
    // ch3-1 --------------3
    {// 16
      cate: 3,
      subCate: [5, 6],
      question: 4,
    },
    {// 17
      cate: 3,
      subCate: [5, 6],
      question: 5,
    },
    {// 18
      cate: 3,
      subCate: [3, 6],
      question: 6,
    },
    {// 19
      cate: 3,
      subCate: [1, 6],
      question: 7,
    },
    // ch3-2 --------------4
    {// 20
      cate: 4,
      subCate: [7, 8],
      question: 4,
    },
    {// 21
      cate: 4,
      subCate: [7, 8],
      question: 6,
    },
    {// 22
      cate: 4,
      subCate: [5, 8],
      question: 7,
    },
    {// 23
      cate: 4,
      subCate: [3, 8],
      question: 8,
    },
    // ch4-1 --------------5
    {// 24
      cate: 5,
      subCate: [9, 10],
      question: 4,
    },
    {// 25
      cate: 5,
      subCate: [9, 10],
      question: 5,
    },
    {// 26
      cate: 5,
      subCate: [7, 10],
      question: 6,
    },
    {// 27
      cate: 5,
      subCate: [5, 10],
      question: 7,
    },
    // ch4-2 --------------6
    {// 28
      cate: 6,
      subCate: [11, 12],
      question: 4,
    },
    {// 29
      cate: 6,
      subCate: [11, 12],
      question: 6,
    },
    {// 30
      cate: 6,
      subCate: [9, 12],
      question: 7,
    },
    {// 31
      cate: 6,
      subCate: [7, 12],
      question: 8,
    },
    // ch5-1 --------------7
    {// 32
      cate: 7,
      subCate: [13, 14],
      question: 4,
    },
    {// 33
      cate: 7,
      subCate: [13, 14],
      question: 5,
    },
    {// 34
      cate: 7,
      subCate: [11, 14],
      question: 6,
    },
    {// 35
      cate: 7,
      subCate: [9, 14],
      question: 7,
    },
    // ch5-2 --------------8
    {// 36
      cate: 8,
      subCate: [15, 16],
      question: 4,
    },
    {// 37
      cate: 8,
      subCate: [15, 16],
      question: 6,
    },
    {// 38
      cate: 8,
      subCate: [13, 16],
      question: 7,
    },
    {// 39
      cate: 8,
      subCate: [11, 16],
      question: 8,
    },
    // ch6-1 --------------9
    {// 40
      cate: 9,
      subCate: [17, 18],
      question: 4,
    },
    {// 41
      cate: 9,
      subCate: [17, 18],
      question: 5,
    },
    {// 42
      cate: 9,
      subCate: [15, 18],
      question: 6,
    },
    {// 43
      cate: 9,
      subCate: [13, 18],
      question: 7,
    },
    // ch6-2 --------------10
    {// 44
      cate: 10,
      subCate: [19, 20],
      question: 4,
    },
    {// 45
      cate: 10,
      subCate: [19, 20],
      question: 6,
    },
    {// 46
      cate: 10,
      subCate: [17, 20],
      question: 7,
    },
    {// 47
      cate: 10,
      subCate: [15, 20],
      question: 8,
    },
    // ch7-1 --------------11
    {// 48
      cate: 11,
      subCate: [21, 22],
      question: 4,
    },
    {// 49
      cate: 11,
      subCate: [21, 22],
      question: 5,
    },
    {// 50
      cate: 11,
      subCate: [19, 22],
      question: 6,
    },
    {// 51
      cate: 11,
      subCate: [17, 22],
      question: 7,
    },
    {
      cate: 12,
      subCate: [23, 24],
      question: 4,
    },
    {
      cate: 12,
      subCate: [23, 24],
      question: 6,
    },
    {
      cate: 12,
      subCate: [21, 24],
      question: 7,
    },
    {
      cate: 12,
      subCate: [19, 24],
      question: 8,
    },
    {
      cate: 12,
      subCate: [1, 25],
      question: 20,
    },
  ],
};

const stageDataGoalGame = [
  0, 3, 3, 3, 3, 3, 3, 6, // 1ch
  4, 5, 6, 7, 4, 6, 7, 8, // 2
  4, 5, 6, 7, 4, 6, 7, 8, // 3
  4, 5, 6, 7, 4, 6, 7, 8, // 4
  4, 5, 6, 7, 4, 6, 7, 8, // 5
  4, 5, 6, 7, 4, 6, 7, 8, // 6
  4, 5, 6, 7, 4, 6, 7, 8, // 7
  20,
];

/*
 * 밸런스를 위한 데이터들
 * questData, stageData, vipLevelReward
 * */
const VStageData = {
  stage: [
    {},
    {// 1
      idx: 1,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 1,
      goalGame: 3,
    },
    {// 2
      idx: 2,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 1,
      goalGame: 3,
    },
    {// 3
      idx: 3,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 1,
      goalGame: 3,
    },
    {// 4
      idx: 4,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 2,
      goalGame: 3,
    },
    {// 5
      idx: 5,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 2,
      goalGame: 3,
    },
    {// 6
      idx: 6,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 2,
      goalGame: 3,
    },
    {// 7
      idx: 7,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 3,
      goalGame: 6,
    },
  ],
};

for (let i = 8; i <= 56; i += 1) { // 일반 게임들
  if (i % 8 === 5 || i % 8 === 6 || i % 8 === 7) { // 심화문제
    if (i < 44) {
      VStageData.stage[i] = {
        idx: i,
        type: 0,
        played: 0,
        star: 0,
        ruby: 0,
        maxRuby: 6,
      };
    } else {
      VStageData.stage[i] = {
        idx: i,
        type: 0,
        played: 0,
        star: 0,
        ruby: 0,
        maxRuby: 9,
      };
    }
  } else {
    if (i < 44) {
      VStageData.stage[i] = {
        idx: i,
        type: 0,
        played: 0,
        star: 0,
        ruby: 0,
        maxRuby: 3,
      };
    } else {
      VStageData.stage[i] = {
        idx: i,
        type: 0,
        played: 0,
        star: 0,
        ruby: 0,
        maxRuby: 6,
      };
    }
  }
  if (i % 4 === 0) {
    VStageData.stage[i].type=1;
    VStageData.stage[i].maxRuby=3;
  }
  if (i === 56) {
    VStageData.stage[i] = {
      idx: i,
      type: 0,
      played: 0,
      star: 0,
      ruby: 0,
      maxRuby: 12,
      goalGame: 20,
    };
  }
  VStageData.stage[i].goalGame = stageDataGoalGame[i];
}
const VQuestData = {
  quest: [
    {
      qId: 0,
      type: 0,
      reward: 0,
      goal: 0,
      chk: 0,
    },
    {// 챕터 퀘스트
      qId: 1,
      type: 1,
      reward: 2,
      goal: 7,
      chk: 0,
    },
    {
      qId: 2,
      type: 1,
      reward: 4,
      goal: 15,
      chk: 0,
    },
    {
      qId: 3,
      type: 1,
      reward: 6,
      goal: 23,
      chk: 0,
    },
    {
      qId: 4,
      type: 1,
      reward: 8,
      goal: 31,
      chk: 0,
    },
    {
      qId: 5,
      type: 1,
      reward: 10,
      goal: 39,
      chk: 0,
    },
    {
      qId: 6,
      type: 1,
      reward: 12,
      goal: 47,
      chk: 0,
    },
    {
      qId: 7,
      type: 1,
      reward: 14,
      goal: 55,
      chk: 0,
    },
    {// 만점 스테이지 클리어 갯수 퀘스트
      qId: 8,
      type: 2,
      reward: 5,
      goal: 5,
      chk: 0,
    },
    {
      qId: 9,
      type: 2,
      reward: 6,
      goal: 11,
      chk: 0,
    },
    {
      qId: 10,
      type: 2,
      reward: 8,
      goal: 18,
      chk: 0,
    },
    {
      qId: 11,
      type: 2,
      reward: 11,
      goal: 26,
      chk: 0,
    },
    {
      qId: 12,
      type: 2,
      reward: 15,
      goal: 35,
      chk: 0,
    },
    {
      qId: 13,
      type: 2,
      reward: 20,
      goal: 45,
      chk: 0,
    },
    {
      qId: 14,
      type: 2,
      reward: 26,
      goal: 56,
      chk: 0,
    },
    {// 누적 정답수 퀘스트
      qId: 15,
      type: 3,
      reward: 10,
      goal: 50,
      chk: 0,
    },
    {
      qId: 16,
      type: 3,
      reward: 15,
      goal: 150,
      chk: 0,
    },
    {
      qId: 17,
      type: 3,
      reward: 20,
      goal: 300,
      chk: 0,
    },
    {
      qId: 18,
      type: 3,
      reward: 25,
      goal: 500,
      chk: 0,
    },
    {// exam 퀘스트
      qId: 19,
      type: 4,
      reward: 2,
      goal: 1,
      chk: 0,
    },
    {
      qId: 20,
      type: 4,
      reward: 3,
      goal: 3,
      chk: 0,
    },
    {
      qId: 21,
      type: 4,
      reward: 4,
      goal: 4,
      chk: 0,
    },
    {
      qId: 22,
      type: 4,
      reward: 5,
      goal: 5,
      chk: 0,
    },
    {
      qId: 23,
      type: 4,
      reward: 6,
      goal: 6,
      chk: 0,
    },
    {
      qId: 24,
      type: 4,
      reward: 7,
      goal: 7,
      chk: 0,
    },
    {
      qId: 25,
      type: 4,
      reward: 8,
      goal: 8,
      chk: 0,
    },
    {
      qId: 26,
      type: 4,
      reward: 9,
      goal: 9,
      chk: 0,
    },
    {// 황금팁 잠금해제 퀘스트
      qId: 27,
      type: 5,
      reward: 5,
      goal: 1,
      chk: 0,
    },
    {
      qId: 28,
      type: 5,
      reward: 10,
      goal: 3,
      chk: 0,
    },
    {
      qId: 29,
      type: 5,
      reward: 15,
      goal: 6,
      chk: 0,
    },
    {// 결과창에서 꿀팀 확인하기 퀘스트
      qId: 30,
      type: 7,
      reward: 5,
      goal: 10,
      chk: 0,
    },
    {// 통장을 모두 쓰는 퀘스트
      qId: 31,
      type: 6,
      reward: 2,
      goal: 1,
      chk: 0,
    },
    {
      qId: 32,
      type: 6,
      reward: 4,
      goal: 1,
      chk: 0,
    },
    {
      qId: 33,
      type: 6,
      reward: 7,
      goal: 1,
      chk: 0,
    },
    {
      qId: 34,
      type: 6,
      reward: 10,
      goal: 1,
      chk: 0,
    },
    {// 이메일 인증 퀘스트
      qId: 35,
      type: 8,
      reward: 10,
      goal: 1,
      chk: 0,
    },
    {// 로그인 보상
      qId: 36,
      type: 9,
      reward: 5,
      goal: 1,
      chk: 0,
    },
    {
      qId: 37,
      type: 9,
      reward: 10,
      goal: 1,
      chk: 0,
    },
    {
      qId: 38,
      type: 9,
      reward: 15,
      goal: 1,
      chk: 0,
    },
  ],
};
const VDayChkData = {
  dayChk: [
    {},
    {
      idx: 1,
      type: 1,
      value: 1,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 2,
      type: 1,
      value: 2,
      v1Value: 1,
      v2Value: 2,
      v3Value: 4,
    },
    {
      idx: 3,
      type: 4,
      value: 2,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 4,
      type: 1,
      value: 3,
      v1Value: 0,
      v2Value: 3,
      v3Value: 6,
    },
    {
      idx: 5,
      type: 1,
      value: 4,
      v1Value: 0,
      v2Value: 0,
      v3Value: 4,
    },
    {
      idx: 6,
      type: 4,
      value: 3,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 7,
      type: 3,
      value: 2,
      v1Value: 1,
      v2Value: 2,
      v3Value: 4,
    },
    {
      idx: 8,
      type: 1,
      value: 5,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 9,
      type: 1,
      value: 6,
      v1Value: 3,
      v2Value: 6,
      v3Value: 12,
    },
    {
      idx: 10,
      type: 4,
      value: 4,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 11,
      type: 1,
      value: 7,
      v1Value: 0,
      v2Value: 7,
      v3Value: 14,
    },
    {
      idx: 12,
      type: 1,
      value: 8,
      v1Value: 0,
      v2Value: 0,
      v3Value: 16,
    },
    {
      idx: 13,
      type: 6,
      value: 1,
      v1Value: 1,
      v2Value: 2,
      v3Value: 4,
    },
    {
      idx: 14,
      type: 3,
      value: 4,
      v1Value: 2,
      v2Value: 4,
      v3Value: 8,
    },
    {
      idx: 15,
      type: 1,
      value: 9,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 16,
      type: 1,
      value: 10,
      v1Value: 5,
      v2Value: 10,
      v3Value: 20,
    },
    {
      idx: 17,
      type: 4,
      value: 6,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 18,
      type: 1,
      value: 11,
      v1Value: 0,
      v2Value: 11,
      v3Value: 22,
    },
    {
      idx: 19,
      type: 1,
      value: 12,
      v1Value: 0,
      v2Value: 0,
      v3Value: 24,
    },
    {
      idx: 20,
      type: 4,
      value: 6,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 21,
      type: 2,
      value: 20,
      v1Value: 0,
      v2Value: 20,
      v3Value: 40,
    },
    {
      idx: 22,
      type: 1,
      value: 13,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 23,
      type: 1,
      value: 14,
      v1Value: 7,
      v2Value: 14,
      v3Value: 28,
    },
    {
      idx: 24,
      type: 4,
      value: 7,
      v1Value: 0,
      v2Value: 0,
      v3Value: 0,
    },
    {
      idx: 25,
      type: 1,
      value: 15,
      v1Value: 0,
      v2Value: 15,
      v3Value: 30,
    },
    {
      idx: 26,
      type: 1,
      value: 16,
      v1Value: 0,
      v2Value: 0,
      v3Value: 32,
    },
    {
      idx: 27,
      type: 6,
      value: 2,
      v1Value: 2,
      v2Value: 4,
      v3Value: 8,
    },
    {
      idx: 28,
      type: 5,
      value: 20,
      v1Value: 0,
      v2Value: 20,
      v3Value: 40,
    },
  ],
};
