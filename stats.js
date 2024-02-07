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
    return `Total Clicks: ${simplifyNumber(totalClicks)}, Total Score: ${simplifyNumber(totalScore)}, Total Auto Score: ${simplifyNumber(totalautoScore)}, Total Auto Clicks: ${simplifyNumber(totalautoClicks)}`;
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

function resetStats() {
    try {
        // Confirmation message
        const confirmationMessage = `
        Do you really want to reset all statistics?
        (Reload the page after reset)
        (Maybe you need luck?)

        Current Statistics:
        - Total Clicks: ${simplifyNumber(totalClicks)}
        - Total Score: ${simplifyNumber(totalScore)}
        - Current Score: ${simplifyNumber(score)}
    `;

        // Show confirmation dialog
        const isConfirmed = window.confirm(confirmationMessage);

        // If confirmed
        if (isConfirmed) {

            // Stop auto clicker if active
            const autoClickerButton = document.getElementById('toggleAutoClicker');
            if (autoClickerButton.classList.contains('active')) {
                stopAutoClicker();
                showUpgradeNotification("❌ Please turn off the Auto Clicker before Reset!");
                return;
            }

            // Reset stats
            totalClicks = 0;
            totalScore = 0;
            totalautoScore = 0;
            totalautoClicks = 0;
            document.getElementById('scoreValue').textContent = 0;
    
            // Reset upgrades
            for (const upgradeId in upgrades) {
                if (upgrades.hasOwnProperty(upgradeId)) {
                    upgrades[upgradeId].level = 0;
                    upgrades[upgradeId].cost = upgrades[upgradeId].basecost;
                    upgrades[upgradeId].owned = 0;
                }
            }

            // Reset score and achievements
            score = 0;
            updateScore();
            localStorage.setItem('score', 0);
            saveScoreToLocalStorage(); 
            achievements.forEach(achievement => {
                achievement.unlocked = false;
            });
            saveAchievements(); 
            updateAchievements();

            // Save and update stats, upgrades, and achievements
            saveStatsToLocalStorage();
            updateStats();
            saveUpgradesToLocalStorage();
            updateUpgradeButtons();
            resetAchievements();
            showUpgradeNotification("✅ STATS SUCCESSFULLY RESET");

            // Reload the page after 5 seconds
            setTimeout(() => {
                location.reload();
            }, 250);
        }
    } catch (error) {
        console.error('Error resetting stats:', error);
    }
}  

// Fügen Sie einen Event Listener für den Reset-Button hinzu
const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', resetStats);
}

loadStatsFromLocalStorage();