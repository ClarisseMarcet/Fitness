# CoachIA - Entraîneur Sportif Intelligent

Une application web qui utilise l'intelligence artificielle pour détecter les poses et compter les répétitions pendant vos séances d'entraînement.

## Fonctionnalités

- 🔐 Authentification utilisateur avec Firebase
- 📹 Détection de pose en temps réel avec TensorFlow.js
- 🔢 Comptage automatique des répétitions
- 📊 Suivi des statistiques d'entraînement
- 💪 Support pour différents exercices (squats, pompes)

## Prérequis

- Node.js 18+ et npm
- Un compte Firebase
- Une caméra web

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/coach-ia.git
cd coach-ia
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` à la racine du projet avec vos clés Firebase :
```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

## Configuration Firebase

1. Créez un nouveau projet Firebase
2. Activez l'authentification par email/mot de passe
3. Créez une base de données Firestore
4. Configurez les règles de sécurité Firestore :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Structure du Projet

```
src/
  ├── app/                    # Pages de l'application
  │   ├── page.tsx           # Page d'accueil
  │   ├── login/             # Page de connexion
  │   ├── register/          # Page d'inscription
  │   ├── dashboard/         # Tableau de bord
  │   └── train/             # Page d'entraînement
  ├── components/            # Composants réutilisables
  │   ├── AuthForm.tsx       # Formulaire d'authentification
  │   ├── Header.tsx         # En-tête de l'application
  │   ├── PoseTracker.tsx    # Détection de pose
  │   └── RepsCounter.tsx    # Compteur de répétitions
  └── lib/                   # Utilitaires et configurations
      └── firebase.ts        # Configuration Firebase
```

## Utilisation

1. Créez un compte ou connectez-vous
2. Accédez au tableau de bord
3. Sélectionnez un exercice
4. Autorisez l'accès à votre caméra
5. Commencez votre entraînement !

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
