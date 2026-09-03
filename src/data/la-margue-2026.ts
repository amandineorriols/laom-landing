// Montage financier La Margue — Est & Ouest, état au 3 septembre 2026.
// SOURCE DE VÉRITÉ des chiffres affichés sur /la-margue-est, /la-margue-ouest
// et /la-margue-notice. Les pages ne contiennent aucun montant en dur : tout
// vient d'ici. Origine des données : classeur « Montage financier La Margue
// 02092026 » et sa version de travail « SCIA Est v3.2 » (Drive de Charly).
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
  capital: number
  capitalNote?: string
  communs: number
  communsDetail: Ligne[]
  total: number
  totalNote?: string
  partCapital: string
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
    titre: 'SCIA Est v3.2',
    description:
      'La version de travail détaillée : proposition finale, communs par lot, frais de notaire, variantes.',
    href: 'https://docs.google.com/spreadsheets/d/1jhCQY1sqaRI_7TX9zXQAmfRwoLk_E-kq/edit',
  },
  {
    titre: 'Oasis La Margue — les montants',
    description:
      'Le classeur de Greg : main à la main, fosse, toit, montant par foyer. Source retenue pour le main à la main.',
    href: 'https://docs.google.com/spreadsheets/d/1Kl8NIiqqaDZcPlBelCaE0fmZJ2o7xArrZ_2V5OmLfJI/edit',
  },
]

export const documentsNote = 'Accès sur demande à Charly.'

// ============================================================
// LA MARGUE EST
// ============================================================

export const estTotals = {
  capital: 1101299.16,
  dettes: 836082.25,
  prixLyre: 330000,
  communs: 135685.17,
  fosse: 16222.47,
  mainALaMain: 24734.77,
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
  `Le transfert de Patricia vers l'Ouest, ${eur(66396.94)}, est le levier qui met la Lyre à ${eur(330000)} tout compris.`,
]

