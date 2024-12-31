#include "stm32f10x.h"                  // Device header

#ifndef __USART1_H
#define __USART1_H

#include <stdio.h>

extern char Serial_RxPacket[];
extern uint8_t Serial_RxFlag;
extern char Serial_TxPacket[];
void Serial_Init(void);
void Serial_SendByte(uint8_t Byte);
void Serial_SendArray(uint8_t *Array, uint16_t Length);
void Serial_SendString(char *String);
void Serial_SendNumber(uint32_t Number, uint8_t Length);
void Serial_Printf(char *format, ...);
 uint32_t Rxdata2Int(char *RxPacket);
#endif


//#include "stm32f10x.h"                  // Device header
//#include "Delay.h"
//#include "OLED.h"
//#include "Serial.h"
//#include "LED.h"
//#include "string.h"

//int main(void)
//{
//	/*ģ���ʼ��*/
//	OLED_Init();		//OLED��ʼ��
//	LED_Init();			//LED��ʼ��
//	Serial_Init();		//���ڳ�ʼ��
//	
//	/*��ʾ��̬�ַ���*/
//	OLED_ShowString(1, 1, "TxPacket");
//	OLED_ShowString(3, 1, "RxPacket");
//	
//	while (1)
//	{
//		if (Serial_RxFlag == 1)		//������յ����ݰ�
//		{
//			OLED_ShowString(4, 1, "                ");
//			OLED_ShowString(4, 1, Serial_RxPacket);				//OLED���ָ��λ�ã�����ʾ���յ������ݰ�
//			
//			/*���յ������ݰ���Ԥ���ָ��Աȣ��Դ˾�����Ҫִ�еĲ���*/
//			if (strcmp(Serial_RxPacket, "LED_ON") == 0)			//����յ�LED_ONָ��
//			{
//				LED1_ON();										//����LED
//				Serial_SendString("LED_ON_OK\r\n");				//���ڻش�һ���ַ���LED_ON_OK
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "LED_ON_OK");				//OLED���ָ��λ�ã�����ʾLED_ON_OK
//			}
//			else if (strcmp(Serial_RxPacket, "LED_OFF") == 0)	//����յ�LED_OFFָ��
//			{
//				LED1_OFF();										//Ϩ��LED
//				Serial_SendString("LED_OFF_OK\r\n");			//���ڻش�һ���ַ���LED_OFF_OK
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "LED_OFF_OK");			//OLED���ָ��λ�ã�����ʾLED_OFF_OK
//			}
//			else						//�������������������㣬���յ���δָ֪��
//			{
//				Serial_SendString("ERROR_COMMAND\r\n");			//���ڻش�һ���ַ���ERROR_COMMAND
//				OLED_ShowString(2, 1, "                ");
//				OLED_ShowString(2, 1, "ERROR_COMMAND");			//OLED���ָ��λ�ã�����ʾERROR_COMMAND
//			}
//			
//			Serial_RxFlag = 0;			//������ɺ���Ҫ���������ݰ���־λ���㣬�����޷����պ������ݰ�
//		}
//	}
//}
