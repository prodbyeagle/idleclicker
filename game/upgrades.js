// upgrades.js

const upgradesKey = 'savedUpgrades';
const upgrades = {
    1: { name: "More Clicks", basecost: 20, cost: 20, level: 0, multiplier: 2, maxLevel: 50, owned: 0},
    3: { name: "Lucky Clicks", basecost: 250000, cost: 250000, level: 0, luckyClickChance: 0.0001, cooldownReduction: 0, owned: 0, maxLevel: 50},
    6: { name: "Auto Clicker", basecost: 1500000, cost: 1500000, level: 0, maxLevel: 50, owned: 0},
    9: { name: "Auto Buy", basecost: 1000000000000, cost: 1000000000000, level: 0, maxLevel: 1, owned: 0},
    10: { name: "Critical Clicks", basecost: 500000000, cost: 500000000, level: 0, critChance: 0.001, critMultiplier: 2, maxLevel: 50, owned: 0 }
};

// Funktion zum Laden der Upgrades aus dem Local Storage
function loadUpgradesFromLocalStorage() {
    const savedUpgrades = JSON.parse(localStorage.getItem(upgradesKey));
    if (savedUpgrades) {
        for (const upgradeId in upgrades) {
            if (upgrades.hasOwnProperty(upgradeId) && savedUpgrades.hasOwnProperty(upgradeId)) {
                upgrades[upgradeId].level = savedUpgrades[upgradeId].level;
                upgrades[upgradeId].cost = savedUpgrades[upgradeId].cost;
                upgrades[upgradeId].owned = savedUpgrades[upgradeId].owned;
            }
        }
    }
}

function saveUpgradesToLocalStorage() {
    const savedUpgrades = {};
    for (const upgradeId in upgrades) {
        if (upgrades.hasOwnProperty(upgradeId)) {
            savedUpgrades[upgradeId] = {
                level: upgrades[upgradeId].level,
                cost: upgrades[upgradeId].cost,
                owned: upgrades[upgradeId].owned,
            };
        }
    }
    localStorage.setItem(upgradesKey, JSON.stringify(savedUpgrades));
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];

    if (!upgrade) {
        return;
    }

    if (upgrade.level >= upgrade.maxLevel) {
        showUpgradeNotification("⚠️ Upgrade already at MAX Level.");
        return;
    }

    if (score < upgrade.cost) {
        let remainingPoints = upgrade.cost - score;
        showUpgradeNotification(`❌ Insufficient points. You need ${simplifyNumber(remainingPoints)} more points.`);
        return;
    }

    score -= upgrade.cost;
    applyUpgradeEffects(upgrade);

    const buySoundVolume = parseFloat(localStorage.getItem('buySoundVolume')) || 1;

    const buySoundElement = document.getElementById('buySound');
    let buySound;
    
    if (buySoundElement) {
        buySound = new Audio(buySoundElement.src);
        buySound.volume = buySoundVolume;
        buySound.currentTime = 0;
        
        const playPromise = buySound.play();
    
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
                displayError('Audio playback failed:', error);
            });
        }
    }

    upgrade.owned++;
    upgrade.level++;
    upgrade.cost *= 4;

    if (upgrade.name === "Auto Clicker" && upgrade.level === 1) {
        enableAutoClicker();
    }

    if (upgrade.name === "Auto Buy" && upgrade.level === 1) {
        unlockAutoBuy();
    }

    updateScore();
    updateUpgradeButtons();
    showUpgradeNotification(`✅ Upgraded ${upgrade.name} to Level ${upgrade.level}`);
    saveUpgradesToLocalStorage();
}

function calculateCooldown() {
    const luckyClickUpgrade = upgrades[3];
    const baseCooldown = 60000;

    // Verringer den Cooldown basierend auf dem Upgrade-Level
    let reducedCooldown = baseCooldown - luckyClickUpgrade.cooldownReduction;

    if (luckyClickUpgrade.level > 5) {
        reducedCooldown -= 15000;
    }

    return reducedCooldown < 0 ? 0 : reducedCooldown; // Der Cooldown kann nicht negativ sein
}

let lastLuckyClickTime = 0;

