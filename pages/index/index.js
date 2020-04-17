"use strict";

const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const NOT_START = 0;
const GOING = 1;
const PAUSING = 2;
const colors = ["#cc00ff", "#00ff00", "#ff4d4d", "#aaaa55", "#669999", "#0000e6", "#99ff33", "#ff1aff", "#e60000"];

Page({
    data: {
        recordState: NOT_START,
        playState: NOT_START,
        recordBtnText: "Start",
        playBtnText: "End",
        tempFilePath: "",
        color:"",
        backgroundColor:""
    },
    changeButtonColor: function(){
        this.setData({
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    },
    changePageColor: function(){
        this.setData({
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
        });
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
        if (this.data.playBtnText==="Play"){
            this.setData({
                playBtnText:"End"
            });
        }
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
            console.log('Start record.');
            wx.setNavigationBarTitle({
                title: '正在录音...',
            });
        });
        recorderManager.onError((res) => {
            console.log(res);
        })
    },

    pauseRecord: function () {
        recorderManager.pause();
        recorderManager.onPause((res) => {
            console.log('Pause record.');
            wx.setNavigationBarTitle({
                title: '录音已暂停',
            });
        });
    },

    resumeRecord: function () {
        recorderManager.resume();
        recorderManager.onResume(() => {
            console.log('Resume record.');
            wx.setNavigationBarTitle({
                title: '正在录音...',
            });
        });
        recorderManager.onError((res) => {
            console.log(res);
        })
    },
    
    stopRecord: function () {
        const that = this;
        recorderManager.stop();
        recorderManager.onStop((res) => {
            that.data.tempFilePath = res.tempFilePath;
            console.log('Stop record. Temp file path: ', res.tempFilePath);
            wx.setNavigationBarTitle({
                title: '录音已终止',
            });
        });
    },

    onPlayBthClicked: function () {
        if(this.data.playBtnText==="End" && this.data.recordState!== NOT_START){
            this.stopRecord();
            this.setData({
                playBtnText: "Play",
                recordBtnText: "Start", // 修改 recordBtn 的文字
                recordState: NOT_START // 设置 recordState 为未开始
            });
            console.log('End recording.');
            wx.setNavigationBarTitle({
                title: '录音已终止',
            });
            return;
        } else {
            innerAudioContext.src = this.data.tempFilePath;
            innerAudioContext.play();
        }

        innerAudioContext.onPlay(() => {
            console.log('Start playing audio.');
            wx.setNavigationBarTitle({
                title: '正在播放录音',
            });
        });

        innerAudioContext.onEnded(()=>{
            console.log('Audio play ended.'); 
            wx.setNavigationBarTitle({
                title: '录音播放完毕',
            });
            this.setData({
                playState: NOT_START,
                playBtnText: "Play"
            })
        });
        
        innerAudioContext.onError((res) => {
            console.log(res.errMsg, res.errCode);
            wx.showToast({
                title: '≧ ﹏ ≦ 很抱歉，出错了一些错误',
                icon: "none",
                duration: 1000
            })
        });
    },

    onShareAppMessage: function(res) {
        return {
          title: "水文生成器"
        }
    }
});
