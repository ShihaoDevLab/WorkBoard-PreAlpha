// Clock functionality
function updateClock() {
    const now = new Date();
    // Use currentLang for locale format, fallback to en-US if needed
    const userLocale = currentLang === 'en' ? 'en-US' : currentLang;

    // Update time using system format
    const timeString = now.toLocaleTimeString(userLocale, {
        // hour12: false,
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
    });
    document.getElementById("clock").textContent = timeString;

    // Update date using system format
    const dateString = now.toLocaleDateString(userLocale, {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    document.getElementById("date").textContent = dateString;

    // Update countdown
    updateCountdown();
}

// Countdown functionality
let countdownData = {
    name: "",
    date: null,
};

// Load countdown data from localStorage
function loadCountdownData() {
    try {
        const saved = localStorage.getItem("countdownData");
        if (saved) {
            countdownData = JSON.parse(saved);
            updateCountdownDisplay();
        }
    } catch (error) {
        console.error("Failed to load countdown data:", error);
        // Reset to default if loading fails
        countdownData = { name: "", date: null };
    }
}

// Save countdown data to localStorage
function saveCountdownData() {
    try {
        localStorage.setItem("countdownData", JSON.stringify(countdownData));
    } catch (error) {
        console.error("Failed to save countdown data:", error);
        alert(t("countdownAlertFull"));
    }
}

function updateCountdown() {
    if (!countdownData.date) {
        document.getElementById("countdownText").textContent = t("countdownFirst");
        return;
    }

    const now = new Date();
    const targetDate = new Date(countdownData.date);
    // Set target time to the specific time set by user
    // targetDate.setHours(0, 0, 0, 0); // No longer needed as we use full datetime

    const diff = targetDate - now;
    // Use currentLang for locale format, fallback to en-US if needed
    const userLocale = currentLang === 'en' ? 'en-US' : currentLang;

    if (diff <= 0) {
        // Use system format to display target date
        const targetDateString = targetDate.toLocaleString(userLocale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        document.getElementById("countdownText").textContent = `${countdownData.name} (${targetDateString}) ${t("countdownHasArrived")}`;
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Use system format to display target date
    const targetDateString = targetDate.toLocaleString(userLocale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    let text = `${t("countdownTimeUntil")}${countdownData.name} (${targetDateString}): `;

    if (days > 0) {
        text += `${days} ${days > 1 ? t("days") : t("day")} `;
    }
    
    if (days > 0 || hours > 0) {
        text += `${hours} ${hours > 1 ? t("hours") : t("hour")} `;
    }
    
    if (days > 0 || hours > 0 || minutes > 0) {
        text += `${minutes} ${minutes > 1 ? t("minutes") : t("minute")} `;
    }
    
    text += `${seconds} ${seconds > 1 ? t("seconds") : t("second")}`;

    document.getElementById("countdownText").textContent = text;
}

function updateCountdownDisplay() {
    if (!countdownData.date) {
        document.getElementById("countdownText").textContent = "Please set a countdown first";
        return;
    }
    updateCountdown();
}

// Modal control
const modal = document.getElementById("countdownModal");
const cancelBtn = document.getElementById("cancelBtn");
const clearCountdownBtn = document.getElementById("clearCountdownBtn");
const saveBtn = document.getElementById("saveBtn");
const countdownNameInput = document.getElementById("countdownName");
const countdownDateInput = document.getElementById("countdownDate");

// Countdown settings button in dropdown
const countdownSettingsBtn = document.getElementById("countdownSettingsBtn");

countdownSettingsBtn.addEventListener("click", () => {
    modal.classList.add("active");
    countdownNameInput.value = countdownData.name === "" ? "" : countdownData.name;
    // Format for datetime-local input: YYYY-MM-DDTHH:mm:ss
    if (countdownData.date) {
        const d = new Date(countdownData.date);
        // Adjust for timezone offset to show correct local time in input
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d - tzOffset).toISOString().slice(0, 19);
        countdownDateInput.value = localISOTime;
    } else {
        countdownDateInput.value = "";
    }

    // Close settings dropdown
    const settingsDropdown = document.getElementById("settingsDropdown");
    const settingsBtn = document.getElementById("settingsBtn");
    settingsDropdown.classList.remove("active");
    settingsBtn.classList.remove("active");
});

cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

clearCountdownBtn.addEventListener("click", () => {
    countdownData.name = "";
    countdownData.date = null;
    saveCountdownData();
    updateCountdownDisplay();
    modal.classList.remove("active");
});

saveBtn.addEventListener("click", () => {
    const name = countdownNameInput.value.trim();
    const date = countdownDateInput.value;

    if (!name || !date) {
        alert(t("countdownAlertMissing"));
        return;
    }

    // Validate date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert(t("countdownAlertPast"));
        return;
    }

    countdownData.name = name;
    countdownData.date = date;
    saveCountdownData();
    updateCountdownDisplay();
    modal.classList.remove("active");
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

// Stopwatch variables
let stopwatchInterval = null;
let stopwatchStartTime = null;
let stopwatchElapsed = 0;

// Timer variables
let timerInterval = null;
let timerRemaining = 0;
let timerRunning = false;

// Blackboard variables
let blackboardCanvas = null;
let blackboardCtx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let blackboardImageData = null;

// Localization
let currentLang = "en";

const translations = {
    en: {
        clockLoading: "WorkBoard Loading...",
        countdownLoading: "Loading countdown...",
        countdownFirst: "Please set a countdown first",
        countdownHasArrived: "has arrived!",
        countdownTimeUntil: "Time until ",
        countdownLessThanMinute: "Less than 1 minute",
        countdownSet: "Set Countdown",
        countdownName: "Countdown Name",
        countdownNamePlaceholder: "Enter event name here",
        countdownDate: "Target Date",
        countdownCancel: "Cancel",
        countdownSave: "Save",
        countdownClear: "Clear",
        countdownAlertMissing: "Please enter both event name and target date",
        countdownAlertPast: "Please select today or a future date",
        countdownAlertFull: "Failed to save countdown data. Local storage might be full or disabled.",
        stopwatchStart: "Start",
        stopwatchStop: "Stop",
        stopwatchReset: "Reset",
        timerAlertInvalid: "Please set a valid timer duration",
        timerAlertFinished: "Timer finished!",
        timerHours: "HH",
        timerMinutes: "MM",
        timerSeconds: "SS",
        blackboardClear: "Clear",
        blackboardConfirmClear: "Are you sure you want to clear the blackboard?",
        blackboardTitle: "Blackboard",
        alertOk: "OK",
        day: "day",
        days: "days",
        hour: "hour",
        hours: "hours",
        minute: "minute",
        minutes: "minutes",
        second: "second",
        seconds: "seconds",
        theme: "Theme",
        themeAuto: "Auto",
        themeLight: "Light",
        themeDark: "Dark",
        language: "Language",
        font: "Font",
        about: "About WorkBoard",
        aboutTitle: "About WorkBoard",
        aboutDesc: "A simple, offline-first productivity dashboard.",
        close: "Close",
    },
    "zh-CN": {
        clockLoading: "WorkBoard 加载中...",
        countdownLoading: "加载倒计时...",
        countdownFirst: "请先设置倒计时",
        countdownHasArrived: "已到达！",
        countdownTimeUntil: "距离",
        countdownLessThanMinute: "不足1分钟",
        countdownSet: "设置倒计时",
        countdownName: "倒计时名称",
        countdownNamePlaceholder: "在这里填写事件名称",
        countdownDate: "目标日期",
        countdownCancel: "取消",
        countdownSave: "保存",
        countdownClear: "清除",
        countdownAlertMissing: "请填写完整的事件名称和目标日期",
        countdownAlertPast: "请选择今天或未来的日期",
        countdownAlertFull: "保存倒计时数据失败。本地存储可能已满或被禁用。",
        stopwatchStart: "开始",
        stopwatchStop: "停止",
        stopwatchReset: "重置",
        timerAlertInvalid: "请设置有效的计时器时长",
        timerAlertFinished: "计时器结束！",
        timerHours: "时",
        timerMinutes: "分",
        timerSeconds: "秒",
        blackboardClear: "清空",
        blackboardConfirmClear: "确定要清空黑板吗？",
        blackboardTitle: "黑板",
        alertOk: "确定",
        day: "天",
        days: "天",
        hour: "小时",
        hours: "小时",
        minute: "分钟",
        minutes: "分钟",
        second: "秒",
        seconds: "秒",
        theme: "主题",
        themeAuto: "跟随系统",
        themeLight: "浅色",
        themeDark: "深色",
        language: "语言",
        font: "字体",
        about: "关于 WorkBoard",
        aboutTitle: "关于 WorkBoard",
        aboutDesc: "一个简单、离线优先的生产力仪表盘。",
        close: "关闭",
    },
    "zh-TW": {
        clockLoading: "WorkBoard 載入中...",
        countdownLoading: "載入倒數計時...",
        countdownFirst: "請先設定倒數計時",
        countdownHasArrived: "已到達！",
        countdownTimeUntil: "距離",
        countdownLessThanMinute: "不足1分鐘",
        countdownSet: "設定倒數計時",
        countdownName: "倒數計時名稱",
        countdownNamePlaceholder: "在這裡填寫事件名稱",
        countdownDate: "目標日期",
        countdownCancel: "取消",
        countdownSave: "儲存",
        countdownClear: "清除",
        countdownAlertMissing: "請填寫完整的事件名稱和目標日期",
        countdownAlertPast: "請選擇今天或未來的日期",
        countdownAlertFull: "儲存倒數計時資料失敗。本機儲存可能已滿或被禁用。",
        stopwatchStart: "開始",
        stopwatchStop: "停止",
        stopwatchReset: "重置",
        timerAlertInvalid: "請設定有效的計時器時長",
        timerAlertFinished: "計時器結束！",
        timerHours: "時",
        timerMinutes: "分",
        timerSeconds: "秒",
        blackboardClear: "清空",
        blackboardConfirmClear: "確定要清空黑板嗎？",
        blackboardTitle: "黑板",
        alertOk: "確定",
        day: "天",
        days: "天",
        hour: "小時",
        hours: "小時",
        minute: "分鐘",
        minutes: "分鐘",
        second: "秒",
        seconds: "秒",
        theme: "主題",
        themeAuto: "跟隨系統",
        themeLight: "淺色",
        themeDark: "深色",
        language: "語言",
        font: "字體",
        about: "關於 WorkBoard",
        aboutTitle: "關於 WorkBoard",
        aboutDesc: "一個簡單、離線優先的生產力儀表板。",
        close: "關閉",
    },
};

function t(key) {
    return translations[currentLang][key] || translations["en"][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("workboardLang", lang);
    updateLanguageUI();
    updateAllTexts();
}

function updateLanguageUI() {
    // Update language select
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect.value !== currentLang) {
        languageSelect.value = currentLang;
    }
}

function updateAllTexts() {
    // Update static texts
    document.getElementById("date").textContent = t("clockLoading");
    document.getElementById("countdownText").textContent = t("countdownLoading");

    // Update modal texts
    document.querySelector("#countdownModal h2").textContent = t("countdownSet");
    document.querySelector('label[for="countdownName"]').textContent = t("countdownName");
    document.getElementById("countdownName").placeholder = t("countdownNamePlaceholder");
    document.querySelector('label[for="countdownDate"]').textContent = t("countdownDate");
    document.getElementById("cancelBtn").textContent = t("countdownCancel");
    document.getElementById("clearCountdownBtn").textContent = t("countdownClear");
    document.getElementById("saveBtn").textContent = t("countdownSave");

    // Update countdown settings button in dropdown
    const countdownSettingsBtn = document.getElementById("countdownSettingsBtn");
    if (countdownSettingsBtn) {
        countdownSettingsBtn.textContent = t("countdownSet");
        countdownSettingsBtn.title = t("countdownSet");
    }

    // Update blackboard
    document.querySelector(".blackboard-header h2").textContent = t("blackboardTitle");
    document.getElementById("blackboardClear").textContent = t("blackboardClear");

    // Update alert
    const alertOk = document.getElementById("alertOk");
    if (alertOk) {
        alertOk.textContent = t("alertOk");
    }

    // Update settings labels
    document.getElementById("labelTheme").textContent = t("theme");
    // document.querySelector('.theme-btn[data-theme="auto"]').textContent = t("themeAuto");
    document.querySelector('.theme-btn[data-theme="auto"]').title = t("themeAuto");
    document.querySelector('.theme-btn[data-theme="light"]').title = t("themeLight");
    document.querySelector('.theme-btn[data-theme="dark"]').title = t("themeDark");
    document.getElementById("labelLanguage").textContent = t("language");
    document.getElementById("labelFont").textContent = t("font");
    document.getElementById("labelCountdown").textContent = t("countdownSet");
    document.getElementById("aboutBtn").textContent = "ℹ️ " + t("about");

    // Update About Modal
    document.getElementById("aboutTitle").textContent = t("aboutTitle");
    document.getElementById("aboutDesc").textContent = t("aboutDesc");
    document.getElementById("aboutCloseBtn").textContent = t("close");

    // Update countdown display
    updateCountdownDisplay();
}

// Navigation
function setupNavigation() {
    const navBtns = document.querySelectorAll(".nav-btn");
    const cards = {
        clock: document.getElementById("mainCard"),
        stopwatch: document.getElementById("stopwatchCard"),
        timer: document.getElementById("timerCard"),
        blackboard: document.getElementById("blackboardCard"),
    };

    navBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view;

            // Update active button
            navBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Show/hide cards
            Object.values(cards).forEach((card) => card.classList.add("hidden"));
            if (cards[view]) {
                cards[view].classList.remove("hidden");
                // Resize blackboard if switching to it
                if (view === "blackboard") {
                    // Small delay to ensure display:block is applied and layout is done
                    setTimeout(resizeBlackboard, 0);
                }
            }
        });
    });
}

// Stopwatch functions
function updateStopwatchDisplay() {
    const elapsed = stopwatchElapsed;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = elapsed % 1000;

    const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
    document.getElementById("stopwatchDisplay").textContent = display;
}

function startStopwatch() {
    if (stopwatchInterval) return;

    stopwatchStartTime = Date.now() - stopwatchElapsed;
    stopwatchInterval = setInterval(() => {
        stopwatchElapsed = Date.now() - stopwatchStartTime;
        updateStopwatchDisplay();
    }, 10); // Update every 10ms for smooth display
}

function stopStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchElapsed = 0;
    updateStopwatchDisplay();
}

