"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// bluetooth.js
var app = getApp(); //// 页面所需数据
// devices: [], // 存储找到的蓝牙设备
// chs: [], // 存储蓝牙特征
// isConnected: false, // 蓝牙连接状态
// isFound: false, // 设备搜索状态
//这里把所有自定义的有关蓝牙的函数都export出去了，其实后在页面里import的函数只有几个

module.exports = {
  openBluetoothAdapter: openBluetoothAdapter,
  getBluetoothAdapterState: getBluetoothAdapterState,
  startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery: stopBluetoothDevicesDiscovery,
  onBluetoothDeviceFound: onBluetoothDeviceFound,
  createBLEConnection: createBLEConnection,
  closeBLEConnection: closeBLEConnection,
  getBLEDeviceServices: getBLEDeviceServices,
  getBLEDeviceCharacteristics: getBLEDeviceCharacteristics,
  writeBLECharacteristicValue: writeBLECharacteristicValue,
  closeBluetoothAdapter: closeBluetoothAdapter,
  parseReceivedData: parseReceivedData //这个是对接受的数据进行解析， 解析的规则可以修改

};

function inArray(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }

  return -1;
}

function ab2str(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
} // 初始化蓝牙模块


function openBluetoothAdapter(page) {
  closeBluetoothAdapter();
  wx.openBluetoothAdapter({
    success: function success(response) {
      console.log("初始化蓝牙模块成功：openBluetoothAdapter", response);
      startBluetoothDevicesDiscovery(page); // 开始搜索蓝牙设备
    },
    fail: function fail(err) {
      if (err.errCode === 10001) {
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log("监听蓝牙适配器状态变化事件：onBluetoothAdapterStateChange", res);
          res.available && startBluetoothDevicesDiscovery(page);
        });
      }
    }
  });
} // 获取蓝牙适配器状态


function getBluetoothAdapterState(page) {
  wx.getBluetoothAdapterState({
    success: function success(res) {
      console.log("getBluetoothAdapterState", res);

      if (res.discovering) {
        onBluetoothDeviceFound(page); // 搜索到设备
      } else if (res.available) {
        startBluetoothDevicesDiscovery(page); // 开始搜索设备
      }
    }
  });
} // 开始搜索蓝牙设备


function startBluetoothDevicesDiscovery(page) {
  // if (page._discoveryStarted) return; //加了这个就只搜一次
  // page._discoveryStarted = true;
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: function success(response) {
      console.log("开始搜寻附近的蓝牙外围设备：startBluetoothDevicesDiscovery", response);
      onBluetoothDeviceFound(page); // 注册设备发现事件
    },
    fail: function fail(err) {
      console.log("搜索设备失败", err);
      wx.showToast({
        title: "搜索设备失败",
        icon: "error"
      });
    }
  });
} // 停止搜索蓝牙设备


function stopBluetoothDevicesDiscovery() {
  console.log("停止搜寻附近的蓝牙外围设备");
  wx.stopBluetoothDevicesDiscovery();
} // 处理发现的蓝牙设备


function onBluetoothDeviceFound(page) {
  wx.onBluetoothDeviceFound(function (res) {
    res.devices.forEach(function (device) {
      if (!device.name && !device.localName) {
        return;
      }

      var foundDevices = page.data.devices;
      var idx = inArray(foundDevices, "deviceId", device.deviceId);
      var data = {};

      if (idx === -1) {
        data["devices[".concat(foundDevices.length, "]")] = device;
      } else {
        data["devices[".concat(idx, "]")] = device;
      }

      page.setData(data); // 更新页面数据
    });
  });
} // 创建蓝牙连接


function createBLEConnection(page, e) {
  var ds = e.currentTarget.dataset;
  var deviceId = ds.deviceId;
  var name = ds.name;
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function success() {
      page.setData({
        isConnected: true,
        name: name,
        deviceId: deviceId
      }); // 定时器延时显示

      setTimeout(function () {
        wx.showToast({
          title: "连接蓝牙设备成功",
          icon: "success"
        });
      }, 500);
      getBLEDeviceServices(page, deviceId); // 获取蓝牙服务
    },
    fail: function fail(e) {
      console.log("连接失败", e.errMsg);
      wx.showToast({
        title: "连接失败,错误信息: " + e.errMsg,
        icon: "error"
      });
    }
  });
  stopBluetoothDevicesDiscovery(); // 停止搜索设备
} // 断开蓝牙连接