function applyLuckyClick(chance) {
    const currentTime = Date.now();

    if (currentTime - lastLuckyClickTime < calculateCooldown()) {
        return;
    }


    const randomValue = Math.random();

    if (randomValue < chance) {
        handleLuckyClick();
        lastLuckyClickTime = currentTime; // Setzen Sie die Zeit des letzten Lucky Clicks
    }
}

//TODO: SOUND SYSTEM REMAKE

function handleLuckyClick() {
    const luckyClickUpgrade = upgrades[3];
    const baseLuckyClickValue = 200000; // Basiswert

    // Wachstumsfaktor
    const growthFactor = 5;

    // Berechne den Zuwachs basierend auf dem Upgrade-Level
    const scaledLuckyClickValue = baseLuckyClickValue * Math.pow(growthFactor, luckyClickUpgrade.level);

    score += Math.round(scaledLuckyClickValue);
    let finalscore = simplifyNumber(scaledLuckyClickValue);

// Lese die gespeicherten Lautstärke-Werte aus dem localStorage
    const luckySoundVolume = parseFloat(localStorage.getItem('luckyEventSoundVolume')) || 1;

    const luckySoundElement = document.getElementById('luckyEventSound');
    let luckySound;

    if (luckySoundElement) {
        luckySound = new Audio(luckySoundElement.src);
        luckySound.volume = luckySoundVolume;
        luckySound.currentTime = 0;

        // Check if user interaction is required
        const playPromise = luckySound.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio playback started successfully
            }).catch(error => {
                // Audio playback failed, handle the error
                displayError('Audio playback failed:', error);
            });
        }
    }

    updateScore();
    showUpgradeNotification(`🍀 Lucky Click! +${finalscore} Clicks`);
    createRandomClover();
}

let isCloverFalling = false; // Variable, um den Status des Falls zu überprüfen

function createRandomClover() {
    if (isCloverFalling) {
        return;
    }

    isCloverFalling = true;

    const cloverCount = 25;
    const cloverContainer = document.getElementById('clover-container');

    // Vor dem Hinzufügen neuer Kleeblätter vorhandene Kleeblätter löschen
    cloverContainer.textContent = '';

    for (let i = 0; i < cloverCount; i++) {
        const clover = document.createElement('div');
        clover.className = 'clover';
        clover.innerHTML = '🍀';

        clover.style.left = Math.random() * (window.innerWidth - 20) + 'px';
        clover.style.top = Math.random() * -window.innerHeight + '20px';

        clover.style.animationDuration = (Math.random() * 2 + 1) + 's';

        cloverContainer.appendChild(clover);
    }

    setTimeout(() => {
        isCloverFalling = false;
        cloverContainer.textContent = ''; // Hier werden die Kleeblätter aus dem Container entfernt
    }, 4500);
}

function applyUpgradeEffects(upgrade) {
    if (upgrade.luckyClickChance) {
        applyLuckyClick(upgrade.luckyClickChance);
    }

    if (upgrade.critChance) {
        applyCritClick(upgrade.critChance, upgrade.critMultiplier);
    }

    clickMultiplier *= upgrade.multiplier || 1;

    if (upgrade.name === "Auto Clicker") {
        startAutoClicker(upgrade.level);
    }
}

// CRIT

function applyCritClick(chance, multiplier) {
    const randomValue = Math.random();
    if (randomValue < chance) {
        handleCritClick(multiplier);
    }
}

function handleCritClick(level) {
    const critValue = score * 0.1 * level;
    score += critValue;
    updateScore();

    // Lese die gespeicherten Lautstärke-Werte aus dem localStorage
    const luckySoundVolume = parseFloat(localStorage.getItem('luckyEventSoundVolume')) || 1;
    
    const luckySoundElement = document.getElementById('luckyEventSound');
    let luckySound;
    
    if (luckySoundElement) {
        luckySound = new Audio(luckySoundElement.src);
        luckySound.volume = luckySoundVolume;
        luckySound.currentTime = 0;
    
        // Check if user interaction is required
        const playPromise = luckySound.play();
    
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio playback started successfully
            }).catch(error => {
                // Audio playback failed, handle the error
                displayError('Audio playback failed:', error);
            });
        }
    }

    showUpgradeNotification(`💥 Critical Click! +${simplifyNumber(critValue)} Clicks`);
}

