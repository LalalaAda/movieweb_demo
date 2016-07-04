var Category = require('../models/category')
var Movie = require('../models/movie')

//index page
exports.index = function(req, res){

	Category
		.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categorites){
			if(err){console.log(err)}
			res.render('index', {
				title: '电影首页',
				categorites: categorites
			})
		})
	
}
//index search 根据分类查找，根据关键词查找
exports.search = function(req, res){
	var catId = req.query.cat
	var page = parseInt(req.query.p, 10) || 0
	var q = req.query.q
	var count = 2
	var index = page * count
	if (catId) {
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				//- options: {limit: 2, skip: index}
			})
			.exec(function(err, categorites){
				if(err){console.log(err)}

				var category = categorites[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + count)

				res.render('results', {
					title: '结果列表页',
					keyword: category.name,
					currentPage: (page + 1),
					query: 'cat=' + catId,
					totalPage: Math.ceil(movies.length / 2),
					movies: results
				})
			})
	}
	else {
		Movie
			.find({title: new RegExp( q + '.*', 'i')})
			.exec(function(err, movies){
				if(err){console.log(err)}

				var results = movies.slice(index, index + count)

				res.render('results', {
					title: '结果列表页',
					keyword: "关键词:  " + q,
					currentPage: (page + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / 2),
					movies: results
				})
			})
	}
}