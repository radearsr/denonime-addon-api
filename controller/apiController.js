const axiosServices = require("../services/axiosServices");
const cheerioServices = require("../services/cheerioServices");
const {
  monitoringPayloadSchema,
  getEmbedPayloadSchema,
  getSourcePayloadSchema,
  getSourceHeaderSchema,
} = require("../services/payloadServices");

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
