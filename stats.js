// stats.js

// Beispielwerte für die Stats
let totalClicks = 0;
let totalScore = 0;
let doubleClicksUpgradeLevel = 0;
let luckyClicksUpgradeLevel = 0;
let autoClickerUpgradeLevel = 0;

// Funktion zum Aktualisieren der Stats
function updateStats() {
    console.log('Updating Stats:', {
        doubleClicksUpgradeLevel,
        luckyClicksUpgradeLevel,
        autoClickerUpgradeLevel,
        totalClicks,
        totalScore,
        score
    }); // Debug-Information hinzufügen

    document.getElementById("doubleClicksUpgradeLevel").textContent = doubleClicksUpgradeLevel.toString();
    document.getElementById("luckyClicksUpgradeLevel").textContent = luckyClicksUpgradeLevel.toString();
    document.getElementById("autoClickerUpgradeLevel").textContent = autoClickerUpgradeLevel.toString();
    document.getElementById("totalClicks").textContent = totalClicks.toString();
    document.getElementById("totalScoreValue").textContent = totalScore.toString();
}

function loadStatsFromLocalStorage() {
    if (!localStorage.getItem('statsReset')) {
        console.log('Loading Stats from Local Storage...'); // Debug-Information hinzufügen

        const savedTotalClicks = localStorage.getItem('totalClicks');
        if (savedTotalClicks !== null) {
            totalClicks = parseInt(savedTotalClicks, 10);
        }

        const savedTotalScore = localStorage.getItem('totalScore');
        if (savedTotalScore !== null) {
            totalScore = parseInt(savedTotalScore, 10);
        }

        const savedDoubleClicksUpgradeLevel = localStorage.getItem('doubleClicksUpgradeLevel'); {
            doubleClicksUpgradeLevel = parseInt(savedDoubleClicksUpgradeLevel, 10);
        }

        const savedLuckyClicksUpgradeLevel = localStorage.getItem('luckyClicksUpgradeLevel'); {
            luckyClicksUpgradeLevel = parseInt(savedLuckyClicksUpgradeLevel, 10);
        }

        const savedAutoClickerUpgradeLevel = localStorage.getItem('autoClickerUpgradeLevel');{
            autoClickerUpgradeLevel = parseInt(savedAutoClickerUpgradeLevel, 10);
        }

        console.log('Stats Loaded:', {
            totalClicks,
            totalScore,
            doubleClicksUpgradeLevel,
            luckyClicksUpgradeLevel,
            autoClickerUpgradeLevel,
            score
        }); // Debug-Information hinzufügen
    }
}

// Funktion zum Speichern der Stats im Local Storage
function saveStatsToLocalStorage() {
    console.log('Saving Stats to Local Storage...');
    localStorage.setItem('doubleClicksUpgradeLevel', doubleClicksUpgradeLevel.toString());
    localStorage.setItem('luckyClicksUpgradeLevel', luckyClicksUpgradeLevel.toString());
    localStorage.setItem('autoClickerUpgradeLevel', autoClickerUpgradeLevel.toString());
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('totalScore', totalScore);
}

// Funktion zum Zurücksetzen der Stats
function resetStats() {
    try {
        console.log('Trying to reset Stats...');
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
            updateUpgradeButtons()
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

// Initialisiere die Stats beim Laden der Seite
console.log('Initializing Stats on Page Load...');
console.log('Initial Stats:', {
    totalClicks,
    totalScore,
    doubleClicksUpgradeLevel,
    luckyClicksUpgradeLevel,
    autoClickerUpgradeLevel,
    score,
});
loadStatsFromLocalStorage();