// Configuration matching the image
const startDate = new Date("2026-01-11"); // Sunday Jan 11 (Adjust year as needed)
const totalWeeks = 4;
const daysPerWeek = 7;

// This object holds the state
let readingData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderGrid();
});

function renderGrid() {
    const grid = document.getElementById('scorecard-grid');
    // Important: We need to attach the grid items to the wrapper directly 
    // to respect the CSS grid layout, not nest them inside a div.
    const wrapper = document.querySelector('.calendar-wrapper');
    
    // Remove existing grid items (keeping headers)
    const existingItems = wrapper.querySelectorAll('.day-card, .weekly-total-card');
    existingItems.forEach(el => el.remove());

    let currentDate = new Date(startDate);

    for (let w = 0; w < totalWeeks; w++) {
        // Create 7 Days
        for (let d = 0; d < daysPerWeek; d++) {
            const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
            const dataKey = `w${w}-d${d}`;
            
            // Find saved data for this specific day
            const savedDay = readingData.find(item => item.id === dataKey) || {};

            const dayCard = document.createElement('div');
            dayCard.className = `day-card ${savedDay.minutes ? 'filled' : ''}`;
            dayCard.innerHTML = `
                <span class="date-label">${dateStr}</span>
                <input type="text" 
                       placeholder="Initials" 
                       class="input-initials" 
                       maxlength="3" 
                       value="${savedDay.initials || ''}"
                       onchange="updateData('${dataKey}', 'initials', this.value)">
                <input type="number" 
                       placeholder="Min" 
                       class="input-min" 
                       value="${savedDay.minutes || ''}"
                       onchange="updateData('${dataKey}', 'minutes', this.value)">
            `;
            wrapper.appendChild(dayCard);

            // Increment Date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Create Weekly Total Box
        const weeklyKey = `w${w}-total`;
        const savedTotal = readingData.find(item => item.id === weeklyKey) || {};

        const totalCard = document.createElement('div');
        totalCard.className = 'weekly-total-card';
        totalCard.innerHTML = `
            <label>WEEKLY<br>UNITS</label>
            <input type="number" 
                   value="${savedTotal.units || ''}"
                   onchange="updateData('${weeklyKey}', 'units', this.value)">
        `;
        wrapper.appendChild(totalCard);
    }
}

// Update State
function updateData(id, field, value) {
    let item = readingData.find(x => x.id === id);
    
    if (!item) {
        item = { id: id };
        readingData.push(item);
    }
    
    item[field] = value;
    
    // Save automatically to local storage
    localStorage.setItem('readingBowlData', JSON.stringify(readingData));

    // Visual feedback
    if(field === 'minutes' && value > 0) {
        celebrate();
    }
}

// Save Button (Explicit save)
function saveData() {
    localStorage.setItem('readingBowlData', JSON.stringify(readingData));
    alert("Scorecard Saved! Great job reading! 📚");
}

// Load from Local Storage
function loadData() {
    const stored = localStorage.getItem('readingBowlData');
    if (stored) {
        readingData = JSON.parse(stored);
    }
}

// Clear Data
function clearData() {
    if(confirm("Are you sure you want to clear the scorecard?")) {
        localStorage.removeItem('readingBowlData');
        readingData = [];
        renderGrid();
    }
}

// Download JSON (To commit to Repo)
function downloadJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(readingData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "reading_scorecard_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Confetti Effect
function celebrate() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4081', '#00E5FF', '#FFEA00']
    });
}