// Auto Clicker


let autoClickerInterval;
let totalAutoScoreValue = 0;
let spmCounterInterval;
let startTime;

function startAutoClicker(autoClickerMultiplier) {
    startTime = Date.now(); // Set the start time
    clearInterval(autoClickerInterval);
    totalAutoScoreValue = 0; // Reset totalAutoScoreValue when starting the AutoClicker

    autoClickerInterval = setInterval(() => {
        if (typeof score !== "undefined" && !isNaN(score) && !isNaN(clickMultiplier) && !isNaN(autoClickerMultiplier)) {
            const incrementalScore = clickMultiplier * autoClickerMultiplier;
            score += incrementalScore;
            totalAutoScoreValue += incrementalScore; // Update totalAutoScoreValue
            updateScore();
            saveScoreToLocalStorage();
            addAutoClick();

            // Lese die gespeicherten Lautstärke-Werte aus dem localStorage
            const clickSoundVolume = parseFloat(localStorage.getItem('clickSoundVolume')) || 1;
            
            const clickSoundElement = document.getElementById('clickSound');
            let clickSound;
            
            if (clickSoundElement) {
                clickSound = new Audio(clickSoundElement.src);
                clickSound.volume = clickSoundVolume;
                clickSound.currentTime = 0;
            
                // Check if user interaction is required
                const playPromise = clickSound.play();
            
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Audio playback started successfully
                    }).catch(error => {
                        // Audio playback failed, handle the error
                        displayError('Audio playback failed:', error);
                    });
                }
            }

        } else {
            console.error("Fehler: 'score' oder 'clickMultiplier' ist NaN");
        }
    }, 175);

    startSPMCounter(); // Start the SPM counter
}

function enableAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    startAutoClicker(autoClickerUpgrade.level);
    document.getElementById('toggleAutoClicker').style.display = "block";
    document.getElementById('toggleAutoClicker').classList.add('active');
}

function stopAutoClicker() {
    clearInterval(autoClickerInterval);
    stopSPMCounter();
}

function startSPMCounter() {
    startTime = Date.now(); // Set the start time when starting the SPM counter
    spmCounterInterval = setInterval(() => {
        document.getElementById('cpsValue').textContent = getSPM();
    }, 175); // Update every second
}

function getSPM() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Convert to minutes
    const spm = totalAutoScoreValue / elapsedTime; // Calculate SPM
    return simplifyNumber(spm);
}

function stopSPMCounter() {
    clearInterval(spmCounterInterval);
}

function toggleAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    const toggleButton = document.getElementById('toggleAutoClicker');

    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
        toggleButton.classList.remove('active');
        toggleButton.classList.add('inactive');
        showUpgradeNotification(`❌ Auto-Clicker OFF!`);
    } else {
        if (autoClickerUpgrade.level > 0) {
            // Ensure that the 'score' variable is defined before starting the AutoClicker
            if (typeof score !== "undefined" && !isNaN(score)) {
                startAutoClicker(autoClickerUpgrade.level); // Pass the level as an argument
                toggleButton.classList.remove('inactive');
                toggleButton.classList.add('active');
                addAutoClick();
                showUpgradeNotification(`✅ Auto-Clicker ON!`);
            }
        }
    }
}

function simplifyNumber(number) {
    const suffixes = [
        "", "k", "M", "B", "T", "Q", "Qt", "Sx", "Sp", "Oc",
        "No", "Dc", "Un", "Du", "Tr", "Qu", "Qi", "Se", "St",
        "Ot", "Nv", "Vg", "Ct", "Ut", "Dt", "Tt", "QtT", "SxT",
        "SpT", "OcT", "INFINITY"
    ];
    let suffixIndex = 0;

    // Vereinfache nur, wenn die Zahl größer als 1000 ist
    if (number >= 1000) {
        while (number >= 1000 && suffixIndex < suffixes.length - 1) {
            number /= 1000;
            suffixIndex++;
        }
        return (number >= 1 ? number.toFixed(number % 1 === 0 ? 0 : 2) : number.toFixed(0)).toString() + suffixes[suffixIndex];
    } else {
        return number.toString();
    }
}

