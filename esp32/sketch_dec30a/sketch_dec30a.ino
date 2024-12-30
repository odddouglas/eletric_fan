#include <NimBLEDevice.h>

/* 提前创建 BLE 蓝牙要用的各个对象 */
NimBLEServer *pServer = NULL;
NimBLEService *pService = NULL;
NimBLECharacteristic *pCharacteristicRX = NULL;
NimBLECharacteristic *pCharacteristicTX = NULL;
NimBLEAdvertising *pAdvertising = NULL;

// 存储接收到的数据
String data1 = "1";
String data2 = "2";
String data3 = "0";
String data4 = "0";

// 按键状态变量
bool buttonPressed = false;

void setup() {
  // 初始化串口通信，波特率设置为115200
  Serial.begin(115200,SERIAL_8N1,16,17);
  //Serial.begin(115200);
  // 初始化 BLE 蓝牙功能
  initBLE();
  // 配置指示灯所在端口为输出模式
  pinMode(19, OUTPUT);

}

void loop() {
  // 处理接收和发送数据
  handleBLEData();
  handleSerial1Data();

  // 点亮指示灯
  digitalWrite(19, HIGH);
  delay(200);
  digitalWrite(19, LOW);
  delay(200);
  // 发送数据到小程序
  sendDataToApp(data1);
  // 发送串口数据
  //sendSerial1Data(data2);

  
}

// 初始化 BLE 蓝牙功能
void initBLE() {
  // BLE 蓝牙功能配置初始化
  NimBLEDevice::init("BLE4fan");                                                                             // 设置蓝牙名称
  pServer = NimBLEDevice::createServer();                                                                      // 创建蓝牙服务器
  pService = pServer->createService("ABC0");                                                                   // 创建 BLE 服务，UUID 为 ABC0
  pCharacteristicRX = pService->createCharacteristic("ABC1", NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);  // 服务中开启特征，UUID 为 ABC1，默认可读、可写。用于接收客户端发来的数据
  pCharacteristicTX = pService->createCharacteristic("ABC2", NIMBLE_PROPERTY::NOTIFY);                         // 服务中开启特征，UUID 为 ABC2，指定属性为通知
  pService->start();                                                                                           // 启动服务
  pAdvertising = NimBLEDevice::getAdvertising();                                                               // 创建广播对象
  pAdvertising->addServiceUUID("ABC0");                                                                        // 配置广播
  pAdvertising->start();                                                                                       // 启动广播
  Serial.println("初始化蓝牙完成...");
}

// 处理蓝牙接收的数据
void handleBLEData() {
  // RX 获取接收数据
  String val = pCharacteristicRX->getValue();
  if (val != "") {
    //Serial.print("Received from MiniProgram: ");
    //Serial.println(val);
    // 手动解析从小程序端发来的JSON包
    String key = extractValue(val, "key");
    String value = extractValue(val, "value");
    String json_string = key + ":" + value;  // 将其形式变成 “key:value”
    parseReceivedData(json_string);
    Serial.println(value);  //打印蓝牙接收的数值
  }
  pCharacteristicRX->setValue("");

  // 小延迟，避免占用过多 CPU 资源
  delay(20);
}

// 处理串口接收的数据
void handleSerial1Data() {
  // 从串口读取数据
  while (Serial.available() > 0) {
    String receivedData = Serial.readStringUntil('%');
    if (receivedData != "") {
      //Serial.print("Received from Serial: ");
      //Serial.println(receivedData);  //打印串口接收的数值
      // 处理
      parseReceivedData(receivedData);
    }
  }

  // 小延迟，避免占用过多 CPU 资源
  delay(20);
}
// 数据格式： "@data\r\n" , 32需要写包头规则 （文本包串口接收发）
// 发送数据到串口
//void sendSerial1Data(String data) {
  //Serial.print("Sending data to Serial: ");
  //Serial.println(data);
  // 发送串口数据
  //Serial.print("\n");
//  String TxData = "@" + data + "\r\n";
//  Serial.print(TxData.c_str());
//}

String extractValue(const String &data, const String &field) {
  int startIndex = data.indexOf("\"" + field + "\":\"") + field.length() + 4;
  int endIndex = data.indexOf("\"", startIndex);
  if (startIndex < field.length() + 4 || endIndex == -1) {
    return "";
  }
  return data.substring(startIndex, endIndex);
}

// 解析串口或蓝牙接收到的数据并存储，需要发送 指定前缀且带冒号“:”
void parseReceivedData(String data) {
  int delimiterIndex = data.indexOf(':');
  if (delimiterIndex > 0) {
    String key = data.substring(0, delimiterIndex);
    String value = data.substring(delimiterIndex + 1);
    if (key == "data1") {
      data1 = value;
    } else if (key == "data2") {
      data2 = value;
    } else if (key == "data3") {
      data3 = value;
    } else if (key == "data4") {
      data4 = value;
    }
  }
}

// 发送数据到小程序
void sendDataToApp(String data) {
  // 设置特征值并发送通知
  pCharacteristicTX->setValue("data1:" + data + "\n");
  pCharacteristicTX->notify();
  //Serial.print("Sent data to app: ");
  //Serial.println(data);
}
