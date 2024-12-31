
import * as echarts from "../../utils/ec-canvas/echarts.js";
const app = getApp();
const myechart = require('../../module/myecharts.js');
const bluetooth = require('../../module/bluetooth.js'); // Import the new Bluetooth module
Page({

  data: {
    //蓝牙发送部分
    isAuto: false, //是否自动温控
    slider_value: null, //滑动值0~100，用于控制pwm
    //蓝牙连接部分
    devices: [], // 存储找到的蓝牙设备
    chs: [], // 存储蓝牙特征
    isConnected: false, // 蓝牙连接状态
    isFound: false, // 设备搜索状态 
    //仪表echart  
    chart1: {}, //该空对象用于获取内置初始完毕的echart组件
    thermometer_data: 20.0, //温度数据
    thermometer_ec: {}, //该空对象用于获取组件对象并调用初始化函数
    lazyEc1: { lazyEnable: true }, //不能使用自动初始化，得使用手动初始化，这样才能控制延迟渲染
    //折线图echart
    chart2: {}, //该空对象用于获取内置初始完毕的echart组件
    rpm_data: [1000, 1000, 1000, 1000, 1000, 1000, 1000], //pwm数据
    rpm_ec: {}, //该空对象用于获取组件对象并调用初始化函数
    lazyEc2: { lazyEnable: true }, //不能使用自动初始化，得使用手动初始化，这样才能控制延渲染

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

  sendBLEData(data) {
    bluetooth.writeBLECharacteristicValue(this, data);
  },

  // echart模块
  initEchart2() {
    // 使用 selectComponent 方法获取页面中的图表组件
    this.thermometer_ec = this.selectComponent('#thermometer_ec');
    this.thermometer_ec.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      //新建一个图标实例chart, 并通过echarts的初始化来获得新的实例, 而lazyComponent也是一个echarts实例, lazyComponent在初始化时chart作为新的实例回调进lazyComponent中
      let option = myechart.getOption2(this.data.thermometer_data);
      this.chart2 = chart; // 将图表实例绑定到this上，方便在其他的函数中访问
      return chart;
    });
  },
  // echart数据获取温度计数据
  changeEcData2() {
    let newdata = parseInt(app.globalData.data2) / 10;
    this.setData({
      thermometer_data: newdata,
    });

  },
  updateEchart2() {
    this.changeEcData2(); //更新数据
    if (this.chart1) {
      // 如果已初始化，则更新图表
      let option = myechart.getOption2(this.data.thermometer_data);
      this.chart2.setOption(option);
    }
    else {
      // 如果未初始化，则初始化图表
      setTimeout(() => {
        // 模拟数据接收，在这里更新到data里, 实质上可以在此处更新chartOption的值，这是要显示的值, 可以是串口接收, 蓝牙接收等等情形
        this.initEchart2();//延时setTimeOut和定时调用setInterval会冲突好像，此时changeEcData1不运行了, 因此这里就不放在setTimeOut里面了，
      }, 10);
    }
  },


  initEchart1() {
    // 使用 selectComponent 方法获取页面中的图表组件
    this.rpm_ec = this.selectComponent('#rpm_ec');
    this.rpm_ec.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      //新建一个图标实例chart, 并通过echarts的初始化来获得新的实例, 而lazyComponent也是一个echarts实例, lazyComponent在初始化时chart作为新的实例回调进lazyComponent中
      let option = myechart.getOption1(this.data.rpm_data);
      this.chart1 = chart; // 将图表实例绑定到this上，方便在其他的函数中访问
      return chart;
    });
  },

  changeEcData1() {
    let data = this.data.rpm_data;
    let newdata = parseInt(app.globalData.data3); // 这里接受的是rpm转速，直接转成整型即可
    data.push(newdata);
    // 模拟请求（延迟以等待数据接收，随后进行初始化）
    if (data.length > 7) {
      data.shift();
    }
    this.setData({
      rpm_data: data,
    });
  },
  updateEchart1() {
    this.changeEcData1(); //更新数据
    if (this.chart1) {
      // 如果已初始化，则更新图表
      let option = myechart.getOption1(this.data.rpm_data);
      this.chart1.setOption(option);
    }
    else {
      // 如果未初始化，则初始化图表
      setTimeout(() => {
        // 模拟数据接收，在这里更新到data里, 实质上可以在此处更新chartOption的值，这是要显示的值, 可以是串口接收, 蓝牙接收等等情形
        this.initEchart1();//延时setTimeOut和定时调用setInterval会冲突好像，此时changeEcData1不运行了, 因此这里就不放在setTimeOut里面了，
      }, 10);
    }
  },

  // 处理滑块值变化的函数
  onSliderChange(e) {
    this.data.slider_value = e.detail.value; // 获取滑块的整型值
    // app.globalData.data1 = this.data.slider_value; 
    console.log("slider_value: ", this.data.slider_value);
    this.sendBLEData(this.data.slider_value);//发送给小程序
  },
  onAUTOButton(e) {
    this.data.slider_value = e.detail.value; // 获取滑块的新值
    // app.globalData.data1 = this.data.slider_value; 
    console.log("isAuto: ", this.data.isAuto);
    this.sendBLEData("AUTO");//发送给小程序
  },
  //生命周期函数 - 页面加载时触发
  onLoad() {
    this.timer = setInterval(() => {
      if (this.data.isConnected) {
        //连接上之后再进行更新，这样不会出现图表未渲染就进行初始化的init错误
        this.updateEchart1();
        this.updateEchart2();
      }
    }, 100);
  },

  //生命周期函数 - 页面卸载时触发
  onUnload() {
    clearInterval(this.timer);
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