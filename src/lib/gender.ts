// Inference du genre par prenom (audience francophone) pour le routage des
// calls coliving : femmes -> Amandine, hommes -> Yanis (leads formulaire site).
// Retourne 'h' | 'f' | null (inconnu/ambigu — a trier manuellement dans l'admin,
// l'override est alors stocke dans leads.gender et prime sur l'inference).

const MALE = new Set([
  'aaron', 'abdel', 'abdellah', 'abdou', 'achille', 'adam', 'adama', 'adel', 'adrien', 'ahmed',
  'aime', 'alain', 'alan', 'albert', 'alban', 'alexandre', 'alexis', 'ali', 'alphonse', 'amaury',
  'amine', 'amir', 'anas', 'anatole', 'andre', 'angelo', 'anselme', 'anthony', 'antoine', 'antonin',
  'antony', 'armand', 'arnaud', 'arsene', 'arthur', 'augustin', 'aurele', 'aurelien', 'axel', 'ayoub',
  'baptiste', 'barnabe', 'basile', 'bastien', 'benjamin', 'benoit', 'bernard', 'bilal', 'boris', 'brahim',
  'brandon', 'brice', 'bruno', 'bryan', 'cedric', 'celestin', 'cesar', 'charles', 'christian', 'christophe',
  'clement', 'come', 'corentin', 'cyprien', 'cyril', 'cyrille', 'damien', 'dan', 'daniel', 'danny',
  'david', 'denis', 'didier', 'diego', 'dimitri', 'dorian', 'dylan', 'edgar', 'edouard', 'elie',
  'eliott', 'elio', 'elouan', 'emile', 'emilien', 'emmanuel', 'enzo', 'eric', 'erwan', 'esteban',
  'ethan', 'etienne', 'eugene', 'evan', 'fabien', 'fabrice', 'farid', 'felix', 'ferdinand', 'fernand',
  'flavien', 'florent', 'florentin', 'francis', 'franck', 'francois', 'frederic', 'gabin', 'gabriel', 'gael',
  'gaetan', 'gaspard', 'gaston', 'gauthier', 'gautier', 'geoffrey', 'geoffroy', 'georges', 'gerald', 'gerard',
  'germain', 'ghislain', 'gilbert', 'gilles', 'gregoire', 'gregory', 'guillaume', 'gustave', 'guy', 'hamza',
  'harold', 'hassan', 'hector', 'henri', 'herve', 'hicham', 'honore', 'hubert', 'hugo', 'hugues',
  'ibrahim', 'idriss', 'ilan', 'ilyes', 'imran', 'isaac', 'ismael', 'issa', 'jacques', 'jason',
  'jean', 'jeremie', 'jeremy', 'jerome', 'jimmy', 'joachim', 'joel', 'johan', 'john', 'johnny',
  'jonas', 'jonathan', 'jordan', 'joris', 'joseph', 'josue', 'jules', 'julien', 'juste', 'justin',
  'karim', 'kais', 'kenzo', 'kevin', 'kilian', 'killian', 'kylian', 'ladislas', 'lazare', 'leandre',
  'leo', 'leon', 'leonard', 'leopold', 'lilian', 'lionel', 'loan', 'logan', 'loic', 'lorenzo',
  'louis', 'louison', 'luc', 'luca', 'lucas', 'lucien', 'ludovic', 'lukas', 'malik', 'malo',
  'manuel', 'marc', 'marceau', 'marcel', 'marin', 'marius', 'marlon', 'martial', 'martin', 'marwan',
  'mateo', 'matheo', 'mathias', 'mathieu', 'mathis', 'mathys', 'matteo', 'matthias', 'matthieu', 'maxime',
  'maximilien', 'mehdi', 'melvin', 'michael', 'michel', 'mickael', 'milan', 'milo', 'mohamed', 'mohammed',
  'morad', 'moussa', 'nabil', 'nael', 'nassim', 'nathan', 'nathanael', 'nicolas', 'nils', 'nino',
  'noah', 'noe', 'noel', 'nolan', 'norbert', 'octave', 'olivier', 'omar', 'oscar', 'oswald',
  'pablo', 'pascal', 'patrice', 'patrick', 'paul', 'paulin', 'philippe', 'pierre', 'prosper', 'quentin',
  'rachid', 'rafael', 'raoul', 'raphael', 'raymond', 'regis', 'remi', 'remy', 'renaud', 'rene',
  'ricardo', 'richard', 'robin', 'rodolphe', 'rodrigue', 'roger', 'roland', 'romain', 'romeo', 'romuald',
  'ronan', 'rudy', 'ryan', 'said', 'salomon', 'samuel', 'samy', 'sandro', 'sebastien', 'serge',
  'silvain', 'simeon', 'simon', 'sofiane', 'solal', 'stanislas', 'stephane', 'steve', 'steven', 'sullivan',
  'sylvain', 'sylvestre', 'teddy', 'theo', 'theodore', 'theophile', 'thibaud', 'thibault', 'thibaut', 'thierry',
  'thomas', 'timeo', 'timothe', 'timothee', 'titouan', 'tom', 'tony', 'tristan', 'ugo', 'ulysse',
  'valentin', 'valere', 'vianney', 'victor', 'vincent', 'virgile', 'walid', 'walter', 'wassim', 'wesley',
  'wilfried', 'william', 'willy', 'xavier', 'yacine', 'yanis', 'yann', 'yannick', 'yassine', 'yohan',
  'yohann', 'youssef', 'yvan', 'yves', 'zacharie', 'zackary', 'zadig', 'zinedine',
])

