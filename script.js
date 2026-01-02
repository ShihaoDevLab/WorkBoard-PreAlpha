// 时钟功能
function updateClock() {
    const now = new Date();
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // 更新日期
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    document.getElementById('date').textContent = `${weekday} ${year}/${month}/${day}`;
    
    // 更新倒计时
    updateCountdown();
}

// 倒计时功能
let countdownData = {
    name: '倒计时',
    date: null
};

// 从 localStorage 加载倒计时数据
function loadCountdownData() {
    const saved = localStorage.getItem('countdownData');
    if (saved) {
        countdownData = JSON.parse(saved);
        updateCountdownDisplay();
    }
}

// 保存倒计时数据到 localStorage
function saveCountdownData() {
    localStorage.setItem('countdownData', JSON.stringify(countdownData));
}

function updateCountdown() {
    if (!countdownData.date) {
        document.getElementById('countdownText').textContent = '距离[倒计时]还剩X天';
        return;
    }
    
    const now = new Date();
    const targetDate = new Date(countdownData.date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('countdownText').textContent = `${countdownData.name} 已到达！`;
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let text = `距离[${countdownData.name}]还剩`;
    
    if (days > 0) {
        text += `${days}天`;
        if (hours > 0) text += `${hours}小时`;
    } else if (hours > 0) {
        text += `${hours}小时`;
        if (minutes > 0) text += `${minutes}分钟`;
    } else if (minutes > 0) {
        text += `${minutes}分钟`;
    } else {
        text += '即将到达';
    }
    
    document.getElementById('countdownText').textContent = text;
}

function updateCountdownDisplay() {
    if (!countdownData.date) {
        document.getElementById('countdownText').textContent = '距离[倒计时]还剩X天';
        return;
    }
    updateCountdown();
}

// 模态框控制
const modal = document.getElementById('countdownModal');
const editBtn = document.getElementById('editBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const countdownNameInput = document.getElementById('countdownName');
const countdownDateInput = document.getElementById('countdownDate');

editBtn.addEventListener('click', () => {
    modal.classList.add('active');
    countdownNameInput.value = countdownData.name === '倒计时' ? '' : countdownData.name;
    countdownDateInput.value = countdownData.date || '';
});

cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

saveBtn.addEventListener('click', () => {
    const name = countdownNameInput.value.trim();
    const date = countdownDateInput.value;
    
    if (!name || !date) {
        alert('请填写完整的事件名称和目标日期');
        return;
    }
    
    countdownData.name = name;
    countdownData.date = date;
    saveCountdownData();
    updateCountdownDisplay();
    modal.classList.remove('active');
});

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// 初始化
loadCountdownData();
updateClock();
setInterval(updateClock, 1000);
