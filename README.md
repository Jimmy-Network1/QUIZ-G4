# 🏆 Knowar - L'Arène du Quiz Ultime

**Knowar** est une application mobile de quiz multijoueur révolutionnaire, conçue pour transformer la culture générale en une véritable compétition d'e-sport. Que vous soyez connecté au monde entier ou entre amis dans une zone sans réseau, Knowar offre une expérience fluide, intelligente et visuellement époustouflante.

---

## 🌟 Fonctionnalités Phares

### 1. 🏅 Mode Championship (Style Coupe du Monde)
Participez à des tournois à élimination directe.
*   **Tableau de Bord Dynamique :** Visualisez l'arbre de compétition (Brackets) en temps réel.
*   **Matchmaking Automatique :** Le serveur génère les duels (8èmes, Quarts, Demis, Finale) instantanément.
*   **Salle d'Attente Animée :** Suivez l'arrivée des champions en direct avec un compteur réactif.

### 2. 🤖 Intelligence Artificielle (Google Gemini)
Ne soyez jamais à court de défis grâce au générateur de quiz par IA.
*   **Thèmes Infinis :** Tapez n'importe quel sujet (ex: *"Histoire du Cameroun"*, *"Physique Quantique"*, *"Séries Netflix"*) et l'IA génère 10 questions uniques.
*   **Adaptabilité :** Disponible en mode Solo pour l'entraînement et en mode Multi pour surprendre vos adversaires.

### 3. 🌐 Dualité de Connexion (Online vs Local P2P)
*   **Mode Online :** Jouez partout dans le monde via notre serveur déployé sur **Render**. Les scores sont sauvegardés sur une base de données **MongoDB Cloud** pour le classement mondial.
*   **Mode Local P2P :** Jouez sans Internet et sans PC ! Un téléphone devient l'hôte (Hotspot/Wi-Fi) et les autres s'y connectent directement en Peer-to-Peer.

### 4. 🎨 Design Cyberpunk & Immersion
*   **Esthétique Néon :** Une interface sombre inspirée du style futuriste avec des effets de lueur (glow) et des dégradés vibrants.
*   **Animations Fluides :** Effets de pulsation (Pulse) et transitions soignées pour une expérience "vivante".
*   **Trophées Téléchargeables :** Le grand gagnant génère un trophée personnalisé qu'il peut enregistrer et partager.

---

## 🛠️ Stack Technique

| Secteur | Technologies |
| :--- | :--- |
| **Frontend** | React Native (TypeScript), React Navigation, Reanimated |
| **Temps Réel** | Socket.io (Online), TCP Sockets (Local P2P) |
| **Backend** | Node.js, Express |
| **IA** | Google Gemini AI SDK |
| **Base de Données** | MongoDB (Mongoose) |
| **Déploiement** | Render (Infrastructure-as-Code avec Blueprint) |

---

## 🚀 Installation et Lancement

### Prérequis
*   Node.js (v20.x recommandé)
*   Android Studio (pour l'émulateur ou le build APK)
*   Une clé API Google Gemini (pour les fonctions IA)

### Configuration Rapide
1. **Clonage du projet :**
   ```bash
   git clone https://github.com/Jimmy-Network1/QUIZ-G4.git
   ```

2. **Serveur (Backend) :**
   ```bash
   cd server
   npm install
   # Créez un .env avec MONGO_URL, JWT_SECRET et GEMINI_API_KEY
   npm run dev
   ```

3. **Client (Mobile) :**
   ```bash
   cd client
   npm install
   # Configurez l'API_URL dans le .env
   npm run android
   ```

---

## 🏗️ Gestion via CLI (Render)
Ce projet est entièrement pilotable en ligne de commande grâce au **Render CLI** :
*   `render services` : Liste les services actifs.
*   `render logs [ID]` : Affiche les logs du serveur en temps réel.
*   `render deploy [ID]` : Force un nouveau déploiement.

---

## 👥 Membres du Groupe 4
*   **EL SONK JIMMY** (Lead Developer & Ops)
*   [Nom/Prénom Coéquipier 1]
*   [Nom/Prénom Coéquipier 2]
*   [Nom/Prénom Coéquipier 3]

---
*Développé avec passion pour le TP de Développement Mobile 2026.*
