// game.js

let score = 0;
let clickMultiplier = 1;
let bonusChance = 0.1;

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
    notificationElement.classList.add('toast-notification');

    const messageElement = document.createElement('div');
    messageElement.textContent = message;

    const progressBar = document.createElement('div');
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

    let duration = 3000;
    const interval = 100;
    let progress = 100;

    const countdownInterval = setInterval(() => {
        progress -= (interval / duration) * 100;
        progressBar.style.width = `${progress}%`;

        if (progress <= 0) {
            clearInterval(countdownInterval);
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
        }
    }, interval);
}

// Click-Event für den Button
clickBtn.addEventListener('click', function() {
    this.classList.add('clicked');
    checkBonusClick();

    // Überprüfen, ob das "Lucky Clicks"-Upgrade vorhanden und auf mindestens Level 1 ist
    const luckyClickUpgrade = upgrades[3];
    if (luckyClickUpgrade && luckyClickUpgrade.level >= 1) {
        applyLuckyClick(0.1); // Passen Sie die Chance nach Bedarf an
    }

    score += clickMultiplier;
    totalClicks++; // Erhöhe die Gesamtanzahl der Klicks
    totalScore += clickMultiplier; // Erhöhe den Gesamtpunktestand
    updateScore();
    updateStats();
    saveScoreToLocalStorage();

    // Anti-Auto Clicker:
    clickBtn.disabled = true;
    setTimeout(() => {
        clickBtn.disabled = false;
        this.classList.remove('clicked'); // Entferne die 'clicked'-Klasse, um die Verkleinerung rückgängig zu machen
    }, 70);
});

// Funktion zur Überprüfung von Bonus-Klicks
function checkBonusClick() {
    const randomValue = Math.random();
    if (randomValue < bonusChance) {
        score += clickMultiplier;
        updateScore();
        saveScoreToLocalStorage();
    }
}

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

// Initialisiere Upgrade-Buttons
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
    devOverlay.classList.toggle('show');
}

function navigateToMongoDB() {
    window.open('https://cloud.mongodb.com/v2/65a8486c3ad4e31de65feda7#/metrics/replicaSet/65a848ff4a03411f028d0a9b/explorer', '_blank');
}

function give1kscore() {
    score += 1000;
    updateScore();
}

function give1mscore() {
    score += 1000000;
    updateScore();
}
function give1bscore() {
    score += 1000000000;
    updateScore();
}
function give1tscore() {
    score += 1000000000000;
    updateScore();
}
function give1qscore() {
    score += 1000000000000000;
    updateScore();
}

document.addEventListener('keydown', function (event) {
    if (event.key === '´') {
        toggleDevOverlay();
    }
});
