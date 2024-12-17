
import * as echarts from "../../utils/ec-canvas/echarts.js";
const app = getApp();
const bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
const echart = require('../../module/echarts.js');

Page({

  data: {

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