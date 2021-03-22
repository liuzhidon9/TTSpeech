// 云函数入口文件
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
//腾讯云通用印刷体识别文档：https://cloud.tencent.com/document/api/866/33526
const tencentcloud = require("tencentcloud-sdk-nodejs");
const cloud = require("wx-server-sdk");
const got = require("got");
const images = require("images");
const errCode = require("./errCode.js");
cloud.init();

async function generalBasicOCR(ImageUrl, ImageBase64) {
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
    ImageUrl: ImageUrl || "",
    ImageBase64: ImageBase64 || "",
  };
  let data = {};
  let err = null;
  try {
    data = await client.GeneralBasicOCR(params);
  } catch (error) {
    err = {
      ...error,
      msg: errCode[error.code],
    };
  }
  return { data, err }
}

// 图片检测
async function imgSecCheck(ImageUrl) {
  let buffer = await got(ImageUrl).buffer()
  let { width: imgW, height: imgH } = images(buffer).size()
  imgW = imgW > 750 ? 750 : imgW
  imgH = imgH > 1334 ? 1334 : imgH
  let imgBuffer = images(buffer).resize(imgW, imgH).encode("jpg", { quality: 50 })
  let result = null
  try {
    result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: "image/jpg",
        value: imgBuffer,
      },
    });
  } catch (error) {
    result = error
  }
  return result

}
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  let data = {}
  let err = null
  const imgCheckResult = await imgSecCheck(event.ImageUrl)
  if (imgCheckResult.errCode !== 0 && imgCheckResult.errMsg !== 'ok') {
    return {
      event,
      data,
      err: {
        code: imgCheckResult.errCode,
        msg: imgCheckResult.errMsg
      }
    }
  }
  let ocrResult = await generalBasicOCR(event.ImageUrl, event.ImageBase64)
  data = ocrResult.data
  err = ocrResult.err
  return {
    event,
    err,
    data,
  };
};