// Timer functions
function updateTimerDisplay() {
    const hours = Math.floor(timerRemaining / 3600);
    const minutes = Math.floor((timerRemaining % 3600) / 60);
    const seconds = timerRemaining % 60;

    const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.getElementById("timerDisplay").textContent = display;
}

function startTimer() {
    if (timerRunning || timerRemaining <= 0) return;

    const hours = parseInt(document.getElementById("timerHours").value) || 0;
    const minutes = parseInt(document.getElementById("timerMinutes").value) || 0;
    const seconds = parseInt(document.getElementById("timerSeconds").value) || 0;

    if (timerRemaining === 0) {
        timerRemaining = hours * 3600 + minutes * 60 + seconds;
    }

    if (timerRemaining <= 0) {
        alert(t("timerAlertInvalid"));
        return;
    }

    timerRunning = true;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();

        if (timerRemaining <= 0) {
            stopTimer();
            showAlert(t("timerAlertFinished"));
            // Visual feedback
            document.getElementById("timerCard").classList.add("timer-alert-active");
            setTimeout(() => {
                document.getElementById("timerCard").classList.remove("timer-alert-active");
            }, 3000);
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerRunning = false;
}

function resetTimer() {
    stopTimer();
    timerRemaining = 0;
    document.getElementById("timerHours").value = 0;
    document.getElementById("timerMinutes").value = 0;
    document.getElementById("timerSeconds").value = 0;
    updateTimerDisplay();
}

// Blackboard functions
function initBlackboard() {
    blackboardCanvas = document.getElementById("blackboardCanvas");
    blackboardCtx = blackboardCanvas.getContext("2d");

    // Set canvas size
    resizeBlackboard();
    window.addEventListener("resize", resizeBlackboard);

    // Setup drawing events
    setupDrawingEvents();

    // Load saved drawing
    loadBlackboardData();
}

function resizeBlackboard() {
    if (!blackboardCanvas) return;

    const rect = blackboardCanvas.getBoundingClientRect();
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Save current drawing
    if (blackboardImageData) {
        tempCanvas.width = blackboardCanvas.width;
        tempCanvas.height = blackboardCanvas.height;
        tempCtx.drawImage(blackboardCanvas, 0, 0);
    }

    // Resize canvas
    blackboardCanvas.width = rect.width * window.devicePixelRatio;
    blackboardCanvas.height = rect.height * window.devicePixelRatio;
    blackboardCanvas.style.width = rect.width + "px";
    blackboardCanvas.style.height = rect.height + "px";

    // Scale context for high DPI displays
    blackboardCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Restore drawing
    if (blackboardImageData) {
        blackboardCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, blackboardCanvas.width, blackboardCanvas.height);
    }
}

