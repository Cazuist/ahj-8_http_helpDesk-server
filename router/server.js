const http = require('http');
const fs = require("fs");
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const port = process.env.PORT || 7070;
const public = path.join(__dirname, '/public');

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async (ctx) => {
  console.log(ctx.request.querystring);
  console.log(ctx.request.body);
  ctx.response.body = 'server response 2';

  console.log("Синхронное чтение файла")
  let fileContent = fs.readFileSync("./server/db/db.txt", "utf8");
  console.log(fileContent);
});

const server = http.createServer(app.callback()).listen(7070);

/*const server = http.createServer((request, response) => {
  console.log(request);
  response.end(request.url.slice(0, 5));
});



server.listen(port, (err) => {
  if(err) {
    console.log('Error occured: ', err);
    return;
  }

  console.log(`Server is listening on port ${port}`);
});*/