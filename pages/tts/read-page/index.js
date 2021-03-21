// pages/tts/read-page/index.js
import {
  splitText
} from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    audioArr: [],
    nodes: [],
    innerAudioContext: null,
    isRead: true,
    audioArr: {}
  },
  start:async function () {
    this.setData({
      isRead:false
    })
    let audioArr = this.data.audioArr
    for (const source of audioArr) {
      await this._playAudioBySrc(source)
    }
    //语音朗读完毕，清楚文字高亮状态
   let  nodes = this.data.nodes
    nodes[0].children = nodes[0].children.map(item => {
      return {
        ...item,
        read:false,
        attrs: {}
      }
    })
    console.log(nodes);
    this.setData({
      nodes: nodes,
      isRead:false
    })
  },
  // _playAudioBySrc 根据声音资源播放
  _playAudioBySrc: function (source) {
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
        this._destroyAudio()
        resolve()
      })
    })
  },

  _nodesTemplate: function (textContent) {
    let textArr = splitText(textContent)
    // console.log('textArr',textArr,textContent);
    //rich-text组件文档：https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
    let nodes = [{
      name: 'pre',
      attrs: {
        class: 'pre_class',
        style: 'white-space:pre-wrap;word-break:break-all;'
      },
      children: []
    }]
    let childrenNode = []
    for (const text of textArr) {
      text = text.replace(/\n|\r/, "\n\n")
      childrenNode.push({
        name: 'span',
        read: false,
        attrs: {
          class: "",
        },
        children: [{
          type: 'text',
          text: text
        }]
      })
    }
    nodes[0].children = childrenNode
    return nodes
  },
  // playingTextMatch 匹配正在播放的语音文字并高亮它
  _playingTextMatch: function (playingText) {
    let nodes = this.data.nodes
    let isMatch = false
    nodes[0].children = nodes[0].children.map(item => {
      let currentText = item.children[0].text.trim()
      if (currentText === playingText && !item.read && !isMatch) {
        isMatch = true
        return {
          ...item,
          read: true,
          attrs: {
            class: "matchStr"
          }
        }
      }
      return {
        ...item,
        attrs: {
          class: ""
        }
      }
    })
    console.log(nodes);
    this.setData({
      nodes: nodes
    })
  },

  // _destroyAudio 移除声音播放
  _destroyAudio: function () {
    this.data.innerAudioContext == null ? '' : this.data.innerAudioContext.destroy()
    console.log('结束播放');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("acceptDataFromOpenerPage", async (data) => {
      console.log(data);
      let nodes = this._nodesTemplate(data.text)
      let audioArr = data.audioArr
      this.setData({
        nodes: nodes,
        audioArr: audioArr
      })
      this.start()
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
    this._destroyAudio()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this._destroyAudio()
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