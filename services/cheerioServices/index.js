const cheerio = require("cheerio");

const otakudesuStrategy = (html) => {
  const $ = cheerio.load(html)
  const scriptContent = $("script").text();
  const scriptIncludedFormat = scriptContent.split("sources")[1];
  const splitedbyFileKey = scriptIncludedFormat.split(": [{'file':'")[1];
  const videoPlayer = splitedbyFileKey.split("','type':'video/mp4'}],\n")[0];
  return videoPlayer;
};

const ownStrategy = (html) => {
  const $ = cheerio.load(html);
  const player = $("#player > source").attr("src");
  return player;
}

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
}

exports.getVideoPlayer = (html, strategy) => {
  let video;
  if (strategy === "otakudesu") {
    video = otakudesuStrategy(html);
  } else if (strategy === "own") {
    video = ownStrategy(html);
  } else {
    video = "Strategy Tidak Tersedia";
  }
  return video;
}
