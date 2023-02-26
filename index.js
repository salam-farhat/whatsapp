require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const { MessagingResponse } = require('twilio').twiml;

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser)

app.get("/generate/:formUrl", (req, res) => {
  axios
    .get(req.params.formUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const ogTitle = $('meta[property="og:title"]').attr("content");
      const ogDescription = $('meta[property="og:description"]').attr(
        "content"
      );
      const result = `📖  ${ogTitle} 📖

        ${req.params.formUrl}


      🖋   ${ogDescription.replace(/(\r\n|\n|\r)/gm, " ")} 🖋 `;
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/", async (req, res) => {
  console.log(req.body);

  let message;

  message = new MessagingResponse().message('Send us an image!');

  res.set('Content-Type', 'text/xml');
  res.send(message.toString()).status(200);
  //console.log(message.toString());
});

const port = process.env.PORT || 3005;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server listening at ${host}:${port}`);
});

module.exports = app;
