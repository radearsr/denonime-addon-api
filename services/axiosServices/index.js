const axios = require("axios");

exports.checkDomainAndGetHtml = async (domain) => {
  const [,,mainDomain] = domain.split("/");
  console.log(mainDomain);
  const checkDomain = await axios.get(`https://${mainDomain}`);
  if (checkDomain instanceof axios.AxiosError) throw new Error("Domain Gagal Check");
  const getHtml = await axios.get(domain);
  return getHtml.data;
};

exports.getHtmlWithCustomHeader = async (linkStreaming) => {
  const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  }
  const getHtml = await axios.get(linkStreaming, { headers });
  return getHtml.data;
}
