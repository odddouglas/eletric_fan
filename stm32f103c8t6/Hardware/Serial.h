#ifndef __SERIAL_H
#define __SERIAL_H

#include <stdio.h>

extern char HC05_RxPacket[]; // 暴露给main（参数格式： @data\r\n
extern uint8_t Serial_RxFlag;

void HC05_Init(void);
void Serial_SendByte(uint8_t Byte);
void Serial_SendArray(uint8_t *Array, uint16_t Length);
void Serial_SendString(char *String);
void Serial_SendNumber(uint32_t Number, uint8_t Length);
void Serial_Printf(char *format, ...);
int Rxdata2Int(char *RxPacket) ;
#endif
