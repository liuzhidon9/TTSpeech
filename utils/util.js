const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const splitText = textContent => {
  textContent = textContent + " "
  let textArr = textContent.match(/.{1,100}([,.:;?!，。：；！？、]|\s)/igm)
  return textArr
}
const test = () => {
  console.log(wx);
}
// 根据文本生成语音
//参数请参考：https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx3e17776051baf153&token=2035306076&lang=zh_CN
const generatorAduio = ({
  content,
  speed,
  volume,
  voiceType,
  language,
  projectId,
  sampleRate
}) => {
  const plugin = getApp().plugin
  return new Promise((resolve, reject) => {
    content = content.trim()
    if (content.length === 0) {
      resolve();
      return
    }
    plugin.QCloudAIVoice.textToSpeech({
      content: content,
      speed: speed || 0,
      volume: volume || 0,
      voiceType: voiceType || 1,
      language: language || 1,
      projectId: projectId || 0,
      sampleRate: sampleRate || 16000,
      success: function (data) {
        resolve(data)
      },
      fail: (error) => {
        wx.hideLoading()
        wx.showToast({
          title: '无法解析文本内容！',
          icon: 'none',
          duration: 1500
        })
        console.log(error.Error);
        reject(error)
      }
    })
  })
}
// 违规文字检测
//接口返回参数请参考：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.msgSecCheck.html
const msgSecCheck = (msg) => {
  wx.cloud.init()
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "msgSecCheck",
      data: {
        msg: msg
      },
      success: (res) => {
        let result = res.result
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  splitText: splitText,
  generatorAduio: generatorAduio,
  msgSecCheck:msgSecCheck,
  test: test
}