const cloud = require("wx-server-sdk")
cloud.init()
exports.main = async (event, context) => {
  let result = await cloud.openapi.security.msgSecCheck({content:"xxxxxxxxxxxx"})
  return result
}