// upgrades.js

const upgradesKey = 'savedUpgrades';

// Beispiel-Upgrades
const upgrades = {
    1: { name: "Double Clicks", cost: 15, level: 0, multiplier: 3, maxLevel: 25, owned: 0 },
    3: { name: "Lucky Clicks", cost: 10000, level: 0, luckyClickChance: 0.1, owned: 0, maxLevel: 10 },
    6: { name: "Auto Clicker", cost: 1000000, level: 0, maxLevel: 1, owned: 0 },
};

// Funktion zum Laden der Upgrades aus dem Local Storage
function loadUpgradesFromLocalStorage() {
    const savedUpgrades = JSON.parse(localStorage.getItem(upgradesKey));

    if (savedUpgrades) {
        // Übertragen Sie die Werte aus dem gespeicherten Objekt auf das aktuelle Upgrades-Objekt
        for (const upgradeId in upgrades) {
            if (upgrades.hasOwnProperty(upgradeId) && savedUpgrades.hasOwnProperty(upgradeId)) {
                upgrades[upgradeId].level = savedUpgrades[upgradeId].level;
            }
        }
    }
}

// Funktion zum Speichern der Upgrades im Local Storage
function saveUpgradesToLocalStorage() {
    const savedUpgrades = {};

    // Erstellen Sie ein Objekt mit den Upgrade-Levels und Kosten
    for (const upgradeId in upgrades) {
        if (upgrades.hasOwnProperty(upgradeId)) {
            savedUpgrades[upgradeId] = { level: upgrades[upgradeId].level, cost: upgrades[upgradeId].cost };
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
    upgrade.cost *= 20;

    if (upgrade.name === "Auto Clicker" && upgrade.level === 1) {
        enableAutoClicker();
    }

    updateScore();
    updateUpgradeButtons();
    showUpgradeNotification(`✅ Upgraded ${upgrade.name} to Level ${upgrade.level}`);

    // Speichern Sie die Upgrades nach dem Kauf
    saveUpgradesToLocalStorage();
}

function enableAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    startAutoClicker(autoClickerUpgrade.level);
    document.getElementById('toggleAutoClicker').style.display = "block";
    document.getElementById('toggleAutoClicker').classList.add('active');
}

function applyLuckyClick(chance) {
    const randomValue = Math.random();
    if (randomValue < chance) {
        handleLuckyClick();
    }
}

function handleLuckyClick() {
    const luckyClickUpgrade = upgrades[3]; // Ändern Sie die Upgrade-ID entsprechend Ihrer Struktur
    const baseLuckyClickValue = 30; // Basiswert, den Sie hinzufügen möchten

    // Wachstumsfaktor - passen Sie nach Bedarf an
    const growthFactor = 1.2;

    // Berechnen Sie den Zuwachs basierend auf dem Upgrade-Level
    const scaledLuckyClickValue = baseLuckyClickValue * Math.pow(growthFactor, luckyClickUpgrade.level);

    score += Math.round(scaledLuckyClickValue);
    updateScore();
    showUpgradeNotification(`🍀 Lucky Click! +${scaledLuckyClickValue.toFixed(2)} points`);
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

function startAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    const autoClickerMultiplier = autoClickerUpgrade.level;

    autoClickerInterval = setInterval(() => {

        // Stelle sicher, dass die Variable 'score' definiert und nicht NaN ist
        if (typeof score !== "undefined" && !isNaN(score) && !isNaN(clickMultiplier) && !isNaN(autoClickerMultiplier)) {
            score += clickMultiplier * autoClickerMultiplier;
            updateScore();
        } else {
            console.error("Fehler: 'score' oder 'clickMultiplier' ist NaN");
        }
    }, 1000);
}

function toggleAutoClicker() {
    const autoClickerUpgrade = upgrades[6];
    const toggleButton = document.getElementById('toggleAutoClicker');

    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
        toggleButton.classList.remove('active');
        toggleButton.classList.add('inactive');
    } else {

        if (autoClickerUpgrade.level > 0) {
            // Ensure that the 'score' variable is defined before starting the AutoClicker
            if (typeof score !== "undefined" && !isNaN(score)) {
                startAutoClicker(autoClickerUpgrade.multiplier);
                toggleButton.classList.remove('inactive');
                toggleButton.classList.add('active');
            }
        }
    }
}

function simplifyNumber(number) {
    const suffixes = ["", "k", "M", "B", "T", "Q", "Qt", "Sx", "Sp", "Oc"];
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

loadUpgradesFromLocalStorage();