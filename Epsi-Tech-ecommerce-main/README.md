# EPSI Tech - Plateforme E-commerce Informatique

> **Note sur le projet :** Ce site a été initialement conçu lors d'un projet transversal en groupe à l'EPSI. J'ai par la suite repris l'intégralité du projet pour corriger les erreurs, optimiser le code et finaliser l'interface utilisateur afin d'obtenir un résultat professionnel (Utilisation de antigravity pour m'aider à corriger les erreurs et optimiser le code).

## 👤 Mon Rôle et Responsabilités
Dans le cadre de ce projet d'équipe, je me suis occupé des piliers suivants :
* **Design & Frontend** : Création de l'identité visuelle (inspirée de l'EPSI) et intégration de l'interface utilisateur pour toutes les pages (Accueil, Contact, Panier, etc.).
* **Base de Données (BDD)** : Conception, création et gestion de la base de données locale sous XAMPP, incluant la gestion des relations entre les tables.
* **Backend (Partiel)** : Développement des fonctionnalités liées à l'authentification (inscription/connexion) et à la gestion dynamique du panier et des commandes.

## 📝 Présentation du Projet
**EPSI Tech** est une boutique en ligne spécialisée dans le matériel informatique. Le site permet aux utilisateurs de naviguer entre différentes catégories (PC Bureau, PC Portables, Téléphones) et de passer commande.

### Fonctionnalités principales :
* **Gestion Client** : Inscription et connexion avec sécurisation des données (hachage des mots de passe).
* **Catalogue Dynamique** : Affichage des produits répartis en trois catégories distinctes : ordinateurs de bureau, ordinateurs portables et téléphones.
* **Système de Panier** : Ajout d'articles, modification des quantités et calcul du total avant paiement.
* **Validation de Commande** : Envoi automatique des informations de transaction vers la base de données.

## 🛠️ Stack Technique
* **Langages** : PHP (Backend), HTML5 / CSS3 (Design & Frontend) / JavaScript.
* **Base de Données** : MySQL (via XAMPP).
* **Outils** : VS Code, phpMyAdmin.

## 🗄️ Structure de la Base de Données
Le projet repose sur trois tables MySQL interconnectées :
1.  **`users`** : Stockage des profils utilisateurs (admin et clients).
2.  **`article`** : Gestion du stock, des prix et des images des produits.
3.  **`commandes`** : Historique et suivi des achats effectués sur le site.

## 📸 Aperçu de l'Interface

### Boutique & Produits
| Accueil | Catalogue | Fiche Produit |
| :--- | :--- | :--- |
| ![Accueil](01.jpg) | ![Catalogue](04.png) | ![Produit](05.png) |

### Panier & Administration BDD
| Mon Panier | Table des Articles | Table des Utilisateurs |
| :--- | :--- | :--- |
| ![Panier](07.png) | ![Articles](08.png) | ![Users](09.png) |

## ⚙️ Installation Locale
1.  Cloner ce dépôt dans votre dossier `htdocs`.
2.  Démarrer les modules **Apache** et **MySQL** via le panneau de contrôle **XAMPP**.
3.  Importer le fichier `.sql` (disponible dans le dossier `sql/` ou à la racine) dans **phpMyAdmin**.
4.  Lancer le projet via l'URL : `http://localhost/EPSI-Tech/`.