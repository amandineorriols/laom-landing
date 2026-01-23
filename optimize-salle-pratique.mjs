#!/usr/bin/env node

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Récupérer le chemin de l'image source depuis les arguments
const sourceImage = process.argv[2];

if (!sourceImage) {
  console.error('Usage: node optimize-salle-pratique.mjs <chemin-vers-image-source>');
  console.error('Exemple: node optimize-salle-pratique.mjs ~/Downloads/salle-pratique.jpg');
  process.exit(1);
}

if (!existsSync(sourceImage)) {
  console.error(`Erreur: Le fichier '${sourceImage}' n'existe pas.`);
  process.exit(1);
}

const outputDir = join(__dirname, 'public', 'images', 'laom');
const outputFile = join(outputDir, 'salle-de-pratique.webp');

// Créer le dossier de sortie si nécessaire
mkdirSync(outputDir, { recursive: true });

console.log(`Traitement de l'image: ${sourceImage}`);

try {
  // Obtenir les métadonnées de l'image
  const metadata = await sharp(sourceImage).metadata();
  console.log(`Dimensions originales: ${metadata.width}x${metadata.height}`);

  // Dimensions cibles pour format portrait 3:4
  // Pour la section "Nos Espaces", on utilise 420x560 (ratio 3:4)
  const targetWidth = 420;
  const targetHeight = 560;

  console.log(`Dimensions cibles (portrait 3:4): ${targetWidth}x${targetHeight}`);

  // Calculer le recadrage à gauche
  // On garde la hauteur et on recadre la largeur depuis la gauche
  const cropLeft = 0; // Commencer à gauche
  const cropTop = 0;  // Commencer en haut

  // Si l'image est plus large que nécessaire, on la recadre
  // Sinon, on la redimensionne pour qu'elle corresponde au ratio
  let image = sharp(sourceImage);

  // Si l'image est en paysage, on la recadre à gauche pour obtenir le ratio 3:4
  if (metadata.width > metadata.height) {
    // Calculer la largeur à garder pour un ratio 3:4
    const desiredWidth = Math.round(metadata.height * (3 / 4));
    
    if (metadata.width >= desiredWidth) {
      // Recadrer depuis la gauche
      image = image.extract({
        left: cropLeft,
        top: cropTop,
        width: desiredWidth,
        height: metadata.height
      });
      console.log(`Recadrage: ${desiredWidth}x${metadata.height} depuis la gauche`);
    }
  }

  // Redimensionner à la taille cible et convertir en WebP avec optimisation
  await image
    .resize(targetWidth, targetHeight, {
      fit: 'cover',
      position: 'left' // Ancrer à gauche pour le recadrage
    })
    .webp({
      quality: 85,
      effort: 6 // Niveau d'optimisation (0-6, 6 = meilleure compression)
    })
    .toFile(outputFile);

  // Obtenir la taille du fichier
  const stats = await import('fs/promises');
  const fileStats = await stats.stat(outputFile);
  const fileSizeKB = (fileStats.size / 1024).toFixed(2);

  console.log(`✓ Image optimisée créée: ${outputFile}`);
  console.log(`  Taille: ${fileSizeKB} KB`);
  console.log(`  Dimensions: ${targetWidth}x${targetHeight} (portrait 3:4)`);
  console.log(`  Format: WebP (optimisé pour le web)`);

} catch (error) {
  console.error('Erreur lors du traitement de l\'image:', error.message);
  process.exit(1);
}
