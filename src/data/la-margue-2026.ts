// Montage financier La Margue — Est & Ouest, état au 3 septembre 2026.
// SOURCE DE VÉRITÉ des chiffres affichés sur /la-margue-est, /la-margue-ouest
// et /la-margue-notice. Les pages ne contiennent aucun montant en dur : tout
// vient d'ici. Origine des données : classeur « Montage financier La Margue
// 02092026 » et classeur « Oasis La Margue » de Greg (Drive de Charly).
//
// Certains totaux présentent 1 centime d'écart avec la somme des lignes
// (arrondis du classeur) : on affiche les totaux du classeur, jamais une somme
// recalculée, pour rester aligné avec les actes de la notaire.

import noticeRaw from './la-margue-notice.json'

const nf = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formate un montant en euros, format fr-FR, 2 décimales. */
export function eur(n: number): string {
  return `${nf.format(n)} €`
}

/** Formate une surface, format fr-FR, 2 décimales (« 50,45 m² »). */
export function m2(n: number): string {
  return `${nf.format(n)} m²`
}

/** Formate un écart de surface signé (« −9,55 m² », « +1,05 m² »). */
export function m2Signe(n: number): string {
  return `${n < 0 ? '−' : '+'}${nf.format(Math.abs(n))} m²`
}

/** Formate un coefficient (0,04 · 0,5 · 1 · 5). */
export function coef(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
}

export const updatedLabel = '3 septembre 2026'

// ============================================================
// TYPES
// ============================================================

export interface KeyFigure {
  value: string
  label: string
}

export interface Ligne {
  label: string
  montant: number
}

export interface FoyerEst {
  foyer: string
  lot: string
  lotNote: string
  /** Surface du modèle de valorisation, en m². */
  surfaceModele: number
  /** Surface mesurée au DPE, en m². */
  surfaceDpe: number
  surfaceDpeNote?: string
  /** Valeur conventionnelle du classeur (pas une multiplication recalculée). */
  valeurConventionnelle: number
  capital: number
  capitalNote?: string
  /** Capital du seul lot bâti, quand le foyer en porte un second (Magali). */
  capitalLot?: number
  /** Phrase qui explique pourquoi le capital s'écarte de la valeur au m². */
  capitalCommentaire?: string
  /** Quote-part portée sans surface (la Pergola de Magali). */
  pergola?: number
  communs: number
  communsDetail: Ligne[]
  total: number
  totalNote?: string
  partCapital: string
  /** Noms du foyer tels qu'ils apparaissent dans les flux des deux phases. */
  alias: string[]
  detail: string[]
}

export interface Sortant {
  nom: string
  montant: number
}

export interface Flux {
  payeur: string
  beneficiaire: string
  montant: number
  note?: string
}

export interface Phase {
  titre: string
  total: number
  flux: Flux[]
  recus?: Sortant[]
  note: string
}

export interface Variante {
  cle: string
  titre: string
  resume: string
  points: string[]
}

export interface Notion {
  titre: string
  texte: string
}

export interface DocLink {
  titre: string
  description: string
  href: string
}

export interface LotOuest {
  lot: string
  coefficient: number
  coefficientNote?: string
  quotePart: number
  attributaire: string
  valeur: number
  valeurNote?: string
}

export interface ApportOuest {
  associe: string
  montant: number
  note?: string
}

export interface CommunOuest {
  foyer: string
  mainALaMain: number
  mainALaMainNote?: string
  foyerCommun: number
  notaire: number
}

// ============================================================
// DOCUMENTS (partagés par les trois pages)
// ============================================================

export const documents: DocLink[] = [
  {
    titre: 'Montage financier La Margue 02092026',
    description:
      "Le classeur au format d'origine : onglets DATA, SCIA LA MARGUE, SCIA LAOM, Financement SCI.",
    href: 'https://docs.google.com/spreadsheets/d/1JNQZBwZ2u4xGIIZvuDJDrv386V3LIHmB/edit',
  },
  {
    titre: 'Oasis La Margue — les montants',
    description:
      "Le classeur de Greg : main à la main, fosse, toit, montant par foyer. Source retenue pour le total du main à la main. Une partie de ses onglets (fléchage, quote-part du domaine, foyer commun, frais de notaire, prêt Oasis) est antérieure au montage du 3 septembre.",
    href: 'https://docs.google.com/spreadsheets/d/1Kl8NIiqqaDZcPlBelCaE0fmZJ2o7xArrZ_2V5OmLfJI/edit',
  },
]

