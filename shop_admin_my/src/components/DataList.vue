<template>
  <div id="main" style="width: 600px;height:400px;">
    数据报表
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  methods: {
    getLogin () {
      axios({
        url: 'http://localhost:8888/api/private/v1/login',
        method: 'post',
        data: this.form
      }).then(res => {
        console.log(res.data)
      })
    },
    drawChart () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      const option = this.option
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }

  },
  created () {

  },
  mounted () {
    this.drawChart()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style style="stylus" scoped>

</style>
