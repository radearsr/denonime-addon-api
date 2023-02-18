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
  // const headers = {
  //   "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
  //   "sec-ch-ua-mobile": "?0",
  //   "sec-ch-ua-platform": "Windows",
  //   "upgrade-insecure-requests": 1,
  //   "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  //   "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  // };
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
