// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: null,
    src: null,
    selectVoice: 111,
    speech: false,
    per: 111,
    token_id: null,
    soundGenerator: [{
      per: 106,
      name: "度博文",
      src: "../assets/img/man.png",
      active: "../assets/img/man-active.png"
    },
    {
      per: 111,
      name: "度小萌",
      src: "../assets/img/woman.png",
      active: "../assets/img/woman-active.png"
    },
    ]
  },

  // 生成语音
  playAudio: function () {
    var s = "http://tsn.baidu.com/text2audio?tex=" + this.data.text + "&tok=" + this.data.token_id + "&cuid=18488711&ctp=1&lan=zh&per=" + this.data.per
    // console.log(s)
    this.setData({
      src: s
    })
    if (this.data.text != null && this.data.text != "") {
      this.audioCtx.play()
    } else {
      wx.showToast({
        title: '请输入内容 !',
        icon: 'none',
        duration: 1000
      })

    }

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
    this.audioCtx.pause()
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
    // console.log(e.currentTarget.dataset.per)
    var id = e.currentTarget.dataset.per
    this.setData({
      selectVoice: id,
      per: id
    })
    wx.setStorage({
      key: 'personal',
      data: JSON.stringify({ per: id }),
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
    // 获取token
    wx.request({
      url: 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=fKh1vAqVHaOjYcoowsonUSoL&client_secret=cO1WUymT6L93VNd0R4g0PZre3bfNSXL4',
      success: (res) => {
        this.setData({
          token_id: res.data.access_token
        })
        // console.log(res.data.expires_in / 60 / 60 / 24, Date.now())
      }
    })

    this.audioCtx = wx.createAudioContext('audio')
    // console.log(this.audioCtx)
    wx.getStorage({
      key: 'personal',
      success: (res) => {
        // console.log(JSON.parse(res.data).per)
        this.setData({
          selectVoice: JSON.parse(res.data).per,
          per: JSON.parse(res.data).per
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