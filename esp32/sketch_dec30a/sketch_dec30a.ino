#include <NimBLEDevice.h>

/* 提前创建 BLE 蓝牙要用的各个对象 */
NimBLEServer *pServer = NULL;
NimBLEService *pService = NULL;
NimBLECharacteristic *pCharacteristicRX = NULL;
NimBLECharacteristic *pCharacteristicTX = NULL;
NimBLEAdvertising *pAdvertising = NULL;

// 存储接收到的数据
String data1 = "8"; // pwm
String data2 = "20"; // thermometer
String data3 = "0"; // rpm

// 按键状态变量
bool buttonPressed = false;

void setup()
{
  // 初始化串口通信，波特率设置为115200
  // Serial.begin(115200,SERIAL_8N1,16,17);
  Serial.begin(115200);
  // 初始化 BLE 蓝牙功能
  initBLE();
  // 配置指示灯所在端口为输出模式
  pinMode(19, OUTPUT);
}

void loop()
{
  // 处理接收和发送数据
  handleBLEData();
  handleSerial1Data();

  // 点亮指示灯
  digitalWrite(19, HIGH);
  delay(200);
  digitalWrite(19, LOW);
  delay(200);
  // 发送数据到小程序
  sendDataToApp();
  // 发送串口数据
  sendSerial1Data();
}

// 初始化 BLE 蓝牙功能
void initBLE()
{
  // BLE 蓝牙功能配置初始化
  NimBLEDevice::init("BLE4fan");                                                                              // 设置蓝牙名称
  pServer = NimBLEDevice::createServer();                                                                     // 创建蓝牙服务器
  pService = pServer->createService("ABC0");                                                                  // 创建 BLE 服务，UUID 为 ABC0
  pCharacteristicRX = pService->createCharacteristic("ABC1", NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE); // 服务中开启特征，UUID 为 ABC1，默认可读、可写。用于接收客户端发来的数据
  pCharacteristicTX = pService->createCharacteristic("ABC2", NIMBLE_PROPERTY::NOTIFY);                        // 服务中开启特征，UUID 为 ABC2，指定属性为通知
  pService->start();                                                                                          // 启动服务
  pAdvertising = NimBLEDevice::getAdvertising();                                                              // 创建广播对象
  pAdvertising->addServiceUUID("ABC0");                                                                       // 配置广播
  pAdvertising->start();                                                                                      // 启动广播
  Serial.println("初始化蓝牙完成...");
}

// 处理蓝牙接收的数据
void handleBLEData()
{
  // RX 获取接收数据
  String val = pCharacteristicRX->getValue();
  if (val != "")
  {
    Serial.print("Received from MiniProgram: ");
    Serial.println(val);
    //  手动解析从小程序端发来的JSON包
    String key = extractJSONValue(val, "key");
    String value = extractJSONValue(val, "value");
    String json_string = key + ":" + value; // 将其形式变成 “key:value”
    int delimiterIndex = json_string.indexOf(':');
    if (delimiterIndex > 0)
    {
      String key = json_string.substring(0, delimiterIndex);
      String value = json_string.substring(delimiterIndex + 1);
      if (key == "data1")
      {
        data1 = value;
      }
    }
  }
  pCharacteristicRX->setValue("");
  // 小延迟，避免占用过多 CPU 资源
  delay(500);
}

void handleSerial1Data()
{
  // 从串口读取数据
  while (Serial.available() > 0)
  {
    String receivedData = Serial.readStringUntil('\n'); // 读取直到换行符 '\n'

    // 去除尾部的回车符 '\r' 和换行符 '\n'
    receivedData.trim(); // trim() 会移除字符串开头和结尾的空格、回车、换行等字符

    if (receivedData != "") // 如果接收到的数据不为空
    {
      Serial.print("Received from Serial: ");
      Serial.println(receivedData); // 打印接收到的数据

      // 检查数据是否以"@"开头
      if (receivedData.startsWith("@"))
      {
        // 去除开头的"@"
        receivedData.remove(0, 1);

        // 分割字符串，使用"#"分隔符来提取data1和data2
        int separatorIndex = receivedData.indexOf('#');
        if (separatorIndex > 0) // 确保有"#"分隔符
        {
          data2 = receivedData.substring(0, separatorIndex);  // 提取data1
          data3 = receivedData.substring(separatorIndex + 1); // 提取data2

          // 输出解析后的数据
          Serial.print("data2: ");
          Serial.println(data2);
          Serial.print("data3: ");
          Serial.println(data3);

          // 可以在这里将 data1 和 data2 存储到全局变量或进一步处理
        }
        else
        {
          Serial.println("Invalid format: Missing '#' separator");
        }
      }
      else
      {
        Serial.println("Invalid format: Missing '@' at the beginning");
      }
    }
  }

  // 小延迟，避免占用过多 CPU 资源
  delay(20);
}

// 用来从一个 JSON 字符串中提取特定字段（field）的值。
// JSON 数据的字段值是用双引号包围的，并且字段和对应的值之间用 : 分隔。
String extractJSONValue(const String &data, const String &field)
{
  int startIndex = data.indexOf("\"" + field + "\":\"") + field.length() + 4;
  int endIndex = data.indexOf("\"", startIndex);
  if (startIndex < field.length() + 4 || endIndex == -1)
  {
    return "";
  }
  return data.substring(startIndex, endIndex);
}

// 发送数据到小程序
void sendDataToApp()
{
  // 设置特征值并发送通知
  pCharacteristicTX->setValue("data1:" + data1 + "\n");
  pCharacteristicTX->notify();
  Serial.print("Sent data to app: ");
  Serial.println(data1);
  // 设置特征值并发送通知
  pCharacteristicTX->setValue("data2:" + data2 + "\n");
  pCharacteristicTX->notify();
  Serial.print("Sent data to app: ");
  Serial.println(data2);
  // 设置特征值并发送通知
  pCharacteristicTX->setValue("data3:" + data3 + "\n");
  pCharacteristicTX->notify();
  Serial.print("Sent data to app: ");
  Serial.println(data3);
}
// 数据格式： "@data\r\n" , 32需要写包头规则 （文本包串口接收发）
// 发送数据到串口
void sendSerial1Data()
{
  Serial.print("Sending data to Serial: ");
  Serial.println(data1);
  // 发送串口数据
  String TxData = "@" + data1 + "\r\n";
  Serial.print(TxData.c_str());
}