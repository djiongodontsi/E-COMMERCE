class GestionnaireArticles {
    constructor() {
        this.articles = [];
        this.categories = [];
        this.initialiser();
    }

    async initialiser() {
        await this.chargerCategories();
        await this.chargerArticles();
        this.afficherStats();
    }

    // Charger les catégories
    async chargerCategories() {
        try {
            const response = await fetch('../PHP/categories.php');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.categories = data;
            this.remplirSelectCategories();
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            this.afficherToast('Erreur lors du chargement des catégories', 'error');
        }
    }

    // Remplir le select des catégories
    remplirSelectCategories() {
        const select = document.getElementById('id_categorie');
        select.innerHTML = '<option value="">Sélectionnez une catégorie</option>';

        this.categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id_categorie;
            option.textContent = categorie.nom;
            select.appendChild(option);
        });
    }

    // Charger les articles
    async chargerArticles() {
        try {
            const formData = new FormData();
            formData.append('action', 'get_articles');

            const response = await fetch('../PHP/gestion_articles.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.articles = data;
            this.afficherArticles();
            this.afficherStats();
        } catch (error) {
            console.error('Erreur chargement articles:', error);
            this.afficherArticlesErreur('Erreur lors du chargement des articles');
        }
    }

    // Afficher les articles
    afficherArticles() {
        const container = document.getElementById('articles-list');

        if (this.articles.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <h3>Aucun article disponible</h3>
                    <p>Commencez par ajouter votre premier article !</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="articles-grid">
                ${this.articles.map(article => this.creerCarteArticle(article)).join('')}
            </div>
        `;
    }

    // Créer une carte article
    creerCarteArticle(article) {
        const stockStatus = this.getStockStatus(article.nombre_exemplaire);

        return `
            <div class="article-card">
                <div class="article-header">
                    <div>
                        <div class="article-title">${article.titre}</div>
                        <span class="article-category">${article.categorie_nom}</span>
                    </div>
                    <span class="stock-badge ${stockStatus.class}">${stockStatus.text}</span>
                </div>
                
                <p class="article-description">${article.nom || 'Aucune description'}</p>
                
                <div class="article-details">
                    <div class="detail-item">
                        <span class="detail-label">Prix</span>
                        <span class="detail-value">${article.prix} €</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Stock actuel</span>
                        <span class="detail-value">${article.nombre_exemplaire} unités</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Référence</span>
                        <span class="detail-value">#${article.id_article}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Image</span>
                        <span class="detail-value">${article.image || 'Aucune'}</span>
                    </div>
                </div>
                
                <div class="article-actions">
                    <button class="btn-primary" onclick="gestionnaireArticles.modifierStock(${article.id_article}, ${article.nombre_exemplaire})">
                        📊 Modifier stock
                    </button>
                    <button class="btn-danger" onclick="gestionnaireArticles.supprimerArticle(${article.id_article}, '${article.titre}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    // Afficher les statistiques
    afficherStats() {
        const totalArticles = this.articles.length;
        const articlesEnStock = this.articles.filter(a => a.nombre_exemplaire > 0).length;
        const articlesRupture = this.articles.filter(a => a.nombre_exemplaire === 0).length;

        document.getElementById('total-articles').textContent = totalArticles;
        document.getElementById('articles-stock').textContent = articlesEnStock;
        document.getElementById('articles-rupture').textContent = articlesRupture;
    }

    // Obtenir le statut du stock
    getStockStatus(stock) {
        if (stock === 0) {
            return { class: 'stock-epuise', text: 'Rupture' };
        } else if (stock < 5) {
            return { class: 'stock-faible', text: 'Stock faible' };
        } else {
            return { class: 'stock-disponible', text: 'En stock' };
        }
    }

    // Ajouter un article
    async ajouterArticle(formData) {
        try {
            formData.append('action', 'ajouter_article');

            const response = await fetch('../PHP/gestion_articles.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            this.afficherToast('Article ajouté avec succès !', 'success');
            this.chargerArticles();
            this.cacherFormulaire();
            document.getElementById('form-ajout-article').reset();

        } catch (error) {
            console.error('Erreur ajout article:', error);
            this.afficherToast(error.message, 'error');
        }
    }

    // Modifier le stock
    modifierStock(idArticle, stockActuel) {
        document.getElementById('modal-id-article').value = idArticle;
        document.getElementById('modal-stock').value = stockActuel;
        document.getElementById('modal-stock').focus();
        document.getElementById('modal-stock').showModal();
    }

    async mettreAJourStock(formData) {
        try {
            formData.append('action', 'modifier_stock');

            const response = await fetch('../PHP/gestion_articles.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            this.afficherToast('Stock mis à jour avec succès !', 'success');
            this.fermerModalStock();
            this.chargerArticles();

        } catch (error) {
            console.error('Erreur modification stock:', error);
            this.afficherToast(error.message, 'error');
        }
    }

    // Supprimer un article
    async supprimerArticle(idArticle, titre) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?\nCette action est irréversible.`)) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('action', 'supprimer_article');
            formData.append('id_article', idArticle);

            const response = await fetch('../PHP/gestion_articles.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            this.afficherToast('Article supprimé avec succès !', 'success');
            this.chargerArticles();

        } catch (error) {
            console.error('Erreur suppression article:', error);
            this.afficherToast(error.message, 'error');
        }
    }

    // Afficher le formulaire d'ajout
    afficherFormulaire() {
        document.getElementById('form-section').style.display = 'block';
        document.getElementById('titre').focus();
    }

    // Cacher le formulaire d'ajout
    cacherFormulaire() {
        document.getElementById('form-section').style.display = 'none';
    }

    // Fermer le modal de stock
    fermerModalStock() {
        document.getElementById('modal-stock').close();
        document.getElementById('form-modifier-stock').reset();
    }

    // Rafraîchir la liste
    rafraichirListe() {
        this.chargerArticles();
        this.afficherToast('Liste actualisée', 'success');
    }

    // Afficher un message d'erreur
    afficherArticlesErreur(message) {
        const container = document.getElementById('articles-list');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // Afficher un toast
    afficherToast(message, type = 'success') {
        // Supprimer les toasts existants
        const toastsExistants = document.querySelectorAll('.toast');
        toastsExistants.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialisation
const gestionnaireArticles = new GestionnaireArticles();

// Fonctions globales pour les événements
function afficherFormulaireAjout() {
    gestionnaireArticles.afficherFormulaire();
}

function cacherFormulaire() {
    gestionnaireArticles.cacherFormulaire();
}

function rafraichirListe() {
    gestionnaireArticles.rafraichirListe();
}

function fermerModalStock() {
    gestionnaireArticles.fermerModalStock();
}

// Gestion des formulaires
document.addEventListener('DOMContentLoaded', function () {
    // Formulaire d'ajout d'article
    document.getElementById('form-ajout-article').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        gestionnaireArticles.ajouterArticle(formData);
    });

    // Formulaire de modification de stock
    document.getElementById('form-modifier-stock').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        gestionnaireArticles.mettreAJourStock(formData);
    });
});