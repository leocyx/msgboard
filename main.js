var content, title
// var posts = []

async function main () {
  f6.route(/^$/, list)
    .route(/^post\/new/, add)
    .route(/^post/, create)
  await f6.onload(init)
}

function init() {
  title = f6.one('title')
  content = f6.one('#content')
}

function input(){
	var theme = document.getElementById("addtheme");
	var name = document.getElementById("addname");
	var content = document.getElementById("addBody");
	if(theme.value==''||name.value==''||content.value=='')alert("請每一項都完成輸入");
	else create();
}

async function remove(){
	var remove = {}
	await f6.ojax({method: 'POST', url: '/remove'},remove)
	f6.go('')
}
async function add () {
  title.innerHTML = '新增留言'
  content.innerHTML = `
  <h1>請填寫以下</h1>
  <form>
    <p><input id="addtheme" type="text" placeholder="主題" name="theme"></p>
	<p><input id="addname" type="text" placeholder="留言人" name="name"></p>
    <p><textarea id="addBody" placeholder="內容" name="body"></textarea></p>
    <p><input type="button" value="留言" onclick="input()"></p>
  </form>
  `
}


async function create () {
  var post = {
    theme: f6.one('#addtheme').value,
	name: f6.one('#addname').value,
    body: f6.one('#addBody').value,
    created_at: new Date()
  }
  console.log(`create:post=${JSON.stringify(post)}`)
  await f6.ojax({method: 'POST', url: '/post'}, post)
//  posts.push(post)
  f6.go('') // list #
}


async function list () {
  var posts = await f6.ojax({method: 'GET', url: '/'})
  title.innerHTML = '留言板'
  content.innerHTML =
  `
  <h1 align="center">有話請說</h1>
  <p><input type="button" value="我要留言" onclick="location.href='#post/new'"></p>
  <p><input type="button" value="刪除留言" onclick="remove()"></p>
  <ul id="posts">
    ${posts.map(post => `
      <div>
        <h3>主題:<p>${post.theme}</p></h2>
		<hr>
		<h3>留言者:<p>${post.name}(${post.created_at})</h2>
		<hr>
        <h3>留言內容:<br><p>${post.body}</p></h3>
		 <!--<p><input type="button" value="刪除留言" onclick="deletemsg(${post._id})"></p>-->
      </div>
    `).join('\n')}
  </ul>
  `
}

main()