export const foyersEst: FoyerEst[] = [
  {
    foyer: 'Serge & Marie-Agnès Lièvremont',
    lot: 'Gîtes Lavande + Olivier (fusionnés)',
    lotNote: '60 m² modèle / 50,45 m² DPE — résidence secondaire',
    capital: 105250.35,
    communs: 14749.65,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 0,5 part', montant: 2061.23 },
      { label: 'Frais de notaire', montant: 4360.61 },
      { label: 'Foyer commun, 0,5 part', montant: 6300 },
    ],
    total: 120000,
    totalNote: 'leur capacité, tout compris',
    partCapital: '9,6 %',
    detail: [
      `Valeur conventionnelle au m² : ${eur(147085.09)}. Leur capital n'est pas cette valeur : c'est ce qui reste de leur capacité de ${eur(120000)} une fois les communs déduits.`,
      `Ils apportent ${eur(105250.35)} à la signature : ${eur(16108.14)} versés à Caroline et ${eur(89142.21)} à Julian.`,
      'Chaque euro en moins chez eux est un euro de plus sur la Lyre.',
    ],
  },
  {
    foyer: 'Patricia Salgon',
    lot: 'La Grange',
    lotNote: '62 m² modèle / 55,15 m² DPE',
    capital: 151987.93,
    communs: 21538.6,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4122.46 },
      { label: 'Frais de notaire', montant: 2788.33 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 21538.6,
    totalNote: 'les communs seuls : sa créance couvre son capital',
    partCapital: '13,8 %',
    detail: [
      `Sa créance Est après transfert : ${eur(165725)}. Elle dépasse la valeur de La Grange de ${eur(13737.07)} : cet excédent lui est remboursé par l'entrant Lyre.`,
      `${eur(66396.94)} sont basculés à l'Ouest pour financer le lot de Khaldoun, contre un crédit vendeur du même montant de Khaldoun vers elle.`,
      "Elle ne sort pas de cash : elle conserve son lot, et son capital est déjà couvert par ce qu'elle a apporté en 2021.",
    ],
  },
  {
    foyer: 'Entrant Lyre (foyer à trouver)',
    lot: 'La Lyre',
    lotNote: '114 m² modèle / 113,48 m² DPE',
    capital: 304410.61,
    communs: 25589.39,
    communsDetail: [
      { label: 'Provision sur actes', montant: 4811.31 },
      { label: 'Fosse Est, 2 WC', montant: 4055.62 },
      { label: 'Main à la main, 1 part', montant: 4122.46 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 330000,
    partCapital: '27,6 %',
    detail: [
      `Sa valeur au m² est de ${eur(279461.67)}. Le capital retenu est ${eur(24948.94)} au-dessus, parce que la Lyre porte l'équilibre du montage : c'est elle qui boucle le remboursement des sortants.`,
      `À son arrivée, il paie ${eur(53584.03)} à Isabelle, autant à Caroline et autant à Julian, ${eur(129921.46)} à Orriols SARL et ${eur(13737.07)} à Patricia.`,
      "On n'affiche plus un prix de cession : la Lyre s'annonce à son prix tout compris, capital plus actes, fosse, main à la main et foyer commun.",
    ],
  },
  {
    foyer: 'Magali Rouby',
    lot: 'Le Ruisseau + Pergola',
    lotNote: '69 m² modèle / 61,70 m² DPE — Pergola : quote-part seule',
    capital: 177820.94,
    capitalNote: `${eur(169147.85)} + ${eur(8673.09)} pour la Pergola`,
    communs: 27550.46,
    communsDetail: [
      { label: 'Fosse Est, 2 WC', montant: 4055.62 },
      { label: 'Main à la main, 1,5 part', montant: 6183.69 },
      { label: 'Frais de notaire', montant: 4711.15 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 205371.4,
    partCapital: '16,1 %',
    detail: [
      `La Pergola n'a pas de valeur de bâti dans le modèle : elle entre pour sa seule quote-part du domaine, ${eur(8673.09)}.`,
      `Elle verse ${eur(177820.94)} à Caroline à la signature.`,
      'Elle est remise à une part entière de foyer commun depuis le 3 septembre.',
    ],
  },
  {
    foyer: 'Grégoire Renevier',
    lot: 'Rivière',
    lotNote: '67,6 m² modèle / 59,80 m² DPE, cave pondérée comprise',
    capital: 165715.87,
    capitalNote: `apport historique ${eur(113228.98)} + complément ${eur(52486.89)}`,
    communs: 22792.49,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4122.46 },
      { label: 'Frais de notaire', montant: 4042.22 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 75279.38,
    totalNote: 'complément + communs',
    partCapital: '15,0 %',
    detail: [
      `Son apport historique est de ${eur(113228.98)}, dont ${eur(13228.98)} de travaux réalisés sur le lot.`,
      `Il complète jusqu'à la valeur de Rivière, soit ${eur(52486.89)}, par cession de créance vers Caroline, à la signature.`,
      "Ce complément ne transite pas par un virement : c'est un acte de cession de créance chez la notaire.",
    ],
  },
  {
    foyer: 'David Viala & Charlotte Brun',
    lot: 'La Source (ex-maison commune)',
    lotNote: '80 m² modèle / 81,05 m² DPE',
    capital: 196113.45,
    communs: 23464.58,
    communsDetail: [
      { label: 'Fosse Est, 1 WC', montant: 2027.81 },
      { label: 'Main à la main, 1 part', montant: 4122.46 },
      { label: 'Frais de notaire', montant: 4714.31 },
      { label: 'Foyer commun, 1 part', montant: 12600 },
    ],
    total: 219578.03,
    partCapital: '17,8 %',
    detail: [
      `Ils versent ${eur(184835.81)} à Isabelle, ${eur(7273.76)} à Julian et ${eur(4003.88)} à Turquoise SARL.`,
      "Ce sont eux qui soldent la société d'Isabelle à la signature : Turquoise sort ainsi du passif du partage partiel.",
    ],
  },
]

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
  { nom: 'Patricia Salgon (excédent)', montant: 13737.07 },
  { nom: "Turquoise SARL (société d'Isabelle)", montant: 4003.88 },
]

export const sortantsNote = `Isabelle et Turquoise, avec le rachat des parts et les soultes du partage, représentent ${eur(246423.75)} : c'est le « 246 K ».`

export const phase1: Phase = {
  titre: 'Phase 1 — à la signature',
  total: 531671.63,
  flux: [
    { payeur: 'Grégoire Renevier', beneficiaire: 'Caroline Ader', montant: 52486.89, note: 'cession de créance' },
    { payeur: 'Magali Rouby', beneficiaire: 'Caroline Ader', montant: 177820.94 },
    { payeur: 'Serge & Marie-Agnès', beneficiaire: 'Caroline Ader', montant: 16108.14 },
    { payeur: 'Serge & Marie-Agnès', beneficiaire: 'Julian Quero', montant: 89142.21 },
    { payeur: 'Charlotte & David', beneficiaire: 'Julian Quero', montant: 7273.76 },
    { payeur: 'Charlotte & David', beneficiaire: 'Turquoise SARL', montant: 4003.88 },
    { payeur: 'Charlotte & David', beneficiaire: 'Isabelle Desplats', montant: 184835.81 },
  ],
  recus: [
    { nom: 'Isabelle Desplats', montant: 184835.81 },
    { nom: 'Caroline Ader', montant: 246415.97 },
    { nom: 'Julian Quero', montant: 96415.97 },
  ],
  note: `Chacun des trois garde ${eur(53584.03)} en compte courant et reste associé jusqu'à l'arrivée de l'entrant.`,
}

export const phase2: Phase = {
  titre: "Phase 2 — à l'arrivée de l'entrant Lyre",
  total: 304410.61,
  flux: [
    { payeur: 'Entrant Lyre', beneficiaire: 'Isabelle Desplats', montant: 53584.03 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Caroline Ader', montant: 53584.03 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Julian Quero', montant: 53584.03 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Orriols SARL', montant: 129921.46 },
    { payeur: 'Entrant Lyre', beneficiaire: 'Patricia Salgon', montant: 13737.07 },
  ],
  note: 'Rachat des parts et des comptes courants des trois sortants, quittance finale.',
}

export const phases: Phase[] = [phase1, phase2]

export const variantes: Variante[] = [
  {
    cle: 'A',
    titre: 'Avec prêts en compte courant',
    resume: `Trois prêts en compte courant, ${eur(150000)} au total, soldent les sortants dès la signature.`,
    points: [
      `Magali ${eur(60000)}, Greg ${eur(20000)}, Charly & Amandine ${eur(70000)}.`,
      `Le besoin pour solder les trois sortants est de ${eur(160752.09)} : il resterait ${eur(3584.03)} par sortant.`,
      `Isabelle recevrait ${eur(234835.81)} dès la signature.`,
      "Seule variante compatible avec la date butoir d'Isabelle, le 15 novembre 2026.",
      "Les prêts sont remboursés par l'entrant, jamais transformés en parts. Greg a dit le 17 août ne pas vouloir prêter.",
    ],
  },
  {
    cle: 'B',
    titre: 'Sans prêt',
    resume: `Les trois sortants restent associés avec ${eur(53584.03)} chacun en compte courant.`,
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
    texte: `${eur(53592)} avancés par les fondateurs, répartis en 13 parts : ${eur(4122.46)} par part entière, ${eur(2061.23)} par demi-part. La clé reste à confirmer avec Greg, qui affiche 15 parts dans son fichier.`,
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
  lotKhaldoun: 66396.94,
  mainALaMain: 28857.23,
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
  { lot: 'Logement Khaldoun (nouveau)', coefficient: 1, quotePart: 17346.17, attributaire: 'Khaldoun — crédit vendeur Patricia', valeur: 66396.94 },
]

export const lotsOuestNote = `Le total des lots ci-dessus ne se lit pas comme le total des apports : plusieurs lots sont partagés entre attributaires — le foyer commun entre la Ferme du Verseau et l'association — et Orriols SARL n'apporte à l'Ouest que des quotes-parts. Le total qui fait foi est celui des apports, ${eur(1234854.05)}.`

export const deplacementsEst: Notion[] = [
  {
    titre: 'Un lot pour Khaldoun',
    texte: `${eur(66396.94)} : quote-part du domaine ${eur(17346.17)} plus bâti et travaux ${eur(49050.77)}. Il est financé par le transfert de Patricia et remboursé par un crédit vendeur de Khaldoun vers Patricia du même montant, échéancier à définir.`,
  },
  {
    titre: "Ce que Patricia apporte à l'Ouest",
    texte: `${eur(164329.1)} en tout : ${eur(97932.16)} pour le terrain des lodges attribué dans le partage partiel, plus le lot de Khaldoun.`,
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

export const apportsOuest: ApportOuest[] = [
  { associe: 'Patricia Salgon', montant: 164329.1, note: 'lodges + lot Khaldoun' },
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
  { foyer: 'Amandine & Charly', mainALaMain: 6183.69, mainALaMainNote: '1 part + 0,5 studio', foyerCommun: 12600, notaire: 3386.26 },
  { foyer: 'Claire & Baptiste', mainALaMain: 6183.69, mainALaMainNote: '1 part + 0,5 tiny', foyerCommun: 12600, notaire: 2128.69 },
  { foyer: 'Laetitia Brene', mainALaMain: 6183.69, mainALaMainNote: '1 part + 0,5 atelier', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Lin', mainALaMain: 4122.46, mainALaMainNote: '1 part', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'David Coste', mainALaMain: 2061.23, mainALaMainNote: '0,5 part', foyerCommun: 6300, notaire: 871.11 },
  { foyer: 'Khaldoun', mainALaMain: 0, mainALaMainNote: 'retiré de la clé', foyerCommun: 12600, notaire: 871.11 },
  { foyer: 'LAOM / Ferme du Verseau', mainALaMain: 4122.46, mainALaMainNote: '0,5 coliving + 0,5 tiny Eliott', foyerCommun: 0, notaire: 3396.11 },
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
      'Ni foyer commun, ni main à la main, sauf pour les lots touristiques — coliving et tiny Eliott — qui comptent une demi-part de main à la main.',
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
    v32: NoticeGuideItem[]
  }
}

export interface Notice {
  titre: string
  intro: string
  sections: NoticeSection[]
}

export const notice: Notice = noticeRaw
