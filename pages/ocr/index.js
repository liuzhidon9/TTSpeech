// pages/ocr/index.js
//腾讯云通用印刷体识别文档：https://cloud.tencent.com/document/api/866/33526
let orc = (ImageBase64) => {
  wx.cloud.init()
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "generalBasicOCR",
      data: {
        ImageBase64: ImageBase64
      },
      success: (res) => {
        resolve(res.result.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
let scaleDataStore = {
  scale:1,
  originScale:1,
  pointA: null,
  pointB: null
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgFilePath: '',
    imgW: 0,
    imgH: 0,
    textDetections: [],
    angel: 0,
    zoomRatio: 1,
    newScale:1,
  },
  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        console.log(res);
        let path = res.tempFilePaths[0]
        this.setData({
          imgFilePath: path,
        })
        let fileSystemManager = wx.getFileSystemManager()
        let imageBase64 = fileSystemManager.readFileSync(path, "base64")
        let ocrData = await orc(imageBase64)
        console.log('ocrData', ocrData);
        this.setData({
          textDetections: ocrData.TextDetections,
          angel: ocrData.Angel
        })

        wx.getImageInfo({
          src: path,
          success: (res) => {
            const systemInfo = wx.getSystemInfoSync()
            let windowWidth = systemInfo.windowWidth //可使用窗口宽度，单位px
            let windowHeight = systemInfo.windowHeight //可使用窗口高度，单位px
            let imgWidth = res.width //图片真实宽度，单位px
            let imgHeight = res.height //图片真实高度，单位px
            let zoomRatio = windowWidth / imgWidth //图片缩放比
            this.setData({
              imgW: imgWidth * zoomRatio,
              imgH: imgHeight * zoomRatio,
              zoomRatio: zoomRatio
            })
          }
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  touchStart: function (event) {
    console.log('touchStart: ', event.changedTouches);
    //第一个触摸点
    if (!scaleDataStore.pointA) {
      scaleDataStore.pointA = {
        pageX: event.changedTouches[0].pageX,
        pageY: event.changedTouches[0].pageY
      }
    }
    scaleDataStore.originScale = scaleDataStore.scale
  },
  touchMove: function (event) {
    console.log('touchMove: ', event.changedTouches);
    if (event.changedTouches.length !== 2) return
    if (!scaleDataStore.pointB) {
      scaleDataStore.pointB = {
        pageX: event.changedTouches[1].pageX,
        pageY: event.changedTouches[1].pageY
      }
    }
    let pointA = {
      pageX: event.changedTouches[0].pageX,
      pageY: event.changedTouches[0].pageY
    }
    let pointB = {
      pageX: event.changedTouches[1].pageX,
      pageY: event.changedTouches[1].pageY
    }
    let zoomRatio = this._getDistance(pointA, pointB) / this._getDistance(scaleDataStore.pointA, scaleDataStore.pointB)
    let newScale = zoomRatio*scaleDataStore.originScale

    if (newScale>3) {
      newScale = 3
    }
    if(newScale<1){
      newScale = 1
    }
    scaleDataStore.scale = newScale
    this.setData({
      newScale:newScale,
    })
    console.log("双指操作", scale);
  },
  _getDistance: function (pointA, pointB) {
    let distance = Math.sqrt(Math.pow(pointA.pageX - pointB.pageX, 2) + Math.pow(pointA.pageY - pointB.pageY, 2))
    return distance
  },
  touchEnd: function () {
    console.log('touchEnd');
    delete scaleDataStore.pointA
    delete scaleDataStore.pointB
  },
  touchCancel: function () {
    console.log('touchCancel');
    delete scaleDataStore.pointA
    delete scaleDataStore.pointB
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