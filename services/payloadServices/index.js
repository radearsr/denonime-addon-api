exports.monitoringPayloadSchema = (payload) => {
  if (!payload.link || !payload.lastTotalEps) {
    throw new Error("Payload belum sesuai, pastikan 2 fields terisi yaitu link dan lastTotalEps");
  }
};

exports.getEmbedPayloadSchema = (payload) => {
  if (!payload.link) {
    throw new Error("Payload belum sesuai, pastikan link fields sudah terisi");
  }
};

exports.getSourcePayloadSchema = (payload) => {
  if (!payload.link || !payload.strategy) {
    throw new Error("Payload belum sesuai, pastikan link dan strategy('own', 'otakudesu') fields sudah terisi");
  } 
};

exports.getSourceHeaderSchema = (headers) => {
  if (!headers["sec-ch-ua"] || !headers["user-agent"]) {
    throw new Error("Header belum sesuai pastikan sec-ch-ua, user-agent terisi");
  }
}