const axiosServices = require("../services/axiosServices");
const cheerioServices = require("../services/cheerioServices");

exports.monitoringController = async (req, res) => {
  try {
    const { domain, lastTotalEps } = req.body;
    const html = await axiosServices.checkDomainAndGetHtml(domain);
    const updatedEps = cheerioServices.getEpisodesAndCompare(html, lastTotalEps);
    res.json({
      status: "success",
      data: updatedEps,
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

exports.getEmbedController = async (req, res) => {
  try {
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
    const { link, strategy } = req.body;
    console.log(req.headers);
    const html = await axiosServices.getHtmlWithCustomHeader(req.headers["sec-ch-ua"],link);
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
