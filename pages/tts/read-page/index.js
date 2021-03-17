// pages/tts/read-page/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    htmlTemplate: '',
    audioArr: [],
    innerHtml: ''
  },

  // playAudioBySrc 根据声音资源播放
  playAudioBySrc: function (source) {
    return new Promise((resolve, reject) => {
      const innerAudioContext = wx.createInnerAudioContext();
      this.setData({
        innerAudioContext: innerAudioContext
      })
      innerAudioContext.src = source.filePath
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        console.log('开始播放');
        this._playingTextMatch(source.origin)
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
      });
      innerAudioContext.onEnded(() => {
        this.destroyAudio()
        resolve()
      })
    })
  },

  _htmlTemplate:function(textContent){
    return `<pre style="padding:10px;white-space: pre-wrap;word-break: break-all;" >${textContent} </pre>`
  },
  // playingTextMatch 匹配正在播放的语音文字并高亮它
  _playingTextMatch: function (playingText) {
    let htmlTemplate = this.data.htmlTemplate
    let reg = new RegExp(playingText, "img")
    let innerHtml = htmlTemplate.replace(reg, `<span class="macthStr">${playingText}</span>`)
    console.log(innerHtml);
    this.setData({
      innerHtml: innerHtml
    })
  },

  // destroyAudio 移除声音播放
  destroyAudio: function () {
    this.data.innerAudioContext == null ? '' : this.data.innerAudioContext.destroy()
    console.log('结束播放');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("acceptDataFromOpenerPage", async (data) => {
      let htmlTemplate = this._htmlTemplate(data.text)
      let audioArr = data.audioArr
      this.setData({
        innerHtml: htmlTemplate,
        htmlTemplate: htmlTemplate
      })
      for (const source of audioArr) {
        await this.playAudioBySrc(source)
      }
      this.setData({
        innerHtml: htmlTemplate
      })
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