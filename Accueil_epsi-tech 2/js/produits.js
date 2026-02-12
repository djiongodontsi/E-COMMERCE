class GestionnaireProduits {
    constructor() {
        this.panier = this.chargerPanier();
        this.categories = [];
        this.produits = [];
        this.categorieActive = 'toutes';
        this.mettreAJourCompteurPanier();
        this.initialiser();
    }

    async initialiser() {
        await this.chargerCategories();
        await this.chargerProduits();
        this.afficherCategories();
        this.afficherProduitsParCategories();
    }

    // Charger les catégories depuis l'API
    async chargerCategories() {
        try {
            const response = await fetch('../PHP/categories.php');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.categories = data;
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }

    // Charger tous les produits depuis l'API
    async chargerProduits() {
        try {
            const response = await fetch('../PHP/produits.php');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.produits = data;
        } catch (error) {
            console.error('Erreur chargement produits:', error);
            this.afficherErreur('Erreur lors du chargement des produits.');
        }
    }

    // Afficher les catégories dans la navigation
    afficherCategories() {
        const container = document.getElementById('categories-list');

        if (this.categories.length === 0) {
            container.innerHTML = '<div class="error-message">Aucune catégorie disponible.</div>';
            return;
        }

        container.innerHTML = `
            <div class="categories-grid">
                <button class="category-btn ${this.categorieActive === 'toutes' ? 'active' : ''}" 
                        onclick="gestionnaireProduits.filtrerParCategorie('toutes')">
                    🏠 Toutes les catégories
                </button>
                ${this.categories.map(categorie => `
                    <button class="category-btn ${this.categorieActive === categorie.id_categorie ? 'active' : ''}" 
                            onclick="gestionnaireProduits.filtrerParCategorie(${categorie.id_categorie})">
                        ${this.getIconeCategorie(categorie.nom)} ${categorie.nom}
                    </button>
                `).join('')}
            </div>
        `;
    }

    // Filtrer par catégorie
    filtrerParCategorie(categorieId) {
        this.categorieActive = categorieId;
        this.afficherCategories();
        this.afficherProduitsParCategories();
    }

    // Afficher les produits groupés par catégories
    afficherProduitsParCategories() {
        const container = document.getElementById('produits-container');

        if (this.produits.length === 0) {
            container.innerHTML = '<div class="error-message">Aucun produit disponible.</div>';
            return;
        }

        let html = '';

        if (this.categorieActive === 'toutes') {
            // Afficher toutes les catégories
            this.categories.forEach(categorie => {
                const produitsCategorie = this.produits.filter(p => p.id_categorie === categorie.id_categorie);
                if (produitsCategorie.length > 0) {
                    html += this.creerSectionCategorie(categorie.nom, produitsCategorie);
                }
            });
        } else {
            // Afficher une catégorie spécifique
            const categorie = this.categories.find(c => c.id_categorie == this.categorieActive);
            const produitsCategorie = this.produits.filter(p => p.id_categorie == this.categorieActive);

            if (produitsCategorie.length > 0) {
                html = this.creerSectionCategorie(categorie.nom, produitsCategorie);
            } else {
                html = `<div class="categorie-vide">
                    <h3>Aucun produit dans la catégorie "${categorie.nom}"</h3>
                    <p>Revenez plus tard pour découvrir nos nouveaux produits.</p>
                </div>`;
            }
        }

        container.innerHTML = html;
        this.actualiserBoutons();
    }

    // Créer une section de catégorie
    creerSectionCategorie(nomCategorie, produits) {
        return `
            <div class="categorie-groupe">
                <h2 class="categorie-titre">
                    ${this.getIconeCategorie(nomCategorie)} ${nomCategorie}
                    <span style="font-size: 1rem; color: #64748b;">(${produits.length} produits)</span>
                </h2>
                <div class="produits-grid">
                    ${produits.map(produit => this.creerCarteProduit(produit)).join('')}
                </div>
            </div>
        `;
    }

    // Créer une carte produit
    creerCarteProduit(produit) {
        const estDansPanier = this.panier.some(item => item.id_article === produit.id_article);
        const stockStatus = this.getStockStatus(produit.nombre_exemplaire);

        return `
            <div class="produit-card">
                <div class="produit-image">
                    ${produit.image ?
                `<img src="../images/${produit.image}" alt="${produit.titre}" style="width: 100%; height: 100%; object-fit: cover;">` :
                this.getIconeCategorie(produit.categorie_nom)
            }
                </div>
                <div class="produit-info">
                    <h3>${produit.titre}</h3>
                    <p class="produit-description">${produit.nom || ''}</p>
                    <div class="produit-prix">${produit.prix} €</div>
                    <div class="stock-info ${stockStatus.class}">
                        ${stockStatus.text}
                    </div>
                    <button class="btn-ajouter ${estDansPanier ? 'ajoute' : ''}" 
                            onclick="gestionnaireProduits.ajouterAuPanier(${produit.id_article})"
                            ${estDansPanier || produit.nombre_exemplaire === 0 ? 'disabled' : ''}>
                        ${estDansPanier ? '✅ Déjà au panier' :
                produit.nombre_exemplaire === 0 ? 'Rupture de stock' :
                    '🛒 Ajouter au panier'}
                    </button>
                </div>
            </div>
        `;
    }

    // Obtenir l'icône pour une catégorie
    getIconeCategorie(nomCategorie) {
        const icones = {
            'Ordinateurs de Bureau': '🖥️',
            'Ordinateurs Portables': '💻',
            'Téléphones': '📱',
            'Souris & Claviers': '⌨️',
            'Disques Durs': '💾',
            'default': '📦'
        };

        return icones[nomCategorie] || icones.default;
    }

    // Obtenir le statut du stock
    getStockStatus(stock) {
        if (stock === 0) {
            return { class: 'stock-epuise', text: 'Rupture de stock' };
        } else if (stock < 5) {
            return { class: 'stock-faible', text: `Stock faible: ${stock} unités` };
        } else {
            return { class: 'stock-disponible', text: `En stock: ${stock} unités` };
        }
    }

    // Gestion du panier
    ajouterAuPanier(idArticle) {
        const produit = this.produits.find(p => p.id_article === idArticle);
        if (!produit) return;

        if (produit.nombre_exemplaire === 0) {
            alert('Produit en rupture de stock');
            return;
        }

        const articlePanier = {
            id_article: produit.id_article,
            titre: produit.titre,
            prix: produit.prix,
            image: produit.image,
            quantite: 1
        };

        const existant = this.panier.find(item => item.id_article === idArticle);

        if (existant) {
            existant.quantite += 1;
        } else {
            this.panier.push(articlePanier);
        }

        this.sauvegarderPanier();
        this.mettreAJourCompteurPanier();
        this.actualiserBoutons();

        // Animation de confirmation
        this.afficherConfirmationAjout(produit.titre);
    }

    // Méthodes utilitaires
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

    mettreAJourCompteurPanier() {
        const compteur = document.getElementById('panier-count');
        if (compteur) {
            const totalArticles = this.panier.reduce((total, item) => total + item.quantite, 0);
            compteur.textContent = totalArticles;
        }
    }

    actualiserBoutons() {
        const boutons = document.querySelectorAll('.btn-ajouter');
        boutons.forEach(bouton => {
            const onclick = bouton.getAttribute('onclick');
            if (onclick) {
                const idArticle = parseInt(onclick.match(/\d+/)[0]);
                const estDansPanier = this.panier.some(item => item.id_article === idArticle);
                const produit = this.produits.find(p => p.id_article === idArticle);

                if (estDansPanier) {
                    bouton.disabled = true;
                    bouton.textContent = '✅ Déjà au panier';
                    bouton.classList.add('ajoute');
                } else if (produit && produit.nombre_exemplaire === 0) {
                    bouton.disabled = true;
                    bouton.textContent = 'Rupture de stock';
                    bouton.classList.remove('ajoute');
                } else {
                    bouton.disabled = false;
                    bouton.textContent = '🛒 Ajouter au panier';
                    bouton.classList.remove('ajoute');
                }
            }
        });
    }

    afficherConfirmationAjout(nomProduit) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = `✅ ${nomProduit} ajouté au panier !`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    afficherErreur(message) {
        const container = document.getElementById('produits-container');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Initialisation
const gestionnaireProduits = new GestionnaireProduits();

// Fonction globale pour afficher les produits
function afficherProduits(categorie) {
    gestionnaireProduits.filtrerParCategorie(categorie);
}

// Charger tous les produits au départ
document.addEventListener('DOMContentLoaded', function () {
    gestionnaireProduits.chargerProduits();
});

// Ajout des styles d'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);