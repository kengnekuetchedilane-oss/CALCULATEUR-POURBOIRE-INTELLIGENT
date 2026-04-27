// DOM Elements
const montantInput = document.getElementById('montant');
const personnesInput = document.getElementById('personnes');
const customTipInput = document.getElementById('customTip');
const tipButtons = document.querySelectorAll('.tip-btn');
const montantTipSpan = document.getElementById('montantTip');
const totalParPersonneSpan = document.getElementById('totalParPersonne');
const totalGeneralSpan = document.getElementById('totalGeneral');
const resetBtn = document.getElementById('resetBtn');
const montantError = document.getElementById('montantError');
const personnesError = document.getElementById('personnesError');

// État global
let currentTipPercent = 10; // pourcentage actif par défaut

// Fonction de validation et calcul
function calculerEtAfficher() {
    // 1. Récupération et validation du montant
    let montant = parseFloat(montantInput.value);
    if (isNaN(montant) || montant === 0 || montantInput.value === '') {
        montant = 0;
        montantError.textContent = montant === 0 ? '⚠️ Entrez un montant valide (ex: 45.90)' : '';
        if (montant === 0 && montantInput.value !== '') {
            montantError.textContent = '⚠️ Le montant doit être supérieur à 0';
        }
    } else if (montant < 0) {
        montantError.textContent = '❌ Le montant ne peut pas être négatif';
        montant = 0;
    } else {
        montantError.textContent = '';
    }

    // 2. Validation du nombre de personnes
    let personnes = parseInt(personnesInput.value);
    if (isNaN(personnes) || personnes < 1) {
        personnesError.textContent = '👥 Minimum 1 personne';
        personnes = 1;
        personnesInput.value = 1;
    } else {
        personnesError.textContent = '';
    }

    // 3. Récupération du pourcentage (priorité au custom s'il est rempli)
    let tipPercent = currentTipPercent;
    const customValue = parseFloat(customTipInput.value);
    
    if (!isNaN(customValue) && customValue !== 0 && customTipInput.value !== '') {
        if (customValue < 0) {
            tipPercent = 0;
            // Optionnel: afficher une erreur discrète
        } else if (customValue > 100) {
            tipPercent = 100;
        } else {
            tipPercent = customValue;
        }
        // Désactiver visuellement les boutons prédéfinis
        tipButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        // Réactiver visuellement le bon bouton
        tipButtons.forEach(btn => {
            if (parseInt(btn.dataset.tip) === tipPercent) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 4. Calculs
    const pourboire = montant * (tipPercent / 100);
    const totalAvecTip = montant + pourboire;
    const totalParPersonneCalc = personnes > 0 ? totalAvecTip / personnes : 0;

    // 5. Affichage formaté (2 décimales)
    montantTipSpan.textContent = `${pourboire.toFixed(2)} FCFA`;
    totalGeneralSpan.textContent = `${totalAvecTip.toFixed(2)} FCFA`;
    totalParPersonneSpan.textContent = `${totalParPersonneCalc.toFixed(2)} FCFA`;

    // Animation subtile sur le résultat (optionnel)
    totalParPersonneSpan.style.transform = 'scale(1.05)';
    setTimeout(() => {
        totalParPersonneSpan.style.transform = 'scale(1)';
    }, 150);
}

// Gestion des boutons de pourboire prédéfinis
tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tipValue = parseInt(btn.dataset.tip);
        currentTipPercent = tipValue;
        // Efface la valeur du custom tip pour éviter conflit
        customTipInput.value = '';
        calculerEtAfficher();
    });
});

// Écoute des changements sur le custom tip
customTipInput.addEventListener('input', () => {
    if (customTipInput.value !== '') {
        // On ne modifie pas currentTipPercent ici, on utilise directement la valeur dans calcul
        // Juste on refresh visuel
        tipButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        // Si vide, on remet le bouton actif selon currentTipPercent
        tipButtons.forEach(btn => {
            if (parseInt(btn.dataset.tip) === currentTipPercent) {
                btn.classList.add('active');
            }
        });
    }
    calculerEtAfficher();
});

// Écoute des changements sur montant et personnes
montantInput.addEventListener('input', calculerEtAfficher);
personnesInput.addEventListener('input', calculerEtAfficher);

// Empêcher valeurs négatives dans les champs (expérience utilisateur)
montantInput.addEventListener('change', () => {
    let val = parseFloat(montantInput.value);
    if (val < 0) montantInput.value = 0;
    calculerEtAfficher();
});

personnesInput.addEventListener('change', () => {
    let val = parseInt(personnesInput.value);
    if (val < 1) personnesInput.value = 1;
    calculerEtAfficher();
});

// Réinitialisation complète
resetBtn.addEventListener('click', () => {
    montantInput.value = '';
    personnesInput.value = '1';
    customTipInput.value = '';
    currentTipPercent = 10;
    tipButtons.forEach(btn => {
        if (parseInt(btn.dataset.tip) === 10) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    montantError.textContent = '';
    personnesError.textContent = '';
    calculerEtAfficher();
    
    // Petit retour visuel
    resetBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 150);
});

// Calcul initial
calculerEtAfficher();
