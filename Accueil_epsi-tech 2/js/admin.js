class AdminPanel {
    constructor() {
        this.articles = [];
        this.categories = [];
        this.ongletActuel = 'dashboard';
        this.initialiser();
    }

    async initialiser() {
        await this.chargerCategories();
        await this.chargerArticles();
        this.calculerStatistiques();
        this.remplirSelectCategories();
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
            console.log('Catégories chargées:', this.categories);

            if (this.ongletActuel === 'categories') {
                this.afficherCategories();
            }

        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            this.afficherToast('Erreur lors du chargement des catégories', 'error');
        }
    }

    // Charger les articles
    async chargerArticles() {
        try {
            const response = await fetch('../PHP/produits.php');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.articles = data;
            this.afficherArticles();
            this.calculerStatistiques();

        } catch (error) {
            console.error('Erreur chargement articles:', error);
            this.afficherArticlesErreur('Erreur lors du chargement des articles');
        }
    }

    // Remplir le select des catégories
    remplirSelectCategories() {
        const select = document.getElementById('id_categorie');
        if (!select) return;

        select.innerHTML = '<option value="">Sélectionnez une catégorie</option>';

        if (this.categories.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucune catégorie disponible';
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        this.categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id_categorie;
            option.textContent = categorie.nom;
            select.appendChild(option);
        });
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
                </div>
                
                <div class="article-actions">
                    <button class="btn-primary" onclick="admin.modifierStock(${article.id_article}, ${article.nombre_exemplaire})">
                        📊 Modifier stock
                    </button>
                    <button class="btn-danger" onclick="admin.supprimerArticle(${article.id_article}, '${article.titre}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    // Afficher les catégories
    afficherCategories() {
        const container = document.getElementById('categories-list');

        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <h3>Aucune catégorie disponible</h3>
                    <p>Créez votre première catégorie pour commencer !</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="categories-grid">
                ${this.categories.map(categorie => this.creerCarteCategorie(categorie)).join('')}
            </div>
        `;
    }

    // Créer une carte catégorie
    creerCarteCategorie(categorie) {
        // Compter les articles dans cette catégorie
        const nbArticles = this.articles.filter(a => a.id_categorie == categorie.id_categorie).length;

        return `
            <div class="category-card">
                <div