// pages/index.js

const plugin = getApp().plugin
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: null,
    textArr: [],
    selectVoice: 111,
    speech: false,
    voiceType: 101015,
    soundGenerator: [{
        voiceType: 101013,
        description: "智辉，新闻男生",
        src: "../assets/img/man.png",
        active: "../assets/img/man-active.png"
      },
      {
        voiceType: 101007,
        description: "智娜,客服女声",
        src: "../assets/img/woman.png",
        active: "../assets/img/woman-active.png"
      },
    ]
  },
  generatorAduio: function () {
    const innerAudioContext = wx.createInnerAudioContext();
    console.log(this.data.textArr);
    let textArr = this.data.textArr
    let _this = this
    plugin.QCloudAIVoice.textToSpeech({
      content: textArr.shift(),
      speed: 0,
      volume: 0,
      voiceType: this.data.voiceType,
      language: 1,
      projectId: 0,
      sampleRate: 16000,

      success: function (data) {
        _this.setData({
          textArr: textArr
        })
        // console.log("data", data);
        let url = data.result.filePath;
        if (url && url.length > 0) {
      
          innerAudioContext.src = url;
          innerAudioContext.play()
          innerAudioContext.onPlay(() => {console.log('开始播放');});
          innerAudioContext.onError((res) => {
            console.log(res.errMsg)
          });
          innerAudioContext.onEnded(() => {
            innerAudioContext.destroy()
            if (textArr.length > 0) {
              _this.generatorAduio()
              console.log('播放结束');
            }
          })
        }
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  // 生成语音
  playAudio: function () {
    if (this.data.text == null || this.data.text == "") {
      wx.showToast({
        title: '请输入内容 !',
        icon: 'none',
        duration: 1000
      })
      return
    }

    let textArr = this.data.text.split(/[,.:;?!，。：；！？ ]/igm)
    this.setData({
      textArr: textArr
    })
    this.generatorAduio()


  },
  textInput: function (res) {
    // console.log(res)
    this.setData({
      text: res.detail.value
    })
  },
  // 删除内容
  deleteContent: function () {
    // console.log('删除')
    this.setData({
      text: '',
      src: null,
      speech: false
    })
    innerAudioContext.pause()
  },

  // 获取粘贴板内容
  getClipboardData: function () {
    var _this = this
    wx.getClipboardData({

      success(res) {
        var newtext = _this.data.text + res.data
        _this.setData({
          text: newtext
        })
      }
    })
  },
  // 选择声音
  changeVoice: function (e) {
    console.log(e.currentTarget.dataset)
    var voiceType = e.currentTarget.dataset.voicetype
    this.setData({
      voiceType: voiceType
    })
    wx.setStorage({
      key: 'personal',
      data: JSON.stringify({
        voiceType: voiceType
      }),
      success(res) {
        // console.log(res)
      }
    })
  },
  showRadio: function () {
    this.setData({
      speech: true
    })
  },
  hidenRadio: function () {
    this.setData({
      speech: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'personal',
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