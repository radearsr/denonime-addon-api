const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const otakudesuStrategy = (html) => {
  const $ = cheerio.load(html)
  const scriptContent = $("script").text();
  const scriptIncludedFormat = scriptContent.split("sources")[1];
  const splitedbyFileKey = scriptIncludedFormat.split(": [{'file':'")[1];
  const videoPlayer = splitedbyFileKey.split("','type':'video/mp4'}],\n")[0];
  return videoPlayer;
};

const mp4Strategy = () => {
  const result = fs.readFileSync(path.join(__dirname, "index.html"))
  const $ = cheerio.load(result.toString());
  const script = $("body script").text();
  const splitedScript = script.split(`"`)
  return splitedScript[7]
};

const ownStrategy = (html) => {
  const $ = cheerio.load(html);
  const player = $("#player > source").attr("src");
  return player;
};

exports.getEpisodesAndCompare = (html, lastTotalEps) => {
  const capturedEps = [];
  const $ = cheerio.load(html);
  const currentTotalEps = $("#venkonten > div.venser > div:nth-child(8) > ul > li").length;
  if (currentTotalEps > lastTotalEps) {
    const diffEps = currentTotalEps - lastTotalEps;
    $("#venkonten > div.venser > div:nth-child(8) > ul > li a").each((idx, element) => {
      if (idx < diffEps) {
        const linkEps = $(element).attr("href");
        capturedEps.push(linkEps);
      }
    });
  }
  return capturedEps;
};

exports.getDefaultEmbedPlayer = (html) => {
  const $ = cheerio.load(html);
  const iframe = $("#pembed iframe").attr("src");
  return iframe;
};

exports.getVideoPlayer = (html, strategy) => {
  let video;
  if (strategy === "otakudesu") {
    video = otakudesuStrategy(html);
  } else if (strategy === "own") {
    video = ownStrategy(html);
  } else if (strategy === "mp4") {
    video = mp4Strategy(html);
  } else {
    video = "Strategy Tidak Tersedia";
  }
  return video;
};

exports.getAllAnimeList = (html) => {
  const $ = cheerio.load(html);
  const listAnimes = [];
  $(".hodebgst").each((idx, el) => {
    const text = $(el).text().trim();
    const link = $(el).attr("href");
    let title;
    let status;
    let type;
    if (text.includes("Movie")) {
      [title,] = text.split("Movie");
      type = "Movie";
      status = "Completed";
    } else if (text.includes("On-Going")) {
      [title,] = text.split("On-Going");
      type = "Series";
      status = "Ongoing";
    } else {
      title = text;
      type = "Series";
      status = "Completed";
    }
    listAnimes.push({
      title: title.trim(),
      status,
      type,
      link
    });
  });
  return listAnimes;
};

exports.getDetailAnime = async (html) => {
  const $ = cheerio.load(html);
  const description = $(".sinopc").text();
  const title = $(".infozingle > p:nth-child(1)").text();
  const rating = $(".infozingle > p:nth-child(3)").text();
  const releaseDate = $(".infozingle > p:nth-child(9)").text();
  const genres = $(".infozingle > p:nth-child(11)").text();
  const poster = $(".fotoanime > img").attr("src");
  return {
    description,
    title: title.split("Judul: ")[1],
    rating: rating.split("Skor: ")[1],
    releaseDate: releaseDate.split("Tanggal Rilis: ")[1],
    genres: genres.split("Genre: ")[1],
    poster,
  };
};

exports.getResultSearch = (html, includesText) => {
  const $ = cheerio.load(html);
  const result = [];
  $("a.hoverinfo_trigger.fw-b.fl-l").each((idx, el) => {
    const title = $(el).children("strong").text();
    const link = $(el).attr("href");
    if (title.includes(includesText)) {
      result.push({
        title,
        link,
      });
    }
  });
  return result;
};

exports.getDetailMAL = (html) => {
  const $ = cheerio.load(html);
  const rating = $("div.score-label").text();
  const description = $("p[itemprop='description']").text();
  const releaseDate = []
  $(".spaceit_pad > .dark_text").each((idx, el) => {
    const contentDetails = $(el).parent().text();
    if (contentDetails.includes("Aired:")) {
      const [,,date] = contentDetails.split("\n")
      releaseDate.push(date.trim());
    }
  });
  return {
    rating,
    description,
    releaseDate: releaseDate[0],
  };
};

