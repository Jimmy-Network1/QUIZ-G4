# TP QUIZZ-MOBILE - GROUPE 4

## Description du Projet
Ce projet est une application mobile de quiz multijoueur développée dans le cadre du TP de développement mobile. Elle permet aux utilisateurs de s'affronter en temps réel sur des questions de culture générale.

## Fonctionnalités
- Application mobile multiplateforme (React Native).
- Gameplay multijoueur en temps réel via Socket.IO.
- Backend évolutif en Node.js avec architecture MVC.
- Gestion des données avec MongoDB.

## Membres du Groupe 4
- [Votre Nom/Prénom]
- [Nom/Prénom Coéquipier 1]
- [Nom/Prénom Coéquipier 2]
- [Nom/Prénom Coéquipier 3]

## Architecture Technique
### Frontend
- **React Native** (TypeScript)
- **React Navigation** pour la navigation.
- **Socket.io-client** pour la communication temps réel.

### Backend
- **Node.js** & **Express**
- **Socket.IO** pour la gestion des salons de jeu.
- **Mongoose** pour l'interaction avec MongoDB.

## Installation et Lancement

### Prérequis
- Node.js (v16 ou supérieur)
- React Native CLI
- MongoDB
- Android Studio / Xcode

### Installation des dépendances

#### Serveur
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### Configuration
1. Créez un fichier `.env` dans le dossier `client` :
```plaintext
LOCAL_API_URL="http://[VOTRE_IP_LOCALE]:5000"
```

### Lancement

#### Démarrer le serveur
```bash
cd server
npm run dev
```

#### Démarrer l'application (Android)
```bash
cd client
npm run android
```
