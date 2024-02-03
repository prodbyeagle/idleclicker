// achievements.js

const achievements = [
    {
        id: 'click_500',
        name: '👶 Click Novice',
        description: '👶 Click 500 times',
        target: 500,
        unlocked: false
    },
    {
        id: 'score_100k',
        name: '🚀 Score Beginner',
        description: '🚀 Reach a score of 100,000',
        target: 100000,
        unlocked: false
    },
    {
        id: 'click_1000',
        name: '🔥 Click Master',
        description: '🔥 Click 1,000 times',
        target: 1000,
        unlocked: false
    },
    {
        id: 'click_10000',
        name: '🌟 Click Legend',
        description: '🌟 Click 10,000 times',
        target: 10000,
        unlocked: false
    },
    {
        id: 'score_500k',
        name: '🏆 Score Pro',
        description: '🏆 Reach a score of 500,000',
        target: 500000,
        unlocked: false
    },
    {
        id: 'click_5000',
        name: '👑 Click Grandmaster',
        description: '👑 Click 5,000 times',
        target: 5000,
        unlocked: false
    },
    {
        id: 'score_2m',
        name: '🌠 Score Grandmaster',
        description: '🌠 Reach a score of 2 million',
        target: 2000000,
        unlocked: false
    },
    {
        id: 'click_100000',
        name: '🎮 Click God',
        description: '🎮 Click 100,000 times',
        target: 100000,
        unlocked: false
    },
    {
        id: 'click_50000',
        name: '🔱 Click Deity',
        description: '🔱 Click 50,000 times',
        target: 50000,
        unlocked: false
    },
    {
        id: 'score_5m',
        name: '🏅 Score Legend',
        description: '🏅 Reach a score of 5 million',
        target: 5000000,
        unlocked: false
    },
    {
        id: 'score_10m',
        name: '🎖️ Score Master',
        description: '🎖️ Reach a score of 10 million',
        target: 10000000,
        unlocked: false
    },
    {
        id: 'click_250000',
        name: '💎 Click Supreme',
        description: '💎 Click 250,000 times',
        target: 250000,
        unlocked: false
    },
];

// Lade Achievements aus dem localStorage
function loadAchievements() {
    const savedAchievements = localStorage.getItem('achievements');
    
    if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);

        achievements.forEach(achievement => {
            if (parsedAchievements[achievement.id]) {
                achievement.unlocked = parsedAchievements[achievement.id].unlocked;
            }
        });
    } else {
        saveAchievements(); // Speichere leere Achievements, wenn keine vorhanden sind
    }
}

// Speichere Achievements im localStorage
function saveAchievements() {
    // Die saveAchievements-Funktion bleibt unverändert
    const toSave = {};
    achievements.forEach(achievement => {
        toSave[achievement.id] = {
            unlocked: achievement.unlocked
        };
    });

    localStorage.setItem('achievements', JSON.stringify(toSave));
}

function resetAchievements() {
    achievements.forEach(achievement => {
        achievement.unlocked = false;
    });

    saveAchievements(); // Speichere die Änderungen im localStorage
    updateAchievements(); // Aktualisiere die Anzeige nach dem Zurücksetzen
}

const achievementsSound = document.getElementById('achievementsSound');

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if ((achievement.id.startsWith('click') && totalClicks >= achievement.target) ||
                (achievement.id.startsWith('score') && score >= achievement.target)) {

                achievementsSound.currentTime = 0; // Setze die Abspielposition zurück
                achievementsSound.play();
                achievementsSound.volume = 0.2;

                achievement.unlocked = true;
                saveAchievements(); // Speichere die aktualisierten Achievements
                showUpgradeNotification(`🏆 Achievement unlocked: ${achievement.name}`);
            }
        }
    });
}

const achievementsContainer = document.getElementById('achievements-container');
let tooltipTimeout;

function updateAchievements() {
    achievementsContainer.innerHTML = '<h2>🏆 Achievements:</h2>'; // Setze den Titel zurück

    achievements.forEach(achievement => {
        // Nur für entsperrte Achievements Elemente erstellen
        if (achievement.unlocked) {
            const achievementElement = document.createElement('div');
            achievementElement.textContent = `${achievement.name}: ✅`;

            // Füge immer die 'achievement' und 'unlocked' Klasse hinzu
            achievementElement.classList.add('achievement', 'unlocked');
            achievementElement.setAttribute('data-tooltip-content', achievement.description);

            // Füge das Achievement-Element zum Container hinzu
            achievementsContainer.appendChild(achievementElement);

            // Füge Event-Listener für Tooltip-Hover hinzu
            achievementElement.addEventListener('mouseover', (event) => {
                const content = achievementElement.getAttribute('data-tooltip-content');
                handleTooltip(event, content);
            });

            // Verwende mouseleave anstelle von mouseout für stabilere Effekte
            achievementElement.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                hideTooltip();
            });
        }
    });
}

// Lade Achievements beim Start des Spiels
loadAchievements();