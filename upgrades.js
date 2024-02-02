// upgrades.js

const upgradesKey = 'savedUpgrades';
const upgrades = {
    1: { name: "More Clicks", basecost: 20, cost: 15, level: 0, multiplier: 2, maxLevel: 100, owned: 0 },
    3: { name: "Lucky Clicks", basecost: 500000, cost: 10000, level: 0, luckyClickChance: 0.001, cooldownReduction: 0, owned: 0, maxLevel: 25},
    6: { name: "Auto Clicker", basecost: 1000000, cost: 1000000, level: 0, maxLevel: 100, owned: 0 },
};

// Funktion zum Laden der Upgrades aus dem Local Storage
function loadUpgradesFromLocalStorage() {
    const savedUpgrades = JSON.parse(localStorage.getItem(upgradesKey));
    if (savedUpgrades) {
        // Übertragen Sie die Werte aus dem gespeicherten Objekt auf das aktuelle Upgrades-Objekt
        for (const upgradeId in upgrades) {
            if (upgrades.hasOwnProperty(upgradeId) && savedUpgrades.hasOwnProperty(upgradeId)) {
                upgrades[upgradeId].level = savedUpgrades[upgradeId].level;
                upgrades[upgradeId].cost = savedUpgrades[upgradeId].cost;
                upgrades[upgradeId].owned = savedUpgrades[upgradeId].owned;
            }
        }
    }
}

// Funktion zum Speichern der Upgrades im Local Storage
function saveUpgradesToLocalStorage() {
    const savedUpgrades = {};

    // Erstellen Sie ein Objekt mit den Upgrade-Levels, Kosten und weiteren Informationen
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

// Kaufe Upgrade-Funktion
function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];

    if (!upgrade) {
        showUpgradeNotification("❌ Upgrade not found.");
        return;
    }

    if (upgrade.level >= upgrade.maxLevel) {
        showUpgradeNotification("⚠️ Upgrade already at MAX Level.");
        return;
    }

    if (score < upgrade.cost) {
        showUpgradeNotification("❌ Insufficient points.");
        return;
    }

    score -= upgrade.cost;
    applyUpgradeEffects(upgrade);

    upgrade.owned++;
    upgrade.level++;
    upgrade.cost *= 5;

    if (upgrade.name === "Auto Clicker" && upgrade.level === 1) {
        enableAutoClicker();
    }

    updateScore();
    updateUpgradeButtons();
    showUpgradeNotification(`✅ Upgraded ${upgrade.name} to Level ${upgrade.level}`);
    saveUpgradesToLocalStorage();
}

function enableAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    startAutoClicker(autoClickerUpgrade.level);
    document.getElementById('toggleAutoClicker').style.display = "block";
    document.getElementById('toggleAutoClicker').classList.add('active');
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

function handleLuckyClick() {
    const luckyClickUpgrade = upgrades[3];
    const baseLuckyClickValue = 200000; // Basiswert

    // Wachstumsfaktor
    const growthFactor = 4.69;

    // Berechne den Zuwachs basierend auf dem Upgrade-Level
    const scaledLuckyClickValue = baseLuckyClickValue * Math.pow(growthFactor, luckyClickUpgrade.level);

    score += Math.round(scaledLuckyClickValue);
    let finalscore = simplifyNumber(scaledLuckyClickValue);
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

    clickMultiplier *= upgrade.multiplier || 1;

    if (upgrade.name === "Auto Clicker") {
        startAutoClicker(upgrade.level);
    }
}

let autoClickerInterval;
let clickCounter = 0;
let totalAutoScoreValue = 0;
let spmCounterInterval;
let startTime;

function startAutoClicker(autoClickerMultiplier) {
    startTime = Date.now(); // Set the start time
    totalAutoScoreValue = 0; // Reset totalAutoScoreValue when starting the AutoClicker
    clearInterval(autoClickerInterval);

    autoClickerInterval = setInterval(() => {
        if (typeof score !== "undefined" && !isNaN(score) && !isNaN(clickMultiplier) && !isNaN(autoClickerMultiplier)) {
            const incrementalScore = clickMultiplier * autoClickerMultiplier;
            score += incrementalScore;
            totalAutoScoreValue += incrementalScore; // Update totalAutoScoreValue
            updateScore();
            saveScoreToLocalStorage();
            addAutoClick();
        } else {
            console.error("Fehler: 'score' oder 'clickMultiplier' ist NaN");
        }
    }, 175);

    startSPMCounter(); // Start the SPM counter
}


function stopAutoClicker() {
    clearInterval(autoClickerInterval);
    stopSPMCounter();
}

function startSPMCounter() {
    startTime = Date.now(); // Set the start time when starting the SPM counter
    spmCounterInterval = setInterval(() => {
        const spm = getSPM();
        document.getElementById('cpsValue').textContent = spm;
    }, 175); // Update every second
}

function getSPM() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Convert to minutes
    const spm = totalAutoScoreValue / elapsedTime; // Calculate SPM
    const spmscore = simplifyNumber(spm);
    return spmscore;
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
        showUpgradeNotification(`❌ Auto-Clicker Off`);
    } else {
        if (autoClickerUpgrade.level > 0) {
            // Ensure that the 'score' variable is defined before starting the AutoClicker
            if (typeof score !== "undefined" && !isNaN(score)) {
                startAutoClicker(autoClickerUpgrade.level); // Pass the level as an argument
                toggleButton.classList.remove('inactive');
                toggleButton.classList.add('active');
                addAutoClick();
                showUpgradeNotification(`✅ Auto-Clicker On`);
            }
        }
    }
}

function simplifyNumber(number) {
    const suffixes = [
        "", "k", "M", "B", "T", "Q", "Qt", "Sx", "Sp", "Oc",
        "No", "Dc", "Un", "Du", "Tr", "Qu", "Qi", "Se", "St",
        "Ot", "Nv", "Vg", "Ct", "Ut", "Dt", "Tt", "QtT", "SxT",
        "SpT", "OcT", "NoT", "DcT", "UnT", "DuT", "TrT", "QuT",
        "QiT", "SeT", "StT", "OtT", "NvT", "VgT", "CtT", "UtT",
        "DtT", "TtT", "QtTT", "SxTT", "SpTT", "OcTT", "NoTT", "DcTT",
        "UnTT", "DuTT", "TrTT", "QuTT", "QiTT", "SeTT", "StTT", "OtTT", "NvTT",
        "VgTT", "CtTT", "UtTT", "DtTT", "TtTT", "QtTTT", "SxTTT", "SpTTT", "OcTTT",
        "NoTTT", "DcTTT", "UnTTT", "DuTTT", "TrTTT", "QuTTT", "QiTTT", "SeTTT", "StTTT", "OtTTT"
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
                    button.style.backgroundColor = "#666"; // Setze die Hintergrundfarbe auf dunkelgrau
                    button.style.cursor = "not-allowed"; // Setze den Cursor-Stil auf "not-allowed"
                } else {
                    button.disabled = false;
                    button.style.backgroundColor = ""; // Setze die Hintergrundfarbe auf den Standardwert
                    button.style.cursor = ""; // Setze den Cursor-Stil auf den Standardwert
                }

                // Überprüfe, ob es sich um das Auto Clicker-Upgrade handelt und es aufgewertet wurde
                if (upgrade.name === "Auto Clicker" && upgrade.level > 0) {
                    document.getElementById("toggleAutoClicker").style.display = "block";
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

loadUpgradesFromLocalStorage();