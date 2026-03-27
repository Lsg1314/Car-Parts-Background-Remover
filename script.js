const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const previewArea = document.getElementById('previewArea');
const originalImg = document.getElementById('originalImg');
const resultImg = document.getElementById('resultImg');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let processedImageUrl = null;

// 点击上传区域
uploadArea.addEventListener('click', () => fileInput.click());

// 文件选择
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// 处理文件
async function handleFile(file) {
    error.style.display = 'none';
    loading.style.display = 'block';
    previewArea.style.display = 'none';
    
    // 显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImg.src = e.target.result;
    };
    reader.readAsDataURL(file);

    try {
        // 使用客户端 Canvas API 去背景
        const result = await removeBackground(file);
        resultImg.src = result;
        processedImageUrl = result;
        
        loading.style.display = 'none';
        previewArea.style.display = 'block';
    } catch (err) {
        loading.style.display = 'none';
        error.textContent = '处理失败: ' + err.message;
        error.style.display = 'block';
    }
}

// 简单的去背景算法（基于颜色阈值）
async function removeBackground(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // 简单的背景去除：将接近白色的像素变透明
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // 如果像素接近白色或浅色，设为透明
                    if (r > 200 && g > 200 && b > 200) {
                        data[i + 3] = 0; // 设置 alpha 为 0（透明）
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 下载按钮
downloadBtn.addEventListener('click', () => {
    if (processedImageUrl) {
        const a = document.createElement('a');
        a.href = processedImageUrl;
        a.download = 'removed-background.png';
        a.click();
    }
});

// 重置按钮
resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    previewArea.style.display = 'none';
    processedImageUrl = null;
});
