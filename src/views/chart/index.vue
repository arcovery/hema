<template>
  <div class="dashboard">
    <el-card>
      <div class="vessel">
        <div class="vessel_v">
          <div class="circle">{{ total.increment_users }}</div>
          <div>今日新增用户</div>
        </div>
        <div class="vessel_v">
          <div class="circle">{{ total.total_users }}</div>
          <div>总用户量</div>
        </div>
        <div class="vessel_v">
          <div class="circle">{{ total.increment_questions }}</div>
          <div>新增试题</div>
        </div>
        <div class="vessel_v">
          <div class="circle">
            {{ total.total_questions }}
          </div>
          <div>总试题量</div>
        </div>
        <div class="vessel_v">
          <div class="circle">{{ total.total_done_questions }}</div>
          <div>总刷题量</div>
        </div>
        <div class="vessel_v">
          <div class="circle">{{ total.personal_questions }}</div>
          <div>人均刷题量</div>
        </div>
      </div>
    </el-card>

    <el-card>
      <div class="ech" id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { chatTitleAPI, enterpriseDataAPI } from '@/api/charts'

export default {
  data () {
    return {
      total: {
        total_done_questions: '', //	int	刷题总数
        personal_questions: '', //	int	人均刷题数量
        total_users: '', //	int	用户总数
        increment_users: '', //	int	今日增长用户数量
        increment_questions: '', //	int	今日增加题数
        total_questions: '' //	int	题总数量
      },
      data: []
    }
  },
  async created () {
    let res = await chatTitleAPI()
    this.total = res.data
  },
  async mounted () {
    let res2 = await enterpriseDataAPI()
    this.data = res2.data

    // 1. 实例化对象
    const myChart = echarts.init(document.getElementById('main'))

    // 2. 指定数据和配置
    const option = {
      title: {  subtext: '数据分析', left: 'center' },

      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}:{c}({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 30
      },
      series: [
        {
          name: '数据分析',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: '40', fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: this.data
        }
      ]
    }
    // 3. 把数据和配置给实例对象
    myChart.setOption(option)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  .vessel {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 120px;
    width: 100%;
    .vessel_v {
      display: flex;
      flex-direction: column;
      text-align: center;
      .circle {
        width: 100px;
        height: 100px;
        line-height: 100px;
        border: 2px solid green;
        border-radius: 50%;
        margin-bottom: 8px;
      }
    }
  }

  .ech {
    float: none;
    width: 1400px;
    height: 440px;
  }
}
</style>