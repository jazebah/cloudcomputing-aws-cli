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

// Get total posts count
router.get('/api/posts-summary/count', async (ctx) => {
  ctx.body = { totalPosts: db.posts.length };
});

// Get posts count by thread
router.get('/api/posts-summary/thread/:threadId', async (ctx) => {
  const threadId = parseInt(ctx.params.threadId);
  const count = db.posts.filter(post => post.thread === threadId).length;
  ctx.body = { threadId, postCount: count };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001, () => console.log('Posts Summary Service started on port 3001'));
