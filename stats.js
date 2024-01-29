// Beispielwerte für die Stats
let totalClicks = 0;
let totalScore = 0;
let doubleClicksUpgradeLevel = 0;
let luckyClicksUpgradeLevel = 0;
let autoClickerUpgradeLevel = 0;

// Funktion zum Aktualisieren der Stats
function updateStats() {
    document.getElementById("doubleClicksUpgradeLevel").textContent = doubleClicksUpgradeLevel.toString();
    document.getElementById("luckyClicksUpgradeLevel").textContent = luckyClicksUpgradeLevel.toString();
    document.getElementById("autoClickerUpgradeLevel").textContent = autoClickerUpgradeLevel.toString();
    document.getElementById("totalClicks").textContent = totalClicks.toString();
    document.getElementById("totalScoreValue").textContent = totalScore.toString();
}

// Funktion zum Laden der Stats aus dem Local Storage
function loadStatsFromLocalStorage() {
    if (!localStorage.getItem('statsReset')) {
        const savedTotalClicks = localStorage.getItem('totalClicks');
        if (savedTotalClicks) {
            totalClicks = parseInt(savedTotalClicks, 10);
        }

        const savedTotalScore = localStorage.getItem('totalScore');
        if (savedTotalScore) {
            totalScore = parseInt(savedTotalScore, 10);
        }

        const savedDoubleClicksUpgradeLevel = localStorage.getItem('doubleClicksUpgradeLevel');
        if (savedDoubleClicksUpgradeLevel) {
            doubleClicksUpgradeLevel = parseInt(savedDoubleClicksUpgradeLevel, 10);
        }

        const savedLuckyClicksUpgradeLevel = localStorage.getItem('luckyClicksUpgradeLevel');
        if (savedLuckyClicksUpgradeLevel) {
            luckyClicksUpgradeLevel = parseInt(savedLuckyClicksUpgradeLevel, 10);
        }

        const savedAutoClickerUpgradeLevel = localStorage.getItem('autoClickerUpgradeLevel');
        if (savedAutoClickerUpgradeLevel) {
            autoClickerUpgradeLevel = parseInt(savedAutoClickerUpgradeLevel, 10);
        }
    }
}

// Funktion zum Speichern der Stats im Local Storage
function saveStatsToLocalStorage() {
    localStorage.setItem('doubleClicksUpgradeLevel', doubleClicksUpgradeLevel);
    localStorage.setItem('luckyClicksUpgradeLevel', luckyClicksUpgradeLevel);
    localStorage.setItem('autoClickerUpgradeLevel', autoClickerUpgradeLevel);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('totalScore', totalScore);
}

// Funktion zum Zurücksetzen der Stats
function resetStats() {
    try {

        // Zeige eine Bestätigungswarnung
        const isConfirmed = window.confirm('Möchten Sie wirklich alle Statistiken zurücksetzen?');

        if (isConfirmed) {
            totalClicks = 0;
            totalScore = 0;
            doubleClicksUpgradeLevel = 0;
            luckyClicksUpgradeLevel = 0;
            autoClickerUpgradeLevel = 0;
            score = 0;

            saveStatsToLocalStorage();
            updateStats();
            updateScore();

            // Setze die Variable, um zu markieren, dass die Stats zurückgesetzt wurden
            localStorage.setItem('statsReset', 'true'); // Umwandlung in String

            // Nach dem Neuladen (nachdem die Seite neu geladen wurde)
            showUpgradeNotification("✅ STATS SUCCESSFULLY RESET");
        }
    } catch (error) {
        console.error('Fehler beim Zurücksetzen der Stats:', error);
    }
}

// Initialisiere die Stats beim Laden der Seite
loadStatsFromLocalStorage();

// Fügen Sie einen Event Listener für den Reset-Button hinzu
const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', resetStats);
    localStorage.removeItem('statsReset');
}