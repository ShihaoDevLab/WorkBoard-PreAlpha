// 时钟功能
function updateClock() {
    const now = new Date();
    const userLocale = navigator.language || "en-US";
    // const userLocale = "en-US";

    // 使用系统格式更新时间
    const timeString = now.toLocaleTimeString(userLocale, {
        // hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    document.getElementById("clock").textContent = timeString;

    // 使用系统格式更新日期
    const dateString = now.toLocaleDateString(userLocale, {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    document.getElementById("date").textContent = dateString;

    // 更新倒计时
    updateCountdown();
}

// 倒计时功能
let countdownData = {
    name: "",
    date: null,
};

// 从 localStorage 加载倒计时数据
function loadCountdownData() {
    const saved = localStorage.getItem("countdownData");
    if (saved) {
        countdownData = JSON.parse(saved);
        updateCountdownDisplay();
    }
}

// 保存倒计时数据到 localStorage
function saveCountdownData() {
    localStorage.setItem("countdownData", JSON.stringify(countdownData));
}

function updateCountdown() {
    if (!countdownData.date) {
        document.getElementById("countdownText").textContent = "请先设置倒计时";
        return;
    }

    const now = new Date();
    const targetDate = new Date(countdownData.date);
    targetDate.setHours(0, 0, 0, 0);

    const diff = targetDate - now;
    const userLocale = navigator.language || "en-US";

    if (diff <= 0) {
        // 使用系统格式显示目标日期
        const targetDateString = targetDate.toLocaleDateString(userLocale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        document.getElementById("countdownText").textContent = `${countdownData.name}(${targetDateString}) 已到达！`;
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // 使用系统格式显示目标日期
    const targetDateString = targetDate.toLocaleDateString(userLocale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

    let text = `距离${countdownData.name}(${targetDateString})还剩`;

    if (days > 0) {
        text += `${days}天`;
        // if (hours > 0) text += `${hours}小时`;
    } else if (hours > 0) {
        text += `${hours}小时`;
        // if (minutes > 0) text += `${minutes}分钟`;
    } else if (minutes > 0) {
        // text += `${minutes}分钟`;
    } else {
        text += "不足1分钟";
    }

    document.getElementById("countdownText").textContent = text;
}

function updateCountdownDisplay() {
    if (!countdownData.date) {
        document.getElementById("countdownText").textContent = "请先设置倒计时";
        return;
    }
    updateCountdown();
}

// 模态框控制
const modal = document.getElementById("countdownModal");
const editBtn = document.getElementById("editBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const countdownNameInput = document.getElementById("countdownName");
const countdownDateInput = document.getElementById("countdownDate");

editBtn.addEventListener("click", () => {
    modal.classList.add("active");
    countdownNameInput.value = countdownData.name === "" ? "" : countdownData.name;
    countdownDateInput.value = countdownData.date || "";
});

cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

saveBtn.addEventListener("click", () => {
    const name = countdownNameInput.value.trim();
    const date = countdownDateInput.value;

    if (!name || !date) {
        alert("请填写完整的事件名称和目标日期");
        return;
    }

    countdownData.name = name;
    countdownData.date = date;
    saveCountdownData();
    updateCountdownDisplay();
    modal.classList.remove("active");
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
setInterval(updateClock, 1);
