// 云函数入口文件
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");
const OcrClient = tencentcloud.ocr.v20181119.Client;
const clientConfig = {
  credential: {
    secretId: "AKID3qXx6zCvxjaFevwMSHp66pHSL2T3lPDk",
    secretKey: "cyNagX7PTq9MM5fz1WmmfpjNvPmtjIbe",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "ocr.tencentcloudapi.com",
    },
  },
};

const client = new OcrClient(clientConfig);

// 云函数入口函数
exports.main = async (event, context) => {
  const params = {
    "ImageUrl":event.ImageUrl
  };
  let data = await client.GeneralBasicOCR(params)
  return {
    event,
    data
  }
}