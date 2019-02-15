import TagModel from '../../models/back/tag'
import moment from 'moment'

class Tag {
  constructor () {
    this.search = this.search.bind(this)
    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
  }

  async search (req, res, next) {
    let {pageSize = 10, curPage = 1} = req.query
    try {
      let allTag = await TagModel.find({}).sort({}).skip(Number(curPage - 1) * pageSize).limit(Number(pageSize))
      const count = await TagModel.count()
      if (curPage > 1 && !allTag.length) {
        allTag = await TagModel.find({}).sort({}).skip(Number(curPage - 2) * pageSize).limit(Number(pageSize))
        curPage = Number(curPage) - 1
      } else {
        curPage = Number(curPage)
      }
      res.send({
        code: 200,
        success: true,
				data: {
          list: allTag,
          count: count,
          curPage: curPage
        },
			})
    } catch (err) {
      res.send({
        status: 0,
        success: false,
				type: 'ERROR_GET_TAG_LIST',
				message: '获取标签列表失败'
			})
    }
  }

  async add (req, res, next) {
    const {name} = req.body
    try {
      const tag = await TagModel.findOne({name})
      if (tag) {
        res.send({
          status: 0,
          success: false,
          type: 'TAG_HAS_EXIST',
          message: '该标签已经存在'
        })
      } else {
        const createDate = moment().format('YYYY-MM-DD HH:mm:ss')
        const newTag = {
          name,
          createDate,
          relatedCount: 0,
          invisible: true
        }
        await TagModel.create(newTag)
        res.send({
          code: 200,
          success: true,
          message: '新建标签成功'
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

  async delete (req, res, next) {
    const { _id } = req.body
    try {
      const tag = await TagModel.findOne({_id})
      if (tag) {
        await TagModel.deleteOne(tag)
        res.send({
          code: 200,
          success: true,
          message: '该标签删除成功'
        })
      } else {
        res.send({
          status: 0,
          success: false,
          message: '该标签不存在(或已删除)，请刷新后重试'
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

  async edit (req, res, next) {
    const {_id, ...row} = req.body
    console.log(_id)
    console.log(req.body)
    console.log(row)
    try {
      let tag = await TagModel.findOneAndUpdate({_id}, {$set: row})
      if (tag) {
        res.send({
          code: 200,
          success: true,
          message: '修改成功'
        })
      } else {
        res.send({
          status: 0,
          success: false,
          message: '该标签不存在(或已修改), 请刷新后重试'
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

export default new Tag()