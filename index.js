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

const port = process.env.PORT || 3005;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${port}`);
});
