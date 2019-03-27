import ArticleModel from '../../models/back/article'
import moment from 'moment'

class Article {
  constructor () {
    this.publish = this.publish.bind(this)
    this.search = this.search.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.delete = this.delete.bind(this)
  }

  async delete (req, res, next) {
    const { _id } = req.body
    try {
      const article = await ArticleModel.findOne({_id})
      if (article) {
        await ArticleModel.deleteOne(article)
        res.send({
          code: 200,
          status: 1, // 1 代表需要消息提示
          success: true,
          message: '该文章删除成功'
        })
      } else {
        res.send({
          status: 0,
          success: false,
          message: '该文章不存在(或已删除)，请刷新后重试'
        })
      }
    } catch (error) {
      res.send({
        status: 0,
        success: false,
				message: error
			})
    }
  }

  async publish (req, res, next) {
    let {title, subTitle, content, tags} = req.body
    const createDate = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
      const newArticle = {
        title,
        subTitle,
        content,
        tags,
        createDate,
        invisible: true
      }
      await ArticleModel.create(newArticle)
        res.send({
          status: 1, // 1 代表需要消息提示
          code: 200,
          success: true,
          message: '发布文章成功'
        })
    } catch (error) {   
      res.send({
        status: 0,
        success: false,
        type: 'ERROR_PUBLISH_ARTICLE',
        message: '发布文章失败'
      })
    }
  }

  async search (req, res, next) {
    let {pageSize, curPage} = req.query
    try {
      let allarticle = []
      if (!pageSize && !curPage) {
        allarticle = await ArticleModel.find({}).sort({})
      } else {
        allarticle = await ArticleModel.find({}).sort({}).skip(Number(curPage - 1) * pageSize).limit(Number(pageSize))
      }
      const count = await ArticleModel.count()
      if (curPage > 1 && !allarticle.length) {
        allarticle = await ArticleModel.find({}).sort({}).skip(Number(curPage - 2) * pageSize).limit(Number(pageSize))
        curPage = Number(curPage) - 1
      } else {
        curPage = Number(curPage)
      }
      res.send({
        code: 200,
        success: true,
        // status: 1,
				data: {
          list: allarticle,
          count: count,
          curPage: curPage
        },
        message: '获取文章列表成功'
			})
    } catch (err) {
      res.send({
        status: 0,
        success: false,
				type: 'ERROR_GET_TAG_LIST',
				message: '获取文章列表失败'
			})
    }
  }

  async editTitle (req, res, next) {
    let {_id, title} = req.body
    const updateDate = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
      let article = await ArticleModel.findOneAndUpdate({_id}, {$set: {
        title, updateDate
      }})
      if (article) {
        res.send({
          code: 200,
          success: true,
          message: '修改成功'
        })
      } else {
        res.send({
          status: 0,
          success: false,
          message: '该文章不存在(或已修改), 请刷新后重试'
        })
      }
    } catch (error) {
      res.send({
        status: 0,
        success: false,
				message: error
			})
    }
  }

}

export default new Article()