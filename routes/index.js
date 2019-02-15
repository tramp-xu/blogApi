import admin from './admin'
import back from './back/index'

export default app => {
	app.use('/api/admin', admin);
	app.use('/api/back', back);
}