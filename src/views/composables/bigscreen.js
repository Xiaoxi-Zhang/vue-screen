import { ref } from 'vue'
import { getParkInfoAPI } from '@/api/park'
import * as echarts from 'echarts'

// 封装获取数据接口的组合式函数
// 方法名 必须以use开头
// 把组件内部的逻辑封装到方法内部
// 1.该导入的要导入，(ref、getParkInfoAPI)
// 2.封装的函数要导出
// 3.函数内部的数据，如果在外面要使用，还要return
export function useGetParkInfo () {
  const parkInfo = ref({})
  // 封装方法调用接口
  const getParkInfo = async () => {
    const res = await getParkInfoAPI()
    // console.log(res)
    parkInfo.value = res.data
  }
  return {
    parkInfo,
    getParkInfo
  }
}

// 初始化柱状图
export function useInitBarChart (parkInfo) {
  const barChart = ref(null)
  const initBarChart = () => {
    const parkIncome = parkInfo.value.parkIncome
    const myChart = echarts.init(barChart.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        // 让图表占满容器
        top: '10px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
            show: false
          },
          data: parkIncome.xMonth
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '园区年度收入',
          type: 'bar',
          barWidth: '10px',
          data: parkIncome.yIncome.map((item, index) => {
            const color =
              index % 2 === 0
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.23, color: '#74c0f8' },
                    { offset: 1, color: 'rgba(116,192,248,0.00)' }
                  ])
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.23, color: '#ff7152' },
                    { offset: 1, color: 'rgba(255,113,82,0.00)' }
                  ])
            return { value: item, itemStyle: { color } }
          })
        }
      ],
      textStyle: {
        color: '#B4C0CC'
      }
    }
    myChart.setOption(option)
  }
  return {
    barChart,
    initBarChart
  }
}

// 渲染饼状图
export function useInitPieChart (parkInfo) {
  const pieChart = ref(null)
  const initPieChart = () => {
    const myPieChart = echarts.init(pieChart.value)
    const parkIndustry = parkInfo.value.parkIndustry
    const pieOption = {
      color: ['#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
      legend: {
        itemGap: 20,
        bottom: '0',
        icon: 'rect',
        itemHeight: 10, // 图例icon高度
        itemWidth: 10, // 图例icon宽度
        textStyle: {
          color: '#c6d1db'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '园区产业分析',
          type: 'pie',
          radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
          center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
          tooltip: {
            trigger: 'item',
            formatter: params => {
              return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`
            }
          },
          label: {
            show: false,
            position: 'center'
          },
          data: parkIndustry
        }
      ]
    }
    myPieChart.setOption(pieOption)
  }
  return {
    pieChart,
    initPieChart
  }
}
