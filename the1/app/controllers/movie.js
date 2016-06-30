var Movie = require('../models/movie')
var Comment = require('../models/comment')
var _ =require('underscore')


//detail page
exports.detail = function(req, res){
	var id = req.params.id

	Movie.findById(id, function(err, movie){
		if (err) {
			console.log(err)
			res.render('404', {
				title: '404',
			})
		}
		Comment
			.find({movie: id})
			.populate('from', 'name')//填充comment中的from字段添加至name属性
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){
				console.log(comments)
				res.render('detail', {
					title: '详情页'+movie.title,
					movie: movie,
					comments: comments
				})
			})	
	})
}

//admin page
exports.new = function(req, res){
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
			language: '',
		}
	})
}
//admin update movie
exports.update = function(req, res){
	var id = req.params.id

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台录入页',
				movie: movie
			})
		})
	}
}
//admin post movie
exports.save = function(req, res){
	//console.log(req.body)
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(id!== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			//  _.extend underscore框架封装的方法 将第二个参数的属性
			//  按顺序复制到第一个参数中，若存在相同属性则覆盖
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
}

//list page
exports.list = function(req, res){

	Movie.fetch(function(err, movies){
		if (err) { console.log(err) }
		res.render('list', {
			title: '列表页',
			movies: movies
		})
	})
	
}

//list delete movie
exports.del = function(req, res){
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
}