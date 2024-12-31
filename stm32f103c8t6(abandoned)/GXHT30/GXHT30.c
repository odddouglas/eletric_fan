#include "stm32f10x.h"                  // Device header
#include "MyI2C.h"
#include "Delay.h"

#define addr 0x44
//extern float GXHT30_Temperature,GXHT30_Humidity;
void GXHT30_Init(void)
{
	MyI2C_Init();
}

void GXHT30_NAck(void)	//非应答
{
    MyI2C_W_SCL(0);
	Delay_us(1);
   	MyI2C_W_SDA(1);
	Delay_us(1);
  	MyI2C_W_SCL(1);
	Delay_us(1);
    MyI2C_W_SCL(0);
	
	MyI2C_Stop();
}


void GXHT30_Send_Byte(uint8_t txd)  //传入芯片地址
{
     uint8_t i;
	for(i=0;i<8;i++)
	{
		MyI2C_W_SDA(txd & (0x80>>i));
		Delay_us(1);
		MyI2C_W_SCL(1);
		Delay_us(2); 
		MyI2C_W_SCL(0);
		Delay_us(2);
	}
}



uint8_t GXHT30_Receive_Byte(uint8_t ack)//读取单字节
{
   uint8_t i=0,Byte=0x00;
	
   MyI2C_W_SCL(0);
   MyI2C_W_SDA(1);
   for(i=0;i<8;i++)
   {
   		MyI2C_W_SCL(1);
		Delay_ms(2);
	    if(MyI2C_R_SDA()==0x01){Byte |= (0x80>>i);}
		MyI2C_W_SCL(0);
		Delay_ms(1);	
   }
 
   	if(ack==0)
	   	GXHT30_NAck();
	else
		MyI2C_SendAck(0);
 
	return Byte;
}


void GXHT30_ReadReg(float *Temperature,float *Humidity)//测量温湿度数据
{
	uint16_t tem,hum;
	uint8_t buff[8];
	uint8_t i=0;
	float tem_temp,hum_temp;
	float tem_num=0,hum_num=0;
	while (i<10)
	{
	MyI2C_Start();	
	MyI2C_SendByte(addr<<1);//写7位GXHT30设备地址,0作为写取位	
	MyI2C_ReceiveAck();//0    
    GXHT30_Send_Byte(0x2C);//0x2c
    MyI2C_ReceiveAck();//0
	GXHT30_Send_Byte(0x0D);//
	MyI2C_ReceiveAck();
	MyI2C_Stop();
    Delay_ms(15);
		
    MyI2C_Start();	
	MyI2C_SendByte((addr<<1)+1);//写7位GXHT30设备地址加0作为写取位,1为读取位
	Delay_ms(10);
	
	uint8_t ack=MyI2C_ReceiveAck();//返回0为正确
	
	if(ack==0)
	{
		buff[0]=GXHT30_Receive_Byte(1);
		buff[1]=GXHT30_Receive_Byte(1);
		buff[2]=GXHT30_Receive_Byte(1);
		buff[3]=GXHT30_Receive_Byte(1);
		buff[4]=GXHT30_Receive_Byte(1);
		buff[5]=GXHT30_Receive_Byte(0);

		tem = ((uint16_t)(buff[0]<<8) | buff[1]);//温度拼接
		hum = ((uint16_t)(buff[3]<<8) | buff[4]);//湿度拼接	
		
		tem_temp = ((175.0*(float)tem/65535.0)-45.0) ;// T = -45 + 175 * tem / (2^16-1)
		hum_temp = (100.0*(float)hum/65535.0);// RH = hum*100 / (2^16-1)

		if((tem_temp>=0)&&(tem_temp<=125)&&(hum_temp>=0)&&(hum_temp<=100))//过滤错误数据
		{
			tem_num+=tem_temp;
			hum_num+=hum_temp;
		}
		i++;
	}
	}
	i=0;
	*Temperature=tem_num/10;	//测10次求平均值
	*Humidity=hum_num/10;
}
	