export const documentsNote = 'Accès sur demande à Charly.'

// ============================================================
// LA MARGUE EST
// ============================================================

export const estTotals = {
  capital: 1100174.85,
  dettes: 834957.94,
  prixLyre: 330000,
  communs: 140182.4,
  fosse: 16222.47,
  mainALaMain: 29232,
  notaire: 25427.93,
  foyerCommun: 69300,
}

export const estKeyFigures: KeyFigure[] = [
  { value: eur(estTotals.capital), label: 'Capital total de la SCIA Est' },
  { value: eur(estTotals.dettes), label: 'Dettes à rembourser aux sortants' },
  { value: eur(estTotals.prixLyre), label: 'Prix de la Lyre, tout compris' },
  { value: eur(estTotals.communs), label: 'Communs Est, en plus des capitaux' },
]

export const estRegle: string[] = [
  "Chaque indivisaire qui sort est remboursé au centime de ce qu'il a mis. Rien de plus, rien de moins.",
  "Le capital de chaque foyer dans la SCIA est égal à la valeur conventionnelle de son lot : personne n'achète le lot d'un autre, chacun apporte sa part.",
  "Le prix de la Lyre est la variable qui boucle le système : il vaut ce qu'il faut pour que tout le monde soit remboursé.",
  `Le transfert de Patricia vers l'Ouest, ${eur(67521.25)}, est le levier qui met la Lyre à ${eur(330000)} tout compris.`,
]

