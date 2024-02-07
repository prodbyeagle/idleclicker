// achievements.js

const achievements = [
    {
        id: 'click_500',
        name: '☝️ 500 Clicks',
        description: '📃 Click 500 times',
        target: 500,
        unlocked: false
    },
    {
        id: 'score_100k',
        name: '📈 100k Coins',
        description: '📃 Reach a score of 100,000',
        target: 100000,
        unlocked: false
    },
    {
        id: 'click_1000',
        name: '☝️ 1k Clicks',
        description: '📃 Click 1,000 times',
        target: 1000,
        unlocked: false
    },
    {
        id: 'click_10000',
        name: '☝️ 10k Clicks',
        description: '📃 Click 10,000 times',
        target: 10000,
        unlocked: false
    },
    {
        id: 'score_500k',
        name: '📈 500k Coins',
        description: '📃 Reach a score of 500,000',
        target: 500000,
        unlocked: false
    },
    {
        id: 'click_5000',
        name: '☝️ 5k Clicks',
        description: '📃 Click 5,000 times',
        target: 5000,
        unlocked: false
    },
    {
        id: 'score_2m',
        name: '📈 2m Clicks',
        description: '📃 Reach a score of 2 million',
        target: 2000000,
        unlocked: false
    },
    {
        id: 'click_100000',
        name: '☝️ Click God',
        description: '📃 Click 100,000 times',
        target: 100000,
        unlocked: false
    },
    {
        id: 'click_50000',
        name: '☝️ Click Deity',
        description: '📃 Click 50,000 times',
        target: 50000,
        unlocked: false
    },
    {
        id: 'score_5m',
        name: '📈 5m Clicks',
        description: '📃 Reach a score of 5 million',
        target: 5000000,
        unlocked: false
    },
    {
        id: 'score_10m',
        name: '📈 10m Clicks',
        description: '📃 Reach a score of 10 million',
        target: 10000000,
        unlocked: false
    },
    {
        id: 'click_250k',
        name: '☝️ Click Supreme',
        description: '📃 Click 250,000 times',
        target: 250000,
        unlocked: false
    },
    {
        id: 'score_250m',
        name: '📈 250m Clicks',
        description: '📃 Reach a score of 250 million',
        target: 2500000000,
        unlocked: false
    },
    {
        id: 'click_1b',
        name: '📈 Are you Crazy?',
        description: '📃 Click 1,000,000,000 times',
        target: 1000000000,
        unlocked: false
    },
    {
        id: 'score_100b',
        name: '📈 100b Score',
        description: '📃 Reach a score of 100,000,000,000 million',
        target: 100000000000,
        unlocked: false
    },
    {
        id: 'score_250b',
        name: '📈 250b Clicks',
        description: '📃 Reach a score of 250,000,000,000 million',
        target: 250000000000,
        unlocked: false
    },
    {
        id: 'score_1t',
        name: '📈 1T Clicks',
        description: '📃 Reach a score of 1,000,000,000,000 million',
        target: 100000000000000,
        unlocked: false
    },
    {
        id: 'score_500t',
        name: '📈 500T Clicks',
        description: '📃 Reach a score of 500,000,000,000,000 million',
        target: 50000000000000,
        unlocked: false
    },
    {
        id: 'score_1q',
        name: '📈 1Q Clicks',
        description: '📃 Reach a score of 1,000,000,000,000,000 million',
        target: 100000000000000000,
        unlocked: false
    },
    {
        id: 'score_500q',
        name: '📈 500Q Clicks',
        description: '📃 Reach a score of 500,000,000,000,000,000 million',
        target: 50000000000000000000,
        unlocked: false
    },
    {
        id: 'score_1un',
        name: '📈 Click ... cant tell',
        description: '📃️ Reach an Score of 1 Undecillion',
        target: 100000000000000000000000000000000,
        unlocked: false
    },
    {
        id: 'click_bruh',
        name: '☝️ IDK HOW?!!?',
        description: '📃 Click INFINITY times',
        target: 100000000000000000000000000000000,
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
    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if ((achievement.id.startsWith('click') && totalClicks >= achievement.target) ||
                (achievement.id.startsWith('score') && score >= achievement.target)) {

                const achievementsSoundVolume = parseFloat(localStorage.getItem('achievementsSoundVolume')) || 1;

                const achievementsSoundElement = document.getElementById('achievementsSound');
                let achievementsSound;

                if (achievementsSoundElement) {
                    achievementsSound = new Audio(achievementsSoundElement.src);
                    achievementsSound.volume = achievementsSoundVolume;
                    achievementsSound.currentTime = 0;

                    // Check if user interaction is required
                    const playPromise = achievementsSound.play();

                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            // Audio playback started successfully
                        }).catch(error => {
                            // Audio playback failed, handle the error
                            displayError('Audio playback failed:', error);
                        });
                    }
                }

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