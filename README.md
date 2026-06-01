# Cité Concorde - Monorepo

Bienvenue dans la nouvelle structure professionnelle de **Cité Concorde**. Ce projet utilise une architecture **Monorepo** basée sur `pnpm workspaces` pour séparer les interfaces par type d'utilisateur tout en partageant le code commun.

## 🏗️ Structure du Projet

```text
cite-concorde/
├── apps/
│   ├── app-resident/      # Interface pour les Résidents
│   ├── app-boutique/      # Interface pour les Commerçants
│   ├── app-artisan/       # Interface pour les Artisans
│   ├── app-livreur/       # Interface pour les Livreurs
│   ├── app-syndic/        # Interface pour le Syndic
│   └── app-admin/         # Interface Administrateur Global
├── packages/
│   ├── core/              # Logique métier, API Supabase, Types
│   ├── ui/                # Composants UI partagés (React)
│   └── config/            # Configurations partagées (TS, ESLint)
├── legacy-frontend/       # Votre ancien code frontend (pour référence)
└── legacy-backend/        # Votre ancien code backend (pour référence)
```

## 🚀 Démarrage Rapide

### 1. Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### 2. Installation
```bash
pnpm install
```

### 3. Développement
Pour lancer toutes les applications en mode développement simultanément :
```bash
pnpm dev
```

Pour lancer une application spécifique (ex: résident) :
```bash
pnpm --filter app-resident dev
```

## 💡 Pourquoi cette architecture ?

1.  **Sécurité** : Le code de l'admin n'est jamais chargé dans l'application du résident.
2.  **Maintenance** : Les types et la logique API sont définis une seule fois dans `packages/core`.
3.  **Performance** : Chaque application est légère et optimisée pour son usage spécifique.
4.  **Évolutivité** : Vous pouvez ajouter une 7ème application sans perturber les autres.

## 🛠️ Prochaines étapes conseillées

1.  **Variables d'environnement** : Configurez vos clés Supabase dans des fichiers `.env` à la racine ou dans chaque application.
2.  **Composants UI** : Déplacez vos composants réutilisables du dossier `legacy-frontend` vers `packages/ui`.
3.  **Migration progressive** : Copiez la logique de `legacy-frontend` vers les applications correspondantes dans `apps/`.

---
*Projet restructuré avec succès par Manus AI.*
