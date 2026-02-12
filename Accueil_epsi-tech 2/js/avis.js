// Gestion des étoiles de notation
document.addEventListener('DOMContentLoaded', function () {
    // Éléments du DOM
    const formAvis = document.getElementById('formAvis');
    const textarea = document.getElementById('commentaire');
    const charCount = document.getElementById('charCount');
    const ratingText = document.getElementById('ratingText');
    const stars = document.querySelectorAll('input[name="note"]');
    const avisContainer = document.getElementById('avisContainer');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const submitBtn = document.getElementById('submitBtn');

    // Textes pour les notes
    const ratingTexts = {
        1: "Mauvais - Très déçu",
        2: "Médiocre - Peu satisfait",
        3: "Correct - Satisfait",
        4: "Bon - Très satisfait",
        5: "Excellent - Parfait"
    };

    // Gestion des étoiles
    stars.forEach(star => {
        star.addEventListener('change', function () {
            const note = this.value;
            ratingText.textContent = ratingTexts[note] || "Sélectionnez une note";
        });
    });

    // Compteur de caractères
    if (textarea && charCount) {
        textarea.addEventListener('input', function () {
            const length = this.value.length;
            charCount.textContent = length;

            // Changement de couleur
            if (length > 450) {
                charCount.style.color = '#e53e3e';
            } else if (length > 400) {
                charCount.style.color = '#dd6b20';
            } else {
                charCount.style.color = 'var(--text-light)';
            }
        });
    }

    // Soumission du formulaire
    if (formAvis) {
        formAvis.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // État de chargement
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                showNotification(data.message, data.success ? 'success' : 'error');

                if (data.success) {
                    formAvis.reset();
                    charCount.textContent = '0';
                    charCount.style.color = 'var(--text-light)';
                    ratingText.textContent = "Sélectionnez une note";
                    loadAvis(); // Recharger les avis
                }

            } catch (error) {
                console.error('Erreur:', error);
                showNotification('Une erreur est survenue lors de l\'envoi', 'error');
            } finally {
                // Restaurer le bouton
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // Filtres des avis
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;

            // Mettre à jour les boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filtrer les avis
            filterAvis(filter);
        });
    });

    // Chargement initial des avis
    loadAvis();
});

// Fonction pour charger les avis
async function loadAvis() {
    const avisContainer = document.getElementById('avisContainer');

    if (!avisContainer) return;

    avisContainer.innerHTML = `
        <div class="loading-avis">
            <div class="spinner"></div>
            <p>Chargement des avis...</p>
        </div>
    `;

    try {
        const response = await fetch('../PHP/get_avis.php');
        const data = await response.json();

        if (data.success) {
            displayAvis(data.data);
        } else {
            avisContainer.innerHTML = `
                <div class="no-avis">
                    <p>❌ Erreur lors du chargement des avis</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur:', error);
        avisContainer.innerHTML = `
            <div class="no-avis">
                <p>❌ Impossible de charger les avis</p>
            </div>
        `;
    }
}

// Fonction pour afficher les avis
function displayAvis(avis) {
    const avisContainer = document.getElementById('avisContainer');

    if (avis.length === 0) {
        avisContainer.innerHTML = `
            <div class="no-avis">
                <p>📝 Aucun avis pour le moment</p>
                <p>Soyez le premier à donner votre avis !</p>
            </div>
        `;
        return;
    }

    avisContainer.innerHTML = avis.map(avis => `
        <div class="avis-item" data-rating="${avis.note}">
            <div class="avis-header">
                <span class="avis-client">${avis.nom_client}</span>
                <span class="avis-date">${formatDate(avis.date_avis)}</span>
            </div>
            <div class="avis-product">${avis.nom_article || 'Produit'}</div>
            <div class="avis-stars">${'★'.repeat(avis.note)}${'☆'.repeat(5 - avis.note)}</div>
            <div class="avis-comment">${avis.commentaire || 'Aucun commentaire'}</div>
        </div>
    `).join('');
}

// Fonction pour filtrer les avis
function filterAvis(filter) {
    const avisItems = document.querySelectorAll('.avis-item');

    avisItems.forEach(item => {
        if (filter === 'all' || item.dataset.rating === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Fonction pour formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Fonction pour afficher les notifications
function showNotification(message, type) {
    // Supprimer les anciennes notifications
    const oldNotification = document.getElementById('notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.classList.add('hidden');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}