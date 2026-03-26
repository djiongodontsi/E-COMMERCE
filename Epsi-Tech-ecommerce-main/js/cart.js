function addToCart(titre, prix, image) {
  console.log('Ajout au panier :', titre);

  var payload = JSON.stringify({
    titre: titre,
    quantite: 1
  });

  // On envoie au serveur et on attend la réponse avant de rediriger
  fetch('ajout_panier.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  })
  .then(response => {
    if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log('Succès : Ajouté à la BDD');
      // Redirection vers le panier une fois que c'est enregistré
      window.location.href = 'panier.html';
    } else {
      alert('Erreur lors de l\'ajout au panier : ' + data.message);
    }
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi :', error);
    alert('Erreur serveur: ' + error.message);
  });
}

function clearCart() {
  localStorage.removeItem('panier');
}
