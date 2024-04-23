# Backend MDD

Ce projet backend est construit avec [Spring Boot](https://spring.io/projects/spring-boot) en respectant les principes de la Clean Architecture. Il est divisé en trois modules principaux pour une séparation claire des responsabilités et une meilleure maintenabilité.

## Structure du projet

- **mdd-core**: Ce module ne contient aucune dépendance externe. Il définit les interfaces repository, les entités et les uses-cases.
- **mdd-presenter**: Module contenant les contrôleurs, l'implémentation de la sécurité, et les requête/réponse ansin que l'a config des Bean de mdd-core. Il dépend de Spring Boot et interagit directement avec le côté client.
- **mdd-details**: Implémente les interfaces repository définies dans `mdd-core` et contient la logique d'accès aux données.

## Prérequis

- Java JDK 11 ou supérieur
- Maven 3.6 ou supérieur
- Base de données MySql

## Configuration

### Fichier .env

Créez un fichier `.env` à la racine du projet avec les configurations suivantes pour connecter l'application à votre base de données :

```bash
DATABASE_USERNAME=yourUsername

DATABASE_PASSWORD=yourPassword

DATABASE_URL=jdbc:mysql://localhost:3306/yourDatabase
```

### Dépendances

Le projet utilise JWT pour la gestion des authentifications et sécurise les configurations sensibles à l'aide de Dotenv. Assurez-vous que ces dépendances sont correctement configurées dans vos fichiers `pom.xml` de chaque module.

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/TheoKennel/Developpez-une-application-full-stack-complete.git
cd back

# Installer les dépendances et construire le projet
mvn clean install

```

## Script

Dans mdd-presenter - test - ressources, vous trouvez les scription sql des tables si nécessaire. 7

Un script postman est disponible des mdd-presenter - main - ressources afin d'avoir toutes les requêtes.


## Utilisation
L'application est maintenant prête à accepter les requêtes. Vous pouvez interagir avec l'API via des outils comme Postman ou directement depuis votre frontend.

## License 

Projet réalisé par Théo K.


