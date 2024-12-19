"use strict";
exports.__esModule = true;
var app = getApp();
var bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
var echart = require('../../module/echarts.js');
Page({
    data: {
        // 蓝牙连接部分
        devices: [],
        chs: [],
        isConnected: false,
        isFound: false
    },
    //蓝牙模块函数调用 
    openBluetoothAdapter: function () {
        bluetooth.openBluetoothAdapter(this);
    },
    createBLEConnection: function (e) {
        bluetooth.createBLEConnection(this, e);
    },
    closeBLEConnection: function () {
        bluetooth.closeBLEConnection(this);
    },
    //生命周期函数 - 页面加载时触发
    onLoad: function () {
        // TODO: 页面加载时的初始化操作
    },
    //生命周期函数 - 页面初次渲染完成时触发
    onReady: function () {
        // TODO: 页面渲染完成后的操作
    },
    //生命周期函数 - 页面显示时触发
    onShow: function () {
        // TODO: 页面显示时的操作
    },
    //生命周期函数 - 页面隐藏时触发
    onHide: function () {
        // TODO: 页面隐藏时的操作
    },
    //生命周期函数 - 页面卸载时触发
    onUnload: function () {
        // TODO: 页面卸载时的操作
    },
    //生命周期函数 - 监听用户下拉动作
    onPullDownRefresh: function () {
        // TODO: 处理下拉刷新的操作
    },
    //生命周期函数 - 页面上拉触底事件的处理函数
    onReachBottom: function () {
        // TODO: 处理上拉触底的操作
    }
});
