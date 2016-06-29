var User = require('../models/user')

//signup
exports.showSignin = function(req, res){
	res.render('signin', {
		title: '用户登录页',
	})
}
exports.showSignup = function(req, res){
	res.render('signup', {
		title: '用户注册页'
	})
}

exports.signup = function(req, res){
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
}
//userlist page
exports.list = function(req, res){

	User.fetch(function(err, user){
		if (err) { console.log(err) }
		res.render('userlist', {
			title: '用户列表页',
			users: user
		})
	})
	
}

// signin
exports.signin = function(req, res){
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
				req.session.user = user
				return res.redirect('/')
			}
			else {
				console.log("password is not matched")
				return res.redirect('/')
			}
		})
	})
}

//logout
exports.logout = function(req, res){
	delete req.session.user
	return res.redirect('/')
}