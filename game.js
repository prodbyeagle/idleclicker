// game.js

let score = 0;
let clickMultiplier = 1;

// DOM-Elemente
const clickBtn = document.getElementById('clickBtn');
const scoreElement = document.getElementById('scoreValue');
const upgradeButtons = document.querySelectorAll('#upgrades button');
const clickSound = document.getElementById('clickSound');
const errorSound = document.getElementById('errorSound');

// Versuche, den Spielstand aus dem Local Storage abzurufen
const savedScore = localStorage.getItem('score');
if (savedScore) {
    score = parseInt(savedScore, 10);
    updateScore();
}

function saveScoreToLocalStorage() {
    localStorage.setItem('score', score.toString());
}


// Notification System
 

function showUpgradeNotification(message) {
    let toastContainer = document.querySelector('.toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container');
        document.body.appendChild(toastContainer);
    }

    const notificationElement = document.createElement('div');
    const messageElement = document.createElement('div');
    const progressBar = document.createElement('div');
    notiSound.currentTime = 0; // Setze die Abspielposition zurück
    notiSound.play();
    notiSound.volume = 0.2;
    notificationElement.classList.add('toast-notification');
    messageElement.textContent = message;

    progressBar.classList.add('progress-bar');
    notificationElement.appendChild(messageElement);
    notificationElement.appendChild(progressBar);

    const notificationElements = toastContainer.querySelectorAll('.toast-notification');

    // Entferne ältere Benachrichtigungen
    if (notificationElements.length > 2) {
        const notificationsToRemove = Array.from(notificationElements).slice(0, -2);
        notificationsToRemove.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    // Füge die neue Benachrichtigung hinzu
    toastContainer.appendChild(notificationElement);

    // Füge die Eingangsanimation-Klasse hinzu, nachdem das Element dem DOM hinzugefügt wurde
    setTimeout(() => {
        notificationElement.classList.add('enter-animation');
    }, 0);

    let duration = 2500;
    const interval = 100;
    let progress = 100;

    const countdownInterval = setInterval(() => {
        progress -= (interval / duration) * 100;
        progressBar.style.width = `${progress}%`;

        // Dynamische Farbänderung basierend auf dem Fortschritt
        if (progress > 75) {
            progressBar.style.backgroundColor = '#45a049'; // Grün
        } else if (progress > 30) {
            progressBar.style.backgroundColor = '#ffd700'; // Gelb
        } else {
            progressBar.style.backgroundColor = '#ff4500'; // Rot
        }

        if (progress <= 0) {
            // Füge die Ausgangsanimation-Klasse hinzu
            notificationElement.classList.add('exit-animation');

            clearInterval(countdownInterval);
            // Warte auf das Ende der Ausgangsanimation, bevor die Benachrichtigung entfernt wird
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.parentNode.removeChild(notificationElement);
                }
            }, 500); // Hier 500 Millisekunden (0,5 Sekunden) einstellen, um zur Ausgangsanimationsdauer zu passen
        }
    }, interval);
}

// ToolTip System

const tooltipTriggerElements = document.querySelectorAll('.tooltip-trigger');
const tooltip = document.getElementById('tooltip');

function setTooltip(content) {
    tooltip.textContent = content;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function handleTooltip(event) {
    const content = event.currentTarget.getAttribute('data-tooltip-content');
    setTooltip(content);
    }


tooltipTriggerElements.forEach(trigger => {
    trigger.addEventListener('mouseover', handleTooltip);
    trigger.addEventListener('mouseout', hideTooltip);
});


// Click-Event für den Button
clickBtn.addEventListener('click', function() {
    try {
        this.classList.add('clicked');

        // Überprüfen, ob das "Lucky Clicks"-Upgrade vorhanden und auf mindestens Level 1 ist
        const luckyClickUpgrade = upgrades[3];
        if (luckyClickUpgrade && luckyClickUpgrade.level >= 1) {
            applyLuckyClick(0.01); // Passen Sie die Chance nach Bedarf an
        }

        // Überprüfen, ob das "More Clicks"-Upgrade vorhanden und auf mindestens Level 1 ist
        const moreClicksUpgrade = upgrades[1];
        if (moreClicksUpgrade && moreClicksUpgrade.level >= 1) {
            clickMultiplier += moreClicksUpgrade.level * moreClicksUpgrade.multiplier;
        }

        const scoreValueElement = document.getElementById('scoreValue');
        scoreValueElement.title = score.toString();

        ambientSound.play();
        ambientSound.volume = 0.1;

        score += clickMultiplier;
        totalClicks++; // Erhöhe die Gesamtanzahl der Klicks
        totalScore += clickMultiplier; // Erhöhe den Gesamtpunktestand
        updateScore();
        updateStats();
        saveStatsToLocalStorage();
        saveScoreToLocalStorage();

        // Anti-Auto Clicker:
        clickBtn.disabled = true;
        setTimeout(() => {
            clickBtn.disabled = false;
            this.classList.remove('clicked'); // Entferne die 'clicked'-Klasse, um die Verkleinerung rückgängig zu machen
        }, 70);

        checkAchievements();
        updateAchievements();
    } catch (error) {
        displayError(error.message);
    }
});

function simplifyNumber(number) {
    const suffixes = ["", "k", "M", "B", "T", "Q", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "Un", "Du", "Tr", "Qu", "Qi", "Se", "St", "Ot", "Nv", "Vg", "Ct", "Ut", "Dt", "Tt", "QtT", "SxT", "SpT", "OcT", "NoT", "DcT", "UnT", "DuT", "TrT", "QuT", "QiT", "SeT", "StT", "OtT", "NvT", "VgT", "CtT", "UtT", "DtT", "TtT", "QtTT", "SxTT", "SpTT", "OcTT"];
    let suffixIndex = 0;

    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
        number /= 1000;
        suffixIndex++;
    }

    return (number >= 1 ? number.toFixed(number % 1 === 0 ? 0 : 2) : number.toFixed(0)).toString() + suffixes[suffixIndex];
}

