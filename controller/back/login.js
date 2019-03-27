// 构造器
import AdminModel from '../../models/back/admin'
// crypto模块的目的是为了提供通用的加密和哈希算法
import crypto from 'crypto'
// 上传文件插件
// import formidable from 'formidable'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import config from '../../config'

// 上传头像相关依赖
import fs from 'fs'
import formidable from "formidable";
let cacheFolder = 'public/images/admin'

class Admin {
  constructor () {
    this.login = this.login.bind(this)
  }

  async login (req, res, next) {
    const {userName, password} = req.body
    const newpassword = this.encryption(password);
    console.log(newpassword)
    try {
      const admin = await AdminModel.findOne({userName})
      if (!admin) {
        res.send({
          status: 0,
          success: false,
          type: 'USER_NO_EXIST',
          message: '账号/密码错误',
        })
      } else if (newpassword.toString() != admin.password.toString()) {
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '账号/密码错误',
          success: false
        })
      } else {
        console.log(admin)
        let token = jwt.sign({uid: admin.uid}, config.session.secret, {
          expiresIn: config.session.cookie.maxAge
        })

        let {userName, uid, status} = admin
        let user = {
          userName,
          uid,
          status
        }

        res.send({
          code: 200,
          data: {
            token: token,
            user: user
          },
          success: true
        })
      }
    } catch (err) {
      res.send({
        type: 'LOGIN_ADMIN_FAILED',
        message: '登录失败',
      })
    }
  }

  async uploadAvatar (req, res, next) {
    let adminDirPath = cacheFolder
    if (!fs.existsSync(adminDirPath)) {
      fs.mkdirSync(adminDirPath) // 如不存在此目录, 创建目录
    }

    let form = new formidable.IncomingForm()
    form.encoding = 'utf-8'
    form.uploadDir = adminDirPath
    form.keepExtensions = true
    form.maxFieldsSize = 2 * 1024 * 1024
    form.type = true
    form.parse(req, (err, fields, files) => {
      if (err) return res.json(err)
      let extName = ''
      switch (files.file.type) {
        case 'image/pjpeg':
            extName = 'jpg';
            break;
        case 'image/jpeg':
            extName = 'jpg';
            break;
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
            break;
      }
      if (extName.length === 0) {
        res.send({
          success: false,
          message: '只支持png和jpg格式图片',
          type: 'ERROR_FILE_TYPE'
        })
      } else {
        let avatarName = '/' + Date.now() + '.' + extName
        let newPath = form.uploadDir + avatarName
        let oldPath = fields.file
        console.log(oldPath);
        fs.renameSync(files.file.path, newPath)
        console.log(newPath);
        AdminModel.update({uid: req.uid}, {avatar: newPath}, (err, doc) => {
          if (err) {
            res.send({
              success: false,
              message: '更新头像失败',
              type: 'ERROR_UPLODE'
            })
          } else {
            let image = fs.readFileSync(newPath).toString("base64")
            res.send({
              success: true,
              message: '更新头像成功',
              data: {
                avatar: newPath,
                file: image
              }
            })
          }
        })
      }
    })
  }

  encryption (password) {
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5 (password) {
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
}

export default new Admin()