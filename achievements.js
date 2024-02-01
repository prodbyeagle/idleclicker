// achievements.js

const achievements = [
    {
        id: 'click_100',
        name: '👶 Click Novice',
        description: 'Click 100 times',
        target: 100,
        unlocked: false
    },
    {
        id: 'click_500',
        name: '🏅 Click Expert',
        description: 'Click 500 times',
        target: 500,
        unlocked: false
    },
    {
        id: 'score_100k',
        name: '🚀 Score Beginner',
        description: 'Reach a score of 100,000',
        target: 100000,
        unlocked: false
    },
    {
        id: 'click_1000',
        name: '🔥 Click Master',
        description: 'Click 1,000 times',
        target: 1000,
        unlocked: false
    },
    {
        id: 'click_10000',
        name: '🌟 Click Legend',
        description: 'Click 10,000 times',
        target: 10000,
        unlocked: false
    },
    {
        id: 'score_500k',
        name: '🏆 Score Pro',
        description: 'Reach a score of 500,000',
        target: 500000,
        unlocked: false
    },
    {
        id: 'score_1m',
        name: '🎖️ Score Master',
        description: 'Reach a score of 1 million',
        target: 1000000,
        unlocked: false
    },
    {
        id: 'click_5000',
        name: '👑 Click Grandmaster',
        description: 'Click 5,000 times',
        target: 5000,
        unlocked: false
    },
    {
        id: 'score_2m',
        name: '🌠 Score Grandmaster',
        description: 'Reach a score of 2 million',
        target: 2000000,
        unlocked: false
    },
    {
        id: 'click_100000',
        name: '🎮 Click God',
        description: 'Click 100,000 times',
        target: 100000,
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

function checkAchievements() {
    console.log('Checking Achievements...');
    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if ((achievement.id.startsWith('click') && totalClicks >= achievement.target) ||
                (achievement.id.startsWith('score') && score >= achievement.target)) {
                achievement.unlocked = true;
                saveAchievements(); // Speichere die aktualisierten Achievements
                showUpgradeNotification(`🏆 Achievement unlocked: ${achievement.name}`);
            }
        }
    });
}

function updateAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    achievementsContainer.innerHTML = '<h2>Achievements:</h2>'; // Setze den Titel zurück

    achievements.forEach(achievement => {
        if (achievement.unlocked) {
            const achievementElement = document.createElement('div');
            achievementElement.textContent = `${achievement.name}: Unlocked`;

            // Erstelle ein Tooltip-Element
            const tooltip = document.createElement('div');
            tooltip.classList.add('achtooltip');
            tooltip.textContent = achievement.description;

            // Füge das Tooltip-Element als Kind zum Achievement-Element hinzu
            achievementElement.appendChild(tooltip);

            // Füge das Achievement-Element zum Container hinzu
            achievementsContainer.appendChild(achievementElement);
        }
    });
}

// Lade Achievements beim Start des Spiels
loadAchievements();