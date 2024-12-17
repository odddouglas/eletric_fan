
import * as echarts from "../ec-canvas/echarts";

//
function initChart(getOptionFunc, canvas, width, height, dpr) {
    // 使用echarts.init方法初始化一个图表实例(该实例只有以下几个参数)
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr
    });
  
    // 将chart实例绑定到canvas对象上
    canvas.setChart(chart);
  
    // 调用getOptionFunc函数获取图表的配置选项
    const option = getOptionFunc();
  
    // 将配置选项设置到图表实例上
    chart.setOption(option);
  }


// 加载条
function getOption2() {
    return {
      graphic: {
        elements: [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            children: new Array(7).fill(0).map((val, i) => ({
              type: 'rect',
              x: i * 20,
              shape: {
                x: 0,
                y: -40,
                width: 10,
                height: 80
              },
              style: {
                fill: '#5470c6'
              },
              keyframeAnimation: {
                duration: 1000,
                delay: i * 200,
                loop: true,
                keyframes: [
                  {
                    percent: 0.5,
                    scaleY: 0.3,
                    easing: 'cubicIn'
                  },
                  {
                    percent: 1,
                    scaleY: 1,
                    easing: 'cubicOut'
                  }
                ]
              }
            }))
          }
        ]
      }
    };
    
  }

// 湿度计
function getOption5(data) {

  //根据进来的数据判断阈值颜色
  const color = (function(value) {
    if (value <20) {
      return '#4F88F9'; //蓝色
    }
    if (20< value <= 30) {
      return '#3DC91B'; // 绿色
    } else if (30<value <40 ) {
      return '#FF7F50'; // 珊瑚色
    } else {
      return '#FF4500'; // 橙红色
    }
  })(data);

  return {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 50,
        splitNumber: 10,
        itemStyle: {
          color: color
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -10,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '20%'],
          fontSize: 20,
          fontWeight: 'bolder',
          formatter: '{value} °C',
          color: 'inherit'
        },
        data: [
          {
            value: data
          }
        ]
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 50,
        itemStyle: {
          color: '#FEC6FF'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            value: data
          }
        ]
      }
    ]
  };
}
//温度计
function getOption1(data) {

  //根据进来的数据判断阈值颜色
  const color = (function(value) {
    if (value <20) {
      return '#4F88F9'; //蓝色
    }
    if (20< value <= 30) {
      return '#3DC91B'; // 绿色
    } else if (30<value <40 ) {
      return '#FF7F50'; // 珊瑚色
    } else {
      return '#FF4500'; // 橙红色
    }
  })(data);

  return {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 50,
        splitNumber: 10,
        itemStyle: {
          color: color
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -10,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 20,
          fontWeight: 'bolder',
          formatter: '{value} °C',
          color: 'inherit'
        },
        data: [
          {
            value: data
          }
        ]
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 50,
        itemStyle: {
          color: '#ECDFDA'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            value: data
          }
        ]
      }
    ]
  };
}

// 等级评估
function getOption3(data){
  return {
    dataset: {
      source: [
        ['score', 'amount', 'product'],
        [,100 , ' '],
        [data[0], data[0], data[1]]
      ]
    },
    grid: { containLabel: true },
    xAxis: { name: 'score' },
    yAxis: { type: 'category' },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      min: 10,
      max: 100,
      text: ['High Score', 'Low Score'],
      // Map the score column to color
      dimension: 0,
      inRange: {
        color: [ '#FD665F','#FFCE34','#65B581' ]
      }
    },
    series: [
      {
        type: 'bar',
        encode: {
          // Map the "amount" column to X axis.
          x: 'amount',
          // Map the "product" column to Y axis
          y: 'product'
        }
      }
    ]
  };
}

// 等级评估表
function getOption4(data) {
  return {
    series: [
      {
        type: 'gauge',
        anchor: {
          show: true,
          showAbove: true,
          size: 10,
          itemStyle: {
            color: '#FAC858'
          }
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 6,
          length: '80%',
          offsetCenter: [0, '0%']
        },
        progress: {
          show: true,
          overlap: true,
          roundCap: true
        },
        axisLine: {
          roundCap: true
        },
        data: data,
        title: {
          fontSize: 12
        },
        detail: {
          width:10,
          height: 8,
          fontSize: 10,
          color: '#fff',
          backgroundColor: 'inherit',
          borderRadius: 3,
          formatter: '{value}%'
        }
      }
    ]
  };
  
}


  
  module.exports = {
    initChart,
    getOption1,
    getOption2,
    getOption3,
    getOption4,
    getOption5
  };