#!/bin/bash

# Script pour relancer le serveur de développement
# Portfolio - folio-fabien

export PATH="/usr/local/bin:$PATH"

echo "🔄 Arrêt du serveur en cours..."
pkill -f "vite" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 1

echo "🚀 Lancement du serveur..."
cd "$(dirname "$0")"
npm run dev
