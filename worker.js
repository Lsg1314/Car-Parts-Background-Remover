// 完整的 Worker 代码 - 复制到 Cloudflare Dashboard

const REDIRECT_URI = 'https://carpartsbackgroundremover.com/auth/google/callback';

// 简化的首页 HTML（包含定价链接）
const INDEX_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Car Parts BG Remover</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}
.container { 
  background: white;
  border-radius: 24px;
  padding: 40px;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.nav { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}
.nav a { 
  margin-left: 24px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.nav a:hover { color: #764ba2; }
.user-bar { 
  display: none;
  align-items: center;
  gap: 12px;
}
.user-bar img { 
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #667eea;
}
.logout-btn { 
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 8px 20px;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}
.logout-btn:hover { 
  background: #667eea;
  color: white;
}
.login-area { 
  text-align: center;
  padding: 80px 20px;
}
.google-btn { 
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 2px solid #ddd;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.google-btn:hover { 
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
.main-area { display: none; }
h1 { 
  color: #667eea;
  font-size: 28px;
  font-weight: 700;
}
.upload-box {
  border: 3px dashed #667eea;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  transition: all 0.3s;
  cursor: pointer;
}
.upload-box:hover {
  border-color: #764ba2;
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  transform: translateY(-2px);
}
.upload-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}
#preview img, #resultImg {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
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
    <h2 style="font-size:36px;color:#333;margin-bottom:16px;font-weight:700;">AI Car & Auto Parts Photo Editor for Listings</h2>
    <p style="font-size:18px;color:#666;margin-bottom:32px;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.6;">Remove backgrounds, standardize images, add clean white or showroom backdrops, and export listing-ready photos for dealers and auto parts sellers.</p>
    <a href="/auth/google" class="google-btn">
      <img src="https://www.google.com/favicon.ico" width="24">
      Login with Google
    </a>
  </div>
  
  <div class="main-area" id="mainArea">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="color:#333;margin-bottom:12px;font-size:32px;font-weight:700;text-align:center;">AI Car & Auto Parts Photo Editor</h2>
      <p style="color:#666;margin-bottom:32px;text-align:center;font-size:16px;">Professional listing photos in seconds</p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:40px;">
        <button onclick="document.getElementById('fileInput').click()" class="upload-btn" style="width:100%;padding:16px;">🚗 Upload Vehicle Photos</button>
        <button onclick="document.getElementById('fileInput').click()" class="upload-btn" style="width:100%;padding:16px;">🔧 Upload Auto Parts Photos</button>
      </div>
      
      <div class="upload-box" onclick="document.getElementById('fileInput').click()">
        <input type="file" id="fileInput" accept="image/*" style="display:none;">
        <div style="font-size:48px;margin-bottom:16px;">📸</div>
        <p style="color:#888;font-size:14px;">Click or drag and drop your images here</p>
        <p style="margin-top:8px;color:#aaa;font-size:12px;">Supports JPG, PNG (Max 10MB)</p>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:40px;">
        <div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;">
          <div style="font-size:32px;margin-bottom:8px;">⚡</div>
          <h4 style="color:#667eea;margin-bottom:8px;font-size:14px;">Batch Processing</h4>
          <p style="color:#888;font-size:12px;">Process multiple images at once</p>
        </div>
        <div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;">
          <div style="font-size:32px;margin-bottom:8px;">⬜</div>
          <h4 style="color:#667eea;margin-bottom:8px;font-size:14px;">White Background</h4>
          <p style="color:#888;font-size:12px;">Clean white backdrop export</p>
        </div>
        <div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;">
          <div style="font-size:32px;margin-bottom:8px;">🏷️</div>
          <h4 style="color:#667eea;margin-bottom:8px;font-size:14px;">Dealer Branding</h4>
          <p style="color:#888;font-size:12px;">Add your logo and watermark</p>
        </div>
        <div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;">
          <div style="font-size:32px;margin-bottom:8px;">📐</div>
          <h4 style="color:#667eea;margin-bottom:8px;font-size:14px;">Marketplace-Ready</h4>
          <p style="color:#888;font-size:12px;">Perfect sizes for all platforms</p>
        </div>
      </div>
      
      <div id="preview" style="display:none;margin-top:32px;">
        <img id="previewImg" style="max-width:100%;margin-bottom:20px;">
        <button id="processBtn" onclick="processImage()" class="upload-btn" style="width:100%;">🚀 Remove Background</button>
      </div>
      <div id="result" style="display:none;margin-top:32px;">
        <h3 style="color:#667eea;margin-bottom:16px;">✅ Processing Complete</h3>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
          <div>
            <p style="color:#888;font-size:14px;margin-bottom:8px;">Original</p>
            <img id="originalImg" style="max-width:100%;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          </div>
          <div>
            <p style="color:#888;font-size:14px;margin-bottom:8px;">Result</p>
            <img id="resultImg" style="max-width:100%;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          </div>
        </div>
        
        <div style="margin-bottom:20px;">
          <label style="display:block;color:#667eea;font-weight:600;margin-bottom:12px;">Background:</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <button onclick="setBackground('transparent')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><rect fill=\"%23ccc\" width=\"10\" height=\"10\"/><rect fill=\"%23ccc\" x=\"10\" y=\"10\" width=\"10\" height=\"10\"/><rect fill=\"%23fff\" x=\"10\" width=\"10\" height=\"10\"/><rect fill=\"%23fff\" y=\"10\" width=\"10\" height=\"10\"/></svg>');cursor:pointer;">Transparent</button>
            <button onclick="setBackground('white')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;">Pure White</button>
            <button onclick="setBackground('gray')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:#f5f5f5;cursor:pointer;">Light Gray</button>
            <button onclick="setBackground('shadow')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);cursor:pointer;">Studio Shadow</button>
            <button onclick="setBackground('outdoor')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:#e8e8e0;cursor:pointer;">Outdoor Neutral</button>
            <button onclick="setBackground('showroom')" class="bg-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:linear-gradient(135deg, #2c3e50 0%, #34495e 100%);color:#fff;cursor:pointer;">Dealer Showroom</button>
          </div>
        </div>
        
        <div style="margin-bottom:20px;">
          <label style="display:block;color:#667eea;font-weight:600;margin-bottom:12px;">Export Format:</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <button onclick="setFormat('png')" class="format-option active" style="padding:12px;border:2px solid #667eea;border-radius:8px;background:#f8f9ff;cursor:pointer;font-weight:600;">PNG (Transparent)</button>
            <button onclick="setFormat('jpg')" class="format-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;">JPG (Compressed)</button>
            <button onclick="setFormat('webp')" class="format-option" style="padding:12px;border:2px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;">WebP (Lightweight)</button>
          </div>
        </div>
        
        <button onclick="downloadResult()" class="upload-btn" style="width:100%;">⬇️ Download Image</button>
      </div>
    </div>
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
let selectedFile = null;
let processedBlob = null;
let currentBg = 'transparent';
let currentFormat = 'png';

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

document.getElementById('fileInput')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('preview').style.display = 'block';
      document.getElementById('result').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

async function processImage() {
  if (!selectedFile) return;
  const btn = document.getElementById('processBtn');
  btn.disabled = true;
  btn.textContent = 'Processing...';
  
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    const res = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      processedBlob = await res.blob();
      const url = URL.createObjectURL(processedBlob);
      document.getElementById('originalImg').src = document.getElementById('previewImg').src;
      document.getElementById('resultImg').src = url;
      document.getElementById('result').style.display = 'block';
    } else {
      alert('Error: ' + await res.text());
    }
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Remove Background';
  }
}

function downloadResult() {
  const img = document.getElementById('resultImg');
  const a = document.createElement('a');
  a.href = img.src;
  a.download = 'removed-bg.' + currentFormat;
  a.click();
}

function setBackground(bg) {
  currentBg = bg;
  const img = document.getElementById('resultImg');
  const backgrounds = {
    transparent: 'transparent',
    white: '#ffffff',
    gray: '#f5f5f5',
    shadow: 'linear-gradient(to bottom, #fff 0%, #f0f0f0 100%)',
    outdoor: '#e8e8e0',
    showroom: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
  };
  img.style.background = backgrounds[bg];
  document.querySelectorAll('.bg-option').forEach(btn => {
    btn.style.borderColor = '#ddd';
    btn.style.borderWidth = '2px';
  });
  event.target.style.borderColor = '#667eea';
  event.target.style.borderWidth = '3px';
}

function setFormat(format) {
  currentFormat = format;
  document.querySelectorAll('.format-option').forEach(btn => {
    btn.style.borderColor = '#ddd';
    btn.style.background = '#fff';
  });
  event.target.style.borderColor = '#667eea';
  event.target.style.background = '#f8f9ff';
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
    if (url.pathname === '/api/remove-bg') {
      return handleRemoveBg(request, env);
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

  // 使用 Google UserInfo API 获取用户信息（避免 JWT 解码问题）
  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
  });
  const userInfo = await userInfoRes.json();
  
  const user = {
    google_id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
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

async function handleRemoveBg(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const sessionToken = getCookie(request, 'session');
  if (!sessionToken) {
    return new Response('Not logged in', { status: 401 });
  }

  const session = await env.DB.prepare(`SELECT google_id FROM sessions WHERE token = ?`).bind(sessionToken).first();
  if (!session) {
    return new Response('Invalid session', { status: 401 });
  }

  const quota = await env.DB.prepare(`SELECT total, used FROM quotas WHERE google_id = ?`).bind(session.google_id).first();
  if (!quota || quota.used >= quota.total) {
    return new Response('Quota exceeded', { status: 403 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get('image');
    
    const newFormData = new FormData();
    newFormData.append('image_file', image);
    newFormData.append('size', 'auto');
    
    const apiRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': env.REMOVEBG_API_KEY
      },
      body: newFormData
    });

    if (!apiRes.ok) {
      const error = await apiRes.text();
      return new Response('API error: ' + error, { status: 500 });
    }

    await env.DB.prepare(`UPDATE quotas SET used = used + 1 WHERE google_id = ?`).bind(session.google_id).run();

    return new Response(await apiRes.blob(), {
      headers: { 'Content-Type': 'image/png' }
    });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}
