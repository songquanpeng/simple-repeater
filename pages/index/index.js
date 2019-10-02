"use strict";

const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const NOT_START = 0;
const GOING = 1;
const PAUSING = 2;

Page({
    data: {
        recordState: NOT_START,
        playState: NOT_START,
        recordBtnText: "Start",
        playBtnText: "Play"
    },

    onRecordBtnClicked: function(){
        if (this.data.recordState === NOT_START){ // First click
            this.startRecord();
        } else if (this.data.recordState === GOING) {
            this.pauseRecord();
        } else {
            this.resumeRecord();
        }
        this.setData({
            recordBtnText: (this.data.recordState === GOING) ? "Resume":"Pause",
            recordState: (this.data.recordState === GOING) ? PAUSING : GOING
        });
    },

    startRecord: function () {
        const options = {
            duration: 10000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 96000,
            format: 'mp3',
            frameSize: 50,
        };
        recorderManager.start(options);
        recorderManager.onStart(() => {
            console.log('Start record.')
        });
        recorderManager.onError((res) => {
            console.log(res);
        })
    },

    pauseRecord: function () {
        recorderManager.pause();
        recorderManager.onPause((res) => {
            console.log('Pause record.');
        })
    },

    resumeRecord: function () {
        recorderManager.resume();
        recorderManager.onStart(() => {
            console.log('Resume record.');
        });
        recorderManager.onError((res) => {
            console.log(res);
        })
    },
    
    stopRecord: function () {
        recorderManager.stop();
        recorderManager.onStop((res) => {
            this.tempFilePath = res.tempFilePath;
            console.log('Stop record. Temp file path: ', res.tempFilePath);
            const { tempFilePath } = res;
        });
    },

    onPlayBthClicked: function () {
        if (this.data.recordState !== NOT_START){
            this.stopRecord();
            this.setData({
                recordBtnText: "Start",
                recordState: NOT_START
            });
        }
        innerAudioContext.autoplay = true;
        innerAudioContext.src = this.tempFilePath;
        innerAudioContext.onPlay(() => {
            console.log('Start playing audio.');
        });
        innerAudioContext.onError((res) => {
            console.log(res.errMsg);
            console.log(res.errCode);
        });
    }
});