// Funktion zur Aktualisierung des Spielstands im DOM
function updateScore() {
    scoreElement.textContent = simplifyNumber(score);
}
updateUpgradeButtons();


// Display Error

// Funktion zum Anzeigen von Fehlern auf dem HUD
function displayError(message) {
    const errorContainer = document.getElementById('error-container');

    // Erstelle ein neues Element für den Fehler
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = message;

    errorSound.currentTime = 0; // Setze die Abspielposition zurück
    errorSound.play();
    errorSound.volume = 0.2;

    // Füge das Fehler-Element zum Container hinzu
    errorContainer.appendChild(errorElement);

    // Setze ein Timeout, um den Fehler nach einer gewissen Zeit zu entfernen
    setTimeout(() => {
        // Füge die Klasse 'fade-out' hinzu, um die Transitionsanimation auszulösen
        errorElement.classList.add('fade-out');

        // Warte auf das Ende der Animation und entferne dann das Element
        errorElement.addEventListener('transitionend', () => {
            errorContainer.removeChild(errorElement);
        }, { once: true });
    }, 5000); // Fehler wird nach 5 Sekunden entfernt (passen Sie die Zeit nach Bedarf an)
}

window.addEventListener('load', function () {
    const mobileWarning = document.getElementById('mobile-warning');
    
    if (window.innerWidth <= 600) {
        mobileWarning.style.display = 'block';
    }
    
});
    // Die Audio-Elemente
    const notiSound = document.getElementById('notiSound');
    const ambientSound = document.getElementById('ambientSound');

    // Der Global Mute-Button
    const globalMuteButton = document.getElementById('globalMuteButton');

    // Lese den gespeicherten Zustand aus dem localStorage
    const isMuted = localStorage.getItem('isMuted') === 'true';

    // Setze den initialen Zustand des Buttons basierend auf localStorage
    luckyEventSound.muted = isMuted;
    errorSound.muted = isMuted;
    notiSound.muted = isMuted;
    ambientSound.muted = isMuted;
    achievementsSound.muted = isMuted;

    // Event-Listener für den Global Mute-Button
    globalMuteButton.addEventListener('click', () => {
        // Umschalten zwischen stumm und nicht stumm für alle Sounds
        luckyEventSound.muted = !luckyEventSound.muted;
        errorSound.muted = !errorSound.muted;
        notiSound.muted = !notiSound.muted;
        ambientSound.muted = !ambientSound.muted;
        achievementsSound.muted = !achievementsSound.muted;

        // Speichere den aktuellen Zustand im localStorage
        localStorage.setItem('isMuted', luckyEventSound.muted);

        // Aktualisiere den Text des Buttons basierend auf dem aktuellen Zustand
        globalMuteButton.textContent = luckyEventSound.muted ? '🔇' : '🔊';
    });

    globalMuteButton.textContent = luckyEventSound.muted ? '🔇' : '🔊';


// Dev Overlay
 
document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
});

document.addEventListener('keydown', function (event) {
    if (event.key === '~') {
        toggleDevOverlay();
    }
});

function toggleDevOverlay() {
    const devOverlay = document.getElementById('devOverlay');

    // Überprüfen Sie, ob die Shift-Taste gedrückt ist
    const isShiftPressed = event.shiftKey;

    if (devOverlay) {
        showUpgradeNotification(`HEY!!!!! DONT USE THAT IT CLEARS YOUR STATS ITS ONLY FOR DEVS!`);
        // Überprüfen Sie, ob das Dev Overlay bereits angezeigt wird und die Shift-Taste nicht gedrückt ist
        if (!devOverlay.classList.contains('show') && !isShiftPressed) {
            devOverlay.classList.add('show');
        } else {
            // Wenn Shift gedrückt ist, das Overlay nicht schließen
            if (!isShiftPressed) {
                devOverlay.classList.remove('show');
            }
        }
    }
}

function give1kscore() {
    score += 1000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 1K to the Score`);
    toggleDevOverlay();
}
function give1mscore() {
    score += 1000000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 1M to the Score`);
    toggleDevOverlay();
}
function give1bscore() {
    score += 1000000000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 1B to the Score`);
    toggleDevOverlay();
}
function give1tscore() {
    score += 1000000000000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 1T to the Score`);
    toggleDevOverlay();
}
function give1qscore() {
    score += 1000000000000000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 1Q to the Score`);
    toggleDevOverlay();
}

function give100qscore() {
    score += 100000000000000000;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Added 100Q to the Score`);
    toggleDevOverlay();
}

function dev_resetscore() {
    score = 0;
    updateScore();
    showUpgradeNotification(`⚙️ DEV: Reseted Score`);
    toggleDevOverlay();
}

document.addEventListener('keydown', function (event) {
    if (event.key === '´') {
        toggleDevOverlay();
    }
});