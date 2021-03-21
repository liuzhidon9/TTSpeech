// pages/ocr/index.js
//腾讯云通用印刷体识别文档：https://cloud.tencent.com/document/api/866/33526
import {
  generatorAudio,
  msgSecCheck
} from '../../utils/util.js'
let ocr = (filePath) => {
  wx.cloud.init()
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "generalBasicOCR",
      data: {
        ImageUrl: wx.cloud.CDN({
          type: 'filePath',
          filePath: filePath,
        })
      },
      success: (res) => {
        // console.log(res);
        resolve(res.result)
      },
      fail: (err) => {
        wx.showToast({
          title: "错误码：" + err.errCode,
          icon: 'none',
          duration: 2000
        })
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
    imgFilePath: '',
    imgW: 0, //图片宽度
    imgH: 0, //图片高度
    textDetections: [], //文本检测内容
    angel: 0, //修正角度
    newScale: 1, //图片缩放比例
    activeBoxIndex: -1,
    activeText: '',
    cacheText: '',
    audioSrc: '',
    isShow: false,
    isRead: false
  },
  //重置数据
  resetData: function () {
    this.setData({
      imgFilePath: '',
      imgW: 0, //图片宽度
      imgH: 0, //图片高度
      textDetections: [], //文本检测内容
      angel: 0, //修正角度
      newScale: 1, //图片缩放比例
      activeBoxIndex: -1,
      activeText: '',
      cacheText: '',
      audioSrc: '',
      isShow: false,
      isRead: false
    }, )
  },
  activeBox: function (event) {
    let index = event.currentTarget.dataset.index
    let text = event.currentTarget.dataset.text
    console.log("activeBox", index, text);
    this.setData({
      activeBoxIndex: index,
      activeText: text
    })
  },

  read: async function () {
    if (this.data.isRead) return
    this.setData({
      isRead: true
    })
    let audioSrc = this.data.audioSrc
    let activeText = this.data.activeText
    if (activeText !== this.data.cacheText) {
      //违规文本检查
      try {
        await msgSecCheck(activeText)
      } catch (error) {
        console.log(error);
        wx.showToast({
          title: '文本含有违法违规内容!',
          icon: 'none',
          duration: 1500
        })
        return
      }
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      let audioData = await generatorAudio({
        content: this.data.activeText
      })
      wx.hideLoading()
      audioSrc = audioData.result.filePath
      this.setData({
        audioSrc: audioSrc,
        cacheText: this.data.activeText
      })
    }
    let innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = audioSrc
    innerAudioContext.play()
    innerAudioContext.onPlay(res => {
      console.log("开始播放");
    })
    innerAudioContext.onEnded(() => {
      innerAudioContext.destroy()
      this.setData({
        isRead: false
      })
      console.log("结束播放");
    })
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
          newScale: 1,
          isShow: true
        })
        await this._scanTextByFilePath(filePath)
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  //该函数供scale.wxs调用
  updateNewScale: function (payload) {
    console.log('updateNewScale', payload);
    this.setData({
      newScale: payload.newScale
    })
  },
  //scanTextByFilePath 扫描图片文本内容
  _scanTextByFilePath: async function (filePath) {
    wx.showLoading({
      title: '扫描中...',
    })
    let result = await ocr(filePath)
    if (result.err){
      wx.showToast({
        title:result.err.msg,
        icon:"none",
        duration:2000
      })
      return
    }
    let ocrData = result.data
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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