function setupDrawingEvents() {
    // Mouse events
    blackboardCanvas.addEventListener("mousedown", startDrawing);
    blackboardCanvas.addEventListener("mousemove", draw);
    blackboardCanvas.addEventListener("mouseup", stopDrawing);
    blackboardCanvas.addEventListener("mouseout", stopDrawing);

    // Touch events for mobile
    blackboardCanvas.addEventListener("touchstart", handleTouch);
    blackboardCanvas.addEventListener("touchmove", handleTouch);
    blackboardCanvas.addEventListener("touchend", stopDrawing);
    blackboardCanvas.addEventListener("touchcancel", stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = blackboardCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;

    const rect = blackboardCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    blackboardCtx.beginPath();
    blackboardCtx.moveTo(lastX, lastY);
    blackboardCtx.lineTo(currentX, currentY);
    blackboardCtx.strokeStyle = "#FFFFFF";
    blackboardCtx.lineWidth = 3;
    blackboardCtx.lineCap = "round";
    blackboardCtx.lineJoin = "round";
    blackboardCtx.stroke();

    lastX = currentX;
    lastY = currentY;

    // Save drawing data
    saveBlackboardData();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    const rect = blackboardCanvas.getBoundingClientRect();
    const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
    };

    if (e.type === "touchstart") {
        startDrawing(mouseEvent);
    } else if (e.type === "touchmove") {
        draw(mouseEvent);
    }
}

