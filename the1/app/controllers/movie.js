var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ =require('underscore')
var fs = require('fs')
var path = require('path')


//detail page
exports.detail = function(req, res){
	var id = req.params.id
	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
		if (err) { console.log(err) }
	})
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
	Category.find({}, function(err ,categories) {	
		res.render('admin', {
			title: '后台页',
			categories: categories,
			movie: {}
		})
	})
}
//admin update movie
exports.update = function(req, res){
	var id = req.params.id

	if(id){
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: '后台录入页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}
//movie save poster
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname, '../../../', 'public/upload/' + poster)
			fs.writeFile(newPath, data, function(err) {
				if (err) { console.log(err) }
				req.poster = poster
				next()
			})
		})
	}
	else {
		next()
	}
}


//admin post movie
exports.save = function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if (req.poster) {
		movieObj.poster = req.poster
	}

	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			if (movieObj.category != movie.category) {
				Category.findOne({movies:id}, function(err, category){
					if (err) { console.log(err) }
					category.movies.pull(id)
					category.save(function(err, category){
						if (err) { console.log(err) }
						Category.findById(movieObj.category, function(err, category) {
							category.movies.push(movie._id)
							category.save(function(err, category){
								if (err) { console.log(err) }
							})
						})
					})
				})
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
		_movie = new Movie(movieObj)
		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName
		//优先存储categoryId  即选择的分类不是填写的分类
		_movie.save(function(err, movie){
			if (err) {
				console.log(err)
			}
			if (categoryId) {	
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)
					category.save(function(err, category){
						res.redirect('/movie/'+movie._id)
					})
				})
			}
			else if (categoryName) {
				Category.findOne({name:categoryName}, function(err, category) {
					if (err) { console.log(err) }
					if (category) {
						category.movies.push(movie._id)
						category.save(function(err, category){
							res.redirect('/movie/' + movie._id)
						})
					}
					else {
						var newcategory = new Category({
							name: categoryName,
							movies: [movie._id]
						})
						newcategory.save(function(err, category){
							if (err) { console.log(err) }
							res.redirect('/movie/' + movie._id)
						})
					}
				})
			}
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