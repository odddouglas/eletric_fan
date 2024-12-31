#include "stm32f10x.h" // Device header
#include "Delay.h"
#include "OLED.h"
#include "Servo.h"
#include "Key.h"
#include "Timer3.h"
#include "IC.h"
#include "GXHT30.h"
#include "Serial.h"
#include "string.h"
float GXHT30_Temperature, GXHT30_Humidity;

uint8_t KeyNum; // 定义用于接收键码的变量
float Angle;	// 定义角度变量
uint32_t freq = 0;
uint32_t rpm = 0;
int main(void)
{
	/*模块初始化*/
	OLED_Init();  // OLED初始化
	Servo_Init(); // 舵机初始化
	Key_Init();	  // 按键初始化
	HC05_Init();  // 串口初始化

	//	Timer3_Init();
	IC_Init();
	GXHT30_Init();
	/*显示静态字符串*/
	OLED_ShowString(1, 1, "Angle:");  // 1行1列显示字符串Angle:
	OLED_ShowString(2, 1, "Rxdata:"); // 1行1列显示字符串Angle:
	OLED_ShowString(3, 1, "rpm:");	  // 1行1列显示字符串Angle:
	OLED_ShowString(4, 1, "Temp:");	  // 1行1列显示字符串Angle:

	while (1)
	{
		GXHT30_ReadReg(&GXHT30_Temperature, &GXHT30_Humidity);
		KeyNum = Key_GetNum(); // 获取按键键码
		if (KeyNum == 1)	   // 按键1按下
		{
			Angle += 10;	// 角度变量自增30
			if (Angle > 90) // 角度变量超过180后
			{
				Angle = 0; // 角度变量归零
			}
		}
		freq = IC_GetFreq();
		Servo_SetAngle(Angle);		  // 设置舵机的角度为角度变量
		OLED_ShowNum(1, 7, Angle, 3); // OLED显示角度变量
		// OLED_ShowNum(2, 7, freq, 6);					// OLED显示角度变量
		OLED_ShowNum(3, 7, freq * 30, 6);				// OLED显示角度变量
		OLED_ShowNum(4, 7, GXHT30_Temperature * 10, 6); // OLED显示角度变量

		if (Serial_RxFlag == 1) // 如果接收到数据包
		{

			OLED_ShowString(2, 1, "Rxdata:         "); // Rxdata:之后有9格用于刷新
			// OLED_ShowString(2, 8, HC05_RxPacket);	   // OLED清除指定位置，并显示接收到的数据包
			OLED_ShowNum(2, 8, Rxdata2Int(HC05_RxPacket), strlen(HC05_RxPacket));
			Serial_RxFlag = 0; // 处理完成后，需要将接收数据包标志位清零，否则将无法接收后续数据包
		}
	}
}