const FEMALE = new Set([
  'adele', 'adeline', 'agathe', 'agnes', 'aicha', 'aida', 'aimee', 'alexandra', 'alexandrine', 'alexia',
  'alice', 'alicia', 'aline', 'alison', 'alizee', 'amanda', 'amandine', 'ambre', 'amelia', 'amelie',
  'amina', 'anais', 'anastasia', 'andree', 'angele', 'angelina', 'angelique', 'anna', 'annabelle', 'anne',
  'annette', 'annie', 'annick', 'anouck', 'anouk', 'antoinette', 'apolline', 'ariane', 'arlette', 'armelle',
  'assia', 'astrid', 'athenais', 'aude', 'audrey', 'aurelie', 'aurore', 'ava', 'axelle', 'barbara',
  'beatrice', 'benedicte', 'berengere', 'bernadette', 'berthe', 'bertille', 'blanche', 'blandine', 'brigitte', 'capucine',
  'carine', 'carla', 'carole', 'caroline', 'cassandra', 'catherine', 'cecile', 'celia', 'celine', 'chantal',
  'charline', 'charlotte', 'chloe', 'christelle', 'christiane', 'christine', 'cindy', 'claire', 'clara', 'clarisse',
  'claudia', 'claudine', 'clea', 'clemence', 'clementine', 'cloe', 'colette', 'coline', 'constance', 'coralie',
  'corinne', 'cynthia', 'daniele', 'daniella', 'daphne', 'deborah', 'delphine', 'denise', 'diane', 'dina',
  'dorothee', 'edith', 'eleonore', 'eliane', 'elif', 'elisa', 'elisabeth', 'elise', 'ella', 'elodie',
  'eloise', 'elsa', 'elvire', 'emeline', 'emilie', 'emma', 'emmanuelle', 'emmy', 'enora', 'erika',
  'estelle', 'esther', 'eugenie', 'eva', 'evelyne', 'fanny', 'fatima', 'fatou', 'faustine', 'felicie',
  'fernande', 'flavie', 'fleur', 'flora', 'flore', 'florence', 'florie', 'francine', 'francoise', 'gabrielle',
  'gaelle', 'garance', 'genevieve', 'georgette', 'geraldine', 'germaine', 'gilberte', 'gisele', 'gladys', 'gwenaelle',
  'gwladys', 'helena', 'helene', 'heloise', 'hermine', 'hortense', 'huguette', 'ines', 'ingrid', 'irene',
  'iris', 'isabelle', 'isaure', 'jacqueline', 'jade', 'janine', 'jasmine', 'jeanne', 'jeannine', 'jennifer',
  'jessica', 'joanna', 'jocelyne', 'joelle', 'johanna', 'josephine', 'josette', 'josiane', 'julia', 'julie',
  'juliette', 'justine', 'karine', 'katia', 'kenza', 'laetitia', 'lara', 'laura', 'laure', 'laurence',
  'laurine', 'lea', 'leana', 'leila', 'lena', 'leonie', 'leonore', 'lila', 'lilia', 'liliane',
  'lilou', 'lily', 'lina', 'line', 'lisa', 'lise', 'livia', 'lola', 'lorene', 'louane',
  'louise', 'louna', 'lucette', 'lucie', 'lucienne', 'lucile', 'ludivine', 'luna', 'lydia', 'lydie',
  'lya', 'madeleine', 'maelle', 'maelys', 'magali', 'maissa', 'maite', 'malika', 'manon', 'marcelle',
  'margaux', 'margot', 'marguerite', 'maria', 'marianne', 'marie', 'marielle', 'marine', 'marion', 'marjorie',
  'marlene', 'marthe', 'martine', 'maryam', 'maryse', 'mathilde', 'maud', 'maureen', 'maya', 'megane',
  'melanie', 'melina', 'melissa', 'melodie', 'micheline', 'michelle', 'mila', 'mireille', 'miriam', 'mona',
  'monique', 'morgane', 'muriel', 'mylene', 'myriam', 'nadege', 'nadia', 'nadine', 'nael', 'naima',
  'natacha', 'nathalie', 'nawel', 'nelly', 'nicole', 'nina', 'ninon', 'noemie', 'nolwenn', 'nora',
  'oceane', 'odette', 'odile', 'olivia', 'ophelie', 'oriane', 'orianne', 'paola', 'pascale', 'patricia',
  'paule', 'pauline', 'penelope', 'perrine', 'philippine', 'pierrette', 'priscilla', 'prune', 'rachel', 'raissa',
  'raymonde', 'rebecca', 'regine', 'reine', 'renee', 'rita', 'romane', 'rosalie', 'rose', 'roseline',
  'roxane', 'sabine', 'sabrina', 'safia', 'salome', 'samia', 'sandra', 'sandrine', 'sara', 'sarah',
  'segolene', 'severine', 'sibylle', 'simone', 'solange', 'solene', 'sonia', 'sophia', 'sophie', 'stephanie',
  'suzanne', 'suzie', 'sybille', 'sylviane', 'sylvie', 'tatiana', 'tess', 'tessa', 'thais', 'therese',
  'tiphaine', 'valentine', 'valerie', 'vanessa', 'vera', 'veronique', 'victoire', 'victoria', 'violette', 'virginie',
  'viviane', 'wendy', 'yasmina', 'yasmine', 'yolande', 'ysaline', 'yvette', 'yvonne', 'zelie', 'zoe',
])

// Prenoms mixtes courants : jamais inferes, toujours a trier manuellement.
const AMBIGUOUS = new Set([
  'alix', 'ange', 'andrea', 'camille', 'charlie', 'claude', 'dominique', 'eden', 'lou',
  'maxence', 'morgan', 'noa', 'sacha', 'sasha', 'yael',
])

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z-]/g, '')
}

// 'h' | 'f' | null. Composes ("Jean-Marie", "Anne Sophie") : premier composant.
export function inferGender(firstName: string | null | undefined): 'h' | 'f' | null {
  if (!firstName) return null
  const full = normalize(firstName.trim().split(/\s+/)[0])
  const first = full.split('-')[0]
  for (const n of [full, first]) {
    if (!n) continue
    if (AMBIGUOUS.has(n)) return null
    if (MALE.has(n) && !FEMALE.has(n)) return 'h'
    if (FEMALE.has(n) && !MALE.has(n)) return 'f'
  }
  return null
}
