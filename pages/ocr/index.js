// pages/ocr/index.js
let orc = (ImageUrl) => {
  wx.cloud.init()
  wx.cloud.callFunction({
    name: "generalBasicOCR",
    data: {ImageUrl:ImageUrl},
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
    imgFilePath: '',
    imgW: 0,
    imgH: 0

  },
  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res);
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: (res) => {
            console.log(res);
            let path = res.path
            let buffArr = []
            for (let i = 0; i < path.length; i++) {
              buffArr.push(path.charCodeAt(i))
            }
            const arrayBuffer = new Uint8Array(buffArr)
            const base64 = wx.arrayBufferToBase64(arrayBuffer)
            orc('https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg')
            console.log("base64",base64);
            this.setData({
              imgFilePath: res.path,
              imgW: res.width,
              imgH: res.height
            })
          }
        })

      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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