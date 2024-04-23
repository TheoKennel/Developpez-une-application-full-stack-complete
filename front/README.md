# Front

![Angular Logo](https://angular.io/assets/images/logos/angular/angular.png)

Ce projet utilise [Angular](https://angular.io/) version 14.2.0 et est configuré avec une suite de tests complets et des outils de développement pour une intégration et une expérience de développement optimales.

## Prérequis

Ce projet nécessite [Node.js](https://nodejs.org/) et [npm](https://npmjs.com/). Assurez-vous qu'ils sont installés sur votre machine.

## Installation

Pour installer et démarrer le projet, suivez les étapes ci-dessous :

```bash
# Cloner le dépôt
git clone https://github.com/TheoKennel/Developpez-une-application-full-stack-complete.git
cd front

# Installer les dépendances
npm install

```

## Utilisation

```bash

# Démarrer le serveur de développement sur http://localhost:4200/
npm start

# Construire le projet pour la production
npm run build

# Exécuter les tests unitaires avec Jest
npm test

```

## Architecture

Le projet suit une architecture en component. 

Il utilise un local storage ainsi qu'un interceptor pour les jwt / refresh token en cookie disponible dans features / guards. 

Les tests sont réalisé avec jest en unitaire et intégration.

Les tests end-to-end sont disponible dans le fichier cypress.
