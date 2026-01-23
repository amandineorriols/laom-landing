# Guide de traitement des images pour LAOM

## 🎯 Processus simplifié

Quand vous avez une image à utiliser sur le site, suivez ces étapes :

### Option 1 : Glisser-déposer (le plus simple)

1. **Glissez votre image** dans le dossier :
   ```
   public/images/incoming/
   ```

2. **Dites-moi** dans le chat : "Traitement de l'image [nom-du-fichier] pour [usage]"
   
   Par exemple : "Traitement de l'image salle-pratique.jpg pour salle-de-pratique"

3. **Je traiterai l'image automatiquement** :
   - Conversion en WebP
   - Recadrage et optimisation
   - Placement au bon endroit
   - Mise à jour du code

### Option 2 : Commande manuelle

Si vous préférez le faire vous-même :

```bash
# Pour la salle de pratique (portrait, recadré à gauche)
bun run process-image ~/Downloads/mon-image.jpg salle-de-pratique

# Pour d'autres espaces (portrait, recadré à gauche)
bun run process-image ~/Downloads/mon-image.jpg nos-espaces

# Pour des images générales (paysage, centré)
bun run process-image ~/Downloads/mon-image.jpg default
```

## 📋 Presets disponibles

### `salle-de-pratique`
- Dimensions : 420x560px (portrait 3:4)
- Recadrage : À gauche
- Usage : Section "Nos Espaces" - La salle de pratique
- Sortie : `/public/images/laom/salle-de-pratique.webp`

### `nos-espaces`
- Dimensions : 420x560px (portrait 3:4)
- Recadrage : À gauche
- Usage : Autres espaces dans la section "Nos Espaces"
- Sortie : Nom généré depuis le fichier source

### `default`
- Dimensions : 1200x800px (paysage)
- Recadrage : Centré
- Usage : Images générales du site
- Sortie : Nom généré depuis le fichier source

## ✅ Ce que fait le script automatiquement

1. ✅ Convertit en WebP (format requis par le projet)
2. ✅ Recadre selon le preset choisi
3. ✅ Optimise la taille (qualité 85, effort 6)
4. ✅ Place l'image dans le bon dossier
5. ✅ Affiche le chemin à utiliser dans le code

## 📝 Exemples d'utilisation

### Exemple 1 : Image pour la salle de pratique

```bash
# Vous avez une image dans Téléchargements
bun run process-image ~/Downloads/batiment-tentes.jpg salle-de-pratique
```

Résultat :
- Image créée : `/public/images/laom/salle-de-pratique.webp`
- Chemin à utiliser : `/images/laom/salle-de-pratique.webp`

### Exemple 2 : Image glissée dans incoming

1. Glissez `ma-photo.jpg` dans `public/images/incoming/`
2. Dites-moi : "Traitement de l'image ma-photo.jpg pour salle-de-pratique"
3. Je lance : `bun run process-image public/images/incoming/ma-photo.jpg salle-de-pratique`

## 🔄 Workflow recommandé

1. **Vous envoyez l'image dans le chat** OU **vous la glissez dans `public/images/incoming/`**
2. **Vous me dites** : "Traitement de cette image pour [usage]"
3. **Je traite l'image** et mets à jour le code automatiquement
4. **C'est fait !** L'image apparaît sur le site

## 📁 Structure des dossiers

```
public/images/
├── incoming/          ← Glissez vos images ici
└── laom/             ← Images optimisées (généré automatiquement)
    ├── salle-de-pratique.webp
    └── ...
```

## 💡 Astuce

Pour toutes les images que vous voulez utiliser sur le site, **dites-moi simplement** :
- "Traitement de cette image pour [usage]"

Et je m'occupe du reste ! 🚀
