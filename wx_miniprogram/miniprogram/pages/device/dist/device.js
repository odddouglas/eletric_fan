"use strict";
exports.__esModule = true;
var echarts = require("../../utils/ec-canvas/echarts.js");
var app = getApp();
var myechart = require('../../module/myecharts.js');
var bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
Page({
    data: {
        //滑动条
        slider_value: null,
        //蓝牙连接部分
        devices: [],
        chs: [],
        isConnected: false,
        isFound: false,
        //仪表echart  
        chart1: {},
        thermometer_data: [20, 20, 20, 20, 20, 20, 20],
        thermometer_ec: {},
        lazyEc1: { lazyEnable: true },
        //折线图echart
        chart2: {},
        pwm_data: 20,
        pwm_ec: {},
        lazyEc2: { lazyEnable: true }
    },
    // 处理滑块值变化的函数
    onSliderChange: function (e) {
        this.data.slider_value = e.detail.value; // 获取滑块的新值
        console.log("slider_value: ", this.data.slider_value);
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
            var option = myechart.getOption1(_this.data.thermometer_data);
            _this.chart1 = chart; // 将图表实例绑定到this上，方便在其他的函数中访问
            return chart;
        });
    },
    // echart数据获取温度计数据
    changeEcData1: function () {
        var data = this.data.thermometer_data;
        data.push((Math.random() * 10 + 20).toFixed(2));
        // 模拟请求（延迟以等待数据接收，随后进行初始化）
        if (data.length > 7) {
            data.shift();
        }
        this.setData({
            thermometer_data: data
        });
    },
    updateEchart1: function () {
        var _this = this;
        this.changeEcData1(); //更新数据
        if (this.chart1) {
            // 如果已初始化，则更新图表
            var option = myechart.getOption1(this.data.thermometer_data);
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
    initEchart2: function () {
        var _this = this;
        // 使用 selectComponent 方法获取页面中的图表组件
        this.pwm_ec = this.selectComponent('#pwm_ec');
        this.pwm_ec.init(function (canvas, width, height, dpr) {
            var chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            //新建一个图标实例chart, 并通过echarts的初始化来获得新的实例, 而lazyComponent也是一个echarts实例, lazyComponent在初始化时chart作为新的实例回调进lazyComponent中
            var option = myechart.getOption2(_this.data.pwm_data);
            _this.chart2 = chart; // 将图表实例绑定到this上，方便在其他的函数中访问
            return chart;
        });
    },
    // echart数据获取温度计数据
    changeEcData2: function () {
        this.setData({
            pwm_data: ((Math.random() * 10 + 20).toFixed(2))
        });
    },
    updateEchart2: function () {
        var _this = this;
        this.changeEcData2(); //更新数据
        if (this.chart2) {
            // 如果已初始化，则更新图表
            var option = myechart.getOption2(this.data.pwm_data);
            this.chart2.setOption(option);
        }
        else {
            // 如果未初始化，则初始化图表
            setTimeout(function () {
                // 模拟数据接收，在这里更新到data里, 实质上可以在此处更新chartOption的值，这是要显示的值, 可以是串口接收, 蓝牙接收等等情形
                _this.initEchart2(); //延时setTimeOut和定时调用setInterval会冲突好像，此时changeEcData1不运行了, 因此这里就不放在setTimeOut里面了，
            }, 10);
        }
    },
    //生命周期函数 - 页面加载时触发
    onLoad: function () {
        var _this = this;
        this.timer = setInterval(function () {
            if (_this.data.isConnected) {
                //连接上之后再进行更新，这样不会出现图表未渲染就进行初始化的init错误
                _this.updateEchart1();
                _this.updateEchart2();
            }
        }, 1000);
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