function loadBlackboardData() {
    try {
        const saved = localStorage.getItem("blackboardDrawing");
        if (saved) {
            const img = new Image();
            img.onload = function() {
                blackboardCtx.drawImage(img, 0, 0, blackboardCanvas.width, blackboardCanvas.height);
                blackboardImageData = blackboardCanvas.toDataURL();
            };
            img.src = saved;
        }
    } catch (error) {
        console.error("Failed to load blackboard data:", error);
    }
}

function saveBlackboardData() {
    try {
        blackboardImageData = blackboardCanvas.toDataURL();
        localStorage.setItem("blackboardDrawing", blackboardImageData);
    } catch (error) {
        console.error("Failed to save blackboard data:", error);
    }
}

function clearBlackboard() {
    if (confirm(t("blackboardConfirmClear"))) {
        blackboardCtx.clearRect(0, 0, blackboardCanvas.width, blackboardCanvas.height);
        blackboardImageData = null;
        try {
            localStorage.removeItem("blackboardDrawing");
        } catch (error) {
            console.error("Failed to clear blackboard data:", error);
        }
    }
}

// Alert function
function showAlert(message) {
    // Create alert overlay if it doesn't exist
    let alertOverlay = document.getElementById("alertOverlay");
    if (!alertOverlay) {
        alertOverlay = document.createElement("div");
        alertOverlay.id = "alertOverlay";
        alertOverlay.className = "alert-overlay";
        alertOverlay.innerHTML = `
            <div class="alert-box">
                <div id="alertMessage"></div>
                <button id="alertOk">OK</button>
            </div>
        `;
        document.body.appendChild(alertOverlay);

        document.getElementById("alertOk").addEventListener("click", () => {
            alertOverlay.classList.remove("active");
        });
    }

    document.getElementById("alertMessage").textContent = message;
    alertOverlay.classList.add("active");
}

