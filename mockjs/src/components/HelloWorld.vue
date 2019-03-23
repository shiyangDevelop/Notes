<template>
  <div class="hello">
    <h2>淘宝书城</h2>
    <ul>
      <router-link tag="li" :to="item.href" v-for="(item, index) in messageList" :key="'list' + index">
        <img :src="item.thumbnail_pic_s">
        <div class="bookInfo">
          <h4 v-text="item.title"></h4>
          <div>单价：<strong>{{ item.price }}</strong>元/本</div>
          <span>作者：{{ item.author_name }}</span>
          <div>日期：{{ item.date }}</div>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      messageList: []
    }
  },
  mounted () {
    this.init()
    // this.timeout()
  },
  methods: {
    async init () {
      let params = {}
      let res = await this.$axios.post('/news/index', params)
      this.messageList = res.articles
      console.log(res)
    }
    // timeout () {
    //   let that = this
    //   setTimeout(function () {
    //     that.init()
    //     that.timeout()
    //   }, 3000)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  width: 90%;
  margin: 0 auto;
  font-family: 'Microsoft YaHei';
}
li {
  box-sizing: border-box;
  width: 50%;
  float: left;
  padding: 10px;
  text-align: left;
  font-size: 14px;
  color: #666;
}
li::after {
  content: "";
  display: table;
}
li img {
  float: left;
  margin-right: 20px;
  width: 40%;
  border-radius: 10px;
}
li h4 {
  color: #333;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  margin-top: 0;
  margin-bottom: 5px;
}
li .bookInfo {
  float: left;
  padding-left: 10px;
}
@media screen and (max-width: 400px) {
li {
  width: 50%;
  font-size: 14px;
}
li img {
  float: none;
  width: 100%;
}
}
</style>
