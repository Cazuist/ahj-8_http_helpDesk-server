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

/*app.use(async (ctx, next) => {
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
});*/
let tickets = [{
  id: 1, name: 'text', description: 'Описание1', status: false, created: '1.01.01',
}, {
  id: 2, name: 'text2', description: 'Описание2', status: false, created: '1.01.01',
}, {
  id: 3, name: 'text3', description: 'Описание3', status: false, created: '1.01.01',
}];


app.use(async (ctx) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': ['DELETE', 'PUT', 'PATCH'],
  });

  if (ctx.request.method === 'GET') {
    if (ctx.request.querystring === 'tickets') {
      ctx.response.body = tickets;
    } else {
      const id = Number(ctx.request.querystring.slice(9));
      let ticket = tickets.filter(tick => tick.id == id);
      ctx.response.body = ticket[0].description;
    }
  } else if (ctx.request.method === 'POST') {
    const ticked = JSON.parse(ctx.request.body);
    const id = [];
    let newId = 10;
    for (const elem of tickets) {
      id.push(elem.id);
    }
    for (let i = 0; i <= id.length; i += 1) {
      if (id.indexOf(i) === -1) {
        newId = i;
        break;
      }
    }
    ticked.id = newId;
    tickets.push(ticked);
    ctx.response.body = newId;
  } else if (ctx.request.method === 'OPTIONS') {
    ctx.response.body = '';
  } else if (ctx.request.method === 'DELETE') {
    const id = Number(ctx.request.querystring.slice(9));
    tickets = tickets.filter(tick => tick.id != id);
    ctx.response.body = '';
  } else if (ctx.request.method === 'PUT') {
    const id = Number(ctx.request.querystring.slice(9));
    const nameDescript = JSON.parse(ctx.request.body);
    for (const elem of tickets) {
      if (elem.id === id) {
        elem.name = nameDescript.name;
        elem.description = nameDescript.description;
        break;
      }
    }
    ctx.response.body = '';
  } else if (ctx.request.method === 'PATCH') {
    const id = ctx.request.body;
    const ticket = tickets.filter(tick => tick.id == id);
    if (ticket[0].status) {
      tickets[tickets.indexOf(ticket[0])].status = false;
    } else {
      tickets[tickets.indexOf(ticket[0])].status = true;
    }

    ctx.response.body = tickets[tickets.indexOf(ticket[0])].status;
}

const server = http.createServer(app.callback()).listen(port);