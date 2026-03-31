// 完整的 Worker 代码 - 复制到 Cloudflare Dashboard

const REDIRECT_URI = 'https://carpartsbackgroundremover.com/auth/google/callback';

// 简化的首页 HTML（包含定价链接）
const INDEX_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Car Parts BG Remover</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
.container { background: white; border-radius: 20px; padding: 40px; max-width: 1000px; margin: 0 auto; }
.nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
.nav a { margin-left: 20px; color: #667eea; text-decoration: none; }
.user-bar { display: none; align-items: center; gap: 10px; }
.user-bar img { width: 40px; height: 40px; border-radius: 50%; }
.logout-btn { background: none; border: 1px solid #ddd; padding: 6px 16px; border-radius: 20px; cursor: pointer; }
.login-area { text-align: center; padding: 60px 20px; }
.google-btn { display: inline-flex; align-items: center; gap: 10px; background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; text-decoration: none; color: #333; }
.main-area { display: none; }
h1 { color: #667eea; text-align: center; margin-bottom: 20px; }
</style>
</head>
<body>
<div class="container">
  <div class="nav">
    <h1>🚗 <a href="https://carpartsbackgroundremover.com/" style="color: #667eea; text-decoration: none;">carpartsbackgroundremover</a></h1>
    <div>
      <a href="/">Home</a>
      <a href="/pricing">Pricing</a>
      <a href="/profile" id="profileLink" style="display:none;">Profile</a>
      <div class="user-bar" id="userBar">
        <img id="userAvatar" src="">
        <span id="userName"></span>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
      </div>
    </div>
  </div>
  
  <div class="login-area" id="loginArea">
    <p style="margin-bottom:24px;">Please login to use background removal</p>
    <a href="/auth/google" class="google-btn">
      <img src="https://www.google.com/favicon.ico" width="24">
      Login with Google
    </a>
  </div>
  
  <div class="main-area" id="mainArea">
    <p style="text-align:center;color:#667eea;font-size:18px;">Upload feature coming soon!</p>
  </div>
</div>
<script src="/script.js"></script>
</body>
</html>`;
// 第二部分：个人中心页面
const PROFILE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Profile</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
.container { background: white; border-radius: 20px; padding: 40px; max-width: 800px; margin: 0 auto; }
.card { background: #f8f9ff; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card h2 { color: #667eea; font-size: 18px; margin-bottom: 16px; }
.user-info { display: flex; align-items: center; gap: 16px; }
.user-info img { width: 64px; height: 64px; border-radius: 50%; }
.quota-bar { background: #e0e0e0; height: 24px; border-radius: 12px; overflow: hidden; margin: 12px 0; }
.quota-fill { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; transition: width 0.3s; }
a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <a href="/">← Back</a>
  <h1 style="color:#667eea;margin:20px 0;">Personal Center</h1>
  
  <div class="card">
    <h2>Account Info</h2>
    <div class="user-info">
      <img id="avatar" src="">
      <div>
        <p><strong id="name"></strong></p>
        <p id="email"></p>
      </div>
    </div>
  </div>
  
  <div class="card">
    <h2>Quota Usage</h2>
    <div class="quota-bar">
      <div class="quota-fill" id="quotaFill"></div>
    </div>
    <p id="quotaText">Loading...</p>
  </div>
</div>
<script>
async function load() {
  const res = await fetch('/auth/me');
  if (!res.ok) { window.location.href = '/'; return; }
  const user = await res.json();
  document.getElementById('avatar').src = user.picture || '';
  document.getElementById('name').textContent = user.name || 'User';
  document.getElementById('email').textContent = user.email || '';
  
  const qRes = await fetch('/api/quota');
  if (qRes.ok) {
    const q = await qRes.json();
    const p = (q.used / q.total) * 100;
    document.getElementById('quotaFill').style.width = p + '%';
    document.getElementById('quotaText').textContent = 'Used ' + q.used + '/' + q.total;
  }
}
load();
</script>
</body>
</html>`;
// 第三部分：定价页面（精简版）
const PRICING_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Pricing</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px; }
.container { max-width: 1200px; margin: 0 auto; }
h1 { text-align: center; color: white; font-size: 2.5rem; margin-bottom: 48px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
.card.popular { border: 3px solid #667eea; }
.badge { background: #667eea; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 12px; }
.price { font-size: 2.5rem; color: #667eea; font-weight: 700; margin: 12px 0; }
.btn { width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.btn-secondary { background: white; color: #667eea; border: 2px solid #667eea; }
ul { list-style: none; margin: 20px 0; }
li { padding: 8px 0; color: #555; }
li:before { content: "✓"; color: #667eea; font-weight: bold; margin-right: 8px; }
a { color: white; text-decoration: none; display: inline-block; margin-bottom: 24px; }
</style>
</head>
<body>
<div class="container">
  <a href="/">← Back</a>
  <h1>Simple, Transparent Pricing</h1>
  <div class="grid">
    <div class="card">
      <h2>Free</h2>
      <div class="price">$0</div>
      <ul>
        <li>3 free credits</li>
        <li>Basic speed</li>
        <li>7-day history</li>
      </ul>
      <button class="btn btn-secondary" onclick="location.href='/'">Get Started</button>
    </div>
    <div class="card popular">
      <span class="badge">🔥 Popular</span>
      <h2>Basic</h2>
      <div class="price">$9.9<span style="font-size:1rem;color:#666;">/mo</span></div>
      <ul>
        <li>100 credits/month</li>
        <li>Priority speed</li>
        <li>30-day history</li>
        <li>Batch upload (10)</li>
      </ul>
      <button class="btn btn-primary">Upgrade</button>
    </div>
    <div class="card">
      <h2>Pro</h2>
      <div class="price">$29.9<span style="font-size:1rem;color:#666;">/mo</span></div>
      <ul>
        <li>500 credits/month</li>
        <li>Ultra-fast</li>
        <li>Unlimited history</li>
        <li>Batch upload (50)</li>
        <li>API access</li>
      </ul>
      <button class="btn btn-primary">Upgrade</button>
    </div>
  </div>
</div>
</body>
</html>`;
// 第四部分：前端 JavaScript
const SCRIPT_JS = `
async function checkAuth() {
  try {
    const res = await fetch('/auth/me');
    if (res.ok) {
      const user = await res.json();
      document.getElementById('loginArea').style.display = 'none';
      document.getElementById('userBar').style.display = 'flex';
      document.getElementById('mainArea').style.display = 'block';
      document.getElementById('profileLink').style.display = 'inline';
      document.getElementById('userAvatar').src = user.picture || '';
      document.getElementById('userName').textContent = user.name || user.email;
    } else {
      document.getElementById('loginArea').style.display = 'block';
      document.getElementById('userBar').style.display = 'none';
      document.getElementById('mainArea').style.display = 'none';
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleLogout() {
  await fetch('/auth/logout', { method: 'POST' });
  location.reload();
}

checkAuth();
`;
// 第五部分：Worker 主逻辑
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }
    if (url.pathname === '/profile') {
      return new Response(PROFILE_HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }
    if (url.pathname === '/pricing') {
      return new Response(PRICING_HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }
    if (url.pathname === '/script.js') {
      return new Response(SCRIPT_JS, { headers: { 'Content-Type': 'application/javascript' } });
    }
    if (url.pathname === '/auth/google') {
      return handleGoogleLogin(env);
    }
    if (url.pathname === '/auth/google/callback') {
      return handleCallback(request, env);
    }
    if (url.pathname === '/auth/me') {
      return handleMe(request, env);
    }
    if (url.pathname === '/auth/logout') {
      return handleLogout();
    }
    if (url.pathname === '/api/quota') {
      return handleQuota(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

function handleGoogleLogin(env) {
  const state = crypto.randomUUID();
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: {
      'Location': authUrl.toString(),
      'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    }
  });
}
// 第六部分：回调和认证处理
async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.id_token) return new Response('Token error', { status: 400 });

  const payload = JSON.parse(atob(tokenData.id_token.split('.')[1]));
  const user = {
    google_id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  await env.DB.prepare(`
    INSERT INTO users (google_id, email, name, picture, last_login)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email, name = excluded.name, picture = excluded.picture, last_login = datetime('now')
  `).bind(user.google_id, user.email, user.name, user.picture).run();

  await env.DB.prepare(`INSERT OR IGNORE INTO quotas (google_id, total, used) VALUES (?, 3, 0)`).bind(user.google_id).run();

  const sessionToken = crypto.randomUUID();
  await env.DB.prepare(`INSERT INTO sessions (token, google_id, created_at) VALUES (?, ?, datetime('now'))`).bind(sessionToken, user.google_id).run();

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    }
  });
}
// 第七部分：API 处理函数
async function handleMe(request, env) {
  const sessionToken = getCookie(request, 'session');
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { 
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await env.DB.prepare(`
    SELECT u.* FROM users u JOIN sessions s ON u.google_id = s.google_id WHERE s.token = ?
  `).bind(sessionToken).first();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { 
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(session), { headers: { 'Content-Type': 'application/json' } });
}

function handleLogout() {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    }
  });
}

async function handleQuota(request, env) {
  const sessionToken = getCookie(request, 'session');
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { 
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await env.DB.prepare(`SELECT google_id FROM sessions WHERE token = ?`).bind(sessionToken).first();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { 
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const quota = await env.DB.prepare(`SELECT total, used FROM quotas WHERE google_id = ?`).bind(session.google_id).first();
  return new Response(JSON.stringify(quota || { total: 3, used: 0 }), { headers: { 'Content-Type': 'application/json' } });
}

function getCookie(request, name) {
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
