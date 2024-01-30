// stats.js

// Beispielwerte für die Stats
let totalClicks = 0;
let totalScore = 0;
let totalautoClicks = 0;
let totalautoScore = 0;

// Funktion zum Aktualisieren der Stats
function updateStats() {
    document.getElementById("totalClicks").textContent = simplifyNumber(totalClicks);
    document.getElementById("totalScoreValue").textContent = simplifyNumber(totalScore);
    document.getElementById('totalautoClicks').textContent = simplifyNumber(totalautoClicks);
    document.getElementById('totalautoScoreValue').textContent = simplifyNumber(totalautoScore);

}

// Funktion zum Hinzufügen eines Klicks zum Auto-Clicker
function addAutoClick() {
    totalautoClicks++;
    totalautoScore += clickMultiplier; // Hier kannst du die Score-Logik des Auto-Clickers hinzufügen
    updateStats();
    saveStatsToLocalStorage()
}

// Funktion zum Laden der Stats aus dem Local Storage
function loadStatsFromLocalStorage() {
    const savedStats = JSON.parse(localStorage.getItem('stats'));
    if (savedStats) {
        totalClicks = savedStats.totalClicks || 0;
        totalScore = savedStats.totalScore || 0;
        totalautoScore = savedStats.totalautoScore || 0;
        totalautoClicks = savedStats.totalautoClicks || 0;
    }
}

// Funktion zum Speichern der Stats im Local Storage
function saveStatsToLocalStorage() {
    localStorage.setItem('stats', JSON.stringify({
        totalClicks,
        totalScore,
        totalautoScore,
        totalautoClicks
    }));
}

function calculatePrestigeBonus() {
    const baseBonus = 1000000;
    const bonusMultiplier = 1.2;
    const prestigeLevel = 1;

    return Math.floor(baseBonus * Math.pow(bonusMultiplier, prestigeLevel));
}

function resetStats() {
    try {
        // Erstellen Sie die Bestätigungsnachricht mit aktuellen Statistiken
        const confirmationMessage = `
            Möchten Sie wirklich alle Statistiken zurücksetzen?
            (Lade die Seite neu nach dem Reset)
            (Es wird immer einmal Geklickt aus verschiedenen Gründen)

            Aktuelle Statistiken:
            - Total Clicks: ${simplifyNumber(totalClicks)}
            - Total Score: ${simplifyNumber(totalScore)}
            - Current Score: ${simplifyNumber(score)}
        `;

        // Zeige die Bestätigungsnachricht
        const isConfirmed = window.confirm(confirmationMessage);
        const prestigeChance = 0.00005;
        const hasPrestige = Math.random() < prestigeChance;

        // Deaktiviere den Auto Clicker, falls aktiv
        const autoClickerButton = document.getElementById('toggleAutoClicker');
        if (autoClickerButton.classList.contains('active')) {
            stopAutoClicker();
            showUpgradeNotification("❌ Please turn off the Auto Clicker before Reset!");
            return;
        }

        if (isConfirmed) {
            if (hasPrestige) {
                const prestigeBonus = calculatePrestigeBonus();
                showUpgradeNotification(`🌟 Prestige Bonus: +${simplifyNumber(prestigeBonus)} added!`);
                totalScore += prestigeBonus;
            } else {
                // Wenn kein Prestige, setze die Statistiken zurück
                totalClicks = 0;
                totalScore = 0;
                score = 0;
                totalautoScore = 0;
                totalautoClicks = 0;

                autoClickerButton.style.display = 'none';
                saveStatsToLocalStorage();
            }

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

            // Überprüfe nach dem Zurücksetzen die Werte der Stats und Upgrade-Levels
            console.log("Stats nach dem Reset:", totalClicks, totalScore, totalautoClicks, totalautoScore);
            console.log("Upgrade-Levels nach dem Reset:", upgrades);

            // Speichere die Änderungen im Local Storage, bevor die Seite neu geladen wird
            saveStatsToLocalStorage();

            // Simuliere einen Klick auf den Clicker-Button
            const clickBtn = document.getElementById('clickBtn');
            if (clickBtn) {
                clickBtn.click();
            }

            // Lade die Seite nach 5 Sekunden neu
            setTimeout(() => {
                location.reload();
            }, 1000);
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
saveStatsToLocalStorage();
updateStats();
updateScore();
saveUpgradesToLocalStorage();
updateUpgradeButtons();