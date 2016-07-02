#movieweb_demo create in my pc
项目使用
npm install
然后 在命令行中输入
grunt
即可
数据库采用的是MongoDB 数据库名:movieweb


=============================一些问题提示==================================
#1 Node.js里面怎么设置process.env.PORT的值
	1.linux环境下：$PORT=1234 node app.js
		使用上面的命令需要每次都设置，若想设置一次永久生效可以
		$export PORT=1234
		$node app.js
	2.widows环境下：
		set PORT=1234
		node app.js
-----------------------------------------------------------------
#2 这个项目用到的库
	node install express jade moment mogoose
	node install bower -g
	bower install bootstrap
		jade改名为pug  文件后缀名改为pug即可
		使用pug时 img(src="#{item.poster}")即#{}被""括起的时候识别
		为字符串#{}而不是值，所以更改为jade继续项目
-----------------------------------------------------------------
#3 一些改动的地方
	新版express4中，要独立安装static, npm install serve-static --save
	在app.js中， var serveStatic = require('serve-static')
				app.use(serveStatic('../bower_components'))
				因为bower_components文件夹在应用目录外所以这样设置
	bodyParser已经不再与Express捆绑，需要独立安装
	npm install body-parser
	在代码中修改:	var bodyParser = require('body-parser')
					app.use(bodyParser.urlencoded({extended:true}))
-----------------------------------------------------------------
#4 注意回调函数中参数大部分情况是req写前面
	function(req, res){}
-----------------------------------------------------------------
#5 配置.bowerrc文件
{
	"directory":"public/libs"
}
	主要是将静态资源归为一个文件夹 统一管理
------------------------------------------------------------------
#6 安装grunt
	开始建站第二期视频
	npm install grunt -g
	npm install grunt-cli -g
	然后在项目文件夹中安装（这个是在movieweb/）
	npm install grunt
	npm install grunt-contrib-watch --save-dev
	npm install grunt-nodemon --save-dev
	npm install grunt-concurrent --save-dev
	编写gruntfile.js
	与视频当中不一样的是在nodemon 这个中要写
	dev: {
				script: 'the1/app.js',
				options: {
					file: 'the1/app.js',
	//要写上script： 'the1/app.js',  有逗号哦，不然会报错
	SyntaxError: Unexpected identifier
	注意 这个一般代表语法错误 也就是少了逗号之类的 嘿嘿就是上面的

	mongodb的启动(本人电脑上)
	cd c:\MyProgram\MongoDB\SERVER\bin
	mongod.exe --dbpath c:\dbdata\db
-------------------------------------------------------------------
#7 由于视频中的bcrypt不能安装所以转用bcryptjs
	操作流程差不多 
-------------------------------------------------------------------
#8 遇到的User.find( , function(err, user){})
	传入的参数是正常的但是查找不出数据 它返回的user却是[]
	导致注册user新用户也跳转至首页
	解决办法一：User.findOne()
	二：if(user)====> if(user.length)
-------------------------------------------------------------------
#9 使用mongoose过程中遇到的疑惑
	在运行项目过程中，一直很好奇新注册的用户是如何插入mongodb数据库中的。
	查看源码发现原来是通过mongoose来与mongodb进行操作的。而mongoose是通
	过model来创建mongodb中对应的collection的，这样你通过如下的代码：
	mongoose.model('User', UserSchema);
	在相应的数据库中创建一个collection时，第一反应肯定会推断在对应的数据
	库中会建立一个‘User’的collection，但是事实却与推断完全不一样，这也
	是一直困扰我两的问题，我通过在mongodb的命令行中试图去寻找我刚新建的
	collection，代码如下：
	use node_club show collections //只能看到有一个名为users的col
	-lection，而没有User的collection
	由此我们可以推断mongoose在内部创建collection时将我们传递的
	collection名小写化，同时如果小写化的名称后面没有字母——s,则会在其后面
	添加一s,针对我们刚建的collection,则会命名为：users
解决办法（两种)：
	1.xxschema = new Schema({
			…
		}, {collection: “your collection name”});

	2.mongoose.model(‘User’, UserSchema, “your collection name”);
-------------------------------------------------------------------
#10 cookie session需要安装组件  express 4.x 不集成
	npm install express-session
	npm install cookie-parser

	var session = require('express-session')
	var cookieParser =require('cookie-parser')
	var mongoStore = require('connect-mongo')(session)
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
------------------------------------------------------------------
#11 关于Underscore
	Underscore是一个非常实用的JavaScript库，提供许多编程时需要的功能的
	支持，他在不扩展任何JavaScript的原生对象的情况下提供很多实用的功能。
------------------------------------------------------------------
#12 express 4 分离了中间件logger
	npm install morgan --save

	var logger = require('morgan')
------------------------------------------------------------------
#13 豆瓣v2的API
	关于电影的信息api
	是https://api.douban.com/v2/movie/subject/ + id
	传递回来的是jsonp数据
	用ajax接收解析
	$.ajax({
		url: 'https://api.douban.com/v2/movie/subject/' + id,
		cache: true,
		type: 'get',
		dataType: 'jsonp',
		crossDomain: true,
		jsonp: 'callback',
		success: function(data) {
			//在这里解析数据
		}
	})
------------------------------------------------------------------
#14 substring() slice()方法
	前者两个参数 非负  1.截取字符串起始位置2.起始位置加1
	后者两个参数 可负  1.起始位置2.结束位置
	范例
	    var str = "abcd"
	    str1 = str.substring(0,2)    ===> "ab"
	    str2 = str.slice(-2,-1)  ===> "c"
	注意 slice()方法的参数位置始终是start,end  所以（-1，-2）是错误的
	截取不到任何字符，因为是从-1 即倒数第一个开始向后截取，自然没有字符
	可以截取
------------------------------------------------------------------
#15 mongodb 查询数组的方法
	可以把数组当作成键值对
	例子：
	db.food.insert({“_id”:1, “fruit”:["apple","banana","peach"]})
	db.food.insert({“_id”:2, “fruit”:["apple","kumquat","orange"]})

	db.food.find({"fruit": "apple"})
	{ “_id” : 1, “fruit” : [ "apple", "banana", "peach" ] }
	{ “_id” : 2, “fruit” : [ "apple","kumquat","orange" ] }

	删除的话用
	db.food.update({_id:id}, {$pull:{"fruit":"apple"}})
------------------------------------------------------------------
#16 在jade中 写内部js
	- for (var i = 0; i < totalPage; i++){
		- if (currentPage == (i + 1)) {
			li.active
				span #{currentPage}
		- }
		- else {
			li
				a(href='results?#{query}&p=#{i}') #{i + 1}
		- }
	- }
	在js代码前加 - 

	Math.ceil()方法向上取整 意思就是0.1为1 
-------------------------------------------------------------------
#17 express 4.x以后可以使用 connect-multiparty 中间件来获取 req.files
	npm install connect-multiparty --save

	var multipart = require('connect-multiparty');
	app.use(multipart());

	mongodb中字段值增加 &inc
	修改器$inc可以对文档的某个值为数字型（只能为满足要求的数字）的键进行
	增减的操作。
	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
		if (err) { console.log(err) }
	})
-------------------------------------------------------------------
#18  mocha 单元测试模块
	npm install grunt-mocha-test  --save
	should 模块需要安装
	npm install should

	app.js中有个函数用来遍历所有的模块
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
-------------------------------------------------------------------
