// French → English vocabulary for technical / agentic commands (example dictionary).
// Shows how to add a language: plain data, with a few lines of code to generate verb forms.
// Load after the main bundle (script tag with src .../dist/dictionaries/fr.js)  →  VSARoTranslate.dictionaries.fr
// or in Node:                  const fr = require('vsa-ro-translate/dictionaries/fr.js');
(function (root) {
// regular verb forms: -er (ajouter), -ir (agrandir); irregular verbs list their forms explicitly
function er(inf, en, extra) {
  const s = inf.slice(0, -2);
  return [inf, '-', en, [s + 'e', s + 'es', s + 'ez', s + 'ons', s + 'ent', s + 'ant'].concat(extra || []).join(',')].join('|');
}
function ir(inf, en, extra) {
  const s = inf.slice(0, -2);
  return [inf, '-', en, [s + 'is', s + 'it', s + 'issez', s + 'issons', s + 'issent'].concat(extra || []).join(',')].join('|');
}
function irr(inf, en, forms) { return [inf, '-', en, forms].join('|'); }
// participle used as adjective: sélectionné, sélectionnée, sélectionnés, sélectionnées
function part(m, en) { return [m, m + 'e', m + 's', m + 'es', en].join('|'); }

const VERBS = [
  er('ajouter', 'add'), er('supprimer', 'delete'), er('effacer', 'erase'), er('déplacer', 'move', ['déplace']), er('glisser', 'slide'),
  er('aligner', 'align'), er('centrer', 'center'), er('grouper', 'group'), er('regrouper', 'group'), er('dégrouper', 'ungroup'),
  er('verrouiller', 'lock'), er('déverrouiller', 'unlock'), er('masquer', 'hide'), er('cacher', 'hide'), er('afficher', 'show'),
  er('montrer', 'show'), er('dupliquer', 'duplicate'), er('copier', 'copy'), er('coller', 'paste'), er('couper', 'cut'),
  er('annuler', 'undo'), er('rétablir', 'redo'), er('exporter', 'export'), er('importer', 'import'), er('télécharger', 'download'),
  er('partager', 'share', ['partage', 'partagez']), er('enregistrer', 'save'), er('sauvegarder', 'save'), er('fermer', 'close'),
  er('renommer', 'rename'), er('sélectionner', 'select'), er('insérer', 'insert'), er('créer', 'create'), er('changer', 'change', ['change', 'changez']),
  er('modifier', 'change'), er('remplacer', 'replace', ['remplace', 'remplacez']), er('relier', 'connect'), er('connecter', 'connect'), er('dessiner', 'draw'),
  er('appliquer', 'apply'), er('zoomer', 'zoom'), er('jouer', 'play'), er('arrêter', 'stop'), er('démarrer', 'start'),
  er('lancer', 'start', ['lance', 'lancez']), er('répéter', 'repeat', ['répète']), er('animer', 'animate'), er('retarder', 'delay'), er('décaler', 'shift'),
  er('synchroniser', 'sync'), er('déclencher', 'trigger'), er('publier', 'publish'), er('envoyer', 'send', ['envoie', 'envoyez']), er('inviter', 'invite'),
  er('attribuer', 'assign'), er('trier', 'sort'), er('filtrer', 'filter'), er('chercher', 'search'), er('rechercher', 'search'),
  er('trouver', 'find'), er('actualiser', 'refresh'), er('réinitialiser', 'reset'), er('restaurer', 'restore'), er('archiver', 'archive'),
  er('éditer', 'edit'), er('formater', 'format'), er('surligner', 'highlight'), er('générer', 'generate', ['génère']), er('convertir', 'convert', ['convertis', 'convertissez']),
  er('comparer', 'compare'), er('vérifier', 'check'), er('exécuter', 'run', ['exécute']), er('activer', 'enable'), er('désactiver', 'disable'),
  er('augmenter', 'increase'), er('diminuer', 'decrease'), er('redimensionner', 'resize'), er('pivoter', 'rotate'), er('tourner', 'rotate'),
  er('recadrer', 'crop'), er('souligner', 'underline'), er('accélérer', 'speed up', ['accélère']), er('boucler', 'loop'), er('estomper', 'fade'),
  er('donner', 'give'), er('accorder', 'grant'), er('retirer', 'remove'), er('révoquer', 'revoke'), er('approuver', 'approve'),
  er('rejeter', 'reject', ['rejette']), er('signer', 'sign'), er('programmer', 'schedule'), er('planifier', 'schedule'), er('fusionner', 'merge'),
  er('diviser', 'split'), er('épingler', 'pin'), er('ancrer', 'anchor'), er('ajuster', 'adjust'), er('adapter', 'fit'),
  er('garder', 'keep'), er('conserver', 'keep'), er('utiliser', 'use'), er('aider', 'help'), er('expliquer', 'explain'),
  er('durer', 'last'), er('commencer', 'start', ['commence', 'commencez']), er('terminer', 'end'), er('passer', 'go'), er('inverser', 'reverse'),
  er('retourner', 'flip'), er('sauter', 'jump'), er('clignoter', 'blink'), er('pulser', 'pulse'), er('colorer', 'color'),
  er('placer', 'place', ['place', 'placez']), er('positionner', 'position'), er('numéroter', 'number'), er('étiqueter', 'label'), er('lier', 'link'),
  er('annoter', 'annotate'), er('commenter', 'comment'), er('noter', 'note'), er('notifier', 'notify'), er('limiter', 'limit'),
  er('protéger', 'protect', ['protège']), er('expirer', 'expire'), er('ignorer', 'skip'), er('fixer', 'set'), er('régler', 'set', ['règle']),
  er('trouver', 'find'), er('télécharger', 'download'), er('charger', 'load', ['charge', 'chargez']), er('scanner', 'scan'), er('imprimer', 'print'),
  ir('agrandir', 'enlarge'), ir('réduire', 'reduce', ['réduis', 'réduit', 'réduisez']), ir('remplir', 'fill'), ir('choisir', 'choose'), ir('définir', 'set'),
  ir('finir', 'finish'), ir('ralentir', 'slow down'), ir('rétablir', 'restore'), ir('assombrir', 'darken'), ir('éclaircir', 'lighten'), ir('arrondir', 'round'),
  irr('faire', 'make', 'fais,fait,faites,faisons,font'), irr('mettre', 'put', 'mets,met,mettez,mettons,mettent,mis'),
  irr('ouvrir', 'open', 'ouvre,ouvres,ouvrez,ouvrons,ouvert'), irr('lire', 'play', 'lis,lit,lisez,lisons'),
  irr('vouloir', 'want', 'veux,veut,voulez,voulons,veulent,voudrais'), irr('pouvoir', 'can', 'peux,peut,pouvez,pouvons,peuvent,puis'),
  irr('devoir', 'must', 'dois,doit,devez,devons'), irr('être', 'be', 'est,sont,es,êtes,sommes'), irr('avoir', 'have', 'ai,as,a,avez,avons,ont'),
  irr('aller', 'go', 'va,vas,allez,allons,vont'), irr('apparaître', 'appear', 'apparaît,apparais,apparaissent,apparaisse'),
  irr('disparaître', 'disappear', 'disparaît,disparais,disparaissent,disparaisse'), irr('rebondir', 'bounce', 'rebondis,rebondit,rebondissez,rebondisse'),
  irr('tenir', 'keep', 'tiens,tient,tenez'), irr('voir', 'see', 'vois,voit,voyez'), irr('dire', 'tell', 'dis,dit,dites'),
  irr('construire', 'build', 'construis,construit,construisez'), irr('inclure', 'include', 'inclus,inclut,incluez'),
  irr('étendre', 'expand', 'étends,étend,étendez'), irr('joindre', 'attach', 'joins,joint,joignez'),
];

const NOUNS = `
forme|formes|f|shape
rectangle|rectangles|m|rectangle
carré|carrés|m|square
cercle|cercles|m|circle
ellipse|ellipses|f|ellipse
triangle|triangles|m|triangle
losange|losanges|m|diamond
flèche|flèches|f|arrow
ligne|lignes|f|line
trait|traits|m|line
connecteur|connecteurs|m|connector
nœud|nœuds|m|node|noeud,noeuds
boîte|boîtes|f|box|boite,boites
case|cases|f|box
texte|textes|m|text
titre|titres|m|title
sous-titre|sous-titres|m|subtitle
étiquette|étiquettes|f|label
calque|calques|m|layer
couche|couches|f|layer
image|images|f|image
photo|photos|f|photo
logo|logos|m|logo
icône|icônes|f|icon|icone,icones
bouton|boutons|m|button
menu|menus|m|menu
page|pages|f|page
diapositive|diapositives|f|slide
slide|slides|f|slide
arrière-plan|arrière-plans|m|background
fond|fonds|m|background
couleur|couleurs|f|color
bordure|bordures|f|border
contour|contours|m|outline
ombre|ombres|f|shadow
opacité|opacités|f|opacity
transparence|transparences|f|transparency
taille|tailles|f|size
largeur|largeurs|f|width
hauteur|hauteurs|f|height
épaisseur|épaisseurs|f|thickness
police|polices|f|font
caractère|caractères|m|character
mot|mots|m|word
paragraphe|paragraphes|m|paragraph
document|documents|m|document
fichier|fichiers|m|file
dossier|dossiers|m|folder
version|versions|f|version
historique|historiques|m|history
commentaire|commentaires|m|comment
modification|modifications|f|change
changement|changements|m|change
sélection|sélections|f|selection
copie|copies|f|copy
groupe|groupes|m|group
colonne|colonnes|f|column
rangée|rangées|f|row
tableau|tableaux|m|table
cellule|cellules|f|cell
grille|grilles|f|grid
diagramme|diagrammes|m|diagram
schéma|schémas|m|diagram
organigramme|organigrammes|m|flowchart
processus|processus|m|process
étape|étapes|f|step
décision|décisions|f|decision
début|débuts|m|beginning
fin|fins|f|end
entrée|entrées|f|input
sortie|sorties|f|output
couloir|couloirs|m|lane
animation|animations|f|animation
transition|transitions|f|transition
effet|effets|m|effect
mouvement|mouvements|m|movement
durée|durées|f|duration
délai|délais|m|delay
retard|retards|m|delay
vitesse|vitesses|f|speed
boucle|boucles|f|loop
chronologie|chronologies|f|timeline
scène|scènes|f|scene
clip|clips|m|clip
piste|pistes|f|track
position|positions|f|position
rotation|rotations|f|rotation
échelle|échelles|f|scale
zoom|zooms|m|zoom
clic|clics|m|click
survol|survols|m|hover
utilisateur|utilisateurs|m|user
équipe|équipes|f|team
collègue|collègues|m|colleague
membre|membres|m|member
propriétaire|propriétaires|m|owner
droit|droits|m|right
accès|accès|m|access
permission|permissions|f|permission
lien|liens|m|link
partage|partages|m|sharing
projet|projets|m|project
modèle|modèles|m|template
thème|thèmes|m|theme
paramètre|paramètres|m|setting
option|options|f|option
compte|comptes|m|account
rapport|rapports|m|report
donnée|données|f|data;pl=data
champ|champs|m|field
valeur|valeurs|f|value
format|formats|m|format
nom|noms|m|name
description|descriptions|f|description
filtre|filtres|m|filter
recherche|recherches|f|search
résultat|résultats|m|result
erreur|erreurs|f|error
message|messages|m|message
notification|notifications|f|notification
email|emails|m|email
question|questions|f|question
réponse|réponses|f|answer
aide|aides|f|help
commande|commandes|f|command
raccourci|raccourcis|m|shortcut
écran|écrans|m|screen
application|applications|f|app
code|codes|m|code
script|scripts|m|script
fonction|fonctions|f|function
règle|règles|f|rule
gauche|gauches|f|left
droite|droites|f|right
haut|hauts|m|top
bas|bas|m|bottom
centre|centres|m|center
milieu|milieux|m|middle
coin|coins|m|corner
côté|côtés|m|side
bord|bords|m|edge
marge|marges|f|margin
pixel|pixels|m|pixel
point|points|m|point
degré|degrés|m|degree
seconde|secondes|f|second
milliseconde|millisecondes|f|millisecond
minute|minutes|f|minute
heure|heures|f|hour
jour|jours|m|day
semaine|semaines|f|week
mois|mois|m|month
année|années|f|year
facture|factures|f|invoice
contrat|contrats|m|contract
client|clients|m|client
fournisseur|fournisseurs|m|supplier
tâche|tâches|f|task
réunion|réunions|f|meeting
sauvegarde|sauvegardes|f|backup
export|exports|m|export
import|imports|m|import
aperçu|aperçus|m|preview
impression|impressions|f|printing
objet|objets|m|object
élément|éléments|m|element
composant|composants|m|component
légende|légendes|f|legend
symbole|symboles|m|symbol
arbre|arbres|m|tree
branche|branches|f|branch
niveau|niveaux|m|level
curseur|curseurs|m|cursor
souris|souris|f|mouse
clavier|claviers|m|keyboard
touche|touches|f|key
fenêtre|fenêtres|f|window
panneau|panneaux|m|panel
barre|barres|f|bar
outil|outils|m|tool
fois|fois|f|time
graphique|graphiques|m|chart
vidéo|vidéos|f|video
son|sons|m|sound
fondu|fondus|m|fade
utilisation|utilisations|f|use
lecture|lectures|f|playback
ordre|ordres|m|order
liste|listes|f|list
ville|villes|f|city
luminosité|luminosités|f|brightness
apparition|apparitions|f|appearance
disparition|disparitions|f|disappearance
vente|ventes|f|sale
autorisation|autorisations|f|permission
an|ans|m|year
direction|directions|f|management
budget|budgets|m|budget
format|formats|m|format
détourage|détourages|m|cutout
janvier|-|m|January
février|-|m|February
mars|-|m|March
avril|-|m|April
mai|-|m|May
juin|-|m|June
juillet|-|m|July
août|-|m|August
septembre|-|m|September
octobre|-|m|October
novembre|-|m|November
décembre|-|m|December
lundi|-|m|Monday
mardi|-|m|Tuesday
mercredi|-|m|Wednesday
jeudi|-|m|Thursday
vendredi|-|m|Friday
`;

const ADJ = [
  'rouge|rouge|rouges|rouges|red', 'bleu|bleue|bleus|bleues|blue', 'vert|verte|verts|vertes|green', 'jaune|jaune|jaunes|jaunes|yellow',
  'noir|noire|noirs|noires|black', 'blanc|blanche|blancs|blanches|white', 'gris|grise|gris|grises|gray', 'orange|orange|orange|orange|orange',
  'violet|violette|violets|violettes|purple', 'rose|rose|roses|roses|pink', 'marron|marron|marron|marron|brown',
  'clair|claire|clairs|claires|light', 'foncé|foncée|foncés|foncées|dark', 'grand|grande|grands|grandes|large', 'petit|petite|petits|petites|small',
  'long|longue|longs|longues|long', 'court|courte|courts|courtes|short', 'large|large|larges|larges|wide', 'étroit|étroite|étroits|étroites|narrow',
  'épais|épaisse|épais|épaisses|thick', 'fin|fine|fins|fines|thin', 'nouveau|nouvelle|nouveaux|nouvelles|new', 'ancien|ancienne|anciens|anciennes|old',
  'suivant|suivante|suivants|suivantes|next', 'précédent|précédente|précédents|précédentes|previous', 'actuel|actuelle|actuels|actuelles|current',
  'actif|active|actifs|actives|active', 'visible|visible|visibles|visibles|visible', 'entier|entière|entiers|entières|whole',
  'différent|différente|différents|différentes|different', 'rond|ronde|ronds|rondes|round', 'arrondi|arrondie|arrondis|arrondies|rounded',
  'droit|droite|droits|droites|straight', 'courbe|courbe|courbes|courbes|curved', 'pointillé|pointillée|pointillés|pointillées|dotted',
  'tireté|tiretée|tiretés|tiretées|dashed', 'continu|continue|continus|continues|solid', 'horizontal|horizontale|horizontaux|horizontales|horizontal',
  'vertical|verticale|verticaux|verticales|vertical', 'central|centrale|centraux|centrales|central', 'principal|principale|principaux|principales|main',
  'secondaire|secondaire|secondaires|secondaires|secondary', 'rapide|rapide|rapides|rapides|fast', 'lent|lente|lents|lentes|slow',
  'infini|infinie|infinis|infinies|infinite', 'automatique|automatique|automatiques|automatiques|automatic', 'manuel|manuelle|manuels|manuelles|manual',
  'personnalisé|personnalisée|personnalisés|personnalisées|custom', 'public|publique|publics|publiques|public', 'privé|privée|privés|privées|private',
  'interne|interne|internes|internes|internal', 'externe|externe|externes|externes|external', 'complet|complète|complets|complètes|complete',
  'vide|vide|vides|vides|empty', 'plein|pleine|pleins|pleines|full', 'simple|simple|simples|simples|simple', 'gras|grasse|gras|grasses|bold',
  'italique|italique|italiques|italiques|italic', 'transparent|transparente|transparents|transparentes|transparent', 'opaque|opaque|opaques|opaques|opaque',
  'final|finale|finaux|finales|final', 'statique|statique|statiques|statiques|static', 'total|totale|totaux|totales|total',
  'hebdomadaire|hebdomadaire|hebdomadaires|hebdomadaires|weekly', 'trimestriel|trimestrielle|trimestriels|trimestrielles|quarterly', 'juridique|juridique|juridiques|juridiques|legal', 'carré|carrée|carrés|carrées|square', 'annuel|annuelle|annuels|annuelles|yearly', 'quotidien|quotidienne|quotidiens|quotidiennes|daily', 'mensuel|mensuelle|mensuels|mensuelles|monthly',
  part('sélectionné', 'selected'), part('caché', 'hidden'), part('masqué', 'hidden'), part('verrouillé', 'locked'), part('partagé', 'shared'),
  part('animé', 'animated'), part('dupliqué', 'duplicated'), part('supprimé', 'deleted'), part('enregistré', 'saved'), part('modifié', 'modified'),
  part('connecté', 'connected'), part('lié', 'linked'), part('groupé', 'grouped'), part('aligné', 'aligned'), part('centré', 'centered'),
  part('numéroté', 'numbered'), part('approuvé', 'approved'), part('signé', 'signed'), part('archivé', 'archived'), part('payé', 'paid'),
  part('impayé', 'unpaid'), part('expiré', 'expired'), part('ouvert', 'open'), part('fermé', 'closed'), part('terminé', 'finished'),
];

const FUNC = `
le|the|DET
la|the|DET
les|the|DET
l'|the|DET
un|a|DET
une|a|DET
des||DET
du|of the|DETGEN
au|to the|PREP
aux|to the|PREP
ce|this|DEM
cet|this|DEM
cette|this|DEM
ces|these|DEM
mon|my|POSS
ma|my|POSS
mes|my|POSS
ton|your|POSS
ta|your|POSS
tes|your|POSS
son|its|POSS
sa|its|POSS
ses|its|POSS
notre|our|POSS
votre|your|POSS
nos|our|POSS
vos|your|POSS
leur|their|POSS
leurs|their|POSS
tout|all|QUANT
toute|the whole|QUANT
tous|all|QUANT
toutes|all|QUANT
chaque|each|QUANT
autre|other|QUANT
autres|other|QUANT
plusieurs|several|QUANT
premier|the first|ORD
première|the first|ORD
premiers|the first|ORD
premières|the first|ORD
dernier|the last|ORD
dernière|the last|ORD
derniers|the last|ORD
dernières|the last|ORD
deuxième|the second|ORD
second|the second|ORD
seconde|the second|ORD
troisième|the third|ORD
quatrième|the fourth|ORD
deux|two|NUM
trois|three|NUM
quatre|four|NUM
cinq|five|NUM
six|six|NUM
sept|seven|NUM
huit|eight|NUM
neuf|nine|NUM
dix|ten|NUM
cent|hundred|NUM
de|of|PREP
d'|of|PREP
à|to|PREP
dans|in|PREP
en|in|PREP
sur|on|PREP
sous|under|PREP
avec|with|PREP
sans|without|PREP
pour|for|PREP
par|by|PREP
vers|toward|PREP
entre|between|PREP
après|after|PREP
avant|before|PREP
depuis|from|PREP
contre|against|PREP
chez|at|PREP
jusqu'|until|PREP
comme|as|PREP
et|and|CONJ
ou|or|CONJ
puis|then|CONJ
mais|but|CONJ
si|if|CONJ
quand|when|CONJ
lorsque|when|CONJ
ensuite|then|CONJ
ne|don't|NEG
n'|don't|NEG
pas|·|ADV
plus|more|ADV
moins|less|ADV
très|very|ADV
trop|too|ADV
seulement|only|ADV
encore|again|ADV
ici|here|ADV
maintenant|now|ADV
lentement|slowly|ADV
rapidement|quickly|ADV
doucement|gently|ADV
horizontalement|horizontally|ADV
verticalement|vertically|ADV
automatiquement|automatically|ADV
ensemble|together|ADV
toujours|always|ADV
jamais|never|ADV
je|I|PRON
j'|I|PRON
tu|you|PRON
il|it|PRON
elle|it|PRON
nous|we|PRON
vous|you|PRON
ils|they|PRON
elles|they|PRON
le|it|CLITIC
lui|it|CLITIC
leur|them|CLITIC
s'|·|CLITIC
se|·|CLITIC
me|me|CLITIC
m'|me|CLITIC
comment|how|Q
où|where|Q
quel|which|Q
quelle|which|Q
quels|which|Q
quelles|which|Q
combien|how many|Q
pourquoi|why|Q
qui|who|Q
que|what|Q
qu'|what|Q
svp|please|INTJ
merci|thanks|INTJ
`;

const MWE = `
zone de texte => text box | N
base de données => database | N
bases de données => databases | N
ombre portée => drop shadow | N
en pointillés => dashed | ADJ
en pointillé => dashed | ADJ
en lecture seule => read-only | ADJ
lecture seule => read-only | ADJ
où se trouve => where is | QV
où est => where is | QV
qu' est-ce que => what | Q
est-ce que => · | INTJ
de plus de => older than | ADJ
plus de => more than | ADV
par e-mail => by email | ADV
par email => by email | ADV
barre d' outils => toolbar | N
image clé => keyframe | N
images clés => keyframes | N
tableau de bord => dashboard | N
mot de passe => password | N
premier plan => foreground | N
au premier plan => to the front | ADV
à l' arrière-plan => to the back | ADV
en arrière-plan => to the back | ADV
à gauche => to the left | ADV
à droite => to the right | ADV
vers la gauche => to the left | ADV
vers la droite => to the right | ADV
en haut => at the top | ADV
en bas => at the bottom | ADV
vers le haut => up | ADV
vers le bas => down | ADV
en haut à gauche => top left | ADV
en haut à droite => top right | ADV
en bas à gauche => bottom left | ADV
en bas à droite => bottom right | ADV
au centre => in the center | ADV
au milieu => in the middle | ADV
plus grand => larger | ADJ
plus grande => larger | ADJ
plus petit => smaller | ADJ
plus petite => smaller | ADJ
plus rapide => faster | ADJ
plus lent => slower | ADJ
plus lente => slower | ADJ
plus épais => thicker | ADJ
plus clair => lighter | ADJ
plus foncé => darker | ADJ
en boucle => in a loop | ADV
fondu entrant => fade-in | N
fondu sortant => fade-out | N
fondu enchaîné => crossfade | N
mettre en pause => pause | V
mettre en gras => bold | V
mettre en italique => italicize | V
mettre à jour => update | V
faire défiler => scroll | V
faire glisser => drag | V
faire pivoter => rotate | V
faire tourner => rotate | V
faire apparaître => make appear | V
faire disparaître => make disappear | V
s' il vous plaît => please | INTJ
s' il te plaît => please | INTJ
à partir de => from | PREP
jusqu' à => up to | PREP
par rapport à => relative to | PREP
à côté de => next to | PREP
au-dessus de => above | PREP
en dessous de => below | PREP
au lieu de => instead of | PREP
pour cent => percent | N
de nouveau => again | ADV
une fois => once | ADV
deux fois => twice | ADV
trois fois => three times | ADV
au clic => on click | PP
au survol => on hover | PP
en même temps => at the same time | ADV
par défaut => default | ADJ
en gras => bold | ADJ
en italique => italic | ADJ
il y a => there is | V
`;

const FR = { lang: 'fr', name: 'fr-example', morphology: 'none', VERBS, NOUNS, ADJ, FUNC, MWE };
if (typeof module !== 'undefined' && module.exports) module.exports = FR;
else { root.VSA_DICT_FR = FR; if (root.VSARoTranslate && root.VSARoTranslate.dictionaries) root.VSARoTranslate.dictionaries.fr = FR; }
})(typeof window !== 'undefined' ? window : globalThis);