// Font selector setup
function setupFontSelector() {
    const fontSelect = document.getElementById("fontSelect");
    
    // Load saved font or use default
    const savedFont = localStorage.getItem("workboardFont") || "MiSans VF";
    setFont(savedFont);

    fontSelect.addEventListener("change", (e) => {
        setFont(e.target.value);
    });
}

function setFont(font) {
    const clockDisplay = document.getElementById("clock");
    const dateDisplay = document.getElementById("date");
    const countdownText = document.getElementById("countdownText");
    const stopwatchDisplay = document.getElementById("stopwatchDisplay");
    const timerDisplay = document.getElementById("timerDisplay");
    
    // Update select value
    const fontSelect = document.getElementById("fontSelect");
    if (fontSelect.value !== font) {
        fontSelect.value = font;
    }

    // Apply font to different elements
    let fontFamily = "'MiSans VF', sans-serif";
    let monoFont = "'JetBrains Mono', monospace";

    if (font === "JetBrains Mono") {
        fontFamily = "'JetBrains Mono', monospace";
    } else if (font === "Arial") {
        fontFamily = "Arial, sans-serif";
        monoFont = "Arial, sans-serif";
    } else if (font === "Georgia") {
        fontFamily = "Georgia, serif";
        monoFont = "Georgia, serif";
    }

    // Apply to elements
    clockDisplay.style.fontFamily = monoFont;
    stopwatchDisplay.style.fontFamily = monoFont;
    timerDisplay.style.fontFamily = monoFont;
    dateDisplay.style.fontFamily = fontFamily;
    countdownText.style.fontFamily = fontFamily;

    // Save to localStorage
    localStorage.setItem("workboardFont", font);
}

