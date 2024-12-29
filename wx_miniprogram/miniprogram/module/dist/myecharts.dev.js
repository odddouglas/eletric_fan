"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var echarts = _interopRequireWildcard(require("../utils/ec-canvas/echarts"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//内置初始化
function initChart(getOptionFunc, canvas, width, height, dpr) {
  // 使用echarts.init方法初始化一个图表实例(该实例只有以下几个参数)
  var chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  }); // 将chart实例绑定到canvas对象上

  canvas.setChart(chart); // 调用getOptionFunc函数获取图表的配置选项

  var option = getOptionFunc(); // 将配置选项设置到图表实例上

  chart.setOption(option);
} //温度计
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


function getOption1() {
  // 生成随机数据
  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(value)]
    };
  }

  var data = [];
  var now = new Date(1997, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var value = Math.random() * 1000;

  for (var i = 0; i < 1000; i++) {
    data.push(randomData());
  }

  return {
    title: {
      text: 'Dynamic Data & Time Axis'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function formatter(params) {
        params = params[0];
        var date = new Date(params.name);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      data: data
    }]
  };
} //加载条


function getOption2() {
  return {
    graphic: {
      elements: [{
        type: 'group',
        left: 'center',
        top: 'center',
        children: new Array(7).fill(0).map(function (val, i) {
          return {
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
              }, {
                percent: 1,
                scaleY: 1,
                easing: 'cubicOut'
              }]
            }
          };
        })
      }]
    }
  };
}

module.exports = {
  initChart: initChart,
  getOption1: getOption1,
  // 温度计
  getOption2: getOption2 // 加载条
  //getOption3

};