// Auto-Buy System

let isAutoBuyEnabled = false; // Variable, um den Status des automatischen Kaufs zu überprüfen

function buyAutoUpgrades(strategy) {
    let selectedUpgrade;

    switch (strategy) {
        case 'random':
            selectedUpgrade = getRandomUpgrade();
            break;

        case 'cheapest':
            selectedUpgrade = getCheapestUpgrade();
            break;

        case 'highestLevel':
            selectedUpgrade = getHighestLevelUpgrade();
            break;

        default:
            selectedUpgrade = getRandomUpgrade();
    }

    // Kaufe das ausgewählte Upgrade
    if (selectedUpgrade) {
        buyUpgrade(selectedUpgrade.id); // Hier rufe die Funktion buyUpgrade mit der Upgrade-ID auf
        score -= selectedUpgrade.cost

        selectedUpgrade.owned++;
        selectedUpgrade.level++;
        selectedUpgrade.cost *= 5;

        if (selectedUpgrade.name === "Auto Clicker" && selectedUpgrade.level === 1) {
            enableAutoClicker();
        }

        updateScore();
        updateUpgradeButtons();
        showUpgradeNotification(`✅ Auto. Upgrade ${selectedUpgrade.name} to ${selectedUpgrade.level}`);
        saveUpgradesToLocalStorage();
    }
}

// Strategie: Günstigstes Upgrade zuerst
function getCheapestUpgrade() {
    const affordableUpgrades = Object.values(upgrades).filter(upgrade => upgrade.cost <= score && upgrade.level < upgrade.maxLevel);

    if (affordableUpgrades.length > 0) {
        return affordableUpgrades.reduce((prev, curr) => (prev.cost < curr.cost ? prev : curr), {});
    }

    return null; // Kein Upgrade gefunden
}

// Strategie: Höchstes Level zuerst
function getHighestLevelUpgrade() {
    const affordableUpgrades = Object.values(upgrades).filter(upgrade => upgrade.cost <= score && upgrade.level < upgrade.maxLevel);

    if (affordableUpgrades.length > 0) {
        return affordableUpgrades.reduce((prev, curr) => (prev.level > curr.level ? prev : curr), {});
    }

    return null; // Kein Upgrade gefunden
}

// Strategie: Zufälliges Upgrade
function getRandomUpgrade() {
    const affordableUpgrades = Object.values(upgrades).filter(upgrade => upgrade.cost <= score && upgrade.level < upgrade.maxLevel);

    if (affordableUpgrades.length > 0) {
        return affordableUpgrades[Math.floor(Math.random() * affordableUpgrades.length)];
    }

    return null; // Kein Upgrade gefunden
}

// Funktion zum Ein- und Ausschalten des automatischen Upgrade-Kaufs
function toggleAutoBuy() {
    const autotoggleButton = document.getElementById('toggleAutoBuy');
    isAutoBuyEnabled = !isAutoBuyEnabled;

    if (isAutoBuyEnabled) {
        autotoggleButton.classList.remove('inactive');
        autotoggleButton.classList.add('active');
        startAutoBuy();
        showUpgradeNotification("✅ Auto Buy ON!");
    } else {
        autotoggleButton.classList.remove('active');
        autotoggleButton.classList.add('inactive');
        stopAutoBuy();
        showUpgradeNotification("❌ Auto Buy OFF!");
    }
}

let strategy, autoBuyInterval;

// Funktion zum Starten des automatischen Upgrade-Kaufs
function startAutoBuy() {
    autoBuyInterval = setInterval(() => {
        if (isAutoBuyEnabled) {
            buyAutoUpgrades(strategy);
        }
    }, 175);
}

// Funktion zum Stoppen des automatischen Upgrade-Kaufs
function stopAutoBuy() {
    clearInterval(autoBuyInterval);
}

strategy = 'random';

// Funktion zum Ändern der Upgrade-Strategie
function changeStrategy(newStrategy) {
    strategy = newStrategy;
    showUpgradeNotification(`✨ Strategy changed to: ${newStrategy}`);
}


// Funktion zum Aktualisieren der Upgrade-Buttons


