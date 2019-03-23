// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random
// mock一组数据
const produceNewsData = function (params) {
  let articles = []
  for (let i = 0; i < 100; i++) {
    let title = Random.csentence(5, 8)
    let newArticleObject = {
      title: title.substr(0, title.length - 2), //  Random.csentence( min, max )
      thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      price: Random.float(22, 399, 2, 2),
      author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      date: Random.date(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
      href: '/' + Random.string('lower', 3, 6),
      city: Random.city(true)
    }
    articles.push(newArticleObject)
  }

  return {
    articles: articles
  }
}
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/news/index', 'post', produceNewsData)
