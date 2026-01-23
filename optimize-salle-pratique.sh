#!/bin/bash

# Script pour optimiser l'image de la salle de pratique
# Usage: ./optimize-salle-pratique.sh <chemin-vers-image-source>

SOURCE_IMAGE="$1"
OUTPUT_DIR="public/images/laom"
OUTPUT_FILE="$OUTPUT_DIR/salle-de-pratique.webp"

if [ -z "$SOURCE_IMAGE" ]; then
    echo "Usage: $0 <chemin-vers-image-source>"
    echo "Exemple: $0 ~/Downloads/salle-pratique.jpg"
    exit 1
fi

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Erreur: Le fichier '$SOURCE_IMAGE' n'existe pas."
    exit 1
fi

echo "Traitement de l'image: $SOURCE_IMAGE"

# Créer le dossier de sortie si nécessaire
mkdir -p "$OUTPUT_DIR"

# Obtenir les dimensions originales
ORIGINAL_DIM=$(sips -g pixelWidth -g pixelHeight "$SOURCE_IMAGE" 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}')
ORIGINAL_WIDTH=$(echo "$ORIGINAL_DIM" | head -1)
ORIGINAL_HEIGHT=$(echo "$ORIGINAL_DIM" | tail -1)

echo "Dimensions originales: ${ORIGINAL_WIDTH}x${ORIGINAL_HEIGHT}"

# Calculer les dimensions pour le format portrait 3:4
# On garde la hauteur et on calcule la largeur pour un ratio 3:4
TARGET_HEIGHT=960
TARGET_WIDTH=$((TARGET_HEIGHT * 3 / 4))  # 720px pour ratio 3:4

echo "Dimensions cibles (portrait 3:4): ${TARGET_WIDTH}x${TARGET_HEIGHT}"

# Créer un fichier temporaire pour le recadrage
TEMP_CROPPED="/tmp/salle-pratique-cropped.jpg"

# Recadrer l'image à gauche pour format portrait
# sips crop: x, y, width, height (en pixels)
# On coupe à gauche, donc on commence à x=0 et on prend TARGET_WIDTH pixels
sips --cropToHeightWidth "$TARGET_HEIGHT" "$TARGET_WIDTH" "$SOURCE_IMAGE" --out "$TEMP_CROPPED" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "Erreur lors du recadrage. Tentative avec une autre méthode..."
    # Méthode alternative: redimensionner d'abord puis recadrer
    sips -Z "$TARGET_HEIGHT" "$SOURCE_IMAGE" --out "$TEMP_CROPPED" 2>/dev/null
    sips --cropToHeightWidth "$TARGET_HEIGHT" "$TARGET_WIDTH" "$TEMP_CROPPED" --out "$TEMP_CROPPED" 2>/dev/null
fi

# Convertir en WebP avec optimisation
# Utiliser cwebp si disponible, sinon sips
if command -v cwebp &> /dev/null; then
    echo "Conversion en WebP avec cwebp (optimisé)..."
    cwebp -q 85 -m 6 "$TEMP_CROPPED" -o "$OUTPUT_FILE" 2>/dev/null
else
    echo "Conversion en WebP avec sips..."
    # sips ne supporte pas WebP directement, on doit utiliser une autre méthode
    # Pour macOS, on peut utiliser sips pour créer un PNG temporaire puis le convertir
    TEMP_PNG="/tmp/salle-pratique-temp.png"
    sips -s format png "$TEMP_CROPPED" --out "$TEMP_PNG" 2>/dev/null
    
    # Si sharp-cli ou autre outil est disponible, l'utiliser
    # Sinon, on garde le PNG et on informe l'utilisateur
    if [ -f "$TEMP_PNG" ]; then
        echo "Note: sips ne supporte pas WebP directement."
        echo "Image recadrée sauvegardée en PNG. Conversion WebP recommandée avec un outil externe."
        cp "$TEMP_PNG" "$OUTPUT_DIR/salle-de-pratique.png"
        OUTPUT_FILE="$OUTPUT_DIR/salle-de-pratique.png"
    fi
fi

# Nettoyer les fichiers temporaires
rm -f "$TEMP_CROPPED" "$TEMP_PNG" 2>/dev/null

if [ -f "$OUTPUT_FILE" ]; then
    OUTPUT_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo "✓ Image optimisée créée: $OUTPUT_FILE"
    echo "  Taille: $OUTPUT_SIZE"
    echo "  Dimensions: ${TARGET_WIDTH}x${TARGET_HEIGHT} (portrait 3:4)"
else
    echo "Erreur: L'image optimisée n'a pas pu être créée."
    exit 1
fi
