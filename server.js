var Koa = require('koa')
var Router = require('koa-router')
var logger = require('koa-logger')
var koaStatic = require('koa-static')
var bodyParser = require('koa-bodyparser')
var mongodb = require('mongodb')

var db, postsTable

var app = new Koa()
var router = new Router()

app.use(bodyParser())
app.use(logger())


router
  .get('/', listPosts)
  .get('/post/:id', getPost)
  .post('/post', createPost)
  .post('/remove', remove)

async function listPosts (ctx) {
  var posts = await postsTable.find({}).toArray()
  ctx.body = JSON.stringify(posts)
}

async function getPost (ctx) {
  try {
    var id = ctx.params.id
    var post = await postsTable.findOne({_id: new mongodb.ObjectID(id)})
    if (!post) ctx.throw(404, 'invalid post id')
    ctx.body = await JSON.stringify(post)
  } catch (error) {
    ctx.throw(500)
  }
}

async function remove(ctx){
	try {
		await postsTable.remove();
		ctx.body = {}
	}
	catch(error){
		ctx.throw(500)
	}
}

async function createPost (ctx) {
  try {
    console.log('createPost:rawBody=%s', ctx.request.rawBody)
    console.log('createPost:body=%j', ctx.request.body)
    var post = ctx.request.body
	var time = new Date()
    post.created_at = time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()
    await postsTable.insert(post)
    ctx.body = JSON.stringify(post)
  } catch (error) {
    ctx.throw(500)
    ctx.body = {}
  }
}
async function main () {
  db = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/leavemsg')
  postsTable = db.collection('posts')
  app.use(router.routes()).use(koaStatic('../')).listen(3000)
}

main();