function updateUpgradeButtons() {
    Object.values(upgrades).forEach((upgrade, index) => {
        const button = upgradeButtons[index];
        if (button) {
            // Überprüfe, ob alle erforderlichen Eigenschaften im Upgrade-Objekt vorhanden sind
            const requiredProperties = ['name', 'cost', 'level', 'maxLevel'];

            const hasAllProperties = requiredProperties.every(prop => upgrade.hasOwnProperty(prop));

            if (hasAllProperties) {
                const simplifiedCost = simplifyNumber(upgrade.cost);
                const levelText = upgrade.maxLevel ? `${upgrade.level}/${upgrade.maxLevel}` : upgrade.level;

                button.textContent = `${upgrade.name} (Cost: ${simplifiedCost}, Level: ${levelText})`;

                // Überprüfe, ob das maximale Level erreicht wurde, und deaktiviere den Button entsprechend
                if (upgrade.level >= upgrade.maxLevel) {
                    button.disabled = true;
                    button.style.cursor = "not-allowed";
                    button.style.transition = "all 0.2s";
                } else {
                    button.disabled = false;
                    button.style.backgroundColor = ""; // Setze die Hintergrundfarbe auf den Standardwert
                    button.style.cursor = "cursor";
                }

                // Event listeners for hover effect
                button.addEventListener("mouseenter", function () {
                    if (upgrade.level >= upgrade.maxLevel) {
                        button.style.backgroundColor = "#ff4d4d"; // Set to red if at max level
                    } else {
                        button.style.backgroundColor = "#45a049"; // Set to a different color on hover (you can adjust the color)
                    }
                });

                button.addEventListener("mouseleave", function () {
                    button.style.backgroundColor = ""; // Set back to the default color on mouse leave
                });

                // Überprüfe, ob es sich um das Auto Clicker-Upgrade handelt und es aufgewertet wurde
                if (upgrade.name === "Auto Clicker" && upgrade.level > 0) {
                    document.getElementById("toggleAutoClicker").style.display = "block";
                    document.getElementById("toggleAutoClicker").style.cursor = "pointer";
                }
                // Überprüfe, ob es sich um das Auto Clicker-Upgrade handelt und es aufgewertet wurde
                if (upgrade.name === "Auto Buy" && upgrade.level > 0) {
                    document.getElementById("toggleAutoBuy").style.display = "block";
                    document.getElementById("strategyDropdown").style.display = "block";
                }
            } else {
                console.error(`Fehler: Upgrade-Objekt mit ID ${index + 1} enthält nicht alle erforderlichen Eigenschaften`, upgrade);
            }
        }
    });
}

function resetUpgrades() {
    for (const upgradeId in upgrades) {
        if (upgrades.hasOwnProperty(upgradeId)) {
            upgrades[upgradeId].level = 0;
            upgrades[upgradeId].cost = upgrades[upgradeId].basecost;
            upgrades[upgradeId].owned = 0;
        }
    }
    saveUpgradesToLocalStorage();
    updateUpgradeButtons();
}


// Auto Upgrade Buy
function unlockAutoBuy() {
    try {
        const autoBuyUpgrade = upgrades[9];

        // Check if the required upgrade is defined
        if (!autoBuyUpgrade) {
            displayError("Auto Buy upgrade not found.");
        }

        startAutoBuy(autoBuyUpgrade.level);
        isAutoBuyEnabled = true;
        showUpgradeNotification("✅ Auto Buy unlocked!");

        // Set a flag in localStorage to indicate that auto-buy is unlocked
        localStorage.setItem('isAutoBuyUnlocked', 'true');

        // Make the button visible
        const autoBuyButton = document.getElementById('toggleAutoBuy');
        if (!autoBuyButton) {
            displayError("Auto Buy button not found.");
        }

        autoBuyButton.style.display = 'block';

        const Dropdown = document.getElementById('strategyDropdown');
        if (Dropdown) {
            Dropdown.style.display = 'block';
        } else {
            displayError("Dropdown element not found.");
        }
    } catch (error) {
        displayError("Error in unlockAutoBuy:", error.message);
        displayError(error.message); // Call the displayError function
    }
}


loadUpgradesFromLocalStorage();