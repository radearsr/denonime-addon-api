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
    "sec-fetch-dest": "",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": `${custom.headerUserAgent}`,
  }
  const getHtml = await axios.get(linkStreaming, { headers  });
  return getHtml.data;
};

exports.getHtmlContent = async (linkPages) => {
  const getHtml = await axios.get(linkPages);
  return getHtml.data;
};