export const foyersEst: FoyerEst[] = [
  {
    foyer: 'Serge & Marie-Agnès Lièvremont',
    lot: 'Gîtes Lavande + Olivier (fusionnés)',
    lotNote: '60 m² modèle / 50,45 m² DPE — résidence secondaire',
    surfaceModele: 60,
    surfaceDpe: 50.45,
    valeurConventionnelle: 147085.09,
    capital: 104875.58,
    capitalCommentaire: `Le capital n'est pas la valeur au m² : c'est leur capacité de ${eur(120000)} moins les communs.`,
    communs: 15124.42,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 0,5 part', montant: 2436 },
      { label: 'Frais de notaire', montant: 4360.61 },
      { label: 'Foyer commun, 0,5 part', montant: 6300 },
    ],
    total: 120000,
    totalNote: 'leur capacité, tout compris',
    partCapital: '9,6 %',
    alias: ['Serge & Marie-Agnès'],
    detail: ['Chaque euro en moins chez eux est un euro de plus sur la Lyre.'],
  },
  {
    foyer: 'Patricia Salgon',
    lot: 'La Grange',
    lotNote: '62 m² modèle / 55,15 m² DPE',
    surfaceModele: 62,
    surfaceDpe: 55.15,
    valeurConventionnelle: 151987.93,
    capital: 151987.93,
    communs: 22288.14,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4872 },
      { label: 'Frais de notaire', montant: 2788.33 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 22288.14,
    totalNote: 'les communs seuls : sa créance couvre son capital',
    partCapital: '13,8 %',
    alias: ['Patricia Salgon'],
    detail: [
      `Sa créance Est après transfert : ${eur(164600.69)}. Elle dépasse la valeur de La Grange de ${eur(12612.76)} : cet excédent lui est remboursé par l'entrant Lyre.`,
      `${eur(67521.25)} sont basculés à l'Ouest pour financer le lot de Khaldoun, contre un crédit vendeur du même montant de Khaldoun vers elle.`,
      "Elle ne sort pas de cash : elle conserve son lot, et son capital est déjà couvert par ce qu'elle a apporté en 2021.",
    ],
  },
  {
    foyer: 'Entrant Lyre (foyer à trouver)',
    lot: 'La Lyre',
    lotNote: '114 m² modèle / 113,48 m² DPE',
    surfaceModele: 114,
    surfaceDpe: 113.48,
    valeurConventionnelle: 279461.67,
    capital: 303661.07,
    capitalCommentaire: `Le capital est le prix nécessaire pour boucler le montage, ${eur(24199.4)} au-dessus de la valeur au m².`,
    communs: 26338.93,
    communsDetail: [
      { label: 'Provision sur actes', montant: 4811.31 },
      { label: 'Fosse Est, 2 WC', montant: 4055.62 },
      { label: 'Main à la main, 1 part', montant: 4872 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 330000,
    partCapital: '27,6 %',
    alias: ['Entrant Lyre'],
    detail: [
      "On n'affiche plus un prix de cession : la Lyre s'annonce à son prix tout compris, capital plus actes, fosse, main à la main et foyer commun.",
    ],
  },
  {
    foyer: 'Magali Rouby',
    lot: 'Le Ruisseau + Pergola',
    lotNote: '69 m² modèle / 61,70 m² DPE — Pergola : quote-part seule',
    surfaceModele: 69,
    surfaceDpe: 61.7,
    valeurConventionnelle: 169147.85,
    capital: 177820.94,
    capitalNote: `${eur(169147.85)} + ${eur(8673.09)} pour la Pergola`,
    capitalLot: 169147.85,
    pergola: 8673.09,
    communs: 28674.77,
    communsDetail: [
      { label: 'Fosse Est, 2 WC', montant: 4055.62 },
      { label: 'Main à la main, 1,5 part', montant: 7308 },
      { label: 'Frais de notaire', montant: 4711.15 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 206495.71,
    partCapital: '16,1 %',
    alias: ['Magali Rouby'],
    detail: ['Elle est remise à une part entière de foyer commun depuis le 3 septembre.'],
  },
  {
    foyer: 'Grégoire Renevier',
    lot: 'Rivière',
    lotNote: '67,6 m² modèle / 59,80 m² DPE, cave pondérée comprise',
    surfaceModele: 67.6,
    surfaceDpe: 59.8,
    surfaceDpeNote: 'DPE 58,80 m² + cave 5 m² pondérée 0,2',
    valeurConventionnelle: 165715.87,
    capital: 165715.87,
    capitalNote: `apport historique ${eur(113228.98)} + complément ${eur(52486.89)}`,
    communs: 23542.03,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4872 },
      { label: 'Frais de notaire', montant: 4042.22 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 76028.92,
    totalNote: 'complément + communs',
    partCapital: '15,0 %',
    alias: ['Grégoire Renevier'],
    detail: [
      `Son apport historique est de ${eur(113228.98)}, dont ${eur(13228.98)} de travaux réalisés sur le lot.`,
      "Le complément ne transite pas par un virement : c'est un acte de cession de créance chez la notaire.",
    ],
  },
  {
    foyer: 'David Viala & Charlotte Brun',
    lot: 'La Source (ex-maison commune)',
    lotNote: '80 m² modèle / 81,05 m² DPE',
    surfaceModele: 80,
    surfaceDpe: 81.05,
    valeurConventionnelle: 196113.45,
    capital: 196113.45,
    communs: 24214.12,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4872 },
      { label: 'Frais de notaire', montant: 4714.31 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 220327.57,
    partCapital: '17,8 %',
    alias: ['Charlotte & David'],
    detail: [
      "Ce sont eux qui soldent la société d'Isabelle à la signature : Turquoise sort ainsi du passif du partage partiel.",
    ],
  },
]

/** Prix au m² du modèle de valorisation, commun à tous les lots de l'Est. */
export const PRIX_M2_MODELE = 2451.42

/** Capital du seul lot bâti (identique au capital, sauf pour Magali). */
export function capitalDuLot(f: FoyerEst): number {
  return f.capitalLot ?? f.capital
}

/** Valeur du lot si on appliquait le prix au m² du modèle à la surface DPE. */
export function valeurDpe(f: FoyerEst): number {
  return PRIX_M2_MODELE * f.surfaceDpe
}

/** Ce que le capital retenu représente, ramené au m² réellement mesuré. */
export function prixM2Dpe(f: FoyerEst): number {
  return capitalDuLot(f) / f.surfaceDpe
}

/** Écart entre la surface DPE et la surface du modèle, signé. */
export function ecartSurface(f: FoyerEst): number {
  return f.surfaceDpe - f.surfaceModele
}

export const estCommunsTotaux: Ligne[] = [
  { label: 'Fosse Est', montant: estTotals.fosse },
  { label: 'Main à la main', montant: estTotals.mainALaMain },
  { label: 'Frais de notaire', montant: estTotals.notaire },
  { label: 'Foyer commun', montant: estTotals.foyerCommun },
]

export const sortantsEst: Sortant[] = [
  { nom: 'Isabelle Desplats', montant: 238419.84 },
  { nom: 'Caroline Ader', montant: 300000 },
  { nom: 'Julian Quero', montant: 150000 },
  { nom: 'Orriols SARL (part Est)', montant: 129921.46 },
  { nom: 'Patricia Salgon (excédent)', montant: 12612.76 },
  { nom: "Turquoise SARL (société d'Isabelle)", montant: 4003.88 },
]

export const sortantsNote = `Isabelle et Turquoise, avec le rachat des parts et les soultes du partage, représentent ${eur(246423.75)} : c'est le « 246 K ».`

export const phase1: Phase = {
  titre: 'Phase 1 — à la signature',
  total: 531296.87,
  flux: [
    { payeur: 'Grégoire Renevier', beneficiaire: 'Caroline Ader', montant: 52486.89, note: 'cession de créance' },
    { payeur: 'Magali Rouby', beneficiaire: 'Caroline Ader', montant: 177820.94 },
    { payeur: 'Serge & Marie-Agnès', beneficiaire: 'Caroline Ader', montant: 15983.22 },
    { payeur: 'Serge & Marie-Agnès', beneficiaire: 'Julian Quero', montant: 88892.36 },
    { payeur: 'Charlotte & David', beneficiaire: 'Julian Quero', montant: 7398.69 },
    { payeur: 'Charlotte & David', beneficiaire: 'Turquoise SARL', montant: 4003.88 },
    { payeur: 'Charlotte & David', beneficiaire: 'Isabelle Desplats', montant: 184710.89 },
  ],
  recus: [
    { nom: 'Isabelle Desplats', montant: 184710.89 },
    { nom: 'Caroline Ader', montant: 246291.05 },
    { nom: 'Julian Quero', montant: 96291.05 },
  ],
  note: `Chacun des trois garde ${eur(53708.95)} en compte courant et reste associé jusqu'à l'arrivée de l'entrant.`,
}

export const phase2: Phase = {
  titre: "Phase 2 — à l'arrivée de l'entrant Lyre",
  total: 303661.07,
  flux: [
    { payeur: 'Entrant Lyre', beneficiaire: 'Isabelle Desplats', montant: 53708.95 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Caroline Ader', montant: 53708.95 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Julian Quero', montant: 53708.95 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Orriols SARL', montant: 129921.46 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Patricia Salgon', montant: 12612.76 },
  ],
  note: 'Rachat des parts et des comptes courants des trois sortants, quittance finale.',
}

export const phases: Phase[] = [phase1, phase2]

export interface FluxBloc {
  titre: string
  lignes: Flux[]
}

/**
 * Les flux des deux phases qui concernent un foyer, regroupés par moment.
 * Le rapprochement se fait sur `alias` : les phases nomment les foyers plus
 * court que la liste des capitaux (« Charly & Amandine » vs le nom complet).
 */
export function fluxFoyer(f: FoyerEst): FluxBloc[] {
  const blocs: FluxBloc[] = []
  const signature = phase1.flux.filter((x) => f.alias.includes(x.payeur))
  const arrivee = phase2.flux.filter((x) => f.alias.includes(x.payeur))
  const recus = [...phase1.flux, ...phase2.flux].filter((x) => f.alias.includes(x.beneficiaire))

  if (signature.length > 0) blocs.push({ titre: "Ce qu'il verse à la signature", lignes: signature })
  if (arrivee.length > 0) blocs.push({ titre: "Ce qu'il verse à son arrivée", lignes: arrivee })
  if (recus.length > 0) blocs.push({ titre: "Ce qu'il reçoit", lignes: recus })
  return blocs
}

export const variantes: Variante[] = [
  {
    cle: 'A',
    titre: 'Avec prêts en compte courant',
    resume: `Trois prêts en compte courant, ${eur(150000)} au total, soldent les sortants dès la signature.`,
    points: [
      `Magali ${eur(60000)}, Greg ${eur(20000)}, Charly & Amandine ${eur(70000)}.`,
      `Le besoin pour solder les trois sortants est de ${eur(161126.85)} : il resterait ${eur(3708.95)} par sortant.`,
      `Isabelle recevrait ${eur(234710.89)} dès la signature.`,
      "Seule variante compatible avec la date butoir d'Isabelle, le 15 novembre 2026.",
      "Les prêts sont remboursés par l'entrant, jamais transformés en parts. Greg a dit le 17 août ne pas vouloir prêter.",
    ],
  },
  {
    cle: 'B',
    titre: 'Sans prêt',
    resume: `Les trois sortants restent associés avec ${eur(53708.95)} chacun en compte courant.`,
    points: [
      "Ils attendent que l'entrant Lyre rachète leurs parts et leur compte courant.",
      "Aucune reconnaissance de dette n'est signée.",
      "Aucun foyer restant n'avance de trésorerie.",
      "Ne tient pas la date butoir d'Isabelle si l'entrant n'est pas trouvé avant.",
    ],
  },
]

export const notionsEst: Notion[] = [
  {
    titre: 'Valeur conventionnelle',
    texte: `Prix au m² du modèle, ${eur(2451.42)}, multiplié par la surface du modèle. La quote-part du domaine, ${eur(17346.17)} par coefficient, y est déjà comprise : ce n'est pas un commun à payer en plus.`,
  },
  {
    titre: 'Fosse Est',
    texte: `Devis Agussol, ${eur(16222.47)} TTC pour 12 équivalents-habitants, réparti par WC raccordé : ${eur(2027.81)} par WC, 8 WC en tout. Va au fonds de travaux.`,
  },
  {
    titre: 'Main à la main',
    texte: `${eur(53592)} avancés par les fondateurs, répartis en 11 parts : ${eur(4872)} par part entière, ${eur(2436)} par demi-part. Clé arrêtée par Charly le 3 septembre : le coliving, le studio et les deux tinies n'en font pas partie. Greg affiche 15 parts dans son fichier ; à faire valider par le collectif.`,
  },
  {
    titre: 'Foyer commun',
    texte: `${eur(12600)} par part. Une part par foyer, 0,5 pour Serge & Marie-Agnès et pour David Coste, rien pour les lots LAOM. 11 parts au total, soit ${eur(138600)} sur les deux SCIA.`,
  },
  {
    titre: 'Frais de notaire',
    texte:
      "Les provisions du tableau de la notaire, affectées acte par acte à qui paie, plus les quinze conventions d'honoraires. Pas de clé forfaitaire. Deux postes restent non chiffrés.",
  },
]

// ============================================================
// LA MARGUE OUEST (LAOM)
// ============================================================

export const ouestTotals = {
  valeurLots: 1234854.05,
  quotePartUnitaire: 17346.17,
  coefficientsOuest: 12.54,
  coefficientsTotal: 19.04,
  coefficientsEst: 6.5,
  quotesPartsOuest: 217521.03,
  quotesPartsEst: 112750.13,
  lotKhaldoun: 67521.25,
  mainALaMain: 24360,
  foyerCommun: 69300,
}

export const ouestKeyFigures: KeyFigure[] = [
  { value: eur(ouestTotals.valeurLots), label: 'Valeur des lots apportés' },
  { value: eur(ouestTotals.quotePartUnitaire), label: 'Quote-part du domaine, par coefficient' },
  {
    value: `${coef(ouestTotals.coefficientsOuest)} / ${coef(ouestTotals.coefficientsTotal)}`,
    label: 'Coefficients Ouest sur le total du domaine',
  },
  { value: eur(ouestTotals.lotKhaldoun), label: 'Lot de Khaldoun, nouveau' },
]

export const lotsOuest: LotOuest[] = [
  { lot: 'Petit Shambala', coefficient: 1, quotePart: 17346.17, attributaire: 'Amandine & Charly', valeur: 77000 },
  { lot: 'GS rdc extrême ouest — coliving 125 m²', coefficient: 0.5, quotePart: 8673.09, attributaire: 'LAOM / Ferme du Verseau', valeur: 161760.7 },
  { lot: 'GS étage ouest — appartement', coefficient: 0.5, quotePart: 8673.09, attributaire: 'David Coste', valeur: 95633.93 },
  { lot: 'GS étage centre', coefficient: 1, quotePart: 17346.17, attributaire: 'Laetitia Brene', valeur: 130343.33 },
  { lot: 'GS rdc est — atelier 32 m²', coefficient: 0, coefficientNote: '0,5 pour le main à la main', quotePart: 0, attributaire: 'Laetitia Brene', valeur: 44896.04 },
  { lot: 'GS étage est', coefficient: 1, quotePart: 17346.17, attributaire: 'Claire & Baptiste', valeur: 40639 },
  { lot: 'GS étage extrême ouest — studio', coefficient: 0.5, quotePart: 8673.09, attributaire: 'Amandine & Charly', valeur: 15500 },
  { lot: 'GS rdc extrême est', coefficient: 1, quotePart: 17346.17, attributaire: 'David Lin', valeur: 92227.81 },
  { lot: 'GS rdc centre — foyer commun', coefficient: 0, quotePart: 0, attributaire: 'Ferme du Verseau + association', valeur: 106518.6 },
  { lot: 'Annexe', coefficient: 0, quotePart: 0, attributaire: 'Orriols SAS', valeur: 32755.68 },
  { lot: 'Tiny Eliott (touristique)', coefficient: 0.5, quotePart: 8673.09, attributaire: 'LAOM', valeur: 47507 },
  { lot: 'Tiny Claire (touristique)', coefficient: 0.5, quotePart: 8673.09, attributaire: 'Claire & Baptiste', valeur: 49000 },
  { lot: 'Ferme — serre, abris, terre', coefficient: 0.04, quotePart: 693.85, attributaire: 'Orriols SAS', valeur: 5249.54 },
  { lot: 'Accueil — salle, restaurant', coefficient: 0, quotePart: 0, attributaire: 'Ferme du Verseau', valeur: 180000 },
  { lot: 'Terrain des lodges', coefficient: 5, quotePart: 86730.87, attributaire: 'Patricia Salgon', valeur: 97932.16, valeurNote: 'attribué dans le partage partiel' },
  { lot: 'Logement Khaldoun (nouveau)', coefficient: 1, quotePart: 17346.17, attributaire: 'Khaldoun — crédit vendeur Patricia', valeur: 67521.25 },
]

export const lotsOuestNote = `Le total des lots ci-dessus ne se lit pas comme le total des apports : plusieurs lots sont partagés entre attributaires — le foyer commun entre la Ferme du Verseau et l'association — et Orriols SARL n'apporte à l'Ouest que des quotes-parts. Le total qui fait foi est celui des apports, ${eur(1234854.05)}.`

export const deplacementsEst: Notion[] = [
  {
    titre: "Ce que Patricia apporte à l'Ouest",
    texte: `${eur(165453.41)} en tout : ${eur(97932.16)} pour le terrain des lodges attribué dans le partage partiel, plus le lot de Khaldoun.`,
  },
  {
    titre: "L'apport d'Orriols SARL est limité",
    texte: `Orriols n'apporte à l'Ouest que les quotes-parts des lots de la famille et de LAOM : ${eur(70078.54)}, soit ${coef(4.04)} coefficients. Sa créance Est remonte d'autant.`,
  },
  {
    titre: 'Chacun porte sa quote-part',
    texte: `Laetitia ${eur(17346.17)}, David Lin ${eur(17346.17)} et David Coste ${eur(8673.09)} apportent la leur, ${eur(43365.44)} en tout. Le partage partiel chez la notaire est à refaire avec ces attributions, et l'EDD Ouest gagne un lot.`,
  },
]

export interface KhaldounLigne {
  label: string
  montant?: number
  texte?: string
  note?: string
  total?: boolean
}

/**
 * Le lot de Khaldoun : ce qu'il vaut, ce qui remonte à l'Est, ce qu'il doit à
 * Patricia. Le levier est la partie de la valeur du lot qui ne finance rien
 * pour lui : elle sert à faire baisser le prix de la Lyre côté Est.
 */
export const khaldoun = {
  titre: 'Un lot pour Khaldoun',
  lignes: [
    { label: 'Valeur du lot de Khaldoun', montant: 67521.25 },
    { label: 'dont quote-part du domaine', montant: 17346.17 },
    {
      label: "dont levier pour l'Est",
      montant: 50175.08,
      note: "il n'y a pas de bâti : Khaldoun construit 55 m²",
    },
    {
      label: 'Crédit vendeur de Patricia à Khaldoun',
      montant: 67521.25,
      note: 'échéancier à définir',
    },
    {
      label: 'Prêt complémentaire de Patricia pour la construction',
      montant: 30000,
      note: 'un prêt, hors SCIA',
    },
    { label: 'Dû à Patricia en tout', montant: 97521.25, total: true },
    {
      label: 'Apport en nature de Charly',
      texte: "dalle, réseaux (VRD) et gaines de l'atelier du rez-de-chaussée, à chiffrer",
    },
  ] as KhaldounLigne[],
  justiceTitre: 'Point de justice',
  justiceTexte: `Les ${eur(50175.08)} de levier ne financent rien pour Khaldoun : ils remontent à l'Est et allègent le prix de la Lyre pour l'entrant. Le prêt de Patricia, la dalle, les réseaux et les gaines pris en charge par Charly, et son aide sur le chantier compensent en partie. Alternative à chiffrer : Patricia garde ces ${eur(50175.08)} en compte courant à l'Ouest, à son nom, et Khaldoun ne doit que sa quote-part ; le prix de la Lyre remonte alors d'autant pour l'entrant. À trancher avec le collectif.`,
}

export const apportsOuest: ApportOuest[] = [
  { associe: 'Patricia Salgon', montant: 165453.41, note: 'lodges + lot Khaldoun' },
  { associe: 'Claire Orriols & Baptiste Fromont', montant: 89639 },
  { associe: 'Amandine Orriols & Charly Aubert', montant: 92500 },
  { associe: 'Orriols SARL', montant: 70078.54, note: 'quotes-parts seules' },
  { associe: 'La Ferme du Verseau', montant: 419700.1 },
  { associe: 'David Lin', montant: 92227.81 },
  { associe: 'David Coste', montant: 95633.93 },
  { associe: 'Laetitia Brene', montant: 175239.37 },
  { associe: 'Association des habitants', montant: 35506.2 },
]

export const communsOuest: CommunOuest[] = [
  { foyer: 'Amandine & Charly', mainALaMain: 4872, mainALaMainNote: '1 part (le studio est hors clé)', foyerCommun: 12600, notaire: 3386.26 },
  { foyer: 'Claire & Baptiste', mainALaMain: 4872, mainALaMainNote: '1 part (la tiny est hors clé)', foyerCommun: 12600, notaire: 2128.69 },
  { foyer: 'Laetitia Brene', mainALaMain: 7308, mainALaMainNote: '1 part + 0,5 atelier', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Lin', mainALaMain: 4872, mainALaMainNote: '1 part', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Coste', mainALaMain: 2436, mainALaMainNote: '0,5 part', foyerCommun: 6300, notaire: 871.11 },
  { foyer: 'Khaldoun', mainALaMain: 0, mainALaMainNote: 'retiré de la clé', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'LAOM / Ferme du Verseau', mainALaMain: 0, mainALaMainNote: 'coliving et tiny Eliott hors clé depuis le 3/09', foyerCommun: 0, notaire: 3396.11 },
  { foyer: 'Orriols SARL', mainALaMain: 0, foyerCommun: 0, notaire: 2128.69 },
]

/** Somme des provisions de notaire listées ci-dessus (pas un total du classeur). */
export const communsOuestNotaireTotal = communsOuest.reduce((s, c) => s + c.notaire, 0)

export const communsOuestNote =
  "La fosse Ouest n'est pas devisée : elle ne figure dans aucune ligne."

export const notionsOuest: Notion[] = [
  {
    titre: 'La quote-part du domaine',
    texte: `${eur(200000)} d'espaces extérieurs plus ${eur(130271.16)} de frais d'acquisition, divisés par ${coef(19.04)} coefficients : ${eur(17346.17)} par coefficient 1.`,
  },
  {
    titre: 'Le lot de Khaldoun a fait baisser la quote-part',
    texte: `En passant de ${coef(18.04)} à ${coef(19.04)} coefficients, la quote-part est tombée de ${eur(18307.71)} à ${eur(17346.17)}. Tout le monde y gagne, à l'Est comme à l'Ouest.`,
  },
  {
    titre: 'Les lots LAOM ne paient pas les communs des foyers',
    texte:
      'Ni foyer commun, ni main à la main : le coliving et la tiny Eliott sont sortis de la clé du main à la main le 3 septembre.',
  },
  {
    titre: "Sans EDD Ouest, pas de TVA récupérable",
    texte:
      "L'état descriptif de division Ouest est reporté à l'achèvement des travaux. Tant qu'il n'est pas signé, LAOM ne récupère pas la TVA.",
  },
]

// ============================================================
// NOTICE
// ============================================================

export interface NoticeItem {
  point: string
  detail: string
  source: string
  date: string
}

export interface NoticeGuideItem {
  point: string
  detail: string
}

export interface NoticeSection {
  titre: string
  items: NoticeItem[]
  guides?: {
    '0209': NoticeGuideItem[]
  }
}

export interface Notice {
  titre: string
  intro: string
  sections: NoticeSection[]
}

export const notice: Notice = noticeRaw
