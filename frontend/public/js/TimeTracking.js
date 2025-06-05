document.addEventListener("DOMContentLoaded", () => {
    let startTime = null;
    let endTime = null;
    let timerInterval = null;
    let elapsedTime = 0;

    const timeDisplay = document.getElementById('timeDisplay');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const notificationPopup = document.getElementById('notificationPopup');
    const saveSlotName = document.getElementById('saveSlotName');

    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    function updateTimer() {
        const currentTime = Date.now();
        elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        timeDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        startTime = Date.now() - (elapsedTime * 1000);
        timerInterval = setInterval(updateTimer, 1000);
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
    }

    function stopTimer() {
        clearInterval(timerInterval);
        startBtn.style.display = 'inline-block';
        startBtn.disabled = true;
        stopBtn.style.display = 'none';
        notificationPopup.style.display = 'block';
        endTime = new Date();
    }

    function saveTimeSlot(event) {
        const input = slotName.value.trim();
        if (!input) {
            event.preventDefault();
            return false;
        }

        const startDate = new Date(startTime);
        slotDate.value = startDate.toLocaleDateString();
        slotStart.value = startDate.toLocaleTimeString();
        slotEnd.value = endTime.toLocaleTimeString();
        slotDuration.value = formatDuration(elapsedTime);
        slotName.value = input;

        return true;
    }

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    saveSlotName.addEventListener('click', function(event) {
        saveTimeSlot(event);
    });

    // Export functionality
    document.getElementById('batchExportBtn').addEventListener('click', exportSelectedSlots);
    document.getElementById('selectAllBtn').addEventListener('click', toggleSelectAll);
    document.querySelectorAll('.export-single-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            exportSingleSlot(this.dataset.index);
        });
    });

    let allSelected = false;

    function toggleSelectAll() {
        allSelected = !allSelected;
        const checkboxes = document.querySelectorAll('.slot-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = allSelected);
        document.getElementById('selectAllBtn').textContent = allSelected ? 'Deselect All' : 'Select All';
    }

    function exportSingleSlot(index) {
        const row = document.querySelector(`#logRow${index}`);
        const data = getRowData(row);
        downloadFile(formatSlotData(data), `${data.name}.txt`);
    }

    function exportSelectedSlots() {
        const selectedBoxes = document.querySelectorAll('.slot-checkbox:checked');
        if (selectedBoxes.length === 0) {
            alert('Please select at least one time slot to export');
            return;
        }

        let output = '';
        const names = [];
        selectedBoxes.forEach(box => {
            const row = document.querySelector(`#logRow${box.dataset.index}`);
            const data = getRowData(row);
            names.push(data.name);
            output += formatSlotData(data) + '\n\n';
        });

        const filename = names.length === 1 ? `${names[0]}.txt` : 'Export_TimeLogs.txt';
        downloadFile(output, filename);
    }

    function getRowData(row) {
        return {
            name: row.children[5].innerText,
            date: row.children[1].innerText,
            startTime: row.children[2].innerText,
            endTime: row.children[3].innerText,
            duration: row.children[4].innerText
        };
    }

    function formatSlotData(data) {
        return `
Name: ${data.name}
Date: ${data.date}
Start Time: ${data.startTime}
End Time: ${data.endTime}
Duration: ${data.duration}
---`;
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const download = document.createElement('a');
        download.href = url;
        download.download = filename;
        download.click();
        URL.revokeObjectURL(url);
    }
});