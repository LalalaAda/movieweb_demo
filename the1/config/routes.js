var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')


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
	app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)
	app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del)
	app.post('/user/signin', User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	app.get('/logout', User.logout)

	//Movie
	app.get('/movie/:id', Movie.detail)
	app.get('/admin/movie/new', Movie.new)
	app.get('/admin/movie/update/:id', Movie.update)
	app.post('/admin/movie/save', Movie.savePoster, Movie.save)
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

	//Comment
	app.post('/user/comment', User.signinRequired, Comment.save)

	//Category
	app.get('/admin/category/new', User.signinRequired, Category.new)
	app.post('/admin/category/save', User.signinRequired, Category.save)
	app.get('/admin/category/list', User.signinRequired, Category.list)

	//results
	app.get('/results', Index.search)

}