// Theme setup
let currentTheme = "auto";

function setupThemeSelector() {
    const themeBtns = document.querySelectorAll(".theme-btn");
    
    // Load saved theme
    const savedTheme = localStorage.getItem("workboardTheme") || "auto";
    setTheme(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            setTheme(btn.dataset.theme);
        });
    });

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (currentTheme === "auto") {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem("workboardTheme", theme);
    
    // Update buttons
    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    // Apply theme
    if (theme === "auto") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(isDark ? "dark" : "light");
    } else {
        applyTheme(theme);
    }
}

function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }
}

// About Modal setup
function setupAboutModal() {
    const aboutBtn = document.getElementById("aboutBtn");
    const aboutModal = document.getElementById("aboutModal");
    const aboutCloseBtn = document.getElementById("aboutCloseBtn");

    aboutBtn.addEventListener("click", () => {
        aboutModal.classList.add("active");
        // Close settings dropdown
        document.getElementById("settingsDropdown").classList.remove("active");
        document.getElementById("settingsBtn").classList.remove("active");
    });

    aboutCloseBtn.addEventListener("click", () => {
        aboutModal.classList.remove("active");
    });

    aboutModal.addEventListener("click", (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove("active");
        }
    });
}

// Settings menu setup
function setupSettingsMenu() {
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsDropdown = document.getElementById("settingsDropdown");

    settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle("active");
        settingsBtn.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!settingsDropdown.contains(e.target) && e.target !== settingsBtn) {
            settingsDropdown.classList.remove("active");
            settingsBtn.classList.remove("active");
        }
    });
}

// Language selector setup
function setupLanguageSelector() {
    const languageSelect = document.getElementById("languageSelect");

    // Load saved language or detect from browser
    const savedLang = localStorage.getItem("workboardLang");
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else {
        // Detect browser language
        const browserLang = navigator.language;
        if (browserLang.startsWith("zh-TW") || browserLang.startsWith("zh-HK")) {
            currentLang = "zh-TW";
        } else if (browserLang.startsWith("zh")) {
            currentLang = "zh-CN";
        } else {
            currentLang = "en";
        }
    }

    languageSelect.value = currentLang;

    languageSelect.addEventListener("change", (e) => {
        setLanguage(e.target.value);
    });

    updateLanguageUI();
}

// Initialize
function init() {
    // Load language first
    setupLanguageSelector();
    updateAllTexts();

    // Setup font selector
    setupFontSelector();

    // Setup theme selector
    setupThemeSelector();

    // Setup settings menu
    setupSettingsMenu();
    setupAboutModal();

    // Clock and countdown
    loadCountdownData();
    updateClock();
    setInterval(updateClock, 1000); // Update every second instead of 1ms

    // Navigation
    setupNavigation();

    // Stopwatch
    document.getElementById("stopwatchStart").addEventListener("click", startStopwatch);
    document.getElementById("stopwatchStop").addEventListener("click", stopStopwatch);
    document.getElementById("stopwatchReset").addEventListener("click", resetStopwatch);
    updateStopwatchDisplay();

    // Timer
    document.getElementById("timerStart").addEventListener("click", startTimer);
    document.getElementById("timerStop").addEventListener("click", stopTimer);
    document.getElementById("timerReset").addEventListener("click", resetTimer);
    updateTimerDisplay();

    // Blackboard
    initBlackboard();
    document.getElementById("blackboardClear").addEventListener("click", clearBlackboard);
}

// Run initialization
init();
