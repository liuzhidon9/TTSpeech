const tencentcloud = require("tencentcloud-sdk-nodejs");
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
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
    "ImageUrl": "https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg"
  };
  let data = await client.GeneralBasicOCR(params)

  return {
    event,
    data: data,

  }
}