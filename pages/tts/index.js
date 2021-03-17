// pages/index.js
const plugin = getApp().plugin
// 违规文字检测
let msgSecCheck = (msg) => {
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
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    cacheText: "",
    audioArr: [],
    speech: false,
    voiceType: 101015,
    innerAudioContext: null,
    soundGenerator: [{
        voiceType: 101013,
        description: "智辉，新闻男生",
        src: "../../assets/img/man.png",
        active: "../../assets/img/man-active.png"
      },
      {
        voiceType: 101007,
        description: "智娜,客服女声",
        src: "../../assets/img/woman.png",
        active: "../../assets/img/woman-active.png"
      },
    ]
  },

  // 根据文本生成语音
  generatorAduio: function (text) {
    return new Promise((resolve, reject) => {
      text = text.trim()
      if (text.length === 0) {
        resolve();
        return
      }
      plugin.QCloudAIVoice.textToSpeech({
        content: text,
        speed: 0,
        volume: 0,
        voiceType: this.data.voiceType,
        language: 1,
        projectId: 0,
        sampleRate: 16000,
        success: function (data) {
          resolve(data)
        },
        fail: (error) => {
          this.clearState()
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
  },



  // goToRead 解析文本生成语音链接，然后跳转到朗读界面朗读
  goToRead: async function () {
    console.log(this.data.text);
    if (this.data.speech) return
    if (this.data.text == null || this.data.text == "") {
      wx.showToast({
        title: '请输入内容 !',
        icon: 'none',
        duration: 1000
      })
      return
    }

    //违规文本检查
    try {
      await msgSecCheck(this.data.text)
    } catch (error) {
      wx.showToast({
        title: '文本含有违法违规内容!',
        icon: 'none',
        duration: 1500
      })
      return
    }
    //切割文本
    let text = this.data.text + " "
    let textArr = text.match(/.{1,100}([,.:;?!，。：；！？、]|\s)/igm)
    console.log(textArr);

    let audioArr = this.data.audioArr.slice()
    if (this.data.text != this.data.cacheText) {
      audioArr = []
      wx.showLoading({
        title: '正在生成语音...',
      })
      for (const text of textArr) {
        if (this.data.text === '') return //如果正在生成语音的时候用户删除了文本内容，马上停止后面的动作
        let data = await this.generatorAduio(text)
        if (data) {
          let filePath = data.result.filePath
          let origin = data.result.origin
          audioArr.push({
            filePath: filePath,
            origin: origin
          })
        }
      }
      this.setData({
        audioArr: audioArr.slice(),
        cacheText: this.data.text,
      })
      wx.hideLoading()
    }
    wx.navigateTo({
      url: './read-page/index',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          text: this.data.text,
          audioArr: this.data.audioArr
        })
      }
    })
    // for (const source of audioArr) {
    //   if (this.data.text === '') return //如果正在播放语音的时候用户删除了文本内容，马上停止后面的动作
    //   await this.playAudioBySrc(source)
    // }
  },



  // clearState 清除播放状态
  clearState: function () {
    this.setData({
      speech: false,
    })
    wx.hideLoading()
  },

  // deleteContent 删除内容
  deleteContent: function () {
    // console.log('删除')
    this.setData({
      text: '',
    })
    this.destroyAudio()
  },
  // destroyAudio 移除声音播放
  destroyAudio: function () {
    this.data.innerAudioContext == null ? '' : this.data.innerAudioContext.destroy()
    this.clearState()
    console.log('结束播放');
  },

  // 获取粘贴板内容
  getClipboardData: function () {
    var _this = this
    wx.getClipboardData({
      success(res) {
        _this.setData({
          text: _this.data.text + res.data
        })
      }
    })
  },
  // 选择声音
  changeVoice: function (e) {
    console.log(e.currentTarget.dataset)
    var voiceType = e.currentTarget.dataset.voicetype
    this.setData({
      voiceType: voiceType,
      cacheText: ''
    })
    wx.setStorage({
      key: 'voiceType',
      data: JSON.stringify({
        voiceType: voiceType
      }),
      success(res) {
        // console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    //获取本地缓存声音类型
    wx.getStorage({
      key: 'voiceType',
      success: (res) => {
        // console.log(JSON.parse(res.data).selectVoice)
        this.setData({
          voiceType: JSON.parse(res.data).voiceType
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})