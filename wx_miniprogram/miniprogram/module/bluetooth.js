// bluetooth.js

const app = getApp();

//这里把所有自定义的有关蓝牙的函数都export出去了，其实后在页面里import的函数只有几个
module.exports = {
  openBluetoothAdapter,
  getBluetoothAdapterState,
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery,
  onBluetoothDeviceFound,
  createBLEConnection,
  closeBLEConnection,
  getBLEDeviceServices,
  getBLEDeviceCharacteristics,
  writeBLECharacteristicValue,
  closeBluetoothAdapter,
  parseReceivedData //这个是对接受的数据进行解析， 解析的规则可以修改
};



function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
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
  let buf = new ArrayBuffer(str.length);
  let bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


// 初始化蓝牙模块
function openBluetoothAdapter(page) {
  closeBluetoothAdapter();
  wx.openBluetoothAdapter({
    success: response => {
      console.log("初始化蓝牙模块成功：openBluetoothAdapter", response);
      startBluetoothDevicesDiscovery(page); // 开始搜索蓝牙设备
    },
    fail: err => {
      if (err.errCode === 10001) {
        wx.onBluetoothAdapterStateChange(res => {
          console.log("监听蓝牙适配器状态变化事件：onBluetoothAdapterStateChange", res);
          res.available && startBluetoothDevicesDiscovery(page);
        });
      }
    },
  });
}

// 获取蓝牙适配器状态
function getBluetoothAdapterState(page) {
  wx.getBluetoothAdapterState({
    success: res => {
      console.log("getBluetoothAdapterState", res);
      if (res.discovering) {
        onBluetoothDeviceFound(page); // 搜索到设备
      } else if (res.available) {
        startBluetoothDevicesDiscovery(page); // 开始搜索设备
      }
    },
  });
}

// 开始搜索蓝牙设备
function startBluetoothDevicesDiscovery(page) {
  if (page._discoveryStarted) return;

  page._discoveryStarted = true;
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: response => {
      console.log("开始搜寻附近的蓝牙外围设备：startBluetoothDevicesDiscovery", response);
      onBluetoothDeviceFound(page); // 注册设备发现事件
    },
    fail: err => {
      console.log("搜索设备失败", err);
      wx.showToast({ title: "搜索设备失败", icon: "error" });
    },
  });
}

// 停止搜索蓝牙设备
function stopBluetoothDevicesDiscovery() {
  console.log("停止搜寻附近的蓝牙外围设备");
  wx.stopBluetoothDevicesDiscovery();
}

// 处理发现的蓝牙设备
function onBluetoothDeviceFound(page) {
  wx.onBluetoothDeviceFound(res => {
    res.devices.forEach(device => {
      if (!device.name && !device.localName) {
        return;
      }

      const foundDevices = page.data.devices;
      const idx = inArray(foundDevices, "deviceId", device.deviceId);
      const data = {};
      if (idx === -1) {
        data[`devices[${foundDevices.length}]`] = device;
      } else {
        data[`devices[${idx}]`] = device;
      }
      page.setData(data); // 更新页面数据
    });
  });
}

// 创建蓝牙连接
function createBLEConnection(page, e) {
  const ds = e.currentTarget.dataset;
  const deviceId = ds.deviceId;
  const name = ds.name;
  wx.createBLEConnection({
    deviceId,
    success: () => {
      page.setData({ isConnected: true, name, deviceId });
      // 定时器延时显示
      setTimeout(() => {
        wx.showToast({ title: "连接蓝牙设备成功", icon: "success" });
      }, 500);
      getBLEDeviceServices(page, deviceId); // 获取蓝牙服务
    },
    fail: e => {
      console.log("连接失败", e.errMsg);
      wx.showToast({ title: "连接失败,错误信息: " + e.errMsg, icon: "error" });
    },
  });
  stopBluetoothDevicesDiscovery(); // 停止搜索设备
}

// 断开蓝牙连接
function closeBLEConnection(page) {
  console.log("断开与蓝牙低功耗设备的连接");
  wx.showToast({ title: "已断开和蓝牙设备的连接", icon: "none" });
  wx.closeBLEConnection({ deviceId: page.data.deviceId });
  page.setData({ isConnected: false, chs: [], canWrite: false });
}

// 获取蓝牙设备服务
function getBLEDeviceServices(page, deviceId) {
  wx.getBLEDeviceServices({
    deviceId,
    success: res => {
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          getBLEDeviceCharacteristics(page, deviceId, res.services[i].uuid);
          return;
        }
      }
    },
  });
}

// 获取蓝牙服务特征
function getBLEDeviceCharacteristics(page, deviceId, serviceId) {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: res => {
      console.log("获取蓝牙低功耗设备某个服务中所有特征：getBLEDeviceCharacteristics");

      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i];
        if (item.properties.read) {
          wx.readBLECharacteristicValue({ deviceId, serviceId, characteristicId: item.uuid });
        }
        if (item.properties.write) {
          page.setData({ canWrite: true });
          page._deviceId = deviceId;
          page._serviceId = serviceId;
          page._characteristicId = item.uuid;
        }
        if (item.properties.notify || item.properties.indicate) {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
            success(res) {
              console.log("notifyBLECharacteristicValueChange success", res);
            },
          });
        }
      }
    },
    fail(res) {
      console.error("getBLEDeviceCharacteristics", res);
    },
  });

  // 接收蓝牙特征值变化事件
  wx.onBLECharacteristicValueChange(characteristic => {
    console.log("收到原始的数据", characteristic, characteristic.value);
    const receivedData = ab2str(characteristic.value); // 转换为字符串
    console.log("接收到的数据", receivedData);
    parseReceivedData(page, receivedData);
  });
}

// 发送数据到蓝牙设备
function writeBLECharacteristicValue(page, jsonStr) {
  let arrayBufferValue = str2ab(jsonStr); // 转换为 ArrayBuffer
  console.log("发送数据给蓝牙", "原始字符串", jsonStr, "转换arrayBuffer", arrayBufferValue);

  wx.writeBLECharacteristicValue({
    deviceId: page._deviceId,
    serviceId: page._serviceId,
    characteristicId: page._characteristicId,
    value: arrayBufferValue,
    success(res) {
      console.log("消息发送成功", res.errMsg);
      wx.showToast({ title: "消息发送成功", icon: "none" });
    },
    fail(e) {
      console.log("发送消息失败", e);
      wx.showToast({ title: "发送消息失败,错误信息: " + e.errMsg, icon: "none" });
    },
  });
}

// 关闭蓝牙模块
function closeBluetoothAdapter() {
  console.log("关闭蓝牙模块");
  wx.closeBluetoothAdapter();
}


// 解析通过蓝牙接收到的数据
function parseReceivedData(page, data) {
  // 将接收到的数据按照换行符分割为多行
  const lines = data.split('\n');

  // 遍历每一行，解析并更新相应的数据字段
  lines.forEach((line) => {
    // 将每一行数据按照冒号分割为键和值
    const [key, value] = line.split(':');

    // 根据键的不同，更新相应的数据字段
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
      case 'data4':
        app.globalData.data4 = value;
        break;
      case 'data5':
        app.globalData.data5 = value;
        break;
      default:
        console.log("未知数据格式", line);
    }
  });
}