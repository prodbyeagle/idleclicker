// game.js

let score = 0;
let clickMultiplier = 1;

// DOM-Elemente
const clickBtn = document.getElementById('clickBtn');
const scoreElement = document.getElementById('scoreValue');
const upgradeButtons = document.querySelectorAll('#upgrades button');
const notiSound = document.getElementById('notiSound');
const ambientSound = document.getElementById('ambientSound');

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

// Lese die gespeicherten Lautstärke-Werte aus dem localStorage
    const notiSoundVolume = parseFloat(localStorage.getItem('notiSoundVolume')) || 1;

    const notiSoundElement = document.getElementById('notiSound');
    let notiSound;

    if (notiSoundElement) {
        notiSound = new Audio(notiSoundElement.src);
        notiSound.volume = notiSoundVolume;
        notiSound.currentTime = 0;

        // Check if user interaction is required
        const playPromise = notiSound.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio playback started successfully
            }).catch(error => {
                // Audio playback failed, handle the error
                displayError('Audio playback failed:', error);
            });
        }
    }

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
            progressBar.style.backgroundColor = '#ff0000'; // Rot
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


//TODO: Tooltip System


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




//TODO: BUTTON EVENT

const clickAnimation = document.getElementById('clickAnimation');

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

// Funktion zur Aktualisierung des Spielstands im DOM
function updateScore() {
    scoreElement.textContent = simplifyNumber(score);
}
updateUpgradeButtons();


//TODO: Simplify Number


function simplifyNumber(number) {
    const suffixes = ["", "k", "M", "B", "T", "Q", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "Un", "Du", "Tr", "Qu", "Qi", "Se", "St", "Ot", "Nv", "Vg", "Ct", "Ut", "Dt", "Tt", "QtT", "SxT", "SpT", "OcT", "NoT", "DcT", "UnT", "DuT", "TrT", "QuT", "QiT", "SeT", "StT", "OtT", "NvT", "VgT", "CtT", "UtT", "DtT", "TtT", "QtTT", "SxTT", "SpTT", "OcTT"];
    let suffixIndex = 0;

    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
        number /= 1000;
        suffixIndex++;
    }

    return (number >= 1 ? number.toFixed(number % 1 === 0 ? 0 : 2) : number.toFixed(0)).toString() + suffixes[suffixIndex];
}


//TODO: Display Error


function displayError(message) {
    const errorContainer = document.getElementById('error-container');

    // Erstelle ein neues Element für den Fehler
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = message;

// Lese die gespeicherten Lautstärke-Werte aus dem localStorage
    const errorSoundVolume = parseFloat(localStorage.getItem('errorSoundVolume')) || 1;

    const errorSoundElement = document.getElementById('errorSound');
    let errorSound;

    if (errorSoundElement) {
        errorSound = new Audio(errorSoundElement.src);
        errorSound.volume = errorSoundVolume;
        errorSound.currentTime = 0;

        // Check if user interaction is required
        const playPromise = errorSound.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio playback started successfully
            }).catch(error => {
                // Audio playback failed, handle the error
                displayError('Audio playback failed:', error);
            });
        }
    }

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


//TODO: Anti Phone


window.addEventListener('load', function () {
    const mobileWarning = document.getElementById('mobile-warning');

    if (window.innerWidth <= 600) {
        mobileWarning.style.display = 'block';
    }

});


//TODO: Sound System



