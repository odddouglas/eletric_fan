
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

  //生命周期函数
  onLoad() {

  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

})