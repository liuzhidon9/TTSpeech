// pages/index.js

const plugin = getApp().plugin
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

  // 根据文本生成语音
  generatorAduio: function (text) {
    return new Promise((resolve, reject) => {
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
        fail: function (error) {
          reject(error);
        }
      })
    })
  },

  // 播放语音
  playAudio: async function () {
    this.destroyAudio()
    if (this.data.text == null || this.data.text == "") {
      wx.showToast({
        title: '请输入内容 !',
        icon: 'none',
        duration: 1000
      })
      return
    }
    //切割文本
    let text = this.data.text + " "
    let textArr = text.match(/.{1,100}([,.:;?!，。：；！？、]|\n|\r|\s)/igm)
    console.log(textArr);
    let audioArr = textArr.map((item) => {
      return 0
    })
    if (this.data.text != this.data.cacheText) {
      await new Promise((resolve, reject) => {
        textArr.forEach(async (text, index) => {
          let data = await this.generatorAduio(text)
          audioArr.splice(index, 1, data.result.filePath)
          if (audioArr.indexOf(0) == -1) {
            this.setData({
              audioArr: audioArr.slice(),
              cacheText: this.data.text
            })
            resolve()
          }
        })
      })
    } else {
      audioArr = this.data.audioArr.slice()
    }

    let play = () => {
      const innerAudioContext = wx.createInnerAudioContext();
      this.setData({
        innerAudioContext: innerAudioContext
      })
      innerAudioContext.src = audioArr.shift();
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        console.log('开始播放');
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
      });
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy()
        if (audioArr.length > 0) {
          play()
          console.log('播放结束');
        }
      })
    }
    play()
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
    this.destroyAudio()
  },

  destroyAudio: function () {
    //移除声音播放
    this.data.innerAudioContext == null ? '' : this.data.innerAudioContext.destroy()
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
  onLoad: async function (options) {
    
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