// Die Audio-Elemente

    // Lese die gespeicherten Lautstärke-Werte aus dem localStorage
    const notiSoundVolume = parseFloat(localStorage.getItem('notiSoundVolume')) || 1;

    // Setze die initialen Lautstärke-Werte basierend auf localStorage
    notiSound.volume = notiSoundVolume;

    // Setze die initialen Werte der Lautstärke-Regler
    document.getElementById('notiSoundVolume').value = notiSoundVolume;

        // Initialen Zustand aus dem Local Storage wiederherstellen
    const initialState = localStorage.getItem('backgroundState') === 'visible';
    const background = document.querySelector(".background");
    const button = document.getElementById("ToggleBackgroundButton");

    if (initialState) {
        background.style.display = "block";
        background.style.opacity = "1";
        button.innerText = "✅ Background ON";
    } else {
        background.style.display = "none";
        background.style.opacity = "0";
        button.innerText = "❌ Background OFF";
    }

    document.getElementById("ToggleBackgroundButton").addEventListener("click", function() {
        const currentState = background.style.display === "none" || background.style.display === "";

        // Zustand im Local Storage aktualisieren
        localStorage.setItem('backgroundState', currentState ? 'visible' : 'hidden');

        if (currentState) {
            background.style.display = "block";
            background.style.opacity = "1";
            button.innerText = "✅ Background ON";
            background.style.animation = "fadeIn 2s ease forwards";
            button.classList.add('active');
            button.classList.remove('inactive');
        } else {
            background.style.display = "none";
            background.style.opacity = "0";
            button.innerText = "❌ Background OFF";
            background.style.animation = "fadeOut 2s ease forwards";
            button.classList.add('inactive');
            button.classList.remove('active');
        }
    });

// Settings

// Die Audio-Elemente

// Lese den gespeicherten Zustand aus dem localStorage
const isMuted = localStorage.getItem('isMuted') === 'true';
const globalMuteButton = document.getElementById('globalMuteButton');

// Setze den initialen Zustand des Buttons basierend auf localStorage
ambientSound.muted = isMuted;

// Funktion zur Aktualisierung des Button-Stils und Texts
function updateButtonStyleAndText() {
    if (ambientSound.muted) {
        globalMuteButton.classList.add('inactive');
        globalMuteButton.classList.remove('active');
        globalMuteButton.textContent = '🔇';
    } else {
        globalMuteButton.classList.add('active');
        globalMuteButton.classList.remove('inactive');
        globalMuteButton.textContent = '🔊';
    }
}

// Setze den initialen Stil und Text des Buttons
updateButtonStyleAndText();

// Event-Listener für den global Mute-Button
globalMuteButton.addEventListener('click', () => {
    ambientSound.muted = !ambientSound.muted;

    // Aktualisiere den Stil und Text des Buttons
    updateButtonStyleAndText();

    // Speichere den aktuellen Zustand im localStorage
    localStorage.setItem('isMuted', ambientSound.muted);
});


//TODO: Settings


const settingsOverlay = document.getElementById('settingsOverlay');
const volumeSliders = document.querySelectorAll('.volumeSlider');

document.getElementById('ToggleSettingsButton').addEventListener('click', function() {
    toggleSettingsOverlay();
});

function toggleSettingsOverlay() {
    settingsOverlay.classList.toggle('show');
}

function saveSoundVolume(soundId, volume) {
    localStorage.setItem(`${soundId}Volume`, volume);
}

function applySavedVolumes() {
    volumeSliders.forEach(function (slider) {
        const soundId = slider.id.replace('Volume', '');
        const soundElement = document.getElementById(soundId);

        if (soundElement) {
            const savedVolume = parseFloat(localStorage.getItem(`${soundId}Volume`)) || 1;
            slider.value = savedVolume;

            soundElement.volume = savedVolume;
        }
    });
}

function closeSettings() {
    settingsOverlay.classList.remove('show');
    saveAllSettings();
}

function saveAllSettings() {
    const settings = {
        notiSoundVolume: parseFloat(document.getElementById('notiSoundVolume').value),
        luckyEventSoundVolume: parseFloat(document.getElementById('luckyEventSoundVolume').value),
        errorSoundVolume: parseFloat(document.getElementById('errorSoundVolume').value),
        achievementsSoundVolume: parseFloat(document.getElementById('achievementsSoundVolume').value),
    };

    // Speichere die Einstellungen im Local Storage
    localStorage.setItem('settings', JSON.stringify(settings));
}

// Setze den initialen Wert der Slider basierend auf localStorage
applySavedVolumes();

// Event-Listener für Änderungen der Lautstärke
volumeSliders.forEach(function (slider) {
    slider.addEventListener('input', function () {
        const soundId = slider.id.replace('Volume', '');
        const soundElement = document.getElementById(soundId);

        if (soundElement) {
            let volume = parseFloat(slider.value);

            // Check if the volume is 0, set it to a small non-zero value
            if (volume === 0) {
                volume = 0.0000001;
            }

            soundElement.volume = volume;
            saveSoundVolume(soundId, volume);
        }
    });
});


