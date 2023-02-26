require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const { MessagingResponse } = require("twilio").twiml;

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

let getContestMessage = async (formUrl) => {
  let response = await axios.get(formUrl);
  const $ = cheerio.load(response.data);
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDescription = $('meta[property="og:description"]').attr("content");
  const result = `📖  ${ogTitle} 📖

        ${formUrl}


      🖋 ${ogDescription.replace(/(\r\n|\n|\r)/gm, " ")} 🖋 `;
  return result;
};

app.get("/generate/:formUrl", async (req, res) => {
  try {
    res.send(await getContestMessage(req.params.formUrl));
  } catch (e) {
    res.send("Invalid FormUrl").status(400);
    console.log(e);
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  let message;

  try {
    if (!req.body || !req.body.Body) {
      throw "empty body";
    }
    message = new MessagingResponse().message(
      await getContestMessage(req.body.Body)
    );
  } catch (e) {
    message = new MessagingResponse().message("Invalid Google Forms Link");
    console.log(e);
  }

  res.set("Content-Type", "text/xml");
  res.send(message.toString()).status(200);
  console.log(message.toString());
});

const port = process.env.PORT || 3005;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server listening at ${host}:${port}`);
});

module.exports = app;
