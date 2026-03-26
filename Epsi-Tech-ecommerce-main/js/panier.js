document.addEventListener('DOMContentLoaded', function () {
  var tbody = document.getElementById('panier-corps');
  var totalDiv = document.getElementById('total-panier');

  if (!tbody || !totalDiv) return;

  function fetchCart() {
    fetch('get_panier.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          renderCart(data.items);
        } else {
          console.error('Erreur lors de la récupération du panier:', data.message);
          tbody.innerHTML = '<tr><td colspan="5">Erreur lors du chargement du panier</td></tr>';
        }
      })
      .catch(error => {
        console.error('Erreur fetch:', error);
        tbody.innerHTML = '<tr><td colspan="5">Impossible de contacter le serveur</td></tr>';
      });
  }

  function renderCart(cart) {
    if (!cart || cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Votre panier est vide</td></tr>';
      totalDiv.textContent = 'Total : 0 €';
      return;
    }

    var total = 0;
    tbody.innerHTML = '';

    cart.forEach(function (item, idx) {
      var quant = parseInt(item.quantite) || 1;
      var prixNum = parseFloat(item.prix) || 0;
      var itemTotal = prixNum * quant;
      total += itemTotal;

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' +
        escapeHtml(item.titre) +
        '</td>' +
        '<td>' +
        prixNum.toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        ' €</td>' +
        '<td>' +
        quant +
        '</td>' +
        '<td>' +
        itemTotal.toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        ' €</td>' +
        '<td><button class="suppr" data-titre="' +
        escapeHtml(item.titre) +
        '">Supprimer</button></td>';
      tbody.appendChild(tr);
    });

    totalDiv.textContent =
      'Total : ' +
      total.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      ' €';
  }

  fetchCart();

  tbody.addEventListener('click', function (e) {
    if (!e.target) return;
    if (e.target.classList.contains('suppr')) {
      var titre = e.target.getAttribute('data-titre');
      if (titre) {
        supprimerProduit(titre);
      }
    }
  });

  function supprimerProduit(titre) {
    fetch('supprimer_produit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre: titre })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchCart(); // Rafraîchir l'affichage
      }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[s];
    });
  }
});
