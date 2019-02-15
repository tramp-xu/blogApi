module.exports = {
  port: 27017,
  database: 'mongodb://localhost/blogApiServer',
  session: {
    name: 'TsuiBlog',
    secret: 'TsuiBlog',
    cookie: {
      maxAge: 1000 * 60 * 24
    }
  }
}