// Sharing System

document.getElementById('shareX').addEventListener('click', shareOnX);
document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);


function shareOnX() {
    const statsToShare = loadStatsFromLocalStorage();
    const formattedStats = formatStatsForX(statsToShare);

    const tweetText = `${formattedStats}\n\n`;
    const hashtags = 'IdleClicker,Idle,Clicker,prodbyeagle,Chilly,ChillLounge';

    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${hashtags}`;
    openNewWindow(shareUrl);
}

function shareOnWhatsApp() {
    const statsToShare = loadStatsFromLocalStorage();
    const formattedStats = formatStatsForWhatsApp(statsToShare);
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(formattedStats)}`;
    openNewWindow(shareUrl);
}

function formatStatsForX(stats) {
    return `Check out my awesome stats:\n\n${stats}\n\nPlay it now: https://clicker-chilly.netlify.app/`;
}

function formatStatsForWhatsApp(stats) {
    return `Check out my awesome stats:\n${stats}\nPlay it now: https://clicker-chilly.netlify.app/`;
}

function openNewWindow(url) {
    window.open(url, '_blank', 'width=800,height=600');
}

let interval; // Globaler Bereich für das Intervall

function toggleRainbowMode() {
    const rainbowModeActive = !document.documentElement.classList.contains('rainbow-mode');
    if (rainbowModeActive) {
      startRainbowAnimation();
      document.getElementById('rainbowModeButton').textContent = '🌈 Rainbow Mode ON!';
      document.getElementById('rainbowModeButton').style.backgroundColor = '#45a049';
      document.querySelectorAll('.upgradeButton').forEach(button => {
        button.style.backgroundColor = '#45a049';
      });
    } else {
      stopRainbowAnimation();
      document.getElementById('rainbowModeButton').textContent = '🌧️ Rainbow Mode OFF!';
      document.getElementById('rainbowModeButton').style.backgroundColor = '#ff4d4d';
      document.querySelectorAll('.upgradeButton').forEach(button => {
        button.style.backgroundColor = '#545662';
      });
    }
    document.documentElement.classList.toggle('rainbow-mode', rainbowModeActive);
  }

function startRainbowAnimation() {
    let hueValue = 0; // Startwert für den Hue-Wert
    interval = setInterval(() => {
        hueValue = (hueValue + 1) % 360; // Ändert den Hue-Wert, um eine Farbrotation zu erzeugen
        document.documentElement.style.setProperty('--primary-color', `hsl(${hueValue}, 100%, 50%)`);
        document.getElementById('clickBtn').style.backgroundColor = `hsl(${hueValue}, 100%, 50%)`;
    }, 70); // Geschwindigkeit der Farbänderung in Millisekunden
}

function stopRainbowAnimation() {
    clearInterval(interval);
    document.documentElement.style.setProperty('--primary-color', '#a985d3'); // Setzt den Hue-Wert auf den Standardwert zurück
    document.getElementById('clickBtn').style.backgroundColor = '#45a049'; // Setzt die Hintergrundfarbe von clickBtn auf Standardwert zurück
}

document.getElementById('rainbowModeButton').addEventListener('click', toggleRainbowMode);

//TODO: DISCORD RICH PRESENCE

// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                            // DEV OVERLAY                  // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY                                                      // DEV // DEV OVERLAY // DEV
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                       // DEV OVERLAY // DEV OVERLAY
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 








 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                            // DEV OVERLAY                  // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY                                                      // DEV // DEV OVERLAY // DEV
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                       // DEV OVERLAY // DEV OVERLAY
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 








 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                           // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY             // DEV OVERLAY                   // DEV OVERLAY 
// DEV OVERLAY                          // DEV OVERLAY     // DEV OVERLAY                                            // DEV OVERLAY                  // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY                                                      // DEV // DEV OVERLAY // DEV
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                       // DEV OVERLAY // DEV OVERLAY
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 
// DEV OVERLAY // DEV OVERLAY // DEV OVERLAY               // DEV OVERLAY // DEV OVERLAY // DEV OVERLAY                             // DEV OVERLAY 

document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
});