// Gestion simple du panier en localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('panier') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('panier', JSON.stringify(cart));
}

function addToCart(titre, prix, image) {
  var cart = getCart();
  var idx = cart.findIndex(function (it) {
    return it.titre === titre;
  });
  if (idx >= 0) {
    cart[idx].quantite = (cart[idx].quantite || 1) + 1;
  } else {
    cart.push({
      titre: titre,
      prix: parseFloat(prix) || 0,
      image: image,
      quantite: 1,
    });
  }
  saveCart(cart);
  // Debug/log so we can trace client-side behavior
  try {
    console.log('addToCart:', { titre: titre, prix: prix, image: image });
  } catch (e) {}

  // Send to server in background without blocking navigation.
  // Prefer navigator.sendBeacon so navigation isn't cancelled.
  try {
    var payload = JSON.stringify({
      titre: titre,
      prix: parseFloat(prix) || 0,
      image: image,
      quantite: 1,
    });
    if (navigator && typeof navigator.sendBeacon === 'function') {
      var blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('ajout_panier.php', blob);
    } else {
      // Best-effort fetch; don't wait for it — fire and forget
      fetch('ajout_panier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(function (err) {
        console.warn('Erreur envoi panier au serveur:', err);
      });
    }
  } catch (e) {
    console.warn('Erreur envoi panier (catch):', e);
  }

  // Redirect immediately so panier.html can read localStorage and afficher le produit
  window.location.href = 'panier.html';
}

// Small helper to remove the cart (for debugging)
function clearCart() {
  localStorage.removeItem('panier');
}
