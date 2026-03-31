# Fabien Bouadi — Portfolio

## Lancer en local

```bash
# 1. Aller dans le dossier
cd folio-src

# 2. Installer les dépendances (une seule fois)
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir ensuite : **http://localhost:5173**

## Build pour la production

```bash
npm run build
npm run preview
```

## Structure

```
folio-src/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── main.tsx              ← point d'entrée
    ├── App.tsx               ← routes (sans AnimatePresence)
    ├── index.css             ← Tailwind + styles globaux
    ├── context/
    │   └── TransitionContext.tsx
    ├── hooks/
    │   └── useNavigateWithMask.ts  ← à utiliser à la place de <Link>
    ├── components/
    │   ├── Layout.tsx        ← contient le masque beige fixe
    │   ├── Navbar.tsx
    │   ├── PageTransition.tsx
    │   ├── Footer.tsx
    │   ├── LenisProvider.tsx
    │   └── VideoModal.tsx
    ├── pages/
    │   ├── Home.tsx
    │   ├── About.tsx
    │   ├── Project.tsx
    │   └── Playground.tsx
    ├── data/
    │   ├── projects.ts
    │   └── playground.ts
    └── utils/
        └── cn.ts
```
