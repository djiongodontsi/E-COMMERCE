class GestionnairePanier {
    constructor() {
        this.panier = this.chargerPanier();
        this.afficherPanier();
    }

    afficherPanier() {
        const corps = document.getElementById('panier-corps');
        const totalElement = document.getElementById('total-panier');

        if (this.panier.length === 0) {
            corps.innerHTML = '<tr><td colspan="5" style="text-align: center;">Votre panier est vide</td></tr>';
            totalElement.textContent = 'Total : 0 €';
            return;
        }

        let total = 0;
        corps.innerHTML = this.panier.map(item => {
            const sousTotal = item.prix * item.quantite;
            total += sousTotal;

            return `
                <tr>
                    <td>${item.titre}</td>
                    <td>${item.prix} €</td>
                    <td>
                        <input type="number" value="${item.quantite}" min="1" 
                               onchange="gestionnairePanier.modifierQuantite(${item.id_article}, this.value)">
                    </td>
                    <td>${sousTotal} €</td>
                    <td>
                        <button onclick="gestionnairePanier.supprimerArticle(${item.id_article})" 
                                style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                            ❌
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        totalElement.textContent = `Total : ${total} €`;
    }

    modifierQuantite(idArticle, nouvelleQuantite) {
        const quantite = parseInt(nouvelleQuantite);
        if (quantite < 1) {
            this.supprimerArticle(idArticle);
            return;
        }

        const article = this.panier.find(item => item.id_article === idArticle);
        if (article) {
            article.quantite = quantite;
            this.sauvegarderPanier();
            this.afficherPanier();
        }
    }

    supprimerArticle(idArticle) {
        this.panier = this.panier.filter(item => item.id_article !== idArticle);
        this.sauvegarderPanier();
        this.afficherPanier();
    }

    chargerPanier() {
        try {
            return JSON.parse(localStorage.getItem('panier')) || [];
        } catch {
            return [];
        }
    }

    sauvegarderPanier() {
        localStorage.setItem('panier', JSON.stringify(this.panier));
    }
}

// Initialisation
const gestionnairePanier = new GestionnairePanier();