function closeBLEConnection(page) {
  console.log("断开与蓝牙低功耗设备的连接");
  wx.showToast({
    title: "已断开和蓝牙设备的连接",
    icon: "none"
  });
  wx.closeBLEConnection({
    deviceId: page.data.deviceId
  });
  page.setData({
    isConnected: false,
    chs: [],
    canWrite: false
  });
} // 获取蓝牙设备服务


function getBLEDeviceServices(page, deviceId) {
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function success(res) {
      for (var i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          getBLEDeviceCharacteristics(page, deviceId, res.services[i].uuid);
          return;
        }
      }
    }
  });
} // 获取蓝牙服务特征


function getBLEDeviceCharacteristics(page, deviceId, serviceId) {
  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceId,
    success: function success(res) {
      console.log("获取蓝牙低功耗设备某个服务中所有特征：getBLEDeviceCharacteristics");

      for (var i = 0; i < res.characteristics.length; i++) {
        var item = res.characteristics[i];

        if (item.properties.read) {
          wx.readBLECharacteristicValue({
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: item.uuid
          });
        }

        if (item.properties.write) {
          page.setData({
            canWrite: true
          });
          page._deviceId = deviceId;
          page._serviceId = serviceId;
          page._characteristicId = item.uuid;
        }

        if (item.properties.notify || item.properties.indicate) {
          wx.notifyBLECharacteristicValueChange({
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: item.uuid,
            state: true,
            success: function success(res) {
              console.log("notifyBLECharacteristicValueChange success", res);
            }
          });
        }
      }
    },
    fail: function fail(res) {
      console.error("getBLEDeviceCharacteristics", res);
    }
  }); // 接收蓝牙特征值变化事件

  wx.onBLECharacteristicValueChange(function (characteristic) {
    console.log("收到原始的数据", characteristic, characteristic.value);
    var receivedData = ab2str(characteristic.value); // 转换为字符串

    console.log("接收到的数据", receivedData);
    parseReceivedData(receivedData); //解析数据
  });
} // 发送数据到蓝牙设备


function writeBLECharacteristicValue(page, value) {
  var jsonStr = JSON.stringify({
    key: "data1",
    value: value.toString()
  }); //打包成jsonstr

  var arrayBufferValue = str2ab(jsonStr); // str 转换为 ArrayBuffer

  console.log("发送数据给蓝牙", "原始字符串", jsonStr, "转换arrayBuffer", arrayBufferValue);
  wx.writeBLECharacteristicValue({
    deviceId: page._deviceId,
    serviceId: page._serviceId,
    characteristicId: page._characteristicId,
    value: arrayBufferValue,
    //将ab格式的数据打包通过蓝牙发送
    success: function success(res) {
      console.log("消息发送成功", res.errMsg);
      wx.showToast({
        title: "消息发送成功",
        icon: "none"
      });
    },
    fail: function fail(e) {
      console.log("发送消息失败", e);
      wx.showToast({
        title: "发送消息失败,错误信息: " + e.errMsg,
        icon: "none"
      });
    }
  });
} // 关闭蓝牙模块


function closeBluetoothAdapter() {
  console.log("关闭蓝牙模块");
  wx.closeBluetoothAdapter();
} // 解析通过蓝牙接收到的数据 格式为 datax:MSG\n


function parseReceivedData(data) {
  // 将接收到的数据按照换行符分割为多行
  var lines = data.split('\n'); // 遍历每一行，解析并更新相应的数据字段

  lines.forEach(function (line) {
    // 将每一行数据按照冒号分割为键和值
    var _line$split = line.split(':'),
        _line$split2 = _slicedToArray(_line$split, 2),
        key = _line$split2[0],
        value = _line$split2[1]; // 根据键的不同，更新相应的数据字段


    switch (key) {
      case 'data1':
        app.globalData.data1 = value;
        break;

      case 'data2':
        app.globalData.data2 = value;
        break;

      case 'data3':
        app.globalData.data3 = value;
        break;

      default:
        console.log("未知数据格式", line);
    }
  });
}