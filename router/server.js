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

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };
  
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
  
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
  
    ctx.response.status = 204; // No content
  }
});

app.use(async (ctx) => {
  console.log(ctx.request.querystring);
  console.log(ctx.request.body);
  ctx.response.body = 'server response 2';

  console.log("Синхронное чтение файла")
  let fileContent = fs.readFileSync("./server/db/db.txt", "utf8");
  console.log(fileContent);
});

const server = http.createServer(app.callback()).listen(port);