class GestionnairePaiement {
    constructor() {
        this.panier = this.chargerPanier();
        this.total = 0;
        this.initialiser();
    }

    initialiser() {
        this.calculerTotalPanier();
        this.afficherRecapitulatif();
        this.initialiserFormulaire();
    }

    // Calculer le total du panier
    calculerTotalPanier() {
        this.total = this.panier.reduce((total, item) => {
            return total + (item.prix * item.quantite);
        }, 0);

        console.log('Total calculé:', this.total, '€');
    }

    // Afficher le récapitulatif de la commande
    afficherRecapitulatif() {
        const container = document.getElementById('order-items');
        const totalElement = document.getElementById('order-total-amount');
        const payAmountElement = document.getElementById('pay-amount');
        const paidAmountElement = document.getElementById('paid-amount');

        if (this.panier.length === 0) {
            container.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            totalElement.textContent = '0 €';
            payAmountElement.textContent = '0 €';
            paidAmountElement.textContent = '0 €';
            return;
        }

        let html = '';
        this.panier.forEach(item => {
            const sousTotal = item.prix * item.quantite;

            html += `
                <div class="order-item">
                    <div class="item-info">
                        <h4>${item.titre}</h4>
                        <p>Quantité: ${item.quantite} × ${item.prix} €</p>
                    </div>
                    <div class="item-price">${sousTotal} €</div>
                </div>
            `;
        });

        container.innerHTML = html;
        totalElement.textContent = `${this.total} €`;
        payAmountElement.textContent = `${this.total} €`;
        paidAmountElement.textContent = `${this.total} €`;
    }

    // Initialiser le formulaire de paiement
    initialiserFormulaire() {
        const form = document.getElementById('payment-form');

        // Formatage du numéro de carte
        const cardNumber = document.getElementById('card-number');
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Formatage de la date d'expiration
        const expiryDate = document.getElementById('expiry-date');
        expiryDate.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Validation du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procederPaiement();
        });

        // Vérifier si le panier est vide
        if (this.panier.length === 0) {
            this.afficherMessagePanierVide();
        }
    }

    // Afficher message si panier vide
    afficherMessagePanierVide() {
        const container = document.getElementById('order-items');
        container.innerHTML = `
            <div class="empty-cart-message">
                <h3>🛒 Votre panier est vide</h3>
                <p>Ajoutez des produits avant de procéder au paiement</p>
                <button class="btn-back" onclick="window.location.href='produits.html'" style="margin-top: 1rem;">
                    🛍️ Voir les produits
                </button>
            </div>
        `;

        // Désactiver le bouton de paiement
        const btnPay = document.querySelector('.btn-pay');
        btnPay.disabled = true;
        btnPay.textContent = 'Panier vide';
        btnPay.style.background = '#94a3b8';
    }

    // Procéder au paiement
    procederPaiement() {
        // Vérifier que le panier n'est pas vide
        if (this.panier.length === 0) {
            alert('Votre panier est vide !');
            return;
        }

        const btnPayer = document.querySelector('.btn-pay');
        btnPayer.disabled = true;
        btnPayer.innerHTML = 'Traitement en cours...';

        setTimeout(() => {
            // Générer une référence de commande
            const reference = 'TS-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            document.getElementById('order-reference').textContent = reference;

            // Afficher la confirmation
            document.getElementById('confirmation-modal').classList.add('show');

            // Vider le panier
            this.viderPanier();

            btnPayer.disabled = false;
            btnPayer.innerHTML = `✅ Payer ${this.total} €`;
        }, 2000);
    }

    // Vider le panier après paiement
    viderPanier() {
        localStorage.removeItem('panier');
        this.panier = [];
        console.log('Panier vidé après paiement');
    }

    // Charger le panier depuis le localStorage
    chargerPanier() {
        try {
            const panier = JSON.parse(localStorage.getItem('panier')) || [];
            console.log('Panier chargé:', panier);
            return panier;
        } catch {
            console.log('Erreur chargement panier, retour tableau vide');
            return [];
        }
    }
}

// Initialisation
const gestionnairePaiement = new GestionnairePaiement();

// Fonction pour retourner à l'accueil
function retourAccueil() {
    window.location.href = 'ecommerce.html';
}

// Vérifier si le panier est vide au chargement
document.addEventListener('DOMContentLoaded', function () {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    if (panier.length === 0) {
        console.log('Panier vide détecté');
    }
});
function afficherConfirmationPaiement() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'notification-paiement';
    messageDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
        <strong style="font-size: 16px;">Paiement réussi !</strong><br>
        Votre commande a été traitée avec succès.<br>
        Un email de confirmation vous a été envoyé.
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 500);
    }, 5000);
}