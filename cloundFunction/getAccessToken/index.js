// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require("https")
const appid = 'wxe58c0c5af735b2d2'
const appSecret = '67aece8e6849c6c874fe05dcc8f95c27'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = await new Promise((resolve, reject) => {
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appSecret}`, (res) => {
      res.on("data", data => {
        resolve(JSON.parse(data.toString()))
      })
    })
   
  })
  return data
}