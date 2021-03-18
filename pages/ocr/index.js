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
  scale: 1,
  originScale: 1,
  pointA: null,
  pointB: null
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgFilePath: '',
    imgW: 0, //图片宽度
    imgH: 0, //图片高度
    textDetections: [], //文本检测内容
    angel: 0, //修正角度
    newScale: 1, //图片缩放比例
  },

  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        console.log(res);
        let filePath = res.tempFilePaths[0]
        let {
          zoomRatio,
          imgWidth,
          imgHeight
        } = await this._getImageInfoByFilePath(filePath)
        this.setData({
          imgFilePath: filePath,
          imgW: imgWidth * zoomRatio,
          imgH: imgHeight * zoomRatio,
          textDetections: [],
          newScale: 1
        })
        scaleDataStore.scale = 1
        scaleDataStore.originScale = 1
        await this._scanTextByFilePath(filePath)
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  //scanTextByFilePath 扫描图片文本内容
  _scanTextByFilePath: async function (filePath) {
    wx.showLoading({
      title: '扫描中...',
    })
    let fileSystemManager = wx.getFileSystemManager()
    let imageBase64 = fileSystemManager.readFileSync(filePath, "base64")
    let ocrData = await orc(imageBase64)
    console.log('ocrData', ocrData);
    let {
      zoomRatio
    } = await this._getImageInfoByFilePath(filePath)
    let textDetections = ocrData.TextDetections.map(item => {
      return {
        text: item.DetectedText,
        width: item.ItemPolygon.Width * zoomRatio,
        height: item.ItemPolygon.Height * zoomRatio,
        top: item.Polygon[0].Y * zoomRatio,
        left: item.Polygon[0].X * zoomRatio
      }
    })
    this.setData({
      textDetections: textDetections,
      angel: ocrData.Angel
    })
    wx.hideLoading()
  },

  //获取图片信息
  _getImageInfoByFilePath: function (filePath) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: filePath,
        success: (res) => {
          const systemInfo = wx.getSystemInfoSync()
          let windowWidth = systemInfo.windowWidth //可使用窗口宽度，单位px
          let windowHeight = systemInfo.windowHeight //可使用窗口高度，单位px
          let imgWidth = res.width //图片真实宽度，单位px
          let imgHeight = res.height //图片真实高度，单位px
          let zoomRatio = windowWidth / imgWidth //图片缩放比
          resolve({
            zoomRatio,
            imgWidth,
            imgHeight
          })
        },
        fial: (err) => {
          reject(err)
        }
      })
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
    //第二个触摸点
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
    let newScale = zoomRatio * scaleDataStore.originScale

    if (newScale > 3) {
      newScale = 3
    }
    if (newScale < 1) {
      newScale = 1
    }
    scaleDataStore.scale = newScale
    this.setData({
      newScale: newScale,
    })
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