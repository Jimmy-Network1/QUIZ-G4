# 📗 Documentation Technique - Knowar (QUIZ-G4)

Bienvenue dans la documentation officielle de l'application **Knowar**. Ce document détaille l'architecture, le fonctionnement des modules et les interactions clés du système.

---

## 🏗️ 1. Architecture Globale
Le projet est structuré en **Monorepo** divisé en trois parties principales :
1.  **Client (`/client`)** : Application mobile native développée avec **React Native (TypeScript)**.
2.  **Server (`/server`)** : API backend et gestionnaire de temps réel développés avec **Node.js, Express et Socket.io**.
3.  **Shared (`/shared`)** : Types TypeScript partagés pour garantir la cohérence des données entre le front et le back.

---

## 📱 2. Le Client (Frontend)

### 📂 Structure des dossiers clés :
*   **`src/screens/`** : Contient toutes les pages de l'application.
    *   `local/` : Écrans dédiés au mode Wi-Fi et Bluetooth.
    *   `GameScreen.tsx` : Le cœur du moteur de jeu.
*   **`src/hooks/`** : Logique métier réutilisable.
    *   `useGameLogic.ts` : Gère le score, le chronomètre et la progression des questions.
    *   `useQuestions.ts` : Gère la récupération hybride des questions.
*   **`src/services/`** : Communication avec le matériel et les APIs.
    *   `local/LocalP2PService.ts` : Gestion du réseau TCP pour le Wi-Fi local.
    *   `local/BluetoothService.ts` : Gestion du protocole Bluetooth Classic.
*   **`src/store/`** : Gestion d'état globale (Context API).
    *   `authContext.tsx` : Session utilisateur.
    *   `alertContext.tsx` : Nouveau système d'alertes "Glass UI" personnalisées.

### 🚀 Fonctionnalités Majeures du Client :
1.  **Système de Questions Hybride** : 
    *   L'app cherche d'abord en **Local** (`offlineQuestions.json`) pour l'instantanéité.
    *   Ensuite via l'**IA** (Mistral) pour le contenu dynamique en Français.
    *   En dernier recours via l'**API OpenTDB**.
2.  **Capture Multimodale (IA)** :
    *   `launchCamera` & `launchImageLibrary` : Pour analyser des photos ou documents.
    *   `AudioRecorderPlayer` : Pour capturer la voix et générer des quiz basés sur l'audio.
3.  **UI "Glassmorphism"** : Utilisation du composant `GlassCard` pour un aspect visuel moderne et sombre (Apple Style).

---

## 💻 3. Le Serveur (Backend)

### 📂 Structure des dossiers clés :
*   **`src/controllers/`** : Réception des requêtes API.
    *   `aiController.ts` : Point d'entrée pour la génération de quiz par l'IA.
*   **`src/services/`** : Cerveau logique.
    *   `aiService.ts` : Intégration de **Mistral AI**. Gère le fallback (secours) entre les modèles et le mode démo.
*   **`src/socket/`** : Gestion du mode multijoueur en ligne (Salons, scores en direct).
*   **`src/models/`** : Schémas **MongoDB** (Utilisateurs, Salons, Tournois).

---

## 🧠 4. Le Moteur IA (Mistral AI)

L'IA est le point fort de l'application. Elle remplace l'ancienne intégration Google Gemini pour plus de stabilité.
*   **Mode Texte** : Génère des questions à partir d'un thème (ex: "Développement Mobile").
*   **Mode Vision** : Analyse les données d'image envoyées par le mobile.
*   **Sécurité Anti-Panne** : Si l'API Mistral est injoignable, le serveur renvoie automatiquement des questions de secours locales pour éviter que l'utilisateur ne reste bloqué.

---

## 📡 5. Interactions et Flux de données

1.  **Démarrage d'une partie IA** :
    *   Le mobile capture une image/audio -> Convertit en Base64 -> Envoie au serveur via `POST /api/ai/generate`.
    *   Le serveur envoie le contexte à Mistral AI avec un prompt pédagogique.
    *   Le serveur reçoit le JSON, le nettoie et le renvoie au mobile.
    *   Le mobile injecte les questions dans `useGameLogic`.

2.  **Mode Local (P2P)** :
    *   L'hôte crée un serveur TCP sur le port `9090`.
    *   Les clients se connectent via l'IP de l'hôte.
    *   Les questions sont synchronisées via des messages `START_GAME`.

---

## 🚀 6. Déploiement et Maintenance

*   **Hébergement** : Le backend est déployé sur **Render** (`https://quiz-g4.onrender.com`).
*   **Base de données** : MongoDB Atlas (Cloud).
*   **CI/CD** : GitHub Actions est configuré pour tester le code à chaque push.
*   **Build Mobile** : L'APK est généré via Gradle (`cd client/android && ./gradlew assembleRelease`).

---

## 🛠️ 7. Variables d'Environnement Cruciales
*   `MISTRAL_API_KEY` : Clé secrète pour le cerveau IA.
*   `MONGO_URL` : Lien de connexion à la base de données.
*   `JWT_SECRET` : Clé de sécurisation des mots de passe.
