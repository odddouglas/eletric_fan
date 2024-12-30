import * as echarts from "../utils/ec-canvas/echarts";

//内置初始化
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

//温度计
// function getOption3(data) {

//   //根据进来的数据判断阈值颜色
//   const color = (function (value) {
//     if (value < 20) {
//       return '#4F88F9'; //蓝色
//     }
//     if (20 < value <= 30) {
//       return '#3DC91B'; // 绿色
//     } else if (30 < value < 40) {
//       return '#FF7F50'; // 珊瑚色
//     } else {
//       return '#FF4500'; // 橙红色
//     }
//   })(data);

//   return {
//     series: [{
//         type: 'gauge',
//         center: ['50%', '60%'],
//         startAngle: 180,
//         endAngle: 0,
//         min: 0,
//         max: 50,
//         splitNumber: 10,
//         itemStyle: {
//           color: color
//         },
//         progress: {
//           show: true,
//           width: 30
//         },
//         pointer: {
//           show: false
//         },
//         axisLine: {
//           lineStyle: {
//             width: 30
//           }
//         },
//         axisTick: {
//           distance: -45,
//           splitNumber: 2,
//           lineStyle: {
//             width: 2,
//             color: '#999'
//           }
//         },
//         splitLine: {
//           distance: -52,
//           length: 14,
//           lineStyle: {
//             width: 3,
//             color: '#999'
//           }
//         },
//         axisLabel: {
//           distance: -10,
//           color: '#999',
//           fontSize: 20
//         },
//         anchor: {
//           show: false
//         },
//         title: {
//           show: false
//         },
//         detail: {
//           valueAnimation: true,
//           width: '60%',
//           lineHeight: 40,
//           borderRadius: 8,
//           offsetCenter: [0, '-15%'],
//           fontSize: 20,
//           fontWeight: 'bolder',
//           formatter: '{value} °C',
//           color: 'inherit'
//         },
//         data: [{
//           value: data
//         }]
//       },

//     ]
//   };
// }

function getOption1(data) {


  return {
    xAxis: {
      type: 'category',
      data: ['', '', '', '', '', '', '↑'],
      splitLine:true
    },
    yAxis: {
      type: 'value',
      min: 20, // y轴最小值
      max: 100, // y轴最大值
      interval: 5 // 刻度间隔为1
    },
    series: [{
      data: data,
      type: 'line',
    }]
  };
}


//加载条
function getOption2() {
  return {
    graphic: {
      elements: [{
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
            keyframes: [{
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
      }]
    }
  };

}




module.exports = {
  initChart,
  getOption1, // 温度计
  getOption2, // 加载条
  //getOption3
};