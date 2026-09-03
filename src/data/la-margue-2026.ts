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

/** Formate une surface sans décimale inutile (« 60 m² », « 67,6 m² »). */
export function m2Court(n: number): string {
  return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m²`
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
  /** Surface du modèle de valorisation, en m². */
  surfaceModele: number
  /** Précision sur la surface du modèle, affichée en petit dans la carte. */
  surfaceModeleNote?: string
  /** Surface mesurée au DPE, en m². */
  surfaceDpe: number
  /** Valeur conventionnelle du classeur (pas une multiplication recalculée). */
  valeurConventionnelle: number
  capital: number
  /** Capital du seul lot bâti, quand le foyer en porte un second (Magali). */
  capitalLot?: number
  /** Ce qui s'ajoute au lot bâti, en petit sous le capital retenu de la carte. */
  capitalEnPlus?: string
  /** Sous-ligne du tableau récapitulatif, colonne Capital. */
  capitalNote?: string
  /** L'unique phrase de la carte, quand elle est indispensable. */
  capitalCommentaire?: string
  fraisAnnexes: number
  fraisAnnexesDetail: Ligne[]
  total: number
  /** Sous-ligne du tableau récapitulatif, colonne Total à prévoir. */
  totalNote?: string
  /** Mention sous « Total à prévoir », dans la carte du foyer. */
  totalDetail?: string
  partCapital: string
  /** Noms du foyer tels qu'ils apparaissent dans les flux des deux phases. */
  alias: string[]
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
  /** Trois lignes au maximum, une idée par ligne. */
  points: string[]
}

export interface Notion {
  titre: string
  texte: string
}

/** Carte de lexique : une phrase avec un chiffre clé en gras, puis le contexte. */
export interface NotionChiffree {
  titre: string
  /** Début de la phrase, avant le chiffre clé. */
  avant: string
  /** Le chiffre clé, rendu en gras. */
  chiffre?: string
  /** Fin de la phrase, après le chiffre clé. */
  apres?: string
  /** Une seule phrase de contexte. */
  contexte?: string
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

export interface FraisAnnexesOuest {
  foyer: string
  mainALaMain: number
  /** Mention courte, rendue entre parenthèses sous le montant. */
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
  capital: 1150349.93,
  dettes: 834957.94,
  prixLyre: 330000,
  fraisAnnexes: 140182.4,
  fosse: 16222.47,
  mainALaMain: 29232,
  notaire: 25427.93,
  foyerCommun: 69300,
}

export const estKeyFigures: KeyFigure[] = [
  { value: eur(estTotals.capital), label: 'Capital total de la SCIA Est' },
  { value: eur(estTotals.dettes), label: 'Dettes à rembourser aux sortants' },
  { value: eur(estTotals.prixLyre), label: 'Prix de la Lyre, tout compris' },
  { value: eur(estTotals.fraisAnnexes), label: 'Frais annexes Est, en plus des capitaux' },
]

export const estRegle: string[] = [
  "Chaque indivisaire qui sort est remboursé au centime de ce qu'il a mis. Rien de plus, rien de moins.",
  "Le capital de chaque foyer dans la SCIA est égal à la valeur conventionnelle de son lot : personne n'achète le lot d'un autre, chacun apporte sa part.",
  "Le prix de la Lyre est la variable qui boucle le système : il vaut ce qu'il faut pour que tout le monde soit remboursé.",
  `Les deux lots transitoires de Patricia à l'Est, ${eur(50175.08)}, sont ce qui permet à la Lyre de sortir à ${eur(330000)} tout compris.`,
]

export const foyersEst: FoyerEst[] = [
  {
    foyer: 'Serge & Marie-Agnès Lièvremont',
    lot: 'Gîtes Lavande + Olivier (fusionnés)',
    surfaceModele: 60,
    surfaceDpe: 50.45,
    valeurConventionnelle: 147085.09,
    capital: 104875.58,
    capitalCommentaire: `Capital = leur capacité de ${eur(120000)} moins les frais annexes.`,
    fraisAnnexes: 15124.42,
    fraisAnnexesDetail: [
      { label: 'Fosse (1 WC)', montant: 2027.81 },
      { label: 'Main à la main (0,5 part)', montant: 2436 },
      { label: 'Frais de notaire', montant: 4360.61 },
      { label: 'Foyer commun (0,5 part)', montant: 6300 },
    ],
    total: 120000,
    totalNote: 'capacité tout compris',
    totalDetail: 'leur capacité, tout compris',
    partCapital: '9,1 %',
    alias: ['Serge & Marie-Agnès'],
  },
  {
    foyer: 'Patricia Salgon',
    lot: 'La Grange',
    surfaceModele: 62,
    surfaceDpe: 55.15,
    valeurConventionnelle: 151987.93,
    capital: 202163.01,
    capitalLot: 151987.93,
    capitalEnPlus: `+ lots 9 et 10 transitoires, 2 × ${eur(25087.54)}`,
    capitalNote: 'La Grange + lots 9 et 10',
    capitalCommentaire:
      'Les lots 9 et 10 sont des terrains à construire, hors clé historique des quotes-parts.',
    fraisAnnexes: 22288.14,
    fraisAnnexesDetail: [
      { label: 'Fosse (1 WC)', montant: 2027.81 },
      { label: 'Main à la main (1 part)', montant: 4872 },
      { label: 'Frais de notaire', montant: 2788.33 },
      { label: 'Foyer commun (1 part)', montant: 12600 },
    ],
    total: 22288.14,
    totalDetail: 'les frais annexes seuls : sa créance couvre son capital',
    partCapital: '17,6 %',
    alias: ['Patricia Salgon'],
  },
  {
    foyer: 'Entrant Lyre (foyer à trouver)',
    lot: 'La Lyre',
    surfaceModele: 114,
    surfaceDpe: 113.48,
    valeurConventionnelle: 279461.67,
    capital: 303661.07,
    capitalCommentaire: 'Capital = le prix qui boucle le montage.',
    fraisAnnexes: 26338.93,
    fraisAnnexesDetail: [
      { label: 'Provision sur actes', montant: 4811.31 },
      { label: 'Fosse (2 WC)', montant: 4055.62 },
      { label: 'Main à la main (1 part)', montant: 4872 },
      { label: 'Foyer commun (1 part)', montant: 12600 },
    ],
    total: 330000,
    partCapital: '26,4 %',
    alias: ['Entrant Lyre'],
  },
  {
    foyer: 'Magali Rouby',
    lot: 'Le Ruisseau + Pergola',
    surfaceModele: 69,
    surfaceDpe: 61.7,
    valeurConventionnelle: 169147.85,
    capital: 177820.94,
    capitalLot: 169147.85,
    capitalEnPlus: `+ Pergola ${eur(8673.09)}, quote-part seule`,
    fraisAnnexes: 28674.77,
    fraisAnnexesDetail: [
      { label: 'Fosse (2 WC)', montant: 4055.62 },
      { label: 'Main à la main (1,5 part)', montant: 7308 },
      { label: 'Frais de notaire', montant: 4711.15 },
      { label: 'Foyer commun (1 part)', montant: 12600 },
    ],
    total: 206495.71,
    partCapital: '15,5 %',
    alias: ['Magali Rouby'],
  },
  {
    foyer: 'Grégoire Renevier',
    lot: 'Rivière',
    surfaceModele: 67.6,
    surfaceModeleNote: 'cave pondérée comprise',
    surfaceDpe: 59.8,
    valeurConventionnelle: 165715.87,
    capital: 165715.87,
    fraisAnnexes: 23542.03,
    fraisAnnexesDetail: [
      { label: 'Fosse (1 WC)', montant: 2027.81 },
      { label: 'Main à la main (1 part)', montant: 4872 },
      { label: 'Frais de notaire', montant: 4042.22 },
      { label: 'Foyer commun (1 part)', montant: 12600 },
    ],
    total: 76028.92,
    totalDetail: 'complément + frais annexes',
    partCapital: '14,4 %',
    alias: ['Grégoire Renevier'],
  },
  {
    foyer: 'David Viala & Charlotte Brun',
    lot: 'La Source (ex-maison commune)',
    surfaceModele: 80,
    surfaceDpe: 81.05,
    valeurConventionnelle: 196113.45,
    capital: 196113.45,
    fraisAnnexes: 24214.12,
    fraisAnnexesDetail: [
      { label: 'Fosse (1 WC)', montant: 2027.81 },
      { label: 'Main à la main (1 part)', montant: 4872 },
      { label: 'Frais de notaire', montant: 4714.31 },
      { label: 'Foyer commun (1 part)', montant: 12600 },
    ],
    total: 220327.57,
    partCapital: '17,0 %',
    alias: ['Charlotte & David'],
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

export const estFraisAnnexesTotaux: Ligne[] = [
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
    titre: 'Scénario prêt en compte courant',
    points: [
      "Des prêts en compte courant d'associés soldent les trois sortants dès la signature.",
      "Ils sont remboursés par l'entrant de la Lyre, jamais transformés en parts.",
      "Seule variante qui tient la date butoir d'Isabelle, le 15 novembre 2026.",
    ],
  },
  {
    cle: 'B',
    titre: 'Scénario sans prêt',
    points: [
      `Les trois sortants restent associés avec ${eur(53708.95)} chacun en compte courant jusqu'à l'arrivée de l'entrant.`,
      'Aucune reconnaissance de dette.',
      "Personne n'avance de trésorerie.",
    ],
  },
]

export const notionsEst: NotionChiffree[] = [
  {
    titre: 'Valeur conventionnelle',
    avant: 'Le prix au m² du modèle, ',
    chiffre: eur(2451.42),
    apres: ', multiplié par la surface du modèle.',
    contexte: 'La quote-part du domaine y est déjà comprise : rien à payer en plus.',
  },
  {
    titre: 'Fosse Est',
    avant: 'Devis Agussol, ',
    chiffre: eur(16222.47),
    apres: ` TTC, soit ${eur(2027.81)} par WC raccordé.`,
    contexte: 'Huit WC en tout, pour 12 équivalents-habitants. La somme va au fonds de travaux.',
  },
  {
    titre: 'Main à la main',
    avant: `${eur(53592)} avancés par les fondateurs, répartis en 11 parts : `,
    chiffre: eur(4872),
    apres: ` par part, ${eur(2436)} par demi-part.`,
    contexte: "Le coliving, le studio et les deux tinies n'entrent pas dans la clé.",
  },
  {
    titre: 'Foyer commun',
    avant: 'Une part par foyer, ',
    chiffre: eur(12600),
    apres: ', et une demi-part pour Serge & Marie-Agnès comme pour David Coste.',
    contexte: `11 parts au total, soit ${eur(138600)} sur les deux SCIA.`,
  },
  {
    titre: 'Frais de notaire',
    avant: "Les provisions du tableau de la notaire à l'Est, ",
    chiffre: eur(estTotals.notaire),
    apres: ', affectées acte par acte à qui paie.',
    contexte: 'Pas de clé forfaitaire, et deux postes restent non chiffrés.',
  },
]

// ============================================================
// LA MARGUE OUEST (LAOM)
// ============================================================

export const ouestTotals = {
  valeurLots: 1185803.29,
  quotePartUnitaire: 17346.17,
  coefficientsOuest: 12.54,
  coefficientsTotal: 19.04,
  coefficientsEst: 6.5,
  quotesPartsOuest: 217521.03,
  quotesPartsEst: 112750.13,
  lotKhaldoun: 17346.17,
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
  { value: eur(ouestTotals.lotKhaldoun), label: 'Lot de Khaldoun, sa quote-part' },
]

export const lotsOuest: LotOuest[] = [
  { lot: 'Petit Shambala', coefficient: 1, quotePart: 17346.17, attributaire: 'Amandine & Charly', valeur: 77000 },
  { lot: 'GS rdc extrême ouest — coliving 125 m²', coefficient: 0.5, quotePart: 8673.09, attributaire: 'LAOM / Ferme du Verseau', valeur: 161760.7 },
  { lot: 'GS étage ouest — appartement', coefficient: 0.5, quotePart: 8673.09, attributaire: 'David Coste', valeur: 95633.93 },
  { lot: 'GS étage centre', coefficient: 1, quotePart: 17346.17, attributaire: 'Laetitia Brene', valeur: 130343.33 },
  { lot: 'GS rdc est — atelier 32 m²', coefficient: 0, coefficientNote: '0,5 au main à la main', quotePart: 0, attributaire: 'Laetitia Brene', valeur: 44896.04 },
  { lot: 'GS étage est', coefficient: 1, quotePart: 17346.17, attributaire: 'Claire & Baptiste', valeur: 40639 },
  { lot: 'GS étage extrême ouest — studio', coefficient: 0.5, quotePart: 8673.09, attributaire: 'Amandine & Charly', valeur: 15500 },
  { lot: 'GS rdc extrême est', coefficient: 1, quotePart: 17346.17, attributaire: 'David Lin', valeur: 92227.81 },
  { lot: 'GS rdc centre — foyer commun', coefficient: 0, quotePart: 0, attributaire: 'Ferme du Verseau + association', valeur: 106518.6 },
  { lot: 'Annexe', coefficient: 0, quotePart: 0, attributaire: 'Orriols SAS', valeur: 32755.68 },
  { lot: 'Tiny Eliott (touristique)', coefficient: 0.5, quotePart: 8673.09, attributaire: 'LAOM', valeur: 47507 },
  { lot: 'Tiny Claire (touristique)', coefficient: 0.5, quotePart: 8673.09, attributaire: 'Claire & Baptiste', valeur: 49000 },
  { lot: 'Ferme — serre, abris, terre', coefficient: 0.04, quotePart: 693.85, attributaire: 'Orriols SAS', valeur: 5249.54 },
  { lot: 'Accueil — salle, restaurant', coefficient: 0, quotePart: 0, attributaire: 'Ferme du Verseau', valeur: 180000 },
  { lot: 'Terrain des lodges', coefficient: 5, quotePart: 86730.87, attributaire: 'Patricia Salgon', valeur: 97932.16, valeurNote: 'partage partiel' },
  { lot: 'Logement Khaldoun (nouveau)', coefficient: 1, quotePart: 17346.17, attributaire: 'Khaldoun, crédit vendeur Patricia', valeur: 17346.17 },
]

export const lotsOuestNote = `Le total des lots ci-dessus ne se lit pas comme le total des apports : plusieurs lots sont partagés entre attributaires — le foyer commun entre la Ferme du Verseau et l'association — et Orriols SARL n'apporte à l'Ouest que des quotes-parts. Le total qui fait foi est celui des apports, ${eur(ouestTotals.valeurLots)}.`

export const deplacementsEst: Notion[] = [
  {
    titre: "Ce que Patricia apporte à l'Ouest",
    texte: `Patricia apporte à l'Ouest ${eur(115278.33)} : ${eur(97932.16)} du partage partiel plus la quote-part du lot Khaldoun.`,
  },
  {
    titre: "L'apport d'Orriols SARL est limité",
    texte: `Orriols n'apporte à l'Ouest que des quotes-parts : ${eur(70078.54)}, soit ${coef(4.04)} coefficients. Sa créance Est remonte d'autant.`,
  },
  {
    titre: 'Chacun porte sa quote-part',
    texte: `Laetitia ${eur(17346.17)}, David Lin ${eur(17346.17)} et David Coste ${eur(8673.09)} apportent la leur, ${eur(43365.44)} en tout. Le partage partiel est à refaire, et l'EDD Ouest gagne un lot.`,
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
 * Le lot de Khaldoun : sa quote-part du domaine, financée par un crédit vendeur
 * de Patricia, plus un prêt de Patricia pour la construction, hors SCIA.
 * Khaldoun ne porte plus que sa quote-part depuis le 3 septembre au soir.
 */
export const khaldoun = {
  titre: 'Le lot de Khaldoun',
  lignes: [
    {
      label: 'Valeur du lot',
      montant: 17346.17,
      note: 'sa quote-part du domaine',
    },
    {
      label: 'Crédit vendeur de Patricia à Khaldoun',
      montant: 17346.17,
      note: 'échéancier à définir',
    },
    {
      label: 'Prêt de Patricia pour la construction',
      montant: 30000,
      note: 'un prêt, hors SCIA',
    },
    { label: 'Dû à Patricia en tout', montant: 47346.17, total: true },
    {
      label: 'Apport en nature de Charly',
      texte: "dalle, réseaux (VRD) et gaines de l'atelier du rez-de-chaussée, à chiffrer",
    },
  ] as KhaldounLigne[],
  note: `Les ${eur(50175.08)} qui pesaient sur ce lot sont devenus deux lots transitoires de Patricia à l'Est : personne ne porte de dette pour rien.`,
}

export const apportsOuest: ApportOuest[] = [
  { associe: 'Patricia Salgon', montant: 115278.33, note: 'lodges + quote-part Khaldoun' },
  { associe: 'Claire Orriols & Baptiste Fromont', montant: 89639 },
  { associe: 'Amandine Orriols & Charly Aubert', montant: 92500 },
  { associe: 'Orriols SARL', montant: 70078.54, note: 'quotes-parts seules' },
  { associe: 'La Ferme du Verseau', montant: 419700.1 },
  { associe: 'David Lin', montant: 92227.81 },
  { associe: 'David Coste', montant: 95633.93 },
  { associe: 'Laetitia Brene', montant: 175239.37 },
  { associe: 'Association des habitants', montant: 35506.2 },
]

export const fraisAnnexesOuest: FraisAnnexesOuest[] = [
  { foyer: 'Amandine & Charly', mainALaMain: 4872, mainALaMainNote: '1 part, studio hors clé', foyerCommun: 12600, notaire: 3386.26 },
  { foyer: 'Claire & Baptiste', mainALaMain: 4872, mainALaMainNote: '1 part, tiny hors clé', foyerCommun: 12600, notaire: 2128.69 },
  { foyer: 'Laetitia Brene', mainALaMain: 7308, mainALaMainNote: '1 part + 0,5 atelier', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Lin', mainALaMain: 4872, mainALaMainNote: '1 part', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Coste', mainALaMain: 2436, mainALaMainNote: '0,5 part', foyerCommun: 6300, notaire: 871.11 },
  { foyer: 'Khaldoun', mainALaMain: 0, mainALaMainNote: 'hors clé', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'LAOM / Ferme du Verseau', mainALaMain: 0, mainALaMainNote: 'coliving et tiny hors clé', foyerCommun: 0, notaire: 3396.11 },
  { foyer: 'Orriols SARL', mainALaMain: 0, foyerCommun: 0, notaire: 2128.69 },
]

/** Somme des provisions de notaire listées ci-dessus (pas un total du classeur). */
export const fraisAnnexesOuestNotaireTotal = fraisAnnexesOuest.reduce((s, c) => s + c.notaire, 0)

export const fraisAnnexesOuestNote =
  "La fosse Ouest n'est pas devisée : elle ne figure dans aucune ligne."

export const notionsOuest: NotionChiffree[] = [
  {
    titre: 'La quote-part du domaine',
    avant: `Les espaces extérieurs et leurs frais d'acquisition, divisés par ${coef(19.04)} coefficients : `,
    chiffre: eur(17346.17),
    apres: ' par coefficient 1.',
    contexte: `Soit ${eur(200000)} de terrain et ${eur(130271.16)} de frais d'acquisition.`,
  },
  {
    titre: 'Le lot de Khaldoun a fait baisser la quote-part',
    avant: `La quote-part est tombée de ${eur(18307.71)} à `,
    chiffre: eur(17346.17),
    apres: `, en passant de ${coef(18.04)} à ${coef(19.04)} coefficients.`,
    contexte: "Tout le monde y gagne, à l'Est comme à l'Ouest.",
  },
  {
    titre: 'Les lots LAOM ne paient pas les frais annexes des foyers',
    avant: 'Ni foyer commun, ni main à la main.',
    contexte: 'Le coliving et la tiny Eliott sont sortis de la clé le 3 septembre.',
  },
  {
    titre: 'Sans EDD Ouest, pas de TVA récupérable',
    avant: "L'état descriptif de division Ouest est reporté à l'achèvement des travaux.",
    contexte: "Tant qu'il n'est pas signé, LAOM ne récupère pas la TVA.",
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
