 const express = require("express");
  const app = express();
  const axios = require("axios");
  const cheerio = require("cheerio");

  const formUrl = "https://forms.gle/j6BzcWNmqaHpmmvZ6";

 app.get("/generate", (req, res) => {
    axios
      .get(formUrl)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const ogTitle = $('meta[property="og:title"]').attr("content");
        const ogDescription = $('meta[property="og:description"]').attr(
          "content"
        );
        const result =
        `📖  ${ogTitle} 📖

        ${formUrl}


      🖋   ${ogDescription.replace(/(\r\n|\n|\r)/gm, " ")} 🖋 `;
        console.log(result);
        res.send(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const port = 3005;
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
