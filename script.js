let timerInterval = null;
let startTime = null;
let elapsedSeconds = 0;

const DAILY_GOAL = 2.75;
const YEARLY_GOAL = 1000;

function loadData() {
    const data = localStorage.getItem('outdoorTime');
    return data ? JSON.parse(data) : {};
}

function saveData(data) {
    localStorage.setItem('outdoorTime', JSON.stringify(data));
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(elapsedSeconds);
}

function startTimer() {
    startTime = Date.now() - (elapsedSeconds * 1000);
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    if (elapsedSeconds > 0) {
        const hours = elapsedSeconds / 3600;
        const today = new Date().toISOString().split('T')[0];
        addTime(today, hours);
        elapsedSeconds = 0;
        updateTimerDisplay();
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

function addTime(date, hours) {
    const data = loadData();
    data[date] = (data[date] || 0) + hours;
    saveData(data);
    updateStats();
    renderHistory();
}

function updateTime(date, hours) {
    const data = loadData();
    data[date] = hours;
    saveData(data);
    updateStats();
    renderHistory();
}

function deleteTime(date) {
    const data = loadData();
    delete data[date];
    saveData(data);
    updateStats();
    renderHistory();
}

function updateStats() {
    const data = loadData();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);
    const currentYear = today.substring(0, 4);
    
    const todayHours = data[today] || 0;
    
    let monthHours = 0;
    let yearHours = 0;
    
    for (const [date, hours] of Object.entries(data)) {
        if (date.startsWith(currentYear)) {
            yearHours += hours;
            if (date.startsWith(currentMonth)) {
                monthHours += hours;
            }
        }
    }
    
    document.getElementById('todayHours').textContent = todayHours.toFixed(2);
    document.getElementById('monthHours').textContent = monthHours.toFixed(2);
    document.getElementById('yearHours').textContent = yearHours.toFixed(2);
    
    const daysInMonth = new Date(currentYear, parseInt(currentMonth.split('-')[1]), 0).getDate();
    const monthGoal = (DAILY_GOAL * daysInMonth).toFixed(0);
    document.getElementById('monthGoal').textContent = `Goal: ${monthGoal} hours`;
    
    updateProgressTrackers();
}

function updateProgressTrackers() {
    const data = loadData();
    const today = new Date().toISOString().split('T')[0];
    const todayHours = data[today] || 0;
    
    const todayPercent = Math.min((todayHours / DAILY_GOAL) * 100, 100);
    const todayProgressBar = document.getElementById('todayProgress');
    todayProgressBar.style.width = todayPercent + '%';
    
    if (todayHours > DAILY_GOAL) {
        todayProgressBar.classList.add('over-goal');
    } else {
        todayProgressBar.classList.remove('over-goal');
    }
    
    document.getElementById('todayProgressText').textContent = 
        `${todayHours.toFixed(2)} / ${DAILY_GOAL} hours`;
    
    const todayDiff = todayHours - DAILY_GOAL;
    const todayStatus = document.getElementById('todayProgressStatus');
    if (todayDiff >= 0) {
        todayStatus.textContent = `+${todayDiff.toFixed(2)}h`;
        todayStatus.className = 'progress-status ahead';
    } else {
        todayStatus.textContent = `${todayDiff.toFixed(2)}h`;
        todayStatus.className = 'progress-status behind';
    }
    
    const currentWeek = getWeekKey(new Date());
    let weekHours = 0;
    for (const [date, hours] of Object.entries(data)) {
        if (getWeekKey(new Date(date + 'T00:00:00')) === currentWeek) {
            weekHours += hours;
        }
    }
    
    const weekGoal = DAILY_GOAL * 7;
    const weekPercent = Math.min((weekHours / weekGoal) * 100, 100);
    const weekProgressBar = document.getElementById('weekProgress');
    weekProgressBar.style.width = weekPercent + '%';
    
    if (weekHours > weekGoal) {
        weekProgressBar.classList.add('over-goal');
    } else {
        weekProgressBar.classList.remove('over-goal');
    }
    
    document.getElementById('weekProgressText').textContent = 
        `${weekHours.toFixed(2)} / ${weekGoal.toFixed(2)} hours`;
    
    const weekDiff = weekHours - weekGoal;
    const weekStatus = document.getElementById('weekProgressStatus');
    if (weekDiff >= 0) {
        weekStatus.textContent = `+${weekDiff.toFixed(2)}h ahead`;
        weekStatus.className = 'progress-status ahead';
    } else {
        weekStatus.textContent = `${weekDiff.toFixed(2)}h behind`;
        weekStatus.className = 'progress-status behind';
    }
}

function renderHistory() {
    const data = loadData();
    const historyList = document.getElementById('historyList');
    const selectedDate = document.getElementById('entryDate').value;
    
    const dateLabel = document.getElementById('historyDateLabel');
    if (selectedDate) {
        dateLabel.textContent = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else {
        dateLabel.textContent = 'Select a date';
    }
    
    if (!selectedDate) {
        historyList.innerHTML = '<div class="empty-state">Select a date to view history</div>';
        return;
    }
    
    const hours = data[selectedDate];
    
    if (!hours || hours === 0) {
        historyList.innerHTML = '<div class="empty-state">No entries for this date</div>';
        return;
    }
    
    historyList.innerHTML = `
        <div class="history-item">
            <span class="history-date">${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })}</span>
            <span class="history-hours">${hours.toFixed(2)} hours</span>
            <div class="history-actions">
                <button class="btn btn-small btn-edit" onclick="editEntry('${selectedDate}', ${hours})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteEntry('${selectedDate}')">Delete</button>
            </div>
        </div>
    `;
}

function editEntry(date, currentHours) {
    const newHours = prompt(`Edit hours for ${date}:`, currentHours.toFixed(2));
    if (newHours !== null && !isNaN(newHours) && parseFloat(newHours) >= 0) {
        updateTime(date, parseFloat(newHours));
    }
}

function deleteEntry(date) {
    if (confirm(`Delete entry for ${date}?`)) {
        deleteTime(date);
    }
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);

document.getElementById('addBtn').addEventListener('click', () => {
    const date = document.getElementById('entryDate').value;
    const hours = parseInt(document.getElementById('entryHours').value) || 0;
    const minutes = parseInt(document.getElementById('entryMinutes').value) || 0;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    if (hours === 0 && minutes === 0) {
        alert('Please enter at least some time (hours or minutes)');
        return;
    }
    
    const totalHours = hours + (minutes / 60);
    addTime(date, totalHours);
    document.getElementById('entryHours').value = '0';
    document.getElementById('entryMinutes').value = '0';
});

document.getElementById('entryDate').valueAsDate = new Date();

document.getElementById('entryDate').addEventListener('change', renderHistory);

updateStats();
renderHistory();

let currentCalendarMonth = new Date();

function renderCalendar() {
    const data = loadData();
    const calendar = document.getElementById('calendar');
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    
    document.getElementById('calendarMonth').textContent = 
        currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let calendarHTML = dayHeaders.map(day => 
        `<div class="calendar-day-header">${day}</div>`
    ).join('');
    
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hours = data[date] || 0;
        
        let dayClass = 'calendar-day';
        if (hours > 0) {
            dayClass += hours >= DAILY_GOAL ? ' goal-met' : ' has-data';
        }
        if (date === today) {
            dayClass += ' today';
        }
        
        calendarHTML += `
            <div class="${dayClass}" onclick="quickEdit('${date}', ${hours})">
                <div class="day-number">${day}</div>
                ${hours > 0 ? `<div class="day-hours">${hours.toFixed(2)}h</div>` : ''}
            </div>
        `;
    }
    
    calendar.innerHTML = calendarHTML;
}

function quickEdit(date, currentHours) {
    const newHours = prompt(`Edit hours for ${date}:`, currentHours.toFixed(2));
    if (newHours !== null && !isNaN(newHours) && parseFloat(newHours) >= 0) {
        if (parseFloat(newHours) === 0) {
            deleteTime(date);
        } else {
            updateTime(date, parseFloat(newHours));
        }
        renderCalendar();
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        if (tabName === 'calendar') {
            renderCalendar();
        }
    });
});

