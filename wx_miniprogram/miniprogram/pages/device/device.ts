
import * as echarts from "../../utils/ec-canvas/echarts.js";
const app = getApp();
const bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
const echart = require('../../module/echarts.js');

Page({

  data: {
    // 蓝牙连接部分
    devices: [], // 存储找到的蓝牙设备
    chs: [], // 存储蓝牙特征
    isConnected: false, // 蓝牙连接状态
    isFound: false, // 设备搜索状态
  },

  //蓝牙模块函数调用 
  openBluetoothAdapter() {
    bluetooth.openBluetoothAdapter(this);
  },
  createBLEConnection(e) {
    bluetooth.createBLEConnection(this, e);
  },
  closeBLEConnection() {
    bluetooth.closeBLEConnection(this);
  },

  //生命周期函数 - 页面加载时触发
  onLoad() {
    // TODO: 页面加载时的初始化操作
  },

  //生命周期函数 - 页面初次渲染完成时触发
  onReady() {
    // TODO: 页面渲染完成后的操作
  },

  //生命周期函数 - 页面显示时触发
  onShow() {
    // TODO: 页面显示时的操作
  },

  //生命周期函数 - 页面隐藏时触发
  onHide() {
    // TODO: 页面隐藏时的操作
  },

  //生命周期函数 - 页面卸载时触发
  onUnload() {
    // TODO: 页面卸载时的操作
  },

  //生命周期函数 - 监听用户下拉动作
  onPullDownRefresh() {
    // TODO: 处理下拉刷新的操作
  },

  //生命周期函数 - 页面上拉触底事件的处理函数
  onReachBottom() {
    // TODO: 处理上拉触底的操作
  }

})