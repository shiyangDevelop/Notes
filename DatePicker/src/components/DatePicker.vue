<template>
<div class="DatePicker">
  <header class="changeStep">
    <button @click="prevYear" :disabled="year === (startYear + 1)">上一年</button>
    <button @click="prevMonth" :disabled="year === (startYear + 1) && month === 1">上一月</button>
    <button @click="nextMonth" :disabled="year === endYear && month === 12">下一月</button>
    <button @click="nextYear" :disabled="year === endYear">下一年</button>
  </header>
  <header class="changeDate">
    <select class="dateSelect" @change="changeDateFun" v-model="year">
      <option v-for="y in (endYear - startYear)" :key="'year' + y" :value="startYear + y" v-text="startYear + y"></option>
    </select>
    <span>-</span>
    <select class="dateSelect" @change="changeDateFun" v-model="month">
      <option v-for="m in 12" :key="'month' + m" :value="m" v-text="m"></option>
    </select>
    <span>-</span>
    <select class="dateSelect" @change="changeDateFun" v-model="day">
      <option v-for="d in days" :key="'day' + d" :value="d" v-text="d"></option>
    </select>
  </header>
  <header class="week">
    <div class="weekItem" v-for="(week, index) in this['weekText_'+lang]" :key="'week'+index" v-text="week"></div>
  </header>
  <div class="dateTable">
    <div class="row" v-for="(row, index) in dateArr" :key="'row'+index">
      <div class="col" :class="{selectedDate: col.isSelectedDate, weekEnd: col.nWeek > 5}" @click="changeDateFun(col.cYear, col.cMonth, col.cDay)" v-for="(col, i) in row" :key="'col'+i">
        {{ col.cDay }}
        <span class="lunar" v-if="isShowLunar">{{ col.festival ? col.festival : col.lDay === 1 ? col.IMonthCn : col.IDayCn }}</span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Calendar from '../utiles/calendar.js'
export default {
  name: 'DatePicker',
  props: {
    lang: {
      type: String,
      default: 'cn'
    }
  },
  data () {
    return {
      startYear: 1900, // 限制最早时间：年 1900
      startMonth: 2,
      startDay: 1,
      endYear: 2100, // 限制最晚时间：年 2100
      endMonth: 11,
      endDay: 30,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      weekText_cn: ['日', '一', '二', '三', '四', '五', '六'],
      weekText_en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      festival: [
        { month: 1, day: 1, name: '元旦' },
        { month: 2, day: 14, name: '情人节' },
        { month: 3, day: 8, name: '妇女节' },
        { month: 3, day: 12, name: '植树节' },
        { month: 4, day: 1, name: '愚人节' },
        { month: 5, day: 1, name: '劳动节' },
        { month: 5, day: 4, name: '青年节' },
        { month: 5, day: 12, name: '护士节' },
        { month: 6, day: 1, name: '儿童节' },
        { month: 8, day: 1, name: '建军节' },
        { month: 9, day: 10, name: '教师节' },
        { month: 10, day: 1, name: '国庆节' },
        { month: 12, day: 24, name: '平安夜' },
        { month: 12, day: 25, name: '圣诞节' }
      ],
      rows: '',
      dateArr: [],
      isShowLunar: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    days () {
      let daysPerMonth = [31, 28 + this.isLeap(this.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      return daysPerMonth[this.month - 1]
    }
  },
  watch: {
    year (value) {
      this.init(value, this.month, this.day)
    },
    month (value) {
      this.init(this.year, value, this.day)
    },
    day (value) {
      this.init(this.year, this.month, value)
    }
  },
  methods: {
    init (y, m, d) {
      let dateArr = []
      let today = new Date() // 获取当前日期
      y = y || today.getFullYear() // 获取日期中的年份
      m = m - 1 || today.getMonth() // 获取日期中的月份(需要注意的是：月份是从0开始计算，获取的值比正常月份的值少1)
      d = d || today.getDate() // 获取日期中的日(方便在建立日期表格时高亮显示当天)
      let firstday = new Date(y, m, 1) // 获取当月的第一天
      let dayOfWeek = firstday.getDay() // 判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
      let daysPerMonth = [31, 28 + this.isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 创建月份数组
      this.rows = Math.ceil((dayOfWeek + daysPerMonth[m]) / 7) // 确定日期表格所需的行数
      for (let row = 0; row < this.rows; row++) {
        let days = []
        for (let col = 0; col < 7; col++) {
          let idx = 7 * row + col
          let date = idx - dayOfWeek + 1
          let dateObj = {};
          (date <= 0 || date > daysPerMonth[m]) ? date = ' ' : date = idx - dayOfWeek + 1 // 索引小于等于0或者大于月份最大值就用空表格代替
          if (this.isShowLunar && date !== ' ') {
            dateObj = Calendar.solar2lunar(y, (m + 1), date)
            /** 添加被选择日期 */
            d === date ? dateObj.isSelectedDate = true : dateObj.isSelectedDate = false
            /** 添加节日 */
            for (let i = 0; i < this.festival.length; i++) {
              if (this.festival[i].month === m + 1 && this.festival[i].day === date) {
                dateObj.festival = this.festival[i].name
                break
              } else {
                dateObj.festival = ''
              }
            }
          } else if (date !== ' ') {
            dateObj = Calendar.solar2lunar(y, (m + 1), date)
            d === date ? dateObj.isSelectedDate = true : dateObj.isSelectedDate = false
          }
          days.push(dateObj)
        }
        dateArr.push(days)
      }
      this.dateArr = dateArr
    },
    isLeap (year) {
      return year % 4 === 0 ? (year % 100 !== 0 ? 1 : (year % 400 === 0 ? 1 : 0)) : 0
    },
    changeDateFun (y, m, d) {
      if (y && m && d) {
        this.year = y
        this.month = m
        this.day = d
      }
    },
    prevYear () {
      if (this.year !== (this.startYear + 1)) {
        this.year--
      }
    },
    prevMonth () {
      if (this.year !== this.startYear && this.month > 1) {
        this.month--
      } else {
        this.year--
        this.month = 12
      }
    },
    nextYear () {
      if (this.year !== this.endYear) {
        this.year++
      }
    },
    nextMonth () {
      if (this.year <= this.endYear && this.month < 12) {
        this.month++
      } else if (this.year !== this.endYear && this.month === 12) {
        this.year++
        this.month = 1
      }
    }
  }
}
</script>
<style scoped>
.week {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.week .weekItem {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: calc(100%/7);
  height: 40px;
}
.dateTable .row {
  display: flex;
  justify-content: space-around;
}
.dateTable .row .col {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100%/7);
  height: 50px;
}
.dateTable .row .col .lunar {
  font-size: 12px;
}
.changeDate .dateSelect {
  width: 80px;
  height: 30px;
  text-align: center;
  outline: none;
  border-radius: 5px;
  border-color: #ddd;
  background-color: #fff;
}
.selectedDate {
  color: #fff;
  background-color: #999;
}
.changeStep {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
</style>
