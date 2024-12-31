#include "stm32f10x.h"                  // Device header
#include "PWM.h"

/**
  * 函    数：风扇初始化
  * 参    数：无
  * 返 回 值：无
  */
void fan_Init(void)
{
	PWM_Init();									//初始化风扇的底层PWM
}

/**
  * 函    数：风扇的占空比
  * 参    数：speed 要设置的风扇的占空比，范围：0~90
  * 返 回 值：无
  */
void fan_set_speed(uint16_t speed)
{
	PWM_SetCompare2(speed);	//设置占空比
												
}
