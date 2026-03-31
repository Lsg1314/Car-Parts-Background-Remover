// 从 Cloudflare 环境变量读取（在 Dashboard 的 Workers 设置里配置）
const REDIRECT_URI = 'https://carpartsbackgroundremover.com/auth/google/callback';

// 测试页面
const TEST_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Google Login</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .login-btn { display: inline-block; padding: 12px 24px; background: #4285f4; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .status { padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Google 登录测试</h1>
    <div class="status" id="status">检查中...</div>
    <div id="loginArea" style="display:none;">
        <p>未登录</p>
        <a href="/auth/google" class="login-btn">使用 Google 登录</a>
    </div>
    <div id="userArea" style="display:none;">
        <p>已登录</p>
        <div id="userInfo"></div>
        <button onclick="logout()">退出</button>
    </div>
    <script>
        async function checkAuth() {
            try {
                const res = await fetch('/auth/me');
                document.getElementById('status').textContent = \`状态码: \${res.status}\`;
                if (res.ok) {
                    const user = await res.json();
                    document.getElementById('loginArea').style.display = 'none';
                    document.getElementById('userArea').style.display = 'block';
                    document.getElementById('userInfo').innerHTML = \`<p>姓名: \${user.name}</p><p>邮箱: \${user.email}</p>\`;
                } else {
                    document.getElementById('loginArea').style.display = 'block';
                    document.getElementById('userArea').style.display = 'none';
                }
            } catch (e) {
                document.getElementById('status').textContent = '错误: ' + e.message;
                document.getElementById('loginArea').style.display = 'block';
            }
        }
        async function logout() { await fetch('/auth/logout', { method: 'POST' }); location.reload(); }
        checkAuth();
    </script>
</body>
</html>`;

// 静态文件内容（内联）
const INDEX_HTML = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Car Parts Background Remover</title>\n    <style>\n        * { margin: 0; padding: 0; box-sizing: border-box; }\n        body {\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            min-height: 100vh;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            padding: 20px;\n        }\n        .container {\n            background: white;\n            border-radius: 20px;\n            padding: 40px;\n            max-width: 800px;\n            width: 100%;\n            box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n        }\n        h1 { color: #667eea; text-align: center; margin-bottom: 10px; font-size: 2rem; }\n        .subtitle { text-align: center; color: #666; margin-bottom: 30px; }\n\n        /* \u7528\u6237\u4fe1\u606f\u680f */\n        .user-bar {\n            display: none;\n            justify-content: flex-end;\n            align-items: center;\n            gap: 10px;\n            margin-bottom: 20px;\n            padding: 10px 0;\n            border-bottom: 1px solid #eee;\n        }\n        .user-bar img { width: 32px; height: 32px; border-radius: 50%; }\n        .user-bar span { color: #444; font-size: 14px; }\n        .logout-btn {\n            background: none;\n            border: 1px solid #ddd;\n            padding: 4px 12px;\n            border-radius: 20px;\n            cursor: pointer;\n            color: #666;\n            font-size: 13px;\n        }\n        .logout-btn:hover { background: #f5f5f5; }\n\n        /* \u767b\u5f55\u533a\u57df */\n        .login-area {\n            display: block;\n            text-align: center;\n            padding: 40px 20px;\n        }\n        .login-area p { color: #666; margin-bottom: 24px; font-size: 16px; }\n        .google-login-btn {\n            display: inline-flex;\n            align-items: center;\n            gap: 10px;\n            background: white;\n            border: 1px solid #ddd;\n            padding: 12px 24px;\n            border-radius: 8px;\n            cursor: pointer;\n            font-size: 16px;\n            color: #333;\n            text-decoration: none;\n            box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n            transition: box-shadow 0.2s;\n        }\n        .google-login-btn:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.15); }\n        .google-login-btn img { width: 24px; height: 24px; }\n\n        /* \u4e3b\u529f\u80fd\u533a */\n        .main-area { display: none; }\n        .upload-area {\n            border: 3px dashed #667eea;\n            border-radius: 15px;\n            padding: 40px;\n            text-align: center;\n            cursor: pointer;\n            transition: all 0.3s;\n            margin-bottom: 20px;\n        }\n        .upload-area:hover { background: #f8f9ff; border-color: #764ba2; }\n        .upload-area.dragover { background: #f0f0ff; border-color: #764ba2; }\n        input[type=\"file\"] { display: none; }\n        .btn {\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            color: white; border: none;\n            padding: 12px 30px; border-radius: 25px;\n            cursor: pointer; font-size: 16px;\n            transition: transform 0.2s;\n        }\n        .btn:hover { transform: scale(1.05); }\n        .preview-area { display: none; margin-top: 30px; }\n        .preview-grid {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 20px;\n            margin-bottom: 20px;\n        }\n        .preview-box { text-align: center; }\n        .preview-box h3 { color: #667eea; margin-bottom: 10px; }\n        .preview-box img {\n            max-width: 100%;\n            border-radius: 10px;\n            box-shadow: 0 4px 15px rgba(0,0,0,0.1);\n        }\n        .loading { display: none; text-align: center; margin: 20px 0; }\n        .spinner {\n            border: 4px solid #f3f3f3;\n            border-top: 4px solid #667eea;\n            border-radius: 50%;\n            width: 40px; height: 40px;\n            animation: spin 1s linear infinite;\n            margin: 0 auto;\n        }\n        @keyframes spin { 100% { transform: rotate(360deg); } }\n        .error { color: #e74c3c; text-align: center; margin: 10px 0; display: none; }\n        @media (max-width: 768px) { .preview-grid { grid-template-columns: 1fr; } }\n    </style>\n</head>\n<body>\n<div class=\"container\">\n    <h1>\ud83d\ude97 Car Parts Background Remover</h1>\n    <p class=\"subtitle\">\u4e0a\u4f20\u6c7d\u8f66\u914d\u4ef6\u56fe\u7247\uff0c\u81ea\u52a8\u53bb\u9664\u80cc\u666f</p>\n\n    <!-- \u7528\u6237\u4fe1\u606f\u680f\uff08\u767b\u5f55\u540e\u663e\u793a\uff09 -->\n    <div class=\"user-bar\" id=\"userBar\">\n        <img id=\"userAvatar\" src=\"\" alt=\"\">\n        <span id=\"userName\"></span>\n        <button class=\"logout-btn\" onclick=\"handleLogout()\">\u9000\u51fa</button>\n    </div>\n\n    <!-- \u672a\u767b\u5f55\u65f6\u663e\u793a -->\n    <div class=\"login-area\" id=\"loginArea\">\n        <p>\u8bf7\u5148\u767b\u5f55\u540e\u4f7f\u7528\u53bb\u80cc\u666f\u529f\u80fd</p>\n        <a href=\"/auth/google\" class=\"google-login-btn\">\n            <img src=\"https://www.google.com/favicon.ico\" alt=\"Google\">\n            \u4f7f\u7528 Google \u8d26\u53f7\u767b\u5f55\n        </a>\n    </div>\n\n    <!-- \u767b\u5f55\u540e\u663e\u793a\u4e3b\u529f\u80fd -->\n    <div class=\"main-area\" id=\"mainArea\">\n        <div class=\"upload-area\" id=\"uploadArea\">\n            <p style=\"font-size:48px;margin-bottom:10px;\">\ud83d\udcf8</p>\n            <p style=\"color:#667eea;font-size:18px;margin-bottom:10px;\">\u70b9\u51fb\u6216\u62d6\u62fd\u56fe\u7247\u5230\u8fd9\u91cc</p>\n            <p style=\"color:#999;font-size:14px;\">\u652f\u6301 JPG, PNG \u683c\u5f0f</p>\n            <input type=\"file\" id=\"fileInput\" accept=\"image/*\">\n        </div>\n        <div class=\"loading\" id=\"loading\">\n            <div class=\"spinner\"></div>\n            <p style=\"margin-top:10px;color:#667eea;\">\u6b63\u5728\u5904\u7406\u56fe\u7247...</p>\n        </div>\n        <div class=\"error\" id=\"error\"></div>\n        <div class=\"preview-area\" id=\"previewArea\">\n            <div class=\"preview-grid\">\n                <div class=\"preview-box\">\n                    <h3>\u539f\u56fe</h3>\n                    <img id=\"originalImg\" alt=\"\u539f\u56fe\">\n                </div>\n                <div class=\"preview-box\">\n                    <h3>\u53bb\u80cc\u666f\u540e</h3>\n                    <img id=\"resultImg\" alt=\"\u5904\u7406\u540e\">\n                </div>\n            </div>\n            <div style=\"text-align:center;\">\n                <button class=\"btn\" id=\"downloadBtn\">\u4e0b\u8f7d\u56fe\u7247</button>\n                <button class=\"btn\" id=\"resetBtn\" style=\"margin-left:10px;\">\u91cd\u65b0\u4e0a\u4f20</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<script src=\"/script.js\"></script>\n</body>\n</html>\n";
const SCRIPT_JS = "// ==================== \u767b\u5f55\u72b6\u6001\u68c0\u67e5 ====================\nasync function checkAuth() {\n    try {\n        const res = await fetch('/auth/me');\n        if (res.ok) {\n            const user = await res.json();\n            showLoggedIn(user);\n        } else {\n            showLoggedOut();\n        }\n    } catch (e) {\n        showLoggedOut();\n    }\n}\n\nfunction showLoggedIn(user) {\n    document.getElementById('loginArea').style.display = 'none';\n    document.getElementById('userBar').style.display = 'flex';\n    document.getElementById('mainArea').style.display = 'block';\n    document.getElementById('userAvatar').src = user.picture || '';\n    document.getElementById('userName').textContent = user.name || user.email;\n}\n\nfunction showLoggedOut() {\n    document.getElementById('loginArea').style.display = 'block';\n    document.getElementById('userBar').style.display = 'none';\n    document.getElementById('mainArea').style.display = 'none';\n}\n\nasync function handleLogout() {\n    await fetch('/auth/logout', { method: 'POST' });\n    showLoggedOut();\n}\n\n// \u9875\u9762\u52a0\u8f7d\u65f6\u68c0\u67e5\u767b\u5f55\u72b6\u6001\ncheckAuth();\n\n// ==================== \u4e3b\u529f\u80fd ====================\nconst uploadArea = document.getElementById('uploadArea');\nconst fileInput = document.getElementById('fileInput');\nconst loading = document.getElementById('loading');\nconst error = document.getElementById('error');\nconst previewArea = document.getElementById('previewArea');\nconst originalImg = document.getElementById('originalImg');\nconst resultImg = document.getElementById('resultImg');\nconst downloadBtn = document.getElementById('downloadBtn');\nconst resetBtn = document.getElementById('resetBtn');\n\nlet processedImageUrl = null;\n\nuploadArea.addEventListener('click', () => fileInput.click());\n\nfileInput.addEventListener('change', (e) => {\n    const file = e.target.files[0];\n    if (file) handleFile(file);\n});\n\nuploadArea.addEventListener('dragover', (e) => {\n    e.preventDefault();\n    uploadArea.classList.add('dragover');\n});\n\nuploadArea.addEventListener('dragleave', () => {\n    uploadArea.classList.remove('dragover');\n});\n\nuploadArea.addEventListener('drop', (e) => {\n    e.preventDefault();\n    uploadArea.classList.remove('dragover');\n    const file = e.dataTransfer.files[0];\n    if (file && file.type.startsWith('image/')) {\n        handleFile(file);\n    }\n});\n\nasync function handleFile(file) {\n    error.style.display = 'none';\n    loading.style.display = 'block';\n    previewArea.style.display = 'none';\n\n    const reader = new FileReader();\n    reader.onload = (e) => { originalImg.src = e.target.result; };\n    reader.readAsDataURL(file);\n\n    try {\n        const result = await removeBackground(file);\n        resultImg.src = result;\n        processedImageUrl = result;\n        loading.style.display = 'none';\n        previewArea.style.display = 'block';\n    } catch (err) {\n        loading.style.display = 'none';\n        error.textContent = '\u5904\u7406\u5931\u8d25: ' + err.message;\n        error.style.display = 'block';\n    }\n}\n\nasync function removeBackground(file) {\n    return new Promise((resolve, reject) => {\n        const img = new Image();\n        const reader = new FileReader();\n\n        reader.onload = (e) => {\n            img.onload = () => {\n                const canvas = document.createElement('canvas');\n                const ctx = canvas.getContext('2d');\n                canvas.width = img.width;\n                canvas.height = img.height;\n                ctx.drawImage(img, 0, 0);\n\n                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n                const data = imageData.data;\n\n                for (let i = 0; i < data.length; i += 4) {\n                    const r = data[i];\n                    const g = data[i + 1];\n                    const b = data[i + 2];\n                    if (r > 200 && g > 200 && b > 200) {\n                        data[i + 3] = 0;\n                    }\n                }\n\n                ctx.putImageData(imageData, 0, 0);\n                resolve(canvas.toDataURL('image/png'));\n            };\n            img.src = e.target.result;\n        };\n\n        reader.onerror = reject;\n        reader.readAsDataURL(file);\n    });\n}\n\ndownloadBtn.addEventListener('click', () => {\n    if (processedImageUrl) {\n        const a = document.createElement('a');\n        a.href = processedImageUrl;\n        a.download = 'removed-background.png';\n        a.click();\n    }\n});\n\nresetBtn.addEventListener('click', () => {\n    fileInput.value = '';\n    previewArea.style.display = 'none';\n    processedImageUrl = null;\n});\n";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 路由处理
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
    if (url.pathname === '/script.js') {
      return new Response(SCRIPT_JS, {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    if (url.pathname === '/test.html') {
      return new Response(TEST_HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    // 默认返回首页
    return new Response(INDEX_HTML, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};

// 1. 跳转到 Google 授权页
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

// 2. Google 回调：用 code 换 token，存入 D1
async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  // 用 code 换 token
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
  if (!tokenData.id_token) {
    return new Response('Token error: ' + JSON.stringify(tokenData), { status: 400 });
  }

  // 解析 JWT 获取用户信息
  const payload = JSON.parse(atob(tokenData.id_token.split('.')[1]));
  const user = {
    google_id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  // 存入 D1 数据库（upsert）
  await env.DB.prepare(`
    INSERT INTO users (google_id, email, name, picture, last_login)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      picture = excluded.picture,
      last_login = datetime('now')
  `).bind(user.google_id, user.email, user.name, user.picture).run();

  // 生成 session token
  const sessionToken = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO sessions (token, google_id, created_at)
    VALUES (?, ?, datetime('now'))
  `).bind(sessionToken, user.google_id).run();

  // 设置 cookie，跳回首页
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    }
  });
}

// 3. 获取当前用户信息
async function handleMe(request, env) {
  const sessionToken = getCookie(request, 'session');
  if (!sessionToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const session = await env.DB.prepare(`
    SELECT u.google_id, u.email, u.name, u.picture
    FROM sessions s
    JOIN users u ON s.google_id = u.google_id
    WHERE s.token = ?
  `).bind(sessionToken).first();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify(session), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 4. 退出登录
function handleLogout() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; Max-Age=0'
    }
  });
}

// 工具函数：解析 Cookie
function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('=').map(decodeURIComponent))
  );
  return cookies[name] || null;
}
