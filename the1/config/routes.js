var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')


module.exports = function(app){

	// pre handle user
	app.use(function(req, res, cb){
		var _user = req.session.user
		app.locals.user = _user

		return cb()
	})

	//Index
	app.get('/', Index.index)

	//User
	app.post('/user/signup', User.signup)
	app.get('/admin/userlist', User.list)
	app.post('/user/signin', User.signin)
	app.get('/logout', User.logout)

	//Movie
	app.get('/movie/:id', Movie.detail)
	app.get('/admin/movie', Movie.new)
	app.get('/admin/update/:id', Movie.update)
	app.post('/admin/movie/new', Movie.save)
	app.get('/admin/list', Movie.list)
	app.delete('/admin/list', Movie.del)

}