var express = require('express')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movieweb')

app.set('views', 'the1/views/pages')
app.set('view engine', 'jade')
//app.use(express.bodyParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//app.use(express.static(path.join(__dirname, 'bower_components')))
//console.log(path.join(__dirname,'bower_components'))
//console.log(__dirname)
app.use(serveStatic('public'))//取决于你是怎么启动app.js的若在movieweb/下通过the1/app.js启动则是这样
app.locals.moment = require('moment')
app.listen(port)
console.log('server started on port ' + port)

//index page
app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){console.log(err)}
		res.render('index', {
			title: '电影首页',
			movies: movies
		})
	})
	
})

//signup
app.post('/user/signup', function(req, res){
	var _user = req.body.user
	//  /user/signup/1111?userid=1112
	//  req.query.userid  req.query.userid
	//  /user/signup/:userid
	//  req.params.userid  req.param('userid')
	//  /user/signup/111?userid=112 {userid:113}
	//  req.params.userid  优先路由111，再body里113，再query里112

	User.findOne({name: _user.name}, function(err, user){
		if (err) console.log(err)
		if (user) {
			return res.redirect('/')
		}else {
			var user = new User(_user)
			user.save(function(err, user){
				if (err) console.log(err)
				res.redirect('/admin/userlist')
			})
		}
	})
})
//userlist page
app.get('/admin/userlist', function(req, res){

	User.fetch(function(err, user){
		if (err) { console.log(err) }
		res.render('userlist', {
			title: '用户列表页',
			users: user
		})
	})
	
})

// signin
app.post('/user/signin', function(req, res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name: name}, function(err, user){
		if (err) console.log(err)
		if (!user) {
			return res.redirect('/')
		}
		user.comparePassword(password, function(err, isMatch){
			if (err) { console.log(err) }
			if (isMatch) {
				console.log('password is matched')
				return res.redirect('/')
			}
			else {
				console.log("password is not matched")
				return res.redirect('/')
			}
		})
	})
})

//detail page
app.get('/movie/:id', function(req, res){
	var id = req.params.id

	Movie.findById(id, function(err, movie){
		if (err) {
			console.log(err)
			res.render('404', {
				title: '404',
			})
		}else{
			res.render('detail', {
				title: '详情页'+movie.title,
				movie: movie
			})
		}
	})
})

//admin page
app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title: '后台页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})
//admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台录入页',
				movie: movie
			})
		})
	}
})
//admin post movie
app.post('/admin/movie/new', function(req, res){
	//console.log(req.body)
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(id!== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	}else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function(err, movie){
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
})

//

//list page
app.get('/admin/list', function(req, res){

	Movie.fetch(function(err, movies){
		if (err) { console.log(err) }
		res.render('list', {
			title: '列表页',
			movies: movies
		})
	})
	
})

//list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id

	if (id) {
		Movie.remove({_id:id}, function(err, movie){
			if (err) {
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})