"use strict";
exports.__esModule = true;
var app = getApp();
var bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
var echart = require('../../module/echarts.js');
Page({
    data: {},
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
    //生命周期函数
    onLoad: function () {
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    }
});
