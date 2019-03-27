import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleSchema = new Schema({
	title: String,
	subTitle: String,
	content: String,
	tags: Array,
	createDate: String,
	updateDate: String,
	invisible: Boolean
})

const Article = mongoose.model('Article', articleSchema)

export default Article