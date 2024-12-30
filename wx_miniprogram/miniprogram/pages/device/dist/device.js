"use strict";
exports.__esModule = true;
var echarts = require("../../utils/ec-canvas/echarts.js");
var app = getApp();
var bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
var myechart = require('../../module/myecharts.js');
Page({
    data: {
        // 蓝牙连接部分
        devices: [],
        chs: [],
        isConnected: false,
        isFound: false,
        //温度计echart
        chart1: {},
        thermometerData: [20, 20, 20, 20, 20, 20, 20],
        thermometer_ec: {},
        lazyEc: { lazyEnable: true }
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
    // echart模块
    updateEchart1: function () {
        var _this = this;
        this.changeEcData1();
        if (this.chart1) {
            // 如果已初始化，则更新数据
            var option = myechart.getOption1(this.data.thermometerData);
            this.chart1.setOption(option);
        }
        else {
            // 如果未初始化，则初始化图表
            setTimeout(function () {
                // 模拟数据接收，在这里更新到data里, 实质上可以在此处更新chartOption的值，这是要显示的值, 可以是串口接收, 蓝牙接收等等情形
                _this.initEchart1(); //延时setTimeOut和定时调用setInterval会冲突好像，此时changeEcData1不运行了, 因此这里就不放在setTimeOut里面了，
            }, 10);
        }
    },
    initEchart1: function () {
        var _this = this;
        // 使用 selectComponent 方法获取页面中的图表组件
        this.thermometer_ec = this.selectComponent('#thermometer_ec');
        this.thermometer_ec.init(function (canvas, width, height, dpr) {
            var chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            //新建一个图标实例chart, 并通过echarts的初始化来获得新的实例, 而lazyComponent也是一个echarts实例, lazyComponent在初始化时chart作为新的实例回调进lazyComponent中
            var option = myechart.getOption1(_this.data.thermometerData);
            _this.chart1 = chart; // 将图表实例绑定到this上，方便在其他的函数中访问
            return chart;
        });
    },
    // echart数据获取温度计数据
    changeEcData1: function () {
        var data = this.data.thermometerData;
        data.push((Math.random() * 10 + 20).toFixed(2));
        // 模拟请求（延迟以等待数据接收，随后进行初始化）
        if (data.length > 7) {
            data.shift();
        }
        this.setData({
            thermometerData: data
        });
    },
    //生命周期函数 - 页面加载时触发
    onLoad: function () {
    },
    //生命周期函数 - 页面初次渲染完成时触发
    onReady: function () {
        this.updateEchart1();
    },
    //生命周期函数 - 页面显示时触发
    onShow: function () {
        var _this = this;
        // 页面显示时启动定时器
        this.timer = setInterval(function () {
            _this.updateEchart1();
        }, 2000); // 每秒更新一次富文本，一般后台更新数据之后，下一秒就可以直接更新富文本了
    },
    //生命周期函数 - 页面隐藏时触发
    onHide: function () {
        clearInterval(this.timer);
    },
    //生命周期函数 - 页面卸载时触发
    onUnload: function () {
        clearInterval(this.timer);
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
