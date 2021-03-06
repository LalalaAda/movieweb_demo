var express = require('express')
var multipart = require('connect-multiparty')
var logger = require('morgan')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var path = require('path')
var fs = require('fs')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dburl = 'mongodb://127.0.0.1/movieweb'

mongoose.connect(dburl)

//models loading
var models_path = __dirname + '/app/models'
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file
			var stat = fs.statSync(newPath)

			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath)
				}
			}
			else if (stat.isDirectory()) {
				walk(newPath)
			}
		})
}
walk(models_path)



app.set('views', 'the1/app/views/pages')
app.set('view engine', 'jade')
//app.use(express.bodyParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(cookieParser())
app.use(session({
	secret: 'okok',
	resave: true,
  	saveUninitialized: true,
	store: new mongoStore({
		url: dburl,
		collection: 'sessions'
	})
}))
app.use(multipart())

if ("development" === app.get('env')) {
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

//app.use(express.static(path.join(__dirname, 'bower_components')))
//console.log(path.join(__dirname,'bower_components'))
//console.log(__dirname)
app.use(serveStatic('public'))//取决于你是怎么启动app.js的若在movieweb/下通过the1/app.js启动则是这样
app.locals.moment = require('moment')

require("./config/routes")(app)

app.listen(port)
console.log('server started on port ' + port)

