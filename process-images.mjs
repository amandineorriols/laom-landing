#!/usr/bin/env node

/**
 * Script automatisé pour traiter les images envoyées dans le chat
 * Usage: bun run process-images.mjs <nom-image> [destination]
 * 
 * Exemples:
 * - bun run process-images.mjs salle-de-pratique.jpg
 * - bun run process-images.mjs mon-image.png nos-espaces
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join, extname, basename } from 'path';
import { existsSync, readdirSync, mkdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const INCOMING_DIR = join(__dirname, 'public', 'images', 'incoming');
const OUTPUT_BASE_DIR = join(__dirname, 'public', 'images', 'laom');

// Presets de traitement selon le type d'image
const imagePresets = {
  'salle-de-pratique': {
    width: 420,
    height: 560,
    crop: 'right',
    quality: 85,
    outputPath: 'salle-de-pratique.webp'
  },
  'nos-espaces': {
    width: 420,
    height: 560,
    crop: 'left',
    quality: 85,
    outputPath: null // sera généré depuis le nom du fichier
  },
  'default': {
    width: 1200,
    height: 800,
    crop: 'center',
    quality: 85,
    outputPath: null
  }
};

async function processImage(sourcePath, presetName = 'default', customOutputName = null) {
  if (!existsSync(sourcePath)) {
    console.error(`❌ Erreur: Le fichier '${sourcePath}' n'existe pas.`);
    process.exit(1);
  }

  const preset = imagePresets[presetName] || imagePresets['default'];
  const metadata = await sharp(sourcePath).metadata();
  
  console.log(`\n📸 Traitement de l'image: ${sourcePath}`);
  console.log(`   Dimensions originales: ${metadata.width}x${metadata.height}`);
  console.log(`   Format: ${metadata.format}`);

  // Déterminer le nom de sortie
  let outputFileName = customOutputName || preset.outputPath;
  if (!outputFileName) {
    const baseName = basename(sourcePath, extname(sourcePath));
    outputFileName = `${baseName}.webp`;
  }

  const outputPath = join(OUTPUT_BASE_DIR, outputFileName);
  mkdirSync(OUTPUT_BASE_DIR, { recursive: true });

  console.log(`   Dimensions cibles: ${preset.width}x${preset.height} (${preset.crop})`);

  let image = sharp(sourcePath);

  // Recadrage selon le preset
  if ((preset.crop === 'left' || preset.crop === 'right') && metadata.width > metadata.height) {
    // Pour format portrait avec recadrage à gauche ou droite
    const desiredWidth = Math.round(metadata.height * (preset.width / preset.height));
    if (metadata.width >= desiredWidth) {
      const left = preset.crop === 'right' ? metadata.width - desiredWidth : 0;
      image = image.extract({
        left: left,
        top: 0,
        width: desiredWidth,
        height: metadata.height
      });
      console.log(`   Recadrage: ${desiredWidth}x${metadata.height} depuis la ${preset.crop === 'right' ? 'droite' : 'gauche'}`);
    }
  }

  // Redimensionnement et conversion WebP
  await image
    .resize(preset.width, preset.height, {
      fit: 'cover',
      position: preset.crop
    })
    .webp({
      quality: preset.quality,
      effort: 6
    })
    .toFile(outputPath);

  // Statistiques du fichier
  const stats = statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  const reduction = metadata.format !== 'webp' ? '✓' : '';

  console.log(`\n✅ Image optimisée créée: ${outputPath}`);
  console.log(`   Taille: ${fileSizeKB} KB ${reduction}`);
  console.log(`   Dimensions: ${preset.width}x${preset.height}`);
  console.log(`   Format: WebP (optimisé pour le web)`);
  console.log(`\n💡 Chemin à utiliser dans le code: /images/laom/${outputFileName}`);

  return outputPath;
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📦 Traitement d'images pour LAOM Landing

Usage:
  bun run process-images.mjs <chemin-image> [preset] [nom-sortie]

Presets disponibles:
  - salle-de-pratique  → 420x560px, portrait, recadré à gauche
  - nos-espaces        → 420x560px, portrait, recadré à gauche
  - default            → 1200x800px, paysage, centré

Exemples:
  bun run process-images.mjs ~/Downloads/mon-image.jpg salle-de-pratique
  bun run process-images.mjs ~/Desktop/photo.png nos-espaces
  bun run process-images.mjs public/images/incoming/image.jpg salle-de-pratique

Dossier incoming: ${INCOMING_DIR}
    `);
    process.exit(0);
  }

  const sourcePath = args[0];
  const presetName = args[1] || 'default';
  const customOutputName = args[2] || null;

  try {
    await processImage(sourcePath, presetName, customOutputName);
  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error.message);
    process.exit(1);
  }
}

main();
