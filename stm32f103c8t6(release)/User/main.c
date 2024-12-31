#include "stm32f10x.h" // Device header
#include "Delay.h"
#include "OLED.h"
#include "OLED2.h"
#include "Servo.h"
#include "Key.h"
#include "USART1.h"
// #include "Timer3.h"
#include "IC.h"
#include "GXHT30.h"
#include "string.h"
/*  IC PA6   黄
PWM  PA1     蓝
KEY PA12
温度 SDA PB9  SCL PB8


*/

float GXHT30_Temperature, GXHT30_Humidity;

uint8_t KeyNum; // 定义用于接收键码的变量
uint32_t speed; // 定义角度变量
uint32_t freq = 0;
uint32_t rpm = 0;
uint8_t mode = 0;
uint32_t num = 0;
int main(void)
{
	/*模块初始化*/
	OLED2_Init(); // OLED初始化
	OLED_Init();  // OLED1初始化

	fan_Init(); // 舵机初始化
	//	Key_Init();			//按键初始化
	Serial_Init();
	//	Timer3_Init();
	IC_Init();
	GXHT30_Init();
	/*显示静态字符串*/
	OLED_ShowString(1, 1, "speed:"); // 1行1列显示字符串Angle:
	OLED_ShowString(2, 1, "Freq:");	 // 1行1列显示字符串Angle:
	OLED_ShowString(3, 1, "rpm:");	 // 1行1列显示字符串Angle:
	OLED_ShowString(4, 1, "Temp:");	 // 1行1列显示字符串Angle:
	/*显示静态字符串*/
	OLED2_ShowString(1, 1, "TxPacket");
	OLED2_ShowString(3, 1, "RxPacket");

	while (1)
	{
		GXHT30_ReadReg(&GXHT30_Temperature, &GXHT30_Humidity);
		freq = IC_GetFreq();  // 读频率
		fan_set_speed(speed); // 设置舵机的角度为角度变量

		OLED_ShowNum(1, 7, speed, 3);					// OLED显示占空比变量
		OLED_ShowNum(2, 7, freq, 6);					// OLED显示频率变量
		OLED_ShowNum(3, 7, freq * 30, 6);				// OLED显示转速变量
		OLED_ShowNum(4, 7, GXHT30_Temperature * 10, 4); // OLED显示角度变量

		if (Serial_RxFlag == 1)
		{
			//	Serial_SendString(Serial_RxPacket);
			//		  	OLED2_ShowString(4, 1, "                ");
			//			OLED2_ShowString(4, 1, Serial_RxPacket);				//OLED清除指定位置，并显示接收到的数据包

			/**************************************************************/

			if (strcmp(Serial_RxPacket, "AUTO") == 0) // 如果收到自动指令
			{
				mode = 1;
				OLED_ShowString(1, 11, " AUTO");
				//	Serial_SendString("AUTO_OK\r\n");
			}
			else
			{
				OLED_ShowString(1, 11, "NAUTO");
				speed = Rxdata2Int(Serial_RxPacket);
				//	  Serial_SendString(Serial_RxPacket);
				//	  Serial_SendNumber(speed,4);
				mode = 2;
			}
			/**********************************************************/
			if (mode == 2)
			{
				//			  sprintf(Serial_TxPacket, "mode=%d\r\nspeed=%d\r\n",mode,speed);
				//			  Serial_SendString(Serial_TxPacket);
				fan_set_speed(speed); // 更新转速
			}
			Serial_RxFlag = 0; // 处理完成后，需要将接收数据包标志位清零，否则将无法接收后续数据包
		}
		if (mode == 1) // 自动模式
		{
			if (GXHT30_Temperature < 20.0)
			{
				speed = 0;
			}
			else if ((GXHT30_Temperature >= 20.0) && (GXHT30_Temperature < 22.0))
			{
				speed = 30;
			}
			else if ((GXHT30_Temperature >= 22.0) && (GXHT30_Temperature < 23.0))
			{
				speed = 40;
			}
			else if ((GXHT30_Temperature >= 23.0) && (GXHT30_Temperature < 25.0))
			{
				speed = 50;
			}
			else if ((GXHT30_Temperature >= 25.0) && (GXHT30_Temperature < 27.0))
			{
				speed = 60;
			}
			else if ((GXHT30_Temperature >= 27.0) && (GXHT30_Temperature < 28.0))
			{
				speed = 70;
			}
			else if ((GXHT30_Temperature >= 28.0) && (GXHT30_Temperature < 29.0))
			{
				speed = 80;
			}
			else if ((GXHT30_Temperature >= 29.0) && (GXHT30_Temperature < 31.0))
			{
				speed = 90;
			}
			else
			{
				speed = 95;
			}
			fan_set_speed(speed); // 更新转速
		}

		/********************************************************************/
		Delay_ms(500);
		num = (GXHT30_Temperature * 10); // 温度值化为整数
		sprintf(Serial_TxPacket, "@%d#%d\r\n", num, freq * 30);
		Serial_SendString(Serial_TxPacket);
	}
}

// void TIM3_IRQHandler(void)
//{
//	if (TIM_GetITStatus(TIM3, TIM_IT_Update) == SET)
//	{
//		// freq=IC_GetFreq()
//		TIM_ClearITPendingBit(TIM3, TIM_IT_Update);
//	}
// }

// void EXTI15_10_IRQHandler()     //按键中断
//{
//
//    if(EXTI_GetITStatus(EXTI_Line12)==SET)
//    {
//         KeyNum=1;
//		EXTI_ClearITPendingBit(EXTI_Line12);
//    }

//}

// int main(void)
//{
//	/*模块初始化*/
//	OLED_Init();		//OLED初始化
//	Serial_Init();		//串口初始化
//
//	/*显示静态字符串*/
//	OLED_ShowString(1, 1, "TxPacket");
//	OLED_ShowString(3, 1, "RxPacket");
//
//	while (1)
//	{
//		if (Serial_RxFlag == 1)		//如果接收到数据包
//		{
//			OLED_ShowString(4, 1, "                ");
//			OLED_ShowString(4, 1, Serial_RxPacket);				//OLED清除指定位置，并显示接收到的数据包
//
//			/*将收到的数据包与预设的指令对比，以此决定将要执行的操作*/
//			if (strcmp(Serial_RxPacket, "LED_ON") == 0)			//如果收到LED_ON指令
//			{									//点亮LED
//				Serial_SendString("LED_ON_OK\r\n");				//串口回传一个字符串LED_ON_OK
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "LED_ON_OK");				//OLED清除指定位置，并显示LED_ON_OK
//			}
//			else if (strcmp(Serial_RxPacket, "LED_OFF") == 0)	//如果收到LED_OFF指令
//			{									//熄灭LED
//				Serial_SendString("LED_OFF_OK\r\n");			//串口回传一个字符串LED_OFF_OK
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "LED_OFF_OK");			//OLED清除指定位置，并显示LED_OFF_OK
//			}
//			else						//上述所有条件均不满足，即收到了未知指令
//			{
//				Serial_SendString("ERROR_COMMAND\r\n");			//串口回传一个字符串ERROR_COMMAND
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "ERROR_COMMAND");			//OLED清除指定位置，并显示ERROR_COMMAND
//			}
//
//			Serial_RxFlag = 0;			//处理完成后，需要将接收数据包标志位清零，否则将无法接收后续数据包
//		}
//	}
// }
