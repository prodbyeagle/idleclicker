// stats.js

// Beispielwerte für die Stats
let totalClicks = 0;
let totalScore = 0;

// Funktion zum Aktualisieren der Stats
function updateStats() {
    document.getElementById("totalClicks").textContent = simplifyNumber(totalClicks);
    document.getElementById("totalScoreValue").textContent = simplifyNumber(totalScore);
}

// Funktion zum Laden der Stats aus dem Local Storage
function loadStatsFromLocalStorage() {
    const savedStats = JSON.parse(localStorage.getItem('stats'));
    if (savedStats) {
        totalClicks = savedStats.totalClicks || 0;
        totalScore = savedStats.totalScore || 0;
    }
}

// Funktion zum Speichern der Stats im Local Storage
function saveStatsToLocalStorage() {
    localStorage.setItem('stats', JSON.stringify({
        totalClicks,
        totalScore
    }));
}

// Funktion zum Zurücksetzen der Stats
function resetStats() {
    try {
        // Erstellen Sie die Bestätigungsnachricht mit aktuellen Statistiken
        const confirmationMessage = `
            Möchten Sie wirklich alle Statistiken zurücksetzen?
            (Lade die Seite neu nach dem Reset)

            Aktuelle Statistiken:
            - Total Clicks: ${simplifyNumber(totalClicks)}
            - Total Score: ${simplifyNumber(totalScore)}
            - Current Score: ${simplifyNumber(score)}
        `;

        // Zeige die Bestätigungsnachricht
        const isConfirmed = window.confirm(confirmationMessage);

        // Deaktiviere den Auto Clicker, falls aktiv
        const autoClickerButton = document.getElementById('toggleAutoClicker');
        if (autoClickerButton.classList.contains('active')) {
            showUpgradeNotification("Please turn off the Auto Clicker before Reset!");
            return; // Stoppe den Reset-Prozess, wenn Auto Clicker aktiv ist
        }

        if (isConfirmed) {
            totalClicks = 0;
            totalScore = 0;
            score = 0;

            autoClickerButton.style.display = 'none';
            saveStatsToLocalStorage();
            updateStats();
            updateScore();
            saveUpgradesToLocalStorage();
            updateUpgradeButtons();

            localStorage.setItem('statsReset', 'true');
            showUpgradeNotification("✅ STATS SUCCESSFULLY RESET");

            // Upgrade-Levels auf null zurücksetzen
            for (const upgradeId in upgrades) {
                if (upgrades.hasOwnProperty(upgradeId)) {
                    upgrades[upgradeId].level = 0;
                    upgrades[upgradeId].owned = 0;
                    upgrades[upgradeId].cost = upgrades[upgradeId].basecost;
                }
            }
            saveStatsToLocalStorage();
            updateStats();
            updateScore();
            saveUpgradesToLocalStorage();
            updateUpgradeButtons();
        }
    } catch (error) {
        console.error('Fehler beim Zurücksetzen der Stats:', error);
    }
}


// Fügen Sie einen Event Listener für den Reset-Button hinzu
const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', resetStats);
}

loadStatsFromLocalStorage();