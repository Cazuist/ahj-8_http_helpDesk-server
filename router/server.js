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
  //multipart: true,
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
  
    ctx.response.status = 204;
  }
});

app.use(async (ctx) => { 
  const { method } = ctx.request.query;

  if (method === 'allTicket') {
    ctx.response.body = ctx.request.method;
    //ctx.response.body = fs.readFileSync("./router/db/ticket.json", "utf8");
    return;
  }

  ctx.response.body = 'POST';
});

const server = http.createServer(app.callback()).listen(port);