// pages/home.ts
var bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //蓝牙连接部分
        devices: [],
        chs: [],
        isConnected: false,
        isFound: false,
        //富文本
        richText_data1: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }],
        richText_data2: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }],
        richText_data3: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }]
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
    updateRichText: function () {
        // const data3 = app.globalData.data3 || 'NULL';
        // const data4 = app.globalData.data4 || 'NULL';
        this.setData({
            richText_data1: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }],
            richText_data2: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }],
            richText_data2: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }]
        });
    },
    onLoad: function () {
        // 更新富文本内容
        this.updateRichText();
    }
});
