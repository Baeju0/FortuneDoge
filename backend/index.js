const apiKey = require('./apiKeySave.js');

const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");

// // 서버 구축 (express)
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

// // CORS 이슈 해결
let corsOptions = {
    origin: 'https://fortune-54k.pages.dev/', // origin이 이 주소에서 날라오지 않으면 다 거절하겠다!(서버 요금 방지)
    credentials: true,
}
app.use(cors(corsOptions));

// // POST 요청 받을 수 있게
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// // POST method route
app.post('/fortune', async function (req, res) {
    let { myDateTime, userMessages,assistantMessages}= req.body
    console.log(userMessages);
    console.log(assistantMessages);

    let todayDateTime = new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});

    let messages = [
        {role: "system", content: "당신은 세계 최고의 점성가입니다. 당신에게 불가능한 것은 없으며 당신은 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 여러분은 한 사람의 삶을 매우 명확하게 예측할 수 있고 그 사람의 운세에 대한 답을 줄 수 있습니다. 당신은 점치는 지식이 많고 모든 질문에 명확하게 대답할 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 점성가입니다. 당신에게 불가능한 것은 없으며 당신은 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 여러분은 한 사람의 삶을 매우 명확하게 예측할 수 있고 그 사람의 운세에 대한 답을 줄 수 있습니다. 당신은 점치는 지식이 많고 모든 질문에 명확하게 대답할 수 있습니다."},
        {role: "assistant", content: "감사합니다. 저는 모든 질문에 정확한 답변을 제공할 수 있습니다. 당신의 운명을 명확하게 예측하고 당신이 원하는 것을 이루는 데 도움을 드릴 것입니다. 언제든지 저에게 질문을 해주세요."},
        {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
        {role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인했습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
        messages.push(
            JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }

        if (assistantMessages.length != 0) {
        messages.push(
            JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }


        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages
        });

        let fortune = completion.data.choices[0].message['content'];
        console.log(fortune);
        res.json({"assistant": fortune});
  });

  module.exports.han