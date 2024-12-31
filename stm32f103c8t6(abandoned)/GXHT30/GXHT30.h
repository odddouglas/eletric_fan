#ifndef __GXHT30_H
#define __GXHT30_H

uint8_t GXHT30_Receive_Byte(u8 ack);//读取单字节
void GXHT30_Send_Byte(uint8_t txd); 	
void GXHT30_Init(void);
void GXHT30_ReadReg(float *Temperature,float *Humidity);
void GXHT30_NAck(void);
void GXHT30_Init(void);

#endif
