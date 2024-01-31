// game.js

let score = 0;
let clickMultiplier = 1;

// DOM-Elemente
const clickBtn = document.getElementById('clickBtn');
const scoreElement = document.getElementById('scoreValue');
const upgradeButtons = document.querySelectorAll('#upgrades button');

// Versuche, den Spielstand aus dem Local Storage abzurufen
const savedScore = localStorage.getItem('score');
if (savedScore) {
    score = parseInt(savedScore, 10);
    updateScore();
}

function saveScoreToLocalStorage() {
    localStorage.setItem('score', score.toString());
}

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

// Click-Event für den Button
clickBtn.addEventListener('click', function() {
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


// Dev Overlay

document.addEventListener('DOMContentLoaded', () => {
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

document.addEventListener('keydown', function (event) {
    if (event.key === '´') {
        toggleDevOverlay();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.background');

    function randomizePosition() {
        const newX = Math.floor(Math.random() * 101) - 50; // Zufällige X-Position zwischen -50 und 50
        const newY = Math.floor(Math.random() * 101) - 50; // Zufällige Y-Position zwischen -50 und 50

        background.style.transform = `translate(-50% + ${newX}%, -50% + ${newY}%)`;
    }

    function randomizeMovement() {
        randomizePosition();
    }

    setInterval(randomizeMovement, 5000); // Ändere die Position alle 5 Sekunden (5000 Millisekunden)
});

