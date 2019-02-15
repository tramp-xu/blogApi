import mongoose from 'mongoose'

const Schema = mongoose.Schema

const tagSchema = new Schema({
	name: String,
	createDate: String,
	relatedCount: Number,
	tagLevel: Number,
	invisible: Boolean
})

const Tag = mongoose.model('Tag', tagSchema)

export default Tag