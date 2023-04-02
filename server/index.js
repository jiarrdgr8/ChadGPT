const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

const configuration = new Configuration({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json())
app.use(cors({
    origin: "https://chad-gpt-client-six.vercel.app/"
}))



app.post('/', async (req, res)=>{
    const { message, currentModel, temperature } = req.body
    console.log("message:", message)
    console.log("currentModel:", currentModel)
    console.log("Temperature:", temperature)
    const response = await openai.createCompletion({
        model: `${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: Number(temperature),
    });
    res.json({
        message: response.data.choices[0].text,
    })
})

app.get('/models', async (req, res)=>{
    const response = await openai.listEngines();
    // console.log(response.data.data)
    res.json({
        models: response.data.data
    })
})

app.listen(port, ()=> console.log(`Server started on port: ${port}`))