document.getElementById('prevMonth').addEventListener('click', () => {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

function checkMilestones() {
    const data = loadData();
    const milestones = JSON.parse(localStorage.getItem('milestones') || '{}');
    
    const today = new Date().toISOString().split('T')[0];
    const currentWeek = getWeekKey(new Date());
    const currentMonth = today.substring(0, 7);
    const currentYear = today.substring(0, 4);
    
    let weekHours = 0;
    let monthHours = 0;
    let yearHours = 0;
    
    for (const [date, hours] of Object.entries(data)) {
        if (getWeekKey(new Date(date + 'T00:00:00')) === currentWeek) {
            weekHours += hours;
        }
        if (date.startsWith(currentMonth)) {
            monthHours += hours;
        }
        if (date.startsWith(currentYear)) {
            yearHours += hours;
        }
    }
    
    const weekGoal = DAILY_GOAL * 7;
    const daysInMonth = new Date(currentYear, parseInt(currentMonth.split('-')[1]), 0).getDate();
    const monthGoal = DAILY_GOAL * daysInMonth;
    
    if (weekHours >= weekGoal && !milestones[`week_${currentWeek}`]) {
        showMilestone('🎉', 'Weekly Goal Achieved!', `Amazing! You've spent ${weekHours.toFixed(2)} hours outside this week!`);
        milestones[`week_${currentWeek}`] = true;
        localStorage.setItem('milestones', JSON.stringify(milestones));
    }
    
    if (monthHours >= monthGoal && !milestones[`month_${currentMonth}`]) {
        showMilestone('🌟', 'Monthly Goal Crushed!', `Incredible! You've reached ${monthHours.toFixed(2)} hours this month!`);
        milestones[`month_${currentMonth}`] = true;
        localStorage.setItem('milestones', JSON.stringify(milestones));
    }
    
    const hundredMark = Math.floor(yearHours / 100) * 100;
    if (hundredMark > 0 && hundredMark % 100 === 0 && !milestones[`hundred_${hundredMark}`]) {
        const remaining = YEARLY_GOAL - yearHours;
        showMilestone('🏆', `${hundredMark} Hours Milestone!`, `You're on fire! ${remaining.toFixed(0)} hours to go until your yearly goal!`);
        milestones[`hundred_${hundredMark}`] = true;
        localStorage.setItem('milestones', JSON.stringify(milestones));
    }
    
    if (yearHours >= YEARLY_GOAL && !milestones[`year_${currentYear}`]) {
        showMilestone('👑', 'YEARLY GOAL ACHIEVED!', `LEGENDARY! You've spent ${yearHours.toFixed(2)} hours outside this year! You're a nature champion!`);
        milestones[`year_${currentYear}`] = true;
        localStorage.setItem('milestones', JSON.stringify(milestones));
        createConfetti();
    }
}

function getWeekKey(date) {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${year}_${weekNumber}`;
}

function showMilestone(icon, title, message) {
    const modal = document.getElementById('milestoneModal');
    modal.innerHTML = `
        <div class="milestone-modal">
            <div class="milestone-content">
                <div class="milestone-icon">${icon}</div>
                <h2 class="milestone-title">${title}</h2>
                <p class="milestone-message">${message}</p>
                <button class="milestone-close" onclick="closeMilestone()">Continue Your Journey</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function closeMilestone() {
    document.getElementById('milestoneModal').style.display = 'none';
}

function createConfetti() {
    const colors = ['#4a7c59', '#2d5016', '#87ceeb', '#90ee90', '#ffd700'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

const originalAddTime = addTime;
addTime = function(date, hours) {
    originalAddTime(date, hours);
    checkMilestones();
};

const originalUpdateTime = updateTime;
updateTime = function(date, hours) {
    originalUpdateTime(date, hours);
    checkMilestones();
};
