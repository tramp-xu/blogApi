import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema({
  userName: String,
	password: String,
	uid: String,
	createTime: String,
	adminTip: {type: String, default: '管理员'},
	status: Number,  //1:普通管理、 2:超级管理员
	avatar: {type: String, default: 'default.jpg'},
	city: String,

	profile: {
		name: String,
		gender: String,
		location: String,
		website: String,
		picture: String
	}
})

adminSchema.index({id: 1})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin