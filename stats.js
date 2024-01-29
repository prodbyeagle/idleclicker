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

function loadStatsFromLocalStorage() {
    if (!localStorage.getItem('statsReset')) {
        const savedTotalClicks = localStorage.getItem('totalClicks');
        if (savedTotalClicks !== null) {
            totalClicks = parseInt(savedTotalClicks, 10);
        }

        const savedTotalScore = localStorage.getItem('totalScore');
        if (savedTotalScore !== null) {
            totalScore = parseInt(savedTotalScore, 10);
        }

        const savedDoubleClicksUpgradeLevel = localStorage.getItem('doubleClicksUpgradeLevel');
        if (savedDoubleClicksUpgradeLevel !== null) {
            doubleClicksUpgradeLevel = parseInt(savedDoubleClicksUpgradeLevel, 10);
        }

        const savedLuckyClicksUpgradeLevel = localStorage.getItem('luckyClicksUpgradeLevel');
        if (savedLuckyClicksUpgradeLevel !== null) {
            luckyClicksUpgradeLevel = parseInt(savedLuckyClicksUpgradeLevel, 10);
        }

        const savedAutoClickerUpgradeLevel = localStorage.getItem('autoClickerUpgradeLevel');
        if (savedAutoClickerUpgradeLevel !== null) {
            autoClickerUpgradeLevel = parseInt(savedAutoClickerUpgradeLevel, 10);
        }
    }
}

// Funktion zum Speichern der Stats im Local Storage
function saveStatsToLocalStorage() {
    localStorage.setItem('doubleClicksUpgradeLevel', doubleClicksUpgradeLevel.toString());
    localStorage.setItem('luckyClicksUpgradeLevel', luckyClicksUpgradeLevel.toString());
    localStorage.setItem('autoClickerUpgradeLevel', autoClickerUpgradeLevel.toString());
    localStorage.setItem('totalClicks', totalClicks.toString());
    localStorage.setItem('totalScore', totalScore.toString());
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

            saveStatsToLocalStorage();
            updateStats();

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
}