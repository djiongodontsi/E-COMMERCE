document.addEventListener('DOMContentLoaded', function () {
  var tbody = document.getElementById('panier-corps');
  var totalDiv = document.getElementById('total-panier');
  var cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('panier') || '[]');
  } catch (e) {
    cart = [];
  }

  if (!tbody || !totalDiv) return;

  if (!cart || cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Votre panier est vide</td></tr>';
    totalDiv.textContent = 'Total : 0 €';
    return;
  }

  var total = 0;
  tbody.innerHTML = '';

  cart.forEach(function (item, idx) {
    var quant = item.quantite || 1;
    // Accept prix as number or string with comma/dot
    var rawPrix = item.prix;
    var prixNum = 0;
    try {
      prixNum = parseFloat(String(rawPrix).replace(',', '.')) || 0;
    } catch (e) {
      prixNum = 0;
    }
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
      '<td><button class="suppr" data-idx="' +
      idx +
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

  console.log('panier chargé', cart, 'total', total);

  tbody.addEventListener('click', function (e) {
    if (!e.target) return;
    if (e.target.classList.contains('suppr')) {
      var idx = parseInt(e.target.getAttribute('data-idx'), 10);
      if (!isNaN(idx)) {
        cart.splice(idx, 1);
        localStorage.setItem('panier', JSON.stringify(cart));
        location.reload();
      }
    }
  });

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
