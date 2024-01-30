// stats.js

// Beispielwerte für die Stats
let totalClicks = 0;
let totalScore = 0;

// Funktion zum Aktualisieren der Stats
function updateStats() {
    document.getElementById("totalClicks").textContent = totalClicks.toString();
    document.getElementById("totalScoreValue").textContent = totalScore.toString();
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
        console.log('Trying to reset Stats...');

        // Erstellen Sie die Bestätigungsnachricht mit aktuellen Statistiken
        const confirmationMessage = `
            Möchten Sie wirklich alle Statistiken zurücksetzen?
            (Lade die Seite neu nachdem Reset)

            Aktuelle Statistiken:
            - Total Clicks: ${totalClicks}
            - Total Score: ${totalScore}
            - Current Score: ${score}
        `;

        // Zeige die Bestätigungsnachricht
        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            totalClicks = 0;
            totalScore = 0;
            score = 0;

            saveStatsToLocalStorage();
            updateStats();
            updateScore()

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