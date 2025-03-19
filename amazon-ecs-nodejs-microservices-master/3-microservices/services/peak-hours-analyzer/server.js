const Koa = require('koa');
const Router = require('koa-router');
const db = require('./db.json');

const app = new Koa();
const router = new Router();

// Log requests
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// Analyze peak hours
router.get('/api/peak-hours', async (ctx) => {
  const peakHours = db.posts.map(post => post.timestamp)
                            .reduce((acc, time) => {
                              const hour = new Date(time).getHours();
                              acc[hour] = (acc[hour] || 0) + 1;
                              return acc;
                            }, {});

  const peakHour = Object.keys(peakHours).reduce((a, b) => peakHours[a] > peakHours[b] ? a : b);
  
  ctx.body = { peakHour, postCount: peakHours[peakHour] };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3002, () => console.log('Peak Hours Analyzer Service started on port 3002'));
