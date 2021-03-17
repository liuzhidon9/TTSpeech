// pages/ocr/index.js
let orc = () => {
  wx.cloud.init()
  wx.cloud.callFunction({
    name: "generalBasicOCR",
    data: {},
    success: (res) => {
      console.log(res.result.data);
    },
    fail: (err) => {
      console.log(err);
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal:false,
    innerHtml: `
<pre style="word-break:break-all;  white-space: pre-wrap;">
    	
企业微信

企业微信，是腾讯微信团队为企业打造的高效办公平台。与微信一致的沟通体验，丰富的OA应用，和连接微信生态的能力，助力企业高效沟通与管理。
</pre>
    `
  },
  show:function(){
    this.setData({
      isShowModal:!this.data.isShowModal
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cameraContext = wx.createCameraContext()

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