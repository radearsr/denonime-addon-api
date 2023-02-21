const axios = require("axios");

exports.checkDomainAndGetHtml = async (domain) => {
  const [,,mainDomain] = domain.split("/");
  console.log(mainDomain);
  const checkDomain = await axios.get(`https://${mainDomain}`);
  if (checkDomain instanceof axios.AxiosError) throw new Error("Domain Gagal Check");
  const getHtml = await axios.get(domain);
  return getHtml.data;
};

exports.getHtmlWithCustomHeader = async (custom, linkStreaming) => {
  const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": `${custom.headerSecchua}`,
    "sec-ch-ua-mobile": `${custom.headerSecchuaMobile}`,
    "sec-ch-ua-platform": `${custom.headerSecchuaPlatform}`,
    "sec-fetch-dest": "",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": `${custom.headerUserAgent}`,
  }
  console.log(headers);
  const getHtml = await axios.get(linkStreaming, { headers  });
  // console.log(getHtml.data);
  return getHtml.data;
}
