// 云函数入口文件
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
//腾讯云通用印刷体识别文档：https://cloud.tencent.com/document/api/866/33526
const tencentcloud = require("tencentcloud-sdk-nodejs");
const cloud = require('wx-server-sdk')
const errCode = require('./errCode.js')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
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
  const params = {
    "ImageUrl": event.ImageUrl || '',
    "ImageBase64": event.ImageBase64 || ''
  };
  let data = {}
  let err = null
  try {
    data = await client.GeneralBasicOCR(params)
  } catch (error) {
    err = {
      ...error,
      msg: errCode[error.code],
    }
  }
  return {
    event,
    err,
    data
  }
}