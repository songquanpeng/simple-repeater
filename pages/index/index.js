"use strict";

const app = getApp();
const recorderManager = qq.getRecorderManager();
const innerAudioContext = qq.createInnerAudioContext();
innerAudioContext.loop = true;

/*
未开始（用户单击按钮进入录音中状态）
录音中（用户单击按钮进行录音完成状态）
录音完成（用户单击按钮切换到播放中状态）
播放中（用户单击按钮切换到未开始状态）
*/

Page({
  data: {
    prompts: [
      "请点击下方的按钮开始录音",
      "请点击按钮结束录音",
      "请点击按钮开始播放录音",
      "请点击按钮结束播放录音"
    ],
    tempFilePath : "",
    state: 0
  },

  touch: function() {
    switch(this.data.state) {
      case 0: this.startRecord();break;
      case 1: this.endRecord();break;
      case 2: this.startPlay();break;
      case 3: this.endPlay();break;
      default: break;
    }
  },

  startRecord: function() {
    this.setData({ state: 1 });
    const options = {
      sampleRate: 16000,
      format: 'mp3'
    };
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('Start record.');
    });
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  endRecord: function () {
    this.setData({ state: 2 });
    const that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.data.tempFilePath = res.tempFilePath;
      console.log('Stop record. Temp file path: ', res.tempFilePath);
    });
  },

  startPlay: function () {
    this.setData({ state: 3 });
    innerAudioContext.src = this.data.tempFilePath;
    innerAudioContext.play();
  },

  endPlay: function () {
    this.setData({ state: 0 });
    innerAudioContext.stop();
  },

  onShareAppMessage: function(res) {
      return {
        title: "简单复读机"
      }
  }
});
