// pages/home.ts
const bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //蓝牙连接部分
    devices: [], // 存储找到的蓝牙设备
    chs: [], // 存储蓝牙特征
    isConnected: false, // 蓝牙连接状态
    isFound: false, // 设备搜索状态 
    //富文本
    richText_data1: [{
      name: 'div',
      attrs: { class: 'big-text' },
      children: [
        { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: '' }] },
        { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
      ]
    }],
    richText_data2: [{
      name: 'div',
      attrs: { class: 'big-text' },
      children: [
        { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
        { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: 'data' }] },
        { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
      ]
    }],
    richText_data3: [{
      name: 'div',
      attrs: { class: 'big-text' },
      children: [
        { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
        { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: 'data' }] },
        { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
      ]
    }],
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
  updateRichText() {
    // const data3 = app.globalData.data3 || 'NULL';
    // const data4 = app.globalData.data4 || 'NULL';
    this.setData({
      richText_data1: [{
        name: 'div',
        attrs: { class: 'big-text' },
        children: [
          { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: 'data' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
        ]
      }],
      richText_data2: [{
        name: 'div',
        attrs: { class: 'big-text' },
        children: [
          { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: 'data' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
        ]
      }],
      richText_data2: [{
        name: 'div',
        attrs: { class: 'big-text' },
        children: [
          { name: 'span', attrs: { class: 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: 'data' }] },
          { name: 'span', attrs: { class: 'param-value' }, children: [{ type: 'text', text: '' }] }
        ]
      }],
      // 此处还可以继续添加新的富文本节点
    })
  },

  onLoad() {
    // 更新富文本内容
    this.updateRichText();
  },
})