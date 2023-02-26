require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

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

const { MessagingResponse } = require('twilio').twiml;

const goodBoyUrl = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?'
  + 'ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';

app.post("/", (req, res) => {
  const { body } = req;

  let message;

  if (body.NumMedia > 0) {
    message = new MessagingResponse().message("Thanks for the image! Here's one for you!");
    message.media(goodBoyUrl);
  } else {
    message = new MessagingResponse().message('Send us an image!');
  }

  res.set('Content-Type', 'text/xml');
  res.send(message.toString()).status(200);
  console.log("Twilio message");
  console.log(message.toString());
});

const port = process.env.PORT || 3005;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server listening at ${host}:${port}`);
});

module.exports = app;
