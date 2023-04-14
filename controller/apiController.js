const { translate } = require("@vitalets/google-translate-api");
const axiosServices = require("../services/axiosServices");
const cheerioServices = require("../services/cheerioServices");
const {
  monitoringPayloadSchema,
  getEmbedPayloadSchema,
  getSourcePayloadSchema,
  getSourceHeaderSchema,
} = require("../services/payloadServices");


const validationDetails = async (detail) => {
  if (detail.description === "") {
    const contentSearch = await axiosServices.getHtmlContent(`https://myanimelist.net/anime.php?cat=anime&q=${detail.title}&type=0&score=0&status=0&p=0&r=0&sm=0&sd=0&sy=0&em=0&ed=0&ey=0&c%5B%5D=a&c%5B%5D=b&c%5B%5D=c&c%5B%5D=f`);
    const resultLists = cheerioServices.getResultSearch(contentSearch, detail.title);
    if (resultLists.length < 1 || resultLists.length > 1) {
      detail.description = "NULL";
      detail.rating = 0;
    }
    const contentDetailFromMAL = await axiosServices.getHtmlContent(resultLists[0].link);
    const detailFromMAL = cheerioServices.getDetailMAL(contentDetailFromMAL);
    const { text: translatedDescription } = await translate(detailFromMAL.description, {from: 'en', to: 'id'});
    detail.description = translatedDescription; 
    if (detail.rating === "") {
      detail.rating = detailFromMAL.rating;
    }
  }
  if (detail.releaseDate.includes("to")) {
    [detail.releaseDate] = detail.releaseDate.split("to"); 
  }
  return detail;
};

exports.monitoringController = async (req, res) => {
  try {
    monitoringPayloadSchema(req.body);
    const { link, lastTotalEps } = req.body;
    const html = await axiosServices.checkDomainAndGetHtml(link);
    const updatedEps = cheerioServices.getEpisodesAndCompare(html, lastTotalEps);
    res.json({
      status: "success",
      data: updatedEps,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllListAnimeController = async (req, res) => {
  try {
    getEmbedPayloadSchema(req.body);
    const { link } = req.body;
    const html = await axiosServices.getHtmlContent(link);
    const animes = cheerioServices.getAllAnimeList(html);
    res.json({
      status: "success",
      data: animes,
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });    
  }
};

exports.getDetailsAnimeControler = async (req, res) => {
  try {
    getEmbedPayloadSchema(req.body);
    const { link } = req.body;
    const html = await axiosServices.getHtmlContent(link);
    const details = await cheerioServices.getDetailAnime(html);
    const finalDetails = await validationDetails(details);
    res.json({
      status: "success",
      data: finalDetails,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      data: {
        error
      }
    });
  }
}

exports.getEmbedController = async (req, res) => {
  try {
    getEmbedPayloadSchema(req.body);
    const { link } = req.body;
    const html = await axiosServices.checkDomainAndGetHtml(link);
    const resultEmbed = cheerioServices.getDefaultEmbedPlayer(html);
    res.json({
      status: "success",
      data: resultEmbed,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      data: {
        error
      }
    });
  }
};

exports.getSourcePlayer = async (req, res) => {
  try {
    console.log(req.headers);
    getSourcePayloadSchema(req.body);
    getSourceHeaderSchema(req.headers);
    const { link, strategy } = req.body;
    console.log(req.headers);
    const customHeaders = {
      headerSecchua: req.headers["sec-ch-ua"],
      headerUserAgent: req.headers["user-agent"],
    }
    const html = await axiosServices.getHtmlWithCustomHeader(customHeaders, link);
    const resultVideoPlayer = cheerioServices.getVideoPlayer(html, strategy);
    res.json({
      status: "success",
      data: resultVideoPlayer,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      data: {
        error
      }
    });
  } 
};
