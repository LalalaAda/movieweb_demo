var Category = require('../models/category')

//index page
exports.index = function(req, res){

	Category
		.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categorites){
			if(err){console.log(err)}
			console.log(categorites.length)
			res.render('index', {
				title: '电影首页',
				categorites: categorites
			})
		})
	
}