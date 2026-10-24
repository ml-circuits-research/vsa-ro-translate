/*! vsa-ro-translate v0.1.1 | Romanian -> English command translator with a hyperdimensional (VSA) lexicon | MIT | https://github.com/ml-circuits-research/vsa-ro-translate */

  var LEX = (function () { var module = { exports: {} }; // Romanian -> English lexicon for technical / agentic commands
// (diagrams, editing, animation, enterprise). Diacritics are kept here for
// readability; the engine strips them at load time.
//
// VERBS:  infinitive | class | english | extra forms (comma separated)
//   class: ez (-a, -ez), esc (-i, -esc), a (-a plain), e (3rd conj), i (-i plain), irr (forms only)
// NOUNS:  lemma | plural | gender m/f/n | english [| extra forms]
//   english may be "sg;pl=plural" for irregular English plurals.
// ADJ:    m | f | mpl | fpl | english
// FUNC:   surface | english | tag
// MWE:    romanian words => english | tag
(function (root) {
const VERBS = `
adăuga|a|add|adaug,adaugi,adaugă,adauge,adăugați,adăugăm,adăugat,adăugând
insera|ez|insert
crea|irr|create|creez,creezi,creează,creăm,creați,creeze,creat,creând,crea
desena|ez|draw
face|irr|make|fac,faci,face,facem,faceți,facă,făcut,fă,fa,făcând
pune|e|put|pun,pui,pune,punem,puneți,pună,pus,punând
plasa|ez|place
poziționa|ez|position
muta|a|move|mut,muți,mută,mutăm,mutați,mute,mutat
deplasa|ez|move
mișca|a|move|mișc,miști,mișcă,mișcăm,mișcați,miște,mișcat
glisa|ez|slide
trage|e|drag|trag,tragi,trage,tragem,trageți,tragă,tras
șterge|e|delete|șterg,ștergi,șterge,ștergem,ștergeți,șteargă,șters
elimina|a|remove|elimin,elimini,elimină,eliminăm,eliminați,elimine,eliminat
scoate|e|remove|scot,scoți,scoate,scoatem,scoateți,scoată,scos
tăia|irr|cut|tai,tăiați,taie,tăiat,tăia
decupa|ez|crop|decupez,decupează,decupați,decupat
copia|irr|copy|copiez,copiezi,copiază,copiem,copiați,copieze,copiat,copia
lipi|esc|paste
duplica|a|duplicate|duplic,duplici,duplică,duplicați,duplice,duplicat
dubla|ez|duplicate
clona|ez|clone
grupa|ez|group
degrupa|ez|ungroup
alinia|irr|align|aliniez,aliniezi,aliniază,aliniem,aliniați,alinieze,aliniat,alinia
distribui|irr|distribute|distribui,distribuie,distribuim,distribuiți,distribuit,distribuind
centra|ez|center
roti|esc|rotate
întoarce|e|turn|întorc,întorci,întoarce,întoarceți,întoarcă,întors
răsturna|a|flip|răstorn,răstorni,răstoarnă,răsturnați,răstoarne,răsturnat
oglindi|esc|mirror
inversa|ez|reverse
redimensiona|ez|resize
scala|ez|scale
mări|esc|increase
micșora|ez|reduce
crește|e|increase|cresc,crești,crește,creștem,creșteți,crească,crescut
scădea|irr|decrease|scad,scazi,scade,scădeți,scadă,scăzut,scădea
reduce|e|reduce|reduc,reduci,reduce,reducem,reduceți,reducă,redus,redu
seta|ez|set
stabili|esc|set
schimba|a|change|schimb,schimbi,schimbă,schimbăm,schimbați,schimbe,schimbat
modifica|a|change|modific,modifici,modifică,modificați,modifice,modificat
înlocui|esc|replace|înlocuiesc,înlocuiește,înlocuiți,înlocuit,înlocui
căuta|a|find|caut,cauți,caută,căutați,caute,căutat
găsi|esc|find
selecta|ez|select
deselecta|ez|deselect
ascunde|e|hide|ascund,ascunzi,ascunde,ascundeți,ascundă,ascuns
afișa|ez|show
arăta|a|show|arăt,arăți,arată,arătați,arate,arătat
bloca|irr|lock|blochez,blochezi,blochează,blocăm,blocați,blocheze,blocat,bloca
debloca|irr|unlock|deblochez,deblochează,deblocați,deblocheze,deblocat,debloca
conecta|ez|connect
lega|irr|connect|leg,legi,leagă,legăm,legați,lege,legat,lega
uni|esc|join
scrie|e|write|scriu,scrii,scrie,scriem,scrieți,scris
tasta|ez|type
redenumi|esc|rename
eticheta|ez|label
numi|esc|name
colora|ez|color
umple|e|fill|umplu,umpli,umple,umplem,umpleți,umple,umplut
evidenția|irr|highlight|evidențiez,evidențiază,evidențiați,evidențieze,evidențiat,evidenția
sublinia|irr|underline|subliniez,subliniază,subliniați,sublinieze,subliniat,sublinia
îngroșa|irr|thicken|îngroș,îngroașă,îngroșați,îngroașe,îngroșat,îngroșa
formata|ez|format
aplica|a|apply|aplic,aplici,aplică,aplicați,aplice,aplicat
goli|esc|clear
reseta|ez|reset
restaura|ez|restore
reveni|irr|revert|revin,revii,revine,reveniți,revină,revino,revenit,reveni
compara|a|compare|compar,compari,compară,comparați,compare,comparat
verifica|a|check|verific,verifici,verifică,verificați,verifice,verificat
valida|ez|validate
publica|a|publish|public,publici,publică,publicați,publice,publicat
invita|a|invite|invit,inviți,invită,invitați,invite,invitat
permite|e|allow|permit,permiți,permite,permiteți,permită,permis
acorda|a|grant|acord,acorzi,acordă,acordați,acorde,acordat
revoca|a|revoke|revoc,revoci,revocă,revocați,revoce,revocat
da|irr|give|dau,dai,dă,dăm,dați,dea,dat
oferi|i|give|ofer,oferi,oferă,oferiți,ofere,oferit
comenta|ez|comment
rezolva|a|resolve|rezolv,rezolvi,rezolvă,rezolvați,rezolve,rezolvat
închide|e|close|închid,închizi,închide,închideți,închidă,închis
deschide|e|open|deschid,deschizi,deschide,deschideți,deschidă,deschis
reda|irr|play|redau,redă,redați,redea,redat,reda
rula|ez|run
porni|esc|start
începe|e|start|încep,începi,începe,începeți,înceapă,început
opri|esc|stop
întrerupe|e|pause|întrerup,întrerupi,întrerupe,întrerupeți,întrerupă,întrerupt
repeta|a|repeat|repet,repeți,repetă,repetați,repete,repetat
întârzia|irr|delay|întârzii,întârzie,întârziați,întârzie,întârziat,întârzia
accelera|ez|speed up
încetini|esc|slow down
apărea|irr|appear|apar,apari,apare,apăreți,apară,apărut,apărea
dispărea|irr|disappear|dispar,dispari,dispare,dispăreți,dispară,dispărut,dispărea
estompa|ez|fade
pulsa|ez|pulse
sări|i|bounce|sar,sari,sare,săriți,sară,sărit,sări
clipi|esc|blink
intra|a|enter|intru,intri,intră,intrați,intre,intrat
ieși|irr|exit|ies,ieși,iese,ieșiți,iasă,ieșit
retrage|e|revoke|retrag,retragi,retrage,retrageți,retragă,retras
expira|a|expire|expir,expiri,expiră,expirați,expire,expirat
pulsa|ez|pulse
urma|ez|follow
sincroniza|ez|sync
declanșa|ez|trigger
atașa|ez|attach
numerota|ez|number
sorta|ez|sort
filtra|ez|filter
genera|ez|generate
transforma|a|convert|transform,transformi,transformă,transformați,transforme,transformat
converti|esc|convert
împărți|i|split|împart,împarți,împarte,împărțim,împărțiți,împartă,împărțit
îmbina|a|merge|îmbin,îmbini,îmbină,îmbinați,îmbine,îmbinat
combina|a|combine|combin,combini,combină,combinați,combine,combinat
extinde|e|expand|extind,extinzi,extinde,extindeți,extindă,extins
restrânge|e|collapse|restrâng,restrângi,restrânge,restrângeți,restrângă,restrâns
derula|ez|scroll
fixa|ez|pin
ancora|ez|anchor
ajusta|ez|adjust
potrivi|esc|fit
încadra|ez|fit
păstra|ez|keep
lăsa|a|leave|las,lași,lasă,lăsați,lase,lăsat
folosi|esc|use
utiliza|ez|use
vrea|irr|want|vreau,vrei,vrea,vrem,vreți,vrut
dori|esc|want
putea|irr|can|pot,poți,poate,putem,puteți,poată,putut
trebui|irr|must|trebuie,trebui,trebuit
ajuta|a|help|ajut,ajuți,ajută,ajutați,ajute,ajutat
spune|e|tell|spun,spui,spune,spuneți,spună,spus
explica|a|explain|explic,explici,explică,explicați,explice,explicat
fi|irr|be|sunt,ești,este,e,suntem,sunteți,fie,fost,fii
avea|irr|have|am,ai,a,are,avem,aveți,au,avut,aibă
dura|ez|last
termina|a|end|termin,termini,termină,terminați,termine,terminat
deveni|irr|become|devin,devii,devine,deveniți,devină,devenit
rămâne|e|stay|rămân,rămâi,rămâne,rămâneți,rămână,rămas
lucra|ez|work
funcționa|ez|work
merge|e|work|merg,mergi,merge,mergeți,meargă,mers
vedea|irr|see|văd,vezi,vede,vedeți,vadă,văzut,vedea
privi|esc|view
salva|ez|save
exporta|a|export|export,exporți,exportă,exportăm,exportați,exporte,exportat
importa|a|import|import,importi,importă,importăm,importați,importe,importat
încărca|a|upload|încarc,încarci,încarcă,încărcați,încarce,încărcat
descărca|a|download|descarc,descarci,descarcă,descărcați,descarce,descărcat
partaja|ez|share
trimite|e|send|trimit,trimiți,trimite,trimitem,trimiteți,trimită,trimis
aduce|e|bring|aduc,aduci,aduce,aducem,aduceți,aducă,adus,adu
duce|e|take|duc,duci,duce,duceți,ducă,dus,du
alege|e|choose|aleg,alegi,alege,alegeți,aleagă,ales
introduce|e|enter|introduc,introduci,introduce,introduceți,introducă,introdus,introdu
include|e|include|includ,incluzi,include,includeți,includă,inclus
exclude|e|exclude|exclud,excluzi,exclude,excludeți,excludă,exclus
construi|esc|build
proiecta|ez|design
schița|ez|sketch
organiza|ez|organize
aranja|ez|arrange
ordona|ez|order
extrage|e|extract|extrag,extragi,extrage,extrageți,extragă,extras
apăsa|a|press|apăs,apeși,apasă,apăsați,apese,apăsat
naviga|irr|navigate|navighez,navighează,navigați,navigheze,navigat,naviga
trece|e|go|trec,treci,trece,treceți,treacă,trecut
întreba|a|ask|întreb,întrebi,întreabă,întrebați,întrebe,întrebat
răspunde|e|answer|răspund,răspunzi,răspunde,răspundeți,răspundă,răspuns
notifica|a|notify|notific,notifici,notifică,notificați,notifice,notificat
programa|ez|schedule
planifica|a|schedule|planific,planifici,planifică,planificați,planifice,planificat
aproba|a|approve|aprob,aprobi,aprobă,aprobați,aprobe,aprobat
respinge|e|reject|resping,respingi,respinge,respingeți,respingă,respins
semna|ez|sign
arhiva|ez|archive
restricționa|ez|restrict
limita|ez|limit
activa|ez|enable
dezactiva|ez|disable
afla|a|find out|aflu,afli,află,aflați,afle,aflat
vizualiza|ez|view
previzualiza|ez|preview
reface|e|redo|refac,refaci,reface,refaceți,refacă,refăcut,refă
anula|ez|undo
recupera|ez|recover
rearanja|ez|rearrange
înclina|a|tilt|înclin,înclini,înclină,înclinați,încline,înclinat
netezi|esc|smooth
rotunji|esc|round
umbri|esc|shade
întuneca|a|darken|întunec,întuneci,întunecă,întunecați,întunece,întunecat
lumina|ez|lighten
traduce|e|translate|traduc,traduci,traduce,traduceți,traducă,tradus,tradu
calcula|ez|calculate
număra|a|count|număr,numeri,numără,numărați,numere,numărat
aștepta|a|wait|aștept,aștepți,așteaptă,așteptați,aștepte,așteptat
continua|irr|continue|continui,continuă,continuăm,continuați,continue,continuat,continua
relua|irr|resume|reiau,reia,reluați,reia,reluat,relua
evita|a|avoid|evit,eviți,evită,evitați,evite,evitat
asigura|a|make sure|asigur,asiguri,asigură,asigurați,asigure,asigurat
gestiona|ez|manage
administra|ez|manage
colabora|ez|collaborate
edita|ez|edit
actualiza|ez|update
optimiza|ez|optimize
comprima|a|compress|comprim,comprimi,comprimă,comprimați,comprime,comprimat
întinde|e|stretch|întind,întinzi,întinde,întindeți,întindă,întins
lărgi|esc|widen
îngusta|ez|narrow
lungi|esc|lengthen
scurta|ez|shorten
conține|e|contain|conțin,conții,conține,conțineți,conțină,conținut
lansa|ez|launch
ține|e|keep|țin,ții,ține,țineți,țină,ținut
mări|esc|increase
apropia|irr|bring closer|apropiez,apropie,apropiați,apropiat
depărta|ez|move apart
suprapune|e|overlap|suprapun,suprapui,suprapune,suprapuneți,suprapună,suprapus
încheia|irr|end|închei,încheie,încheiați,încheiat
anima|ez|animate
desfăcea|irr|undo|desfă,desfaceți,desfăcut
completa|ez|complete
umple|e|fill|umplu,umpli,umple,umpleți,umplut
specifica|a|specify|specific,specifici,specifică,specificați,specifice,specificat
indica|a|indicate|indic,indici,indică,indicați,indice,indicat
marca|ez|mark|marchez,marchează,marcați,marcheze,marcat
bifa|ez|check|bifez,bifează,bifați,bifeze,bifat
debifa|ez|uncheck|debifez,debifează,debifați,debifat
`;

const NOUNS = `
diagramă|diagrame|f|diagram
schemă|scheme|f|diagram
organigramă|organigrame|f|org chart
flux|fluxuri|n|flow
flowchart|flowcharturi|n|flowchart
nod|noduri|n|node
casetă|casete|f|box
cutie|cutii|f|box
chenar|chenare|n|border
bordură|borduri|f|border
formă|forme|f|shape
figură|figuri|f|shape
dreptunghi|dreptunghiuri|n|rectangle
pătrat|pătrate|n|square
cerc|cercuri|n|circle
elipsă|elipse|f|ellipse
oval|ovaluri|n|oval
triunghi|triunghiuri|n|triangle
romb|romburi|n|diamond
hexagon|hexagoane|n|hexagon
poligon|poligoane|n|polygon
stea|stele|f|star|steaua,stelei,stelele,stelelor
linie|linii|f|line
săgeată|săgeți|f|arrow
conector|conectori|m|connector
legătură|legături|f|link
conexiune|conexiuni|f|connection
muchie|muchii|f|edge
etichetă|etichete|f|label
text|texte|n|text
titlu|titluri|n|title
subtitlu|subtitluri|n|subtitle
notă|note|f|note
comentariu|comentarii|n|comment
pas|pași|m|step
etapă|etape|f|stage
proces|procese|n|process
decizie|decizii|f|decision
start|starturi|n|start
sfârșit|sfârșituri|n|end
final|finaluri|n|end
început|începuturi|n|beginning
intrare|intrări|f|input
ieșire|ieșiri|f|output
bandă|benzi|f|lane
culoar|culoare|n|lane
rază|raze|f|radius
calculator|calculatoare|n|computer
diferență|diferențe|f|difference
oară|ori|f|time
expirare|expirări|f|expiry
unealtă|unelte|f|tool
link|linkuri|n|link
swimlane|swimlane-uri|n|swimlane
coloană|coloane|f|column
rând|rânduri|n|row
tabel|tabele|n|table
celulă|celule|f|cell
grilă|grile|f|grid
rețea|rețele|f|network|rețeaua,rețelei
container|containere|n|container
grup|grupuri|n|group
cadru|cadre|n|frame
pagină|pagini|f|page
pânză|pânze|f|canvas
canvas|canvasuri|n|canvas
planșă|planșe|f|artboard
fundal|fundaluri|n|background
prim-plan|prim-planuri|n|foreground
strat|straturi|n|layer
layer|layere|n|layer
nivel|niveluri|n|level
ierarhie|ierarhii|f|hierarchy
arbore|arbori|m|tree
ramură|ramuri|f|branch
copil|copii|m|child;pl=children
părinte|părinți|m|parent
legendă|legende|f|legend
simbol|simboluri|n|symbol
pictogramă|pictograme|f|icon
iconiță|iconițe|f|icon
icon|iconuri|n|icon
imagine|imagini|f|image
poză|poze|f|picture
fotografie|fotografii|f|photo
logo|logouri|n|logo
buton|butoane|n|button
meniu|meniuri|n|menu
bară|bare|f|bar
instrument|instrumente|n|tool
panou|panouri|n|panel
fereastră|ferestre|f|window
dialog|dialoguri|n|dialog
listă|liste|f|list
element|elemente|n|element
obiect|obiecte|n|object
componentă|componente|f|component
entitate|entități|f|entity
relație|relații|f|relationship
atribut|atribute|n|attribute
clasă|clase|f|class
actor|actori|m|actor
sistem|sisteme|n|system
server|servere|n|server
bază|baze|f|base
utilizator|utilizatori|m|user
serviciu|servicii|n|service
modul|module|n|module
interfață|interfețe|f|interface
aspect|aspecte|n|layout
aranjament|aranjamente|n|arrangement
spațiu|spații|n|space
spațiere|spațieri|f|spacing
distanță|distanțe|f|distance
aliniere|alinieri|f|alignment
margine|margini|f|margin
colț|colțuri|n|corner
centru|centre|n|center
mijloc|mijloace|n|middle
latură|laturi|f|side
parte|părți|f|side
vârf|vârfuri|n|tip
capăt|capete|n|end
lățime|lățimi|f|width
înălțime|înălțimi|f|height
dimensiune|dimensiuni|f|size
mărime|mărimi|f|size
grosime|grosimi|f|thickness
stil|stiluri|n|style
culoare|culori|f|color
umplere|umpleri|f|fill
contur|contururi|n|outline
umbră|umbre|f|shadow
gradient|gradienți|m|gradient
transparență|transparențe|f|transparency
opacitate|opacități|f|opacity
font|fonturi|n|font
literă|litere|f|letter
caracter|caractere|n|character
cuvânt|cuvinte|n|word
frază|fraze|f|sentence
propoziție|propoziții|f|sentence
paragraf|paragrafe|n|paragraph
interlinie|interlinii|f|line spacing
indentare|indentări|f|indent
bulină|buline|f|bullet
număr|numere|n|number
subliniere|sublinieri|f|underline
majusculă|majuscule|f|capital letter
link|linkuri|n|link
adresă|adrese|f|address
fișier|fișiere|n|file
document|documente|n|document
versiune|versiuni|f|version
istoric|istoricuri|n|history
modificare|modificări|f|change
schimbare|schimbări|f|change
acțiune|acțiuni|f|action
editare|editări|f|editing
selecție|selecții|f|selection
copie|copii|f|copy;pl=copies
duplicat|duplicate|n|duplicate
rotație|rotații|f|rotation
rotire|rotiri|f|rotation
unghi|unghiuri|n|angle
grad|grade|n|degree
pixel|pixeli|m|pixel
punct|puncte|n|point
procent|procente|n|percent
milisecundă|milisecunde|f|millisecond
secundă|secunde|f|second
minut|minute|n|minute
oră|ore|f|hour
zi|zile|f|day|ziua,zilei
săptămână|săptămâni|f|week
lună|luni|f|month
an|ani|m|year
animație|animații|f|animation
tranziție|tranziții|f|transition
efect|efecte|n|effect
mișcare|mișcări|f|motion
durată|durate|f|duration
întârziere|întârzieri|f|delay
viteză|viteze|f|speed
ritm|ritmuri|n|pace
accelerare|accelerări|f|acceleration
decelerare|decelerări|f|deceleration
buclă|bucle|f|loop
repetare|repetări|f|repetition
repetiție|repetiții|f|repetition
ciclu|cicluri|n|cycle
cronologie|cronologii|f|timeline
timeline|timeline-uri|n|timeline
scenă|scene|f|scene
secvență|secvențe|f|sequence
clip|clipuri|n|clip
poziție|poziții|f|position
traiectorie|traiectorii|f|path
cale|căi|f|path|calea,căii
scalare|scalări|f|scaling
scară|scări|f|scale
zoom|zoomuri|n|zoom
apariție|apariții|f|appearance
dispariție|dispariții|f|disappearance
estompare|estompări|f|fade
clic|clicuri|n|click
click|clickuri|n|click
hover|hoveruri|n|hover
declanșator|declanșatoare|n|trigger
eveniment|evenimente|n|event
sunet|sunete|n|sound
redare|redări|f|playback
stare|stări|f|state
permisiune|permisiuni|f|permission
drept|drepturi|n|right
acces|accese|n|access
rol|roluri|n|role
echipă|echipe|f|team
coleg|colegi|m|colleague
membru|membri|m|member
administrator|administratori|m|administrator
admin|admini|m|admin
proprietar|proprietari|m|owner
editor|editori|m|editor
cititor|cititori|m|viewer
vizualizare|vizualizări|f|view
partajare|partajări|f|sharing
proiect|proiecte|n|project
dosar|dosare|n|folder
folder|foldere|n|folder
șablon|șabloane|n|template
temă|teme|f|theme
setare|setări|f|setting
opțiune|opțiuni|f|option
configurare|configurări|f|configuration
configurație|configurații|f|configuration
preferință|preferințe|f|preference
cont|conturi|n|account
parolă|parole|f|password
raport|rapoarte|n|report
dată|date|f|date;pl=data
câmp|câmpuri|n|field
valoare|valori|f|value
format|formate|n|format
calitate|calități|f|quality
rezoluție|rezoluții|f|resolution
nume|nume|n|name
denumire|denumiri|f|name
descriere|descrieri|f|description
filtru|filtre|n|filter
căutare|căutări|f|search
rezultat|rezultate|n|result
eroare|erori|f|error
problemă|probleme|f|problem
avertisment|avertismente|n|warning
notificare|notificări|f|notification
mesaj|mesaje|n|message
email|emailuri|n|email
e-mail|e-mailuri|n|email
întrebare|întrebări|f|question
răspuns|răspunsuri|n|answer
ajutor|ajutoare|n|help
instrucțiune|instrucțiuni|f|instruction
comandă|comenzi|f|command
scurtătură|scurtături|f|shortcut
tastă|taste|f|key
tastatură|tastaturi|f|keyboard
ecran|ecrane|n|screen
dispozitiv|dispozitive|n|device
telefon|telefoane|n|phone
aplicație|aplicații|f|app
program|programe|n|program
cod|coduri|n|code
script|scripturi|n|script
funcție|funcții|f|function
regulă|reguli|f|rule
stânga|stângi|f|left|stângă
dreapta|drepte|f|right
față|fețe|f|front
spate|spate|n|back
interior|interioare|n|inside
exterior|exterioare|n|outside
jumătate|jumătăți|f|half;pl=halves
sfert|sferturi|n|quarter
treime|treimi|f|third
total|totaluri|n|total
mouse|mouse-uri|n|mouse
browser|browsere|n|browser
export|exporturi|n|export
import|importuri|n|import
descărcare|descărcări|f|download
încărcare|încărcări|f|upload
salvare|salvări|f|save
ștergere|ștergeri|f|deletion
adăugare|adăugări|f|addition
ancoră|ancore|f|anchor
port|porturi|n|port
ramificație|ramificații|f|branch
condiție|condiții|f|condition
axă|axe|f|axis;pl=axes
grafic|grafice|n|chart
serie|serii|f|series;pl=series
cronometru|cronometre|n|timer
minge|mingi|f|ball
mașină|mașini|f|car
personaj|personaje|n|character
mască|măști|f|mask
neclaritate|neclarități|f|blur
blur|blururi|n|blur
luminozitate|luminozități|f|brightness
contrast|contraste|n|contrast
saturație|saturații|f|saturation
nuanță|nuanțe|f|shade
ton|tonuri|n|tone
paletă|palete|f|palette
pensulă|pensule|f|brush
creion|creioane|n|pencil
radieră|radiere|f|eraser
riglă|rigle|f|ruler
ghid|ghiduri|n|guide
ghidaj|ghidaje|n|guide
cursor|cursoare|n|cursor
diapozitiv|diapozitive|n|slide
slide|slide-uri|n|slide
prezentare|prezentări|f|presentation
secțiune|secțiuni|f|section
capitol|capitole|n|chapter
antet|antete|n|header
subsol|subsoluri|n|footer
tab|taburi|n|tab
filă|file|f|tab
formular|formulare|n|form
domeniu|domenii|n|domain
organizație|organizații|f|organization
companie|companii|f|company
departament|departamente|n|department
client|clienți|m|client
furnizor|furnizori|m|supplier
factură|facturi|f|invoice
contract|contracte|n|contract
sarcină|sarcini|f|task
termen|termene|n|deadline
calendar|calendare|n|calendar
întâlnire|întâlniri|f|meeting
ședință|ședințe|f|meeting
persoană|persoane|f|person;pl=people
om|oameni|m|person;pl=people
statistică|statistici|f|statistic
indicator|indicatori|m|indicator
dashboard|dashboarduri|n|dashboard
sumar|sumare|n|summary
rezumat|rezumate|n|summary
backup|backupuri|n|backup
securitate|securități|f|security
autentificare|autentificări|f|login
cheie|chei|f|key
token|tokenuri|n|token
jurnal|jurnale|n|log
log|loguri|n|log
limbă|limbi|f|language
traducere|traduceri|f|translation
semnătură|semnături|f|signature
aprobare|aprobări|f|approval
revizuire|revizuiri|f|review
cerere|cereri|f|request
prioritate|priorități|f|priority
status|statusuri|n|status
categorie|categorii|f|category
tip|tipuri|n|type
model|modele|n|template
exemplu|exemple|n|example
mod|moduri|n|mode
previzualizare|previzualizări|f|preview
imprimare|imprimări|f|printing
orientare|orientări|f|orientation
peisaj|peisaje|n|landscape
portret|portrete|n|portrait
hârtie|hârtii|f|paper
foaie|foi|f|sheet
sumă|sume|f|sum
medie|medii|f|average
formulă|formule|f|formula
keyframe|keyframe-uri|n|keyframe
easing|easinguri|n|easing
lățime|lățimi|f|width
graniță|granițe|f|boundary
limită|limite|f|limit
listă|liste|f|list
set|seturi|n|set
colecție|colecții|f|collection
majoritate|majorități|f|majority
număr|numere|n|number
fișă|fișe|f|tab
istorie|istorii|f|history
modificator|modificatori|m|modifier
tastă|taste|f|key
eticheta|etichete|f|label
legătură|legături|f|link
versiune|versiuni|f|version
utilizare|utilizări|f|use
vizibilitate|vizibilități|f|visibility
poziționare|poziționări|f|positioning
direcție|direcții|f|direction
sens|sensuri|n|direction
centrare|centrări|f|centering
ordine|ordini|f|order
vârstă|vârste|f|age
fișier|fișiere|n|file
copie|copii|f|copy;pl=copies
drag|draguri|n|drag
desen|desene|n|drawing
schiță|schițe|f|sketch
pătrățel|pătrățele|n|small square
bilă|bile|f|ball
punct|puncte|n|point
grosime|grosimi|f|thickness
săptămână|săptămâni|f|week
proprietate|proprietăți|f|property
parametru|parametri|m|parameter
variabilă|variabile|f|variable
obiectiv|obiective|n|goal
coș|coșuri|n|bin
gunoi|gunoaie|n|trash
`;

const ADJ = `
roșu|roșie|roșii|roșii|red
albastru|albastră|albaștri|albastre|blue
verde|verde|verzi|verzi|green
galben|galbenă|galbeni|galbene|yellow
negru|neagră|negri|negre|black
alb|albă|albi|albe|white
gri|gri|gri|gri|gray
cenușiu|cenușie|cenușii|cenușii|gray
portocaliu|portocalie|portocalii|portocalii|orange
mov|mov|mov|mov|purple
violet|violetă|violeți|violete|violet
roz|roz|roz|roz|pink
maro|maro|maro|maro|brown
turcoaz|turcoaz|turcoaz|turcoaz|turquoise
auriu|aurie|aurii|aurii|gold
argintiu|argintie|argintii|argintii|silver
bleumarin|bleumarin|bleumarin|bleumarin|navy blue
deschis|deschisă|deschiși|deschise|open
închis|închisă|închiși|închise|closed
transparent|transparentă|transparenți|transparente|transparent
opac|opacă|opaci|opace|opaque
mare|mare|mari|mari|large
mic|mică|mici|mici|small
lung|lungă|lungi|lungi|long
scurt|scurtă|scurți|scurte|short
lat|lată|lați|late|wide
îngust|îngustă|înguști|înguste|narrow
gros|groasă|groși|groase|thick
subțire|subțire|subțiri|subțiri|thin
înalt|înaltă|înalți|înalte|tall
nou|nouă|noi|noi|new
vechi|veche|vechi|vechi|old
următor|următoare|următori|următoare|next
anterior|anterioară|anteriori|anterioare|previous
precedent|precedentă|precedenți|precedente|previous
curent|curentă|curenți|curente|current
actual|actuală|actuali|actuale|current
selectat|selectată|selectați|selectate|selected
activ|activă|activi|active|active
inactiv|inactivă|inactivi|inactive|inactive
vizibil|vizibilă|vizibili|vizibile|visible
invizibil|invizibilă|invizibili|invizibile|invisible
ascuns|ascunsă|ascunși|ascunse|hidden
blocat|blocată|blocați|blocate|locked
întreg|întreagă|întregi|întregi|entire
diferit|diferită|diferiți|diferite|different
rotund|rotundă|rotunzi|rotunde|round
rotunjit|rotunjită|rotunjiți|rotunjite|rounded
drept|dreaptă|drepți|drepte|right
curb|curbă|curbi|curbe|curved
punctat|punctată|punctați|punctate|dotted
întrerupt|întreruptă|întrerupți|întrerupte|dashed
continuu|continuă|continui|continue|solid
orizontal|orizontală|orizontali|orizontale|horizontal
vertical|verticală|verticali|verticale|vertical
diagonal|diagonală|diagonali|diagonale|diagonal
central|centrală|centrali|centrale|central
principal|principală|principali|principale|main
secundar|secundară|secundari|secundare|secondary
rapid|rapidă|rapizi|rapide|fast
lent|lentă|lenți|lente|slow
infinit|infinită|infiniți|infinite|infinite
automat|automată|automați|automate|automatic
manual|manuală|manuali|manuale|manual
implicit|implicită|impliciți|implicite|default
personalizat|personalizată|personalizați|personalizate|custom
public|publică|publici|publice|public
privat|privată|privați|private|private
intern|internă|interni|interne|internal
extern|externă|externi|externe|external
complet|completă|compleți|complete|complete
gol|goală|goi|goale|empty
plin|plină|plini|pline|full
simplu|simplă|simpli|simple|simple
egal|egală|egali|egale|equal
aldin|aldină|aldini|aldine|bold
cursiv|cursivă|cursivi|cursive|italic
italic|italică|italici|italice|italic
mediu|medie|medii|medii|medium
maxim|maximă|maximi|maxime|maximum
minim|minimă|minimi|minime|minimum
dublu|dublă|dubli|duble|double
modern|modernă|moderni|moderne|modern
clar|clară|clari|clare|clear
stâng|stângă|stângi|stângi|left
superior|superioară|superiori|superioare|top
inferior|inferioară|inferiori|inferioare|bottom
rotit|rotită|rotiți|rotite|rotated
grupat|grupată|grupați|grupate|grouped
aliniat|aliniată|aliniați|aliniate|aligned
centrat|centrată|centrați|centrate|centered
important|importantă|importanți|importante|important
corect|corectă|corecți|corecte|correct
greșit|greșită|greșiți|greșite|wrong
gata|gata|gata|gata|ready
disponibil|disponibilă|disponibili|disponibile|available
partajat|partajată|partajați|partajate|shared
editabil|editabilă|editabili|editabile|editable
comun|comună|comuni|comune|common
vizual|vizuală|vizuali|vizuale|visual
animat|animată|animați|animate|animated
static|statică|statici|statice|static
dinamic|dinamică|dinamici|dinamice|dynamic
treptat|treptată|treptați|treptate|gradual
brusc|bruscă|bruști|bruște|sudden
fluid|fluidă|fluizi|fluide|smooth
neted|netedă|netezi|netede|smooth
ascuțit|ascuțită|ascuțiți|ascuțite|sharp
ușor|ușoară|ușori|ușoare|light
exterior|exterioară|exteriori|exterioare|outer
interior|interioară|interiori|interioare|inner
numerotat|numerotată|numerotați|numerotate|numbered
derulant|derulantă|derulanți|derulante|dropdown
temporal|temporală|temporali|temporale|temporal
orar|orară|orari|orare|time
nou-creat|nou-creată|nou-creați|nou-create|newly created
singur|singură|singuri|singure|single
separat|separată|separați|separate|separate
mijlociu|mijlocie|mijlocii|mijlocii|middle
ultim|ultimă|ultimi|ultime|last
final|finală|finali|finale|final
ortogonal|ortogonală|ortogonali|ortogonale|orthogonal
original|originală|originali|originale|original
subtil|subtilă|subtili|subtile|subtle
șters|ștearsă|șterși|șterse|deleted
salvat|salvată|salvați|salvate|saved
exportat|exportată|exportați|exportate|exported
modificat|modificată|modificați|modificate|modified
conectat|conectată|conectați|conectate|connected
legat|legată|legați|legate|linked
`;

// surface | english | tag
// tags: DET, DEM, POSS, QUANT, ORD, NUM, PRON, CLITIC, PREP, CONJ, ADV, PART, NEG, AUX, Q (question word), GENART, INTJ
const FUNC = `
un|a|DET
o|a|DET
niște|some|DET
unui|of a|DETGEN
unei|of a|DETGEN
acest|this|DEM
această|this|DEM
acești|these|DEM
aceste|these|DEM
acesta|this|DEM
aceasta|this|DEM
aceștia|these|DEM
acestea|these|DEM
acestui|of this|DEMGEN
acestei|of this|DEMGEN
acestor|of these|DEMGEN
asta|this|DEM
ăsta|this|DEM
ăștia|these|DEM
astea|these|DEM
acel|that|DEM
cel|the|CEL
cea|the|CEL
cei|the|CEL
cele|the|CEL
unul|one|UNUL
una|one|UNUL
tuturor|of all|DEMGEN
ieri|yesterday|ADV
azi|today|ADV
astăzi|today|ADV
mâine|tomorrow|ADV
ușor|slightly|ADV
acea|that|DEM
acei|those|DEM
acele|those|DEM
acela|that|DEM
aceea|that|DEM
aceia|those|DEM
acelea|those|DEM
ăla|that|DEM
aia|that|DEM
alea|those|DEM
meu|my|POSS
mea|my|POSS
mei|my|POSS
mele|my|POSS
tău|your|POSS
ta|your|POSS
tăi|your|POSS
tale|your|POSS
său|its|POSS
sa|its|POSS
săi|its|POSS
sale|its|POSS
nostru|our|POSS
noastră|our|POSS
noștri|our|POSS
noastre|our|POSS
vostru|your|POSS
voastră|your|POSS
voștri|your|POSS
voastre|your|POSS
lor|their|POSS
tot|all|QUANT
toată|the whole|QUANT
toți|all|QUANT
toate|all|QUANT
fiecare|each|QUANT
oricare|any|QUANT
orice|any|QUANT
niciun|no|QUANT
nicio|no|QUANT
alt|another|QUANT
altă|another|QUANT
alți|other|QUANT
alte|other|QUANT
celălalt|the other|QUANT
cealaltă|the other|QUANT
ceilalți|the other|QUANT
celelalte|the other|QUANT
câțiva|a few|QUANT
câteva|a few|QUANT
ambii|both|QUANT
ambele|both|QUANT
amândoi|both|QUANT
amândouă|both|QUANT
același|the same|QUANT
aceeași|the same|QUANT
aceiași|the same|QUANT
aceleași|the same|QUANT
primul|the first|ORD
prima|the first|ORD
primii|the first|ORD
primele|the first|ORD
ultimul|the last|ORD
ultima|the last|ORD
ultimii|the last|ORD
ultimele|the last|ORD
penultimul|the second-to-last|ORD
penultima|the second-to-last|ORD
unu|one|NUM
doi|two|NUM
două|two|NUM
trei|three|NUM
patru|four|NUM
cinci|five|NUM
șase|six|NUM
șapte|seven|NUM
opt|eight|NUM
nouă|nine|NUM
zece|ten|NUM
unsprezece|eleven|NUM
doisprezece|twelve|NUM
douăsprezece|twelve|NUM
cincisprezece|fifteen|NUM
douăzeci|twenty|NUM
treizeci|thirty|NUM
patruzeci|forty|NUM
cincizeci|fifty|NUM
șaizeci|sixty|NUM
o sută|one hundred|NUM
sută|hundred|NUM
sute|hundred|NUM
mie|thousand|NUM
mii|thousand|NUM
eu|I|PRON
tu|you|PRON
el|it|PRON
ea|it|PRON
noi|we|PRON
voi|you|PRON
ei|they|PRON
ele|they|PRON
mie|me|PRON
ție|you|PRON
mi|me|CLITIC
îmi|me|CLITIC
ți|you|CLITIC
îți|you|CLITIC
îl|it|CLITIC
îi|it|CLITIC
le|them|CLITIC
ne|us|CLITIC
vă|you|CLITIC
mă|me|CLITIC
te|you|CLITIC
se|·|CLITIC
și|and|CONJ
sau|or|CONJ
ori|or|CONJ
dar|but|CONJ
însă|but|CONJ
apoi|then|CONJ
iar|and|CONJ
deci|so|CONJ
dacă|if|CONJ
că|that|CONJ
ca|as|PREP
decât|than|PREP
de|of|PREP
la|to|PREP
în|in|PREP
pe|on|PREP
cu|with|PREP
fără|without|PREP
pentru|for|PREP
din|from|PREP
dintre|between|PREP
între|between|PREP
lângă|next to|PREP
sub|below|PREP
peste|over|PREP
deasupra|above|PREP
dedesubt|below|PREP
dedesubtul|below|PREP
spre|toward|PREP
către|to|PREP
prin|through|PREP
despre|about|PREP
după|after|PREP
până|until|PREP
conform|according to|PREP
pana|until|PREP
când|when|Q
unde|where|Q
cum|how|Q
ce|what|Q
care|which|Q
cine|who|Q
cât|how much|Q
câtă|how much|Q
câți|how many|Q
câte|how many|Q
să|to|PART
nu|not|NEG
mai|more|ADV
foarte|very|ADV
prea|too|ADV
doar|only|ADV
numai|only|ADV
chiar|even|ADV
aproape|almost|ADV
aproximativ|about|ADV
exact|exactly|ADV
încă|still|ADV
deja|already|ADV
acum|now|ADV
aici|here|ADV
acolo|there|ADV
înapoi|back|ADV
înainte|forward|ADV
sus|up|ADV
jos|down|ADV
încet|slowly|ADV
repede|quickly|ADV
treptat|gradually|ADV
brusc|suddenly|ADV
simultan|simultaneously|ADV
imediat|immediately|ADV
automat|automatically|ADV
complet|completely|ADV
puțin|a little|ADV
mult|a lot|ADV
mereu|always|ADV
întotdeauna|always|ADV
niciodată|never|ADV
alături|next to it|ADV
împreună|together|ADV
separat|separately|ADV
invers|in reverse|ADV
orizontal|horizontally|ADV
vertical|vertically|ADV
uniform|evenly|ADV
egal|evenly|ADV
manual|manually|ADV
constant|constantly|ADV
continuu|continuously|ADV
da|yes|INTJ
mulțumesc|thanks|INTJ
mersi|thanks|INTJ
al|of|GENART
ai|of|GENART
ale|of|GENART
a|of|GENART
va|will|AUX
vor|will|AUX
vei|will|AUX
voi|will|AUX
aș|would|AUX
ar|would|AUX
lui|of|GENPRON
`;

// romanian lemmas (space separated; use base/lemma forms or exact surfaces) => english | tag
// Matching is on lemmas after lexical lookup, so inflected forms match too.
const MWE = `
te rog => please | INTJ
vă rog => please | INTJ
dă clic => click | V
da clic => click | V
dă click => click | V
fă clic => click | V
face clic => click | V
apăsa pe => click on | V
la clic => on click | PP
la click => on click | PP
pe clic => on click | PP
la hover => on hover | PP
pe hover => on hover | PP
la trecere mouse => on hover | PP
cadru cheie => keyframe | N
linie temporală => timeline | N
bază de date => database | N
casetă de text => text box | N
bară de instrumente => toolbar | N
spațiu de lucru => workspace | N
flux de lucru => workflow | N
copie de rezervă => backup | N
tablou de bord => dashboard | N
termen limită => deadline | N
fus orar => time zone | N
notă de subsol => footnote | N
casetă de selectare => checkbox | N
listă derulantă => dropdown list | N
punct de conectare => connection point | N
mărime font => font size | N
dimensiune font => font size | N
listă cu buline => bulleted list | N
listă numerotată => numbered list | N
istoric versiune => version history | N
coș de gunoi => trash | N
drept de editare => edit rights | N
drept de acces => access rights | N
trimite în spate => send to back | V
trimite în fundal => send to back | V
adu în față => bring to front | V
adu în prim-plan => bring to front | V
trimite un nivel în spate => send backward | V
adu un nivel în față => bring forward | V
în spate => to the back | ADV
în fundal => to the back | ADV
în spatele => behind | PREP
în față => to the front | ADV
în prim-plan => to the front | ADV
în jos => down | ADV
în sus => up | ADV
la stânga => to the left | ADV
la dreapta => to the right | ADV
spre stânga => to the left | ADV
spre dreapta => to the right | ADV
colț din stânga sus => top left corner | N
colț din dreapta sus => top right corner | N
colț din stânga jos => bottom left corner | N
colț din dreapta jos => bottom right corner | N
colț stânga sus => top left corner | N
colț dreapta sus => top right corner | N
colț stânga jos => bottom left corner | N
colț dreapta jos => bottom right corner | N
de sus => top | ADJ
de jos => bottom | ADJ
de pe => from | PREP
de sub => from under | PREP
de lângă => from next to | PREP
din spatele => from behind | PREP
la sută => percent | N
încă un => another | QUANT
încă o => another | QUANT
în stânga => on the left | ADV
în dreapta => on the right | ADV
pe stânga => on the left | ADV
pe dreapta => on the right | ADV
din stânga => on the left | ADV
din dreapta => on the right | ADV
în partea de sus => at the top | ADV
în partea de jos => at the bottom | ADV
partea de sus => the top | N
partea de jos => the bottom | N
în partea stângă => on the left side | ADV
în partea dreaptă => on the right side | ADV
partea stângă => the left side | N
partea dreaptă => the right side | N
în centru => in the center | ADV
la centru => in the center | ADV
în mijloc => in the middle | ADV
la mijloc => in the middle | ADV
stânga sus => top left | ADV
dreapta sus => top right | ADV
stânga jos => bottom left | ADV
dreapta jos => bottom right | ADV
sus în stânga => top left | ADV
sus în dreapta => top right | ADV
jos în stânga => bottom left | ADV
jos în dreapta => bottom right | ADV
de sus în jos => from top to bottom | ADV
de jos în sus => from bottom to top | ADV
mai mare => larger | ADJ
mai mic => smaller | ADJ
mai repede => faster | ADV
mai rapid => faster | ADJ
mai încet => slower | ADV
mai lent => slower | ADJ
mai gros => thicker | ADJ
mai subțire => thinner | ADJ
mai deschis => lighter | ADJ
mai închis => darker | ADJ
mai lung => longer | ADJ
mai scurt => shorter | ADJ
mai lat => wider | ADJ
mai îngust => narrower | ADJ
mai înalt => taller | ADJ
mai mult => more | ADV
mai puțin => less | ADV
mai mulți => several | QUANT
mai multe => several | QUANT
cel mai => the most | ADV
de două ori => twice | ADV
de trei ori => three times | ADV
o dată => once | ADV
încă o dată => once more | ADV
din nou => again | ADV
la infinit => indefinitely | ADV
la nesfârșit => forever | ADV
fără oprire => nonstop | ADV
în buclă => in a loop | ADV
pe rând => one by one | ADV
unul după altul => one after another | ADV
unul după celălalt => one after another | ADV
în același timp => at the same time | ADV
în timp ce => while | CONJ
după ce => after | CONJ
înainte de => before | PREP
înainte să => before | CONJ
imediat după => right after | PREP
pune pauză => pause | V
pune pe pauză => pause | V
o să => will | AUX
aș vrea => I would like | VMOD
aș dori => I would like | VMOD
ar trebui => should | VMOD
este posibil => is it possible | VMOD
e posibil => is it possible | VMOD
se poate => is it possible | VMOD
cum pot => how can I | QV
cum fac => how do I | QV
cum să => how to | QV
unde găsesc => where do I find | QV
unde pot => where can I | QV
de ce => why | Q
cât durează => how long does it take | QV
ce este => what is | QV
ce e => what is | QV
care este => what is | QV
care e => what is | QV
în loc de => instead of | PREP
în afară de => except | PREP
fade in => fade-in | N
fade out => fade-out | N
ultima dată => last | ADV
fă ca => make | V
face ca => make | V
pe italic => to italic | ADV
pe bold => to bold | ADV
pe aldin => to bold | ADV
pe cursiv => to italic | ADV
în funcție de => depending on | PREP
pe baza => based on | PREP
față de => relative to | PREP
împreună cu => together with | PREP
cu excepția => except | PREP
în jurul => around | PREP
în interiorul => inside | PREP
în afara => outside | PREP
de-a lungul => along | PREP
în timpul => during | PREP
la sfârșitul => at the end of | PREP
la începutul => at the beginning of | PREP
la final => at the end | ADV
la sfârșit => at the end | ADV
la început => at the beginning | ADV
de la => from | PREP
până la => up to | PREP
nu mai => no longer | NEG
la fel => the same | ADV
la fel de => as | ADV
cât mai => as | ADV
apariție treptată => fade-in | N
dispariție treptată => fade-out | N
estompare la intrare => fade-in | N
estompare la ieșire => fade-out | N
al doilea => the second | ORD
a doua => the second | ORD
al treilea => the third | ORD
a treia => the third | ORD
al patrulea => the fourth | ORD
a patra => the fourth | ORD
al cincilea => the fifth | ORD
a cincea => the fifth | ORD
ca să => so that | CONJ
pentru că => because | CONJ
câte unul => one at a time | ADV
în format => in format | PREP
o sută => one hundred | NUM
`;

// Word-sense contexts for the VSA sense disambiguator.
// lemma => [ [english, "context lemmas..."], ... ]  first sense is the default.
const SENSES = {
  'anula': [['undo', 'modificare schimbare pas actiune ultim editare stergere mutare'], ['cancel', 'export descarcare invitatie operatiune abonament salvare cerere programare']],
  'rula': [['run', 'script cod test comanda export proces'], ['play', 'animatie video clip secventa cronologie efect timeline tranzitie']],
  'porni': [['start', 'proces server sesiune program'], ['play', 'animatie video clip secventa efect timeline']],
  'mari': [['increase', 'viteza durata opacitate font dimensiune marime spatiere zoom interlinie grosime latime inaltime'], ['enlarge', 'imagine forma cerc caseta nod dreptunghi logo poza']],
  'micsora': [['reduce', 'viteza durata opacitate font dimensiune marime spatiere zoom grosime latime inaltime'], ['shrink', 'imagine forma cerc caseta nod dreptunghi logo poza']],
  'dubla': [['duplicate', 'nod caseta forma strat element obiect pagina slide cadru'], ['double', 'dimensiune marime latime inaltime viteza durata grosime']],
  'ingrosa': [['thicken', 'linie contur chenar sageata conector bordura'], ['bold', 'text titlu font cuvant litera paragraf eticheta']],
  'incarca': [['upload', 'fisier imagine server cloud poza document'], ['load', 'sablon tema date configurare model']],
  'pune': [['put', 'cerc nod caseta forma imagine sageata colt centru'], ['set', 'durata opacitate culoare viteza intarziere latime inaltime dimensiune marime font valoare']],
  'incarcare': [['upload', 'fisier imagine server document poza'], ['load', 'pagina aplicatie sablon date ecran']],
  'intrare': [['input', 'proces date camp nod formular'], ['entrance', 'animatie efect aparitie estompare tranzitie']],
  'iesire': [['output', 'proces date camp nod formular'], ['exit', 'animatie efect disparitie estompare tranzitie']],
  'copie': [['copy', 'fisier document pagina slide nod strat face'], ['child', 'nod parinte arbore ierarhie']],
  'drept': [['right', 'parte colt latura margine coloana panou bara mana'], ['straight', 'linie sageata conector muchie']],
  'dreapta': [['right', 'parte colt latura margine coloana panou bara muta aliniaza'], ['straight line', 'deseneaza traseaza']],
  'margine': [['margin', 'pagina document tiparire hartie'], ['edge', 'caseta forma nod imagine dreptunghi ecran panza']],
  'trage': [['drag', 'nod caseta forma element mouse cursor'], ['draw', 'linie sageata conector']],
  'cadru': [['frame', '']],
  'deschis': [['open', 'fisier document proiect panou meniu fereastra'], ['light', 'albastru verde rosu gri galben mov roz maro culoare']],
  'inchis': [['closed', 'fisier document proiect panou meniu fereastra'], ['dark', 'albastru verde rosu gri galben mov roz maro culoare']],
  'sus': [['up', 'muta deplasa misca glisa trage derula'], ['top', 'aliniaza colt parte margine pozitioneaza plaseaza']],
  'jos': [['down', 'muta deplasa misca glisa trage derula'], ['bottom', 'aliniaza colt parte margine pozitioneaza plaseaza']],
  'rand': [['row', 'tabel celula coloana grila'], ['line', 'text paragraf']],
  'parte': [['side', ''], ['part', 'document text proces']],
  'model': [['template', 'document prezentare diagrama'], ['model', 'date entitate clasa']],
  'termen': [['deadline', 'sarcina proiect livrare'], ['term', 'cuvant glosar']],
};

const L = { VERBS, NOUNS, ADJ, FUNC, MWE, SENSES };
if (typeof module !== 'undefined' && module.exports) module.exports = L; else root.RO_EN_LEXICON = L;
})(typeof window !== 'undefined' ? window : globalThis);

  ; return module.exports; })();
  var ENGINE = (function () { var module = { exports: {} }; // VSA (hyperdimensional) Romanian -> English command translator.
// Runs in the browser or Node. No model download: lexicon + code only.
//
// What is VSA here (and what is not):
//  * Lexical item memory: every known Romanian word form is a binary hypervector
//    built from character trigrams (trigram = rho^2(c1) XOR rho(c2) XOR c3, bundled
//    by majority). Unknown spellings (no diacritics, typos, unseen inflections) are
//    resolved by nearest-neighbour cleanup in Hamming space.
//  * Word-sense choice: each ambiguous lemma has sense prototypes = bundles of
//    context-lemma hypervectors; the sentence context is compared against them.
//  * Phrases and Romanian->English word order are handled by a small symbolic rule
//    layer (noun-adjective swap, genitives, clitics, prepositions, questions).
(function (root) {
'use strict';

// ---------------------------------------------------------------- utilities
function strip(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function popcnt(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
}

// ---------------------------------------------------------------- hypervectors
function makeHD(D) {
  const W = D >>> 5;
  function rand(seedStr) {
    let s = fnv(seedStr) || 1;
    const v = new Uint32Array(W);
    for (let i = 0; i < W; i++) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; v[i] = s; }
    return v;
  }
  function rot(v, k) { // permutation rho^k: rotate by k words
    const o = new Uint32Array(W);
    for (let i = 0; i < W; i++) o[(i + k) % W] = v[i];
    return o;
  }
  function ham(a, b) {
    let d = 0;
    for (let i = 0; i < W; i++) d += popcnt(a[i] ^ b[i]);
    return d;
  }
  function sim(a, b) { return 1 - ham(a, b) / D; }
  const tie = rand('__tie__');
  // Bit-sliced majority: per-bit counters kept as bit planes, updated with ripple-carry adders
  // on whole 32-bit words (≈30x faster than counting bit by bit). Used when all weights are 1.
  function bundleSliced(vecs) {
    const P = 7, planes = [];
    for (let p = 0; p < P; p++) planes.push(new Uint32Array(W));
    for (const v of vecs) {
      for (let i = 0; i < W; i++) {
        let carry = v[i];
        for (let p = 0; p < P && carry; p++) { const pl = planes[p]; const nc = pl[i] & carry; pl[i] ^= carry; carry = nc; }
      }
    }
    const total = vecs.length, T = total >> 1, out = new Uint32Array(W);
    for (let i = 0; i < W; i++) {
      let gt = 0, eq = 0xFFFFFFFF;
      for (let b = P - 1; b >= 0; b--) {
        const pb = planes[b][i];
        if ((T >> b) & 1) eq &= pb; else { gt |= eq & pb; eq &= ~pb; }
      }
      out[i] = (total & 1 ? gt : (gt | (eq & tie[i]))) >>> 0;
    }
    return out;
  }
  function bundle(vecs, weights) {
    if ((!weights || weights.every(x => x === 1)) && vecs.length < 127) return bundleSliced(vecs);
    const cnt = new Int32Array(D);
    let total = 0;
    for (let k = 0; k < vecs.length; k++) {
      const v = vecs[k], w = weights ? weights[k] : 1;
      total += w;
      for (let i = 0; i < W; i++) {
        let x = v[i]; const base = i << 5;
        for (let b = 0; b < 32; b++) { if (x & 1) cnt[base + b] += w; x >>>= 1; }
      }
    }
    const out = new Uint32Array(W);
    for (let i = 0; i < W; i++) {
      let word = 0; const base = i << 5;
      for (let b = 0; b < 32; b++) {
        const c = cnt[base + b] * 2;
        const bit = c > total ? 1 : c < total ? 0 : (tie[i] >>> b) & 1;
        word |= bit << b;
      }
      out[i] = word >>> 0;
    }
    return out;
  }
  return { D, W, rand, rot, ham, sim, bundle };
}

// ---------------------------------------------------------------- English morphology
const IRR_PL = { child: 'children', person: 'people', axis: 'axes', series: 'series', datum: 'data', half: 'halves', mouse: 'mice', index: 'indices', vertex: 'vertices' };
function enPlural(w) {
  const parts = w.split(' '); const last = parts.pop();
  let p;
  if (IRR_PL[last]) p = IRR_PL[last];
  else if (/(s|x|z|ch|sh)$/.test(last)) p = last + 'es';
  else if (/[^aeiou]y$/.test(last)) p = last.slice(0, -1) + 'ies';
  else p = last + 's';
  return parts.concat(p).join(' ');
}
const IRR_PART = { make: 'made', put: 'put', cut: 'cut', set: 'set', draw: 'drawn', write: 'written', show: 'shown', hide: 'hidden', choose: 'chosen', bring: 'brought', take: 'taken', send: 'sent', find: 'found', run: 'run', begin: 'begun', become: 'become', see: 'seen', give: 'given', tell: 'told', keep: 'kept', leave: 'left', build: 'built', go: 'gone', have: 'had', be: 'been', can: 'been able to', split: 'split', fit: 'fit', undo: 'undone', redo: 'redone', 'find out': 'found out', stay: 'stayed', lose: 'lost', read: 'read', 'speed up': 'sped up', 'slow down': 'slowed down', 'make sure': 'made sure', spin: 'spun' };
const DOUBLE = new Set(['stop', 'cut', 'set', 'drag', 'run', 'pin', 'put', 'begin', 'drop', 'crop', 'skip', 'trim', 'snap', 'tag', 'zip', 'flip', 'plan', 'wrap', 'grab', 'swap', 'ship', 'spin', 'shop', 'chop']);
function enInflect(base, form) {
  if (IRR_PART[base] && form === 'part') return IRR_PART[base];
  const parts = base.split(' '); let v = parts[0]; const rest = parts.slice(1);
  if (form === 'part') {
    if (IRR_PART[v]) v = IRR_PART[v];
    else if (DOUBLE.has(v)) v = v + v.slice(-1) + 'ed';
    else if (/e$/.test(v)) v = v + 'd';
    else if (/[^aeiou]y$/.test(v)) v = v.slice(0, -1) + 'ied';
    else v = v + 'ed';
  } else if (form === 'ing') {
    if (DOUBLE.has(v)) v = v + v.slice(-1) + 'ing';
    else if (/[^e]e$/.test(v) && v !== 'be') v = v.slice(0, -1) + 'ing';
    else v = v + 'ing';
  } else if (form === '3sg') {
    const irr = { be: 'is', have: 'has', can: 'can', must: 'must', do: 'does', go: 'goes' };
    if (irr[v]) v = irr[v];
    else if (/(s|x|z|ch|sh|o)$/.test(v)) v = v + 'es';
    else if (/[^aeiou]y$/.test(v)) v = v.slice(0, -1) + 'ies';
    else v = v + 's';
  }
  return [v].concat(rest).join(' ');
}

// ---------------------------------------------------------------- Romanian form generation
function guessNounFeats(f, lemma) {
  if (/lor$/.test(f)) return { num: 'pl', def: true, gen: true };
  if (/(ul|ua|a)$/.test(f) && f !== lemma) return { num: 'sg', def: true };
  if (/(ului|ei|ii)$/.test(f)) return { num: 'sg', def: true, gen: true };
  if (/le$/.test(f)) return { num: 'pl', def: true };
  return { num: 'sg', def: false };
}
function nounForms(lemma, pl, g) {
  const F = [];
  F.push([lemma, { num: 'sg', def: false }]);
  if (pl && pl !== lemma) F.push([pl, { num: 'pl', def: false }]);
  else if (pl === lemma) F[0][1] = { num: 'sg', def: false, alsoPl: true };
  let def = null;
  if (g === 'f') {
    if (/ă$/.test(lemma)) def = lemma.slice(0, -1) + 'a';
    else if (/ie$/.test(lemma)) def = lemma.slice(0, -1) + 'a';
    else if (/e$/.test(lemma)) def = lemma + 'a';
    else if (/a$/.test(lemma)) def = lemma; // stânga, dreapta
  } else {
    if (/[ăa]$/.test(lemma)) def = null;
    else if (/u$/.test(lemma)) def = lemma + 'l';
    else if (/e$/.test(lemma)) def = lemma + 'le';
    else if (/o$/.test(lemma)) def = lemma + 'ul';
    else def = lemma + 'ul';
  }
  if (def) F.push([def, { num: 'sg', def: true }]);
  // genitive singular
  let gen = null;
  if (g === 'f') {
    if (/ie$/.test(lemma)) gen = lemma + 'i';
    else if (pl && /[ie]$/.test(pl)) gen = pl + 'i';
  } else if (def) {
    gen = /e$/.test(lemma) ? lemma + 'lui' : def + 'ui';
  }
  if (gen) F.push([gen, { num: 'sg', def: true, gen: true }]);
  if (pl) {
    const defPl = (g === 'm' && /i$/.test(pl)) ? pl + 'i' : pl + 'le';
    F.push([defPl, { num: 'pl', def: true }]);
    F.push([pl + 'lor', { num: 'pl', def: true, gen: true }]);
  }
  return F;
}
function guessVerbFeats(f) {
  if (/(ați|eți|iți|âți)$/.test(f)) return ['2pl', 'imp'];
  if (/(ând|ind)$/.test(f)) return ['ger'];
  if (f.length > 3 && /(at|it|ut|ât|s|ns)$/.test(f)) return ['part', 'fin'];
  return ['fin', 'imp'];
}
function verbForms(inf, cls, extras) {
  const F = [[inf, ['inf']]];
  const st = inf.slice(0, -1);
  if (cls === 'ez') {
    F.push([st + 'ez', ['fin', '1sg']], [st + 'ezi', ['fin']], [st + 'ează', ['fin', 'imp', '3sg']], [st + 'ăm', ['fin']],
      [st + 'ați', ['2pl', 'imp']], [st + 'eze', ['subj']], [st + 'at', ['part']], [st + 'ând', ['ger']]);
  } else if (cls === 'esc') {
    F.push([st + 'esc', ['fin', '1sg']], [st + 'ești', ['fin']], [st + 'ește', ['fin', 'imp', '3sg']], [st + 'im', ['fin']],
      [st + 'iți', ['2pl', 'imp']], [st + 'ească', ['subj']], [st + 'it', ['part']], [st + 'ind', ['ger']]);
  } else if (cls === 'a') {
    F.push([st, ['fin', '1sg']], [st + 'ă', ['fin', 'imp', '3sg']], [st + 'ăm', ['fin']], [st + 'ați', ['2pl', 'imp']],
      [st + 'e', ['subj']], [st + 'at', ['part']], [st + 'ând', ['ger']]);
  } else if (cls === 'e') {
    F.push([st, ['fin', '1sg']], [st + 'i', ['fin']], [inf, ['fin', 'imp', '3sg']], [st + 'em', ['fin']], [st + 'eți', ['2pl', 'imp']],
      [st + 'ă', ['subj']], [st + 'ând', ['ger']]);
  } else if (cls === 'i') {
    F.push([st, ['fin', '1sg']], [st + 'im', ['fin']], [st + 'iți', ['2pl', 'imp']], [st + 'it', ['part']], [st + 'ind', ['ger']]);
  }
  for (const x of extras) F.push([x, guessVerbFeats(x)]);
  // participles used as adjectives agree in gender/number: rezolvat -> rezolvată, rezolvați, rezolvate
  for (const [f, feats] of F.slice()) {
    if (!feats.includes('part')) continue;
    let m;
    if ((m = /^(.*)(at|it|ut|ât)$/.exec(f))) { const b = m[1], v = m[2][0]; F.push([b + v + 'tă', ['part', 'adj']], [b + v + 'ți', ['part', 'adj']], [b + v + 'te', ['part', 'adj']]); }
    else if (/s$/.test(f)) F.push([f + 'ă', ['part', 'adj']], [f.slice(0, -1) + 'și', ['part', 'adj']], [f + 'e', ['part', 'adj']]);
  }
  return F;
}
function adjForms(m, f, mpl, fpl) {
  const F = [[m, { g: 'm', num: 'sg' }], [f, { g: 'f', num: 'sg' }], [mpl, { num: 'pl' }], [fpl, { num: 'pl' }]];
  // definite forms (used after nouns rarely, and as substantives)
  if (!/[aăeiouâî]$/.test(m)) F.push([m + 'ul', { g: 'm', num: 'sg', def: true }]);
  if (/ă$/.test(f)) F.push([f.slice(0, -1) + 'a', { g: 'f', num: 'sg', def: true }]);
  return F;
}

// ---------------------------------------------------------------- lexicon loading
function parseLines(txt) { return txt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')); }

function createTranslator(LEX, opts) {
  opts = Object.assign({ D: 2048, threshold: 0.70, ngrams: [2, 3], firstLetter: true, confidentSim: 0.75 }, opts || {});
  const HD = makeHD(opts.D);
  const t0 = (typeof performance !== 'undefined' ? performance : Date).now();

  const surf = new Map();   // stripped surface -> [analysis]
  const lemmaInfo = new Map();
  function addForm(surface, an) {
    const key = strip(surface);
    an.orig = surface.toLowerCase();
    if (!surf.has(key)) surf.set(key, []);
    const arr = surf.get(key);
    // merge identical lemma+pos analyses
    const ex = arr.find(a => a.pos === an.pos && a.lemma === an.lemma && a.tag === an.tag);
    if (ex) {
      if (an.pos === 'V') ex.feats = Array.from(new Set(ex.feats.concat(an.feats)));
      else if (an.pos === 'N' || an.pos === 'A') {
        if (!!ex.feats.def !== !!an.feats.def) ex.feats.def = 'amb';
        if (ex.feats.num !== an.feats.num) ex.feats.alsoPl = true;
      }
      return;
    }
    arr.push(an);
  }

  for (const l of parseLines(LEX.VERBS)) {
    const [inf, cls, en, extra] = l.split('|');
    const lemma = strip(inf);
    const ex = extra ? extra.split(',').map(s => s.trim()).filter(Boolean) : [];
    lemmaInfo.set(lemma + ':V', { en });
    for (const [s, feats] of verbForms(inf, cls, ex)) addForm(s, { pos: 'V', lemma, en, feats: feats.slice() });
  }
  for (const l of parseLines(LEX.NOUNS)) {
    const p = l.split('|');
    const [lem, pl, g, enRaw] = p;
    const lemma = strip(lem);
    let en = enRaw, enPl = null;
    const m = /^(.*);pl=(.*)$/.exec(enRaw);
    if (m) { en = m[1]; enPl = m[2]; }
    if (lemmaInfo.has(lemma + ':N')) continue;
    lemmaInfo.set(lemma + ':N', { en });
    const forms = nounForms(lem, pl, g);
    if (p[4]) for (const x of p[4].split(',')) forms.push([x.trim(), guessNounFeats(strip(x.trim()), lemma)]);
    for (const [s, feats] of forms) addForm(s, { pos: 'N', lemma, en, enPl, feats: Object.assign({ g }, feats) });
  }
  for (const l of parseLines(LEX.ADJ)) {
    const [m, f, mpl, fpl, en] = l.split('|');
    const lemma = strip(m);
    for (const [s, feats] of adjForms(m, f, mpl, fpl)) addForm(s, { pos: 'A', lemma, en, feats });
  }
  const funcSet = new Set();
  for (const l of parseLines(LEX.FUNC)) {
    const [s, en, tag] = l.split('|');
    if (s.includes(' ')) continue;
    funcSet.add(strip(s));
    addForm(s, { pos: 'F', tag, lemma: strip(s), en, feats: {} });
  }
  // MWEs: list of word arrays (stripped)
  const COLORS = ['rosu', 'albastru', 'verde', 'galben', 'gri', 'mov', 'violet', 'roz', 'maro', 'portocaliu', 'turcoaz', 'cenusiu'];
  const extraMwe = [];
  for (const c of COLORS) {
    const en = (surf.get(c) || []).find(a => a.pos === 'A');
    if (!en) continue;
    extraMwe.push(c + ' deschis => light ' + en.en + ' | ADJ', c + ' inchis => dark ' + en.en + ' | ADJ', c + ' aprins => bright ' + en.en + ' | ADJ');
  }
  const MWES = parseLines(LEX.MWE + '\n' + extraMwe.join('\n')).map(l => {
    const [ro, rest] = l.split('=>');
    const [en, tag] = rest.split('|').map(s => s.trim());
    return { words: ro.trim().split(/\s+/).map(strip), en, tag };
  }).sort((a, b) => b.words.length - a.words.length);
  const mweByFirst = new Map();
  for (const m of MWES) { const k = m.words[0]; if (!mweByFirst.has(k)) mweByFirst.set(k, []); mweByFirst.get(k).push(m); }

  // ---------- VSA item memory over content-word surface forms
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789#-';
  const C = {}, C1 = {}, C2 = {};
  for (const ch of alphabet) { C[ch] = HD.rand('char:' + ch); C1[ch] = HD.rot(C[ch], 1); C2[ch] = HD.rot(C[ch], 2); }
  const CR = {};
  function charv(ch, t) {
    const k = ch + t;
    if (!CR[k]) { if (!C[ch]) C[ch] = HD.rand('char:' + ch); CR[k] = t === 0 ? C[ch] : HD.rot(C[ch], t); }
    return CR[k];
  }
  const NG = opts.ngrams || [2, 3], STEMW = opts.stemWeight || 1;
  function encodeWord(key) {
    const s = '#' + key + '#';
    const vecs = [], w = [];
    for (const n of NG) {
      if (n === 's') { // skip-bigram (c_i, c_i+2): tolerant to transpositions/substitutions
        for (let i = 0; i + 3 <= s.length; i++) {
          const a = charv(s[i], 3), b = charv(s[i + 2], 0), v = new Uint32Array(HD.W);
          for (let k = 0; k < HD.W; k++) v[k] = a[k] ^ b[k];
          vecs.push(v); w.push(1);
        }
        continue;
      }
      for (let i = 0; i + n <= s.length; i++) {
        // n-gram = rho^(n-1)(c1) XOR ... XOR rho^0(cn)   (permutation encodes position inside the n-gram)
        const v = new Uint32Array(HD.W);
        for (let t = 0; t < n; t++) { const cv = charv(s[i + t], n - 1 - t); for (let k = 0; k < HD.W; k++) v[k] ^= cv[k]; }
        vecs.push(v); w.push(i < 2 ? STEMW : 1);
      }
    }
    return HD.bundle(vecs, w);
  }
  const itemKeys = [], itemVecs = [], byFirst = new Map();
  let memoryMs = null;
  function ensureMemory() {
    if (memoryMs !== null) return;
    const tm = (typeof performance !== 'undefined' ? performance : Date).now();
    for (const [key, ans] of surf) {
      if (key.length < 4) continue;
      if (!ans.some(a => a.pos !== 'F')) continue;
      itemKeys.push(key); itemVecs.push(encodeWord(key));
      const f = key[0]; if (!byFirst.has(f)) byFirst.set(f, []); byFirst.get(f).push(itemKeys.length - 1);
    }
    memoryMs = Math.round((typeof performance !== 'undefined' ? performance : Date).now() - tm);
  }
  // ---------- VSA sense prototypes
  const lemmaVecCache = new Map();
  function lemmaVec(k) { if (!lemmaVecCache.has(k)) lemmaVecCache.set(k, HD.rand('lemma:' + k)); return lemmaVecCache.get(k); }
  const SENSES = {};
  for (const lem in LEX.SENSES) {
    SENSES[lem] = LEX.SENSES[lem].map(([en, ctx]) => ({ en, ctx: ctx.split(/\s+/).filter(Boolean).map(lemmaVec) }));
  }
  const buildMs = (typeof performance !== 'undefined' ? performance : Date).now() - t0;

  function cleanup(key) {
    ensureMemory();
    const q = encodeWord(key);
    let best = -1, bi = -1, second = -1;
    const pool = opts.firstLetter === false ? itemVecs.map((_, i) => i) : (byFirst.get(key[0]) || []);
    for (const i of pool) {
      const s = HD.sim(q, itemVecs[i]);
      if (s > best) { second = best; best = s; bi = i; } else if (s > second) second = s;
    }
    return { key: itemKeys[bi], sim: best, margin: best - second };
  }

  // ---------------------------------------------------------------- tokenizer
  const CLITIC_SUFFIX = new Set(['l', 'o', 'i', 'le', 'mi', 'ti', 'ne', 'va', 'ma', 'te', 'se', 'si', 'ii', 'li']);
  const LOAN_SUFFIX = { ul: { num: 'sg', def: true }, ului: { num: 'sg', def: true, gen: true }, uri: { num: 'pl' }, urile: { num: 'pl', def: true }, urilor: { num: 'pl', def: true, gen: true }, ul_: {}, lui: { num: 'sg', def: true, gen: true }, le: { num: 'pl', def: true }, a: { num: 'sg', def: true }, ei: { num: 'sg', def: true, gen: true }, i: { num: 'pl' }, ii: { num: 'pl', def: true }, ilor: { num: 'pl', def: true, gen: true }, rile: { num: 'pl', def: true } };
  function tokenize(text) {
    const toks = [];
    const re = /\b\d{1,2}:\d{2}\b|[\p{L}\d_-]+\.(?:csv|pdf|svg|png|jpe?g|json|xml|xlsx?|docx?|pptx?|txt|html?|md|gif|mp4|zip)\b|[\p{L}\d]+(?:_[\p{L}\d]+)+|"[^"]*"|„[^”"]*[”"]|“[^”]*”|«[^»]*»|'[^']{2,}'|#[0-9a-fA-F]{3,8}\b|\d+(?:[.,]\d+)?(?:-(?:lea|a))?(?:\s?(?:%|px|ms|pt|fps|deg|°))?(?![\p{L}\d])|\d+(?:[.,]\d+)?[\p{L}]+|[\p{L}\d_]+(?:-[\p{L}\d_]+)*|[.,!?;:()]/gu;
    let m;
    while ((m = re.exec(text))) {
      const t = m[0];
      if (/^\d{1,2}:\d{2}$/.test(t)) { toks.push({ kind: 'LIT', text: t, time: true }); continue; }
      if (/\.[a-z0-9]{2,4}$/i.test(t) && !/^\d/.test(t) || /_/.test(t)) { toks.push({ kind: 'LIT', text: t, ident: true }); continue; }
      if (/^["„“«']/.test(t)) { toks.push({ kind: 'LIT', text: '"' + t.slice(1, -1) + '"', quoted: true }); continue; }
      if (/^#[0-9a-f]/i.test(t)) { toks.push({ kind: 'LIT', text: t, hex: true }); continue; }
      if (/^\d+-(lea|a)$/.test(t)) { const n = parseInt(t); toks.push({ kind: 'ORDN', text: t, en: 'the ' + n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th') }); continue; }
      if (/^\d/.test(t)) { toks.push({ kind: 'NUMLIT', text: t.replace(/(\d),(\d)/, '$1.$2') }); continue; }
      if (/^[.,!?;:()]$/.test(t)) { toks.push({ kind: 'PUNCT', text: t }); continue; }
      // hyphenated forms
      if (t.includes('-')) {
        const parts = t.split('-');
        const lp = strip(parts[0]);
        // într-un, dintr-o, printr-un
        if (/^(intr|dintr|printr)$/.test(lp) && parts.length === 2) {
          toks.push({ kind: 'W', text: lp === 'intr' ? 'în' : lp === 'dintr' ? 'din' : 'prin' });
          toks.push({ kind: 'W', text: parts[1] });
          continue;
        }
        // pre-verbal clitic + aux: l-am, i-am, s-a, s-o, n-am, mi-a
        if (['l', 'i', 's', 'n', 'mi', 'ti', 'v', 'ne', 'le', 'm'].includes(lp) && parts.length === 2) {
          const map = { l: '-l', i: '-i', s: 'se', n: 'nu', mi: '-mi', ti: '-ți', v: '-vă', ne: '-ne', le: '-le', m: '-mă' };
          if (lp === 's' && strip(parts[1]) === 'o') { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-o' }); continue; }
          toks.push({ kind: 'W', text: map[lp] }); toks.push({ kind: 'W', text: parts[1] }); continue;
        }
        if (lp === 'nu' && parts.length === 2) { toks.push({ kind: 'W', text: 'nu' }); toks.push({ kind: 'W', text: '-' + parts[1] }); continue; }
        if (lp === 'sa' && parts.length === 2) { toks.push({ kind: 'W', text: 'să' }); toks.push({ kind: 'W', text: '-' + parts[1] }); continue; }
        // known hyphenated word (prim-plan, e-mail, de-a)
        if (surf.has(strip(t))) { toks.push({ kind: 'W', text: t }); continue; }
        const last = strip(parts[parts.length - 1]);
        const head = parts.slice(0, -1).join('-');
        // verb + clitic(s): mută-l, adaugă-i, dă-mi-l
        if (CLITIC_SUFFIX.has(last) && parts.length >= 2) {
          let k = parts.length - 1;
          const cl = [];
          while (k > 0 && CLITIC_SUFFIX.has(strip(parts[k]))) { cl.unshift('-' + parts[k]); k--; }
          const base = parts.slice(0, k + 1).join('-');
          // loanword + article ambiguity (e.g. "PDF-ul" handled below); clitics only after lowercase words
          if (!/^[A-Z0-9]+$/.test(base)) {
            toks.push({ kind: 'W', text: base });
            for (const c of cl) toks.push({ kind: 'W', text: c });
            continue;
          }
        }
        // loanword/acronym + Romanian article: PDF-ul, layer-ul, mouse-ului, SVG-uri
        if (LOAN_SUFFIX[last] && parts.length >= 2) {
          toks.push({ kind: 'W', text: head, loanFeats: LOAN_SUFFIX[last] });
          continue;
        }
        toks.push({ kind: 'W', text: t });
        continue;
      }
      toks.push({ kind: 'W', text: t });
    }
    let first = true;
    for (const t of toks) {
      if (t.kind === 'PUNCT' && /[.!?]/.test(t.text)) { first = true; continue; }
      if (t.kind === 'W') { t.first = first; t.cap = /^\p{Lu}/u.test(t.text) && !/^\p{Lu}+$/u.test(t.text) ; t.acr = /^[\p{Lu}\d]{2,}$/u.test(t.text); first = false; }
      else if (t.kind !== 'PUNCT') first = false;
    }
    return toks;
  }

  // ---------------------------------------------------------------- lexical analysis
  const CLITIC_EN = { '-l': ['it', 'acc'], '-o': ['it', 'acc'], '-le': ['them', 'acc'], '-i': ['it', 'dat?'], '-ii': ['it', 'dat?'], '-li': ['them', 'acc'], '-mi': ['me', 'dat'], '-ti': ['you', 'dat'], '-ne': ['us', 'dat'], '-va': ['you', 'dat'], '-ma': ['me', 'acc'], '-te': ['you', 'acc'], '-se': ['', 'refl'], '-si': ['', 'refl'] };
  function analyze(tok, stats) {
    const key = strip(tok.text);
    if (key.startsWith('-')) {
      const c = CLITIC_EN[key];
      return [{ pos: 'F', tag: 'POSTCLITIC', lemma: key, en: c ? c[0] : 'it', feats: { kase: c ? c[1] : 'acc' } }];
    }
    if (tok.loanFeats) {
      const hit = surf.get(key);
      const n = hit && hit.find(a => a.pos === 'N');
      if (n) return [Object.assign({}, n, { feats: Object.assign({}, n.feats, tok.loanFeats) })];
      return [{ pos: 'N', lemma: key, en: tok.text, enPl: /^[A-Z0-9]+$/.test(tok.text) ? tok.text + 's' : null, feats: Object.assign({}, tok.loanFeats), loan: true }];
    }
    if (tok.acr && !surf.has(key)) { stats.unknown++; return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, unknown: true, acr: true }]; }
    if (surf.has(key)) {
      stats.exact++;
      let ans = surf.get(key).map(a => Object.assign({}, a, { feats: Array.isArray(a.feats) ? a.feats.slice() : Object.assign({}, a.feats), how: 'exact' }));
      // diacritics-aware preference: if input carried diacritics, prefer analyses with the same spelling
      const low = tok.text.toLowerCase();
      if (low !== key) {
        const same = ans.filter(a => a.orig === low);
        if (same.length) ans = same.concat(ans.filter(a => a.orig !== low && a.pos !== 'F'));
      } else if (key === 'ca') {
        ans = ans.filter(a => a.tag !== 'CONJ').concat(ans.filter(a => a.tag === 'CONJ'));
      }
      return ans;
    }
    if (key.length >= 4 && !(tok.cap && !tok.first)) {
      const c = cleanup(key);
      const thr = key.length <= 5 ? opts.threshold + 0.04 : opts.threshold;
      if (c.sim >= thr) {
        stats.vsa++;
        stats.vsaLog.push(tok.text + '→' + c.key + ' (' + c.sim.toFixed(2) + ')');
        stats.vsaPairs.push([tok.text, c.key, c.sim]);
        return surf.get(c.key).filter(a => a.pos !== 'F').map(a => Object.assign({}, a, { feats: Array.isArray(a.feats) ? a.feats.slice() : Object.assign({}, a.feats), how: 'vsa', sim: c.sim, match: c.key }));
      }
    }
    stats.unknown++;
    return [{ pos: 'LIT', lemma: key, en: tok.text, feats: {}, unknown: true, label: tok.cap && !tok.first }];
  }

  const isNounish = a => a && (a.pos === 'N' || a.pos === 'LIT' && !a.quoted);
  function has(cands, pred) { return cands && cands.some(pred); }

  // choose one analysis per token using local context
  function choose(items) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.cands.length === 1) { it.a = it.cands[0]; continue; }
      const prev = items[i - 1], next = items[i + 1];
      const prevA = prev && (prev.a || prev.cands[0]);
      const pc = prev ? prev.cands : null, nc = next ? next.cands : null;
      const clauseStart = !prev || prev.kind === 'PUNCT' || (prevA && prevA.pos === 'F' && (prevA.tag === 'CONJ' || prevA.tag === 'INTJ'));
      let best = null, bs = -1e9;
      it.cands.forEach((a, idx) => {
        let s = -idx * 0.1;
        const tg = a.pos === 'F' ? a.tag : a.pos;
        if (tg === 'V') {
          if (clauseStart) s += 3;
          if (prevA && prevA.pos === 'F' && (prevA.tag === 'PART' || prevA.tag === 'Q' || prevA.tag === 'NEG' || prevA.tag === 'AUX')) s += 3;
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'F' && /^(DET|PREP|NUM|DEM|ORD|QUANT)$/.test(prevA.tag))) s -= 2;
          if (a.feats.includes && a.feats.includes('part') && prevA && prevA.pos === 'N') s += 2.5;
        }
        if (tg === 'N') {
          if (prevA && prevA.pos === 'F' && /^(DET|PREP|NUM|DEM|ORD|QUANT|GENART|DETGEN|DEMGEN)$/.test(prevA.tag)) s += 3;
          if (prevA && (prevA.pos === 'V' || prevA.pos === 'N')) s += 1;
          if (prevA && prevA.pos === 'F' && prevA.tag === 'PART') s -= 3;
          if (clauseStart) s -= 1;
        }
        if (tg === 'A') {
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'LIT')) s += 2.5;
          // gender agreement: a masculine-form adjective cannot modify a feminine singular noun (and vice versa) -> adverb reading
          if (prevA && prevA.pos === 'N' && prevA.feats.num === 'sg' && a.feats.num === 'sg' && a.feats.g && prevA.feats.g &&
              ((prevA.feats.g === 'f') !== (a.feats.g === 'f')) && it.cands.some(x => x.pos === 'F' && x.tag === 'ADV')) s -= 4;
          if (has(nc, x => x.pos === 'N') && !(prevA && prevA.pos === 'N')) s -= 0.5;
        }
        if (tg === 'ADV') {
          if (prevA && (prevA.pos === 'V' || prevA.pos === 'F' && prevA.tag === 'POSTCLITIC')) s += 3;
          const nx2 = items[i + 2];
          if (next && strip(next.text) === 'si' && nx2 && nx2.cands.some(x => x.pos === 'F' && x.tag === 'ADV') && it.cands.some(x => x.pos === 'A')) s += 3;
          const pp = items[i - 2];
          if (prev && strip(prev.text) === 'si' && pp && pp.a && pp.a.pos === 'F' && pp.a.tag === 'ADV') s += 4;
          if (next && strip(next.text) === 'si' && nx2 && nx2.cands.some(x => x.pos === 'F' && x.tag === 'ADV') && it.cands.some(x => x.pos === 'A')) s += 1.5;
          if (prevA && prevA.pos === 'N') s -= 1;
        }
        if (tg === 'NUM' && has(nc, x => x.pos === 'N')) s += 2;
        if (tg === 'PRON' && has(nc, x => x.pos === 'V')) s += 1;
        if (tg === 'DET' && has(nc, x => x.pos === 'N' || x.pos === 'A' || x.pos === 'LIT')) s += 3;
        if (tg === 'CLITIC' && has(nc, x => x.pos === 'V')) s += 2;
        if (tg === 'POSS' && prevA && prevA.pos === 'N') s += 3;
        if (tg === 'POSS' && has(nc, x => x.pos === 'V')) s -= 3;
        if (tg === 'PART' && has(nc, x => x.pos === 'V' || x.pos === 'F' && x.tag === 'CLITIC' || x.pos === 'F' && x.tag === 'POSTCLITIC')) s += 4;
        if (tg === 'GENART') { if (prevA && (prevA.pos === 'N' || prevA.pos === 'A')) s += 2; }
        if (tg === 'AUX' && has(nc, x => x.pos === 'V')) s += 2;
        if (a.pos === 'V' && a.lemma === 'avea' && has(nc, x => x.pos === 'V' && x.feats.includes && x.feats.includes('part'))) s += 3;
        if (a.how === 'vsa' && a.sim) s += a.sim;
        if (s > bs) { bs = s; best = a; }
      });
      it.a = best;
    }
  }

  // ---------------------------------------------------------------- MWE merge
  function mweMatch(items, i) {
    const first = items[i];
    const keys = k => {
      const s = new Set([strip(k.text)]);
      for (const a of k.cands) s.add(a.lemma);
      return s;
    };
    const cand = new Set();
    for (const k of keys(first)) if (mweByFirst.has(k)) for (const m of mweByFirst.get(k)) cand.add(m);
    for (const m of Array.from(cand).sort((a, b) => b.words.length - a.words.length)) {
      let j = i, w = 0; const clitics = [];
      while (w < m.words.length && j < items.length) {
        const it = items[j];
        if (it.kind === 'W' && strip(it.text).startsWith('-') && w > 0 && m.tag === 'V') { clitics.push(it); j++; continue; }
        if (it.kind !== 'W' || !keys(it).has(m.words[w])) break;
        w++; j++;
      }
      if (w === m.words.length) {
        // features of last noun (number) for N-type MWEs
        let feats = {};
        const lastIt = items[j - 1];
        const lastN = lastIt.cands.find(a => a.pos === 'N');
        if (m.tag === 'N') {
          const headIt = items[i];
          const hn = headIt.cands.find(a => a.pos === 'N');
          feats = Object.assign({}, hn ? hn.feats : {}, lastN && lastN.feats && lastN.feats.def ? { def: true } : {});
        }
        return { end: j, m, clitics, feats };
      }
    }
    return null;
  }

  // ---------------------------------------------------------------- rendering
  const PRED_VERBS = new Set(['face', 'colora', 'seta', 'transforma', 'lasa', 'pastra', 'umple', 'vopsi']);
  const TO_VERBS = new Set(['exporta', 'salva', 'descarca', 'converti', 'schimba', 'seta', 'traduce', 'modifica', 'trece', 'publica', 'muta', 'trimite', 'adauga', 'insera']);
  const INTO_VERBS = new Set(['imparti', 'transforma', 'grupa', 'trage', 'combina', 'imbina', 'importa', 'insera']);
  const SET_VERBS = new Set(['seta', 'schimba', 'modifica', 'mari', 'micsora', 'creste', 'scadea', 'reduce', 'stabili', 'pune', 'ajusta', 'limita']);
  const WORDLIKE = new Set(['cuvant', 'text', 'fraza', 'fisier', 'folder', 'dosar', 'eticheta', 'nume', 'titlu', 'mesaj', 'termen', 'valoare', 'camp', 'coloana', 'tab', 'fila', 'proiect', 'raport', 'document']);
  const BY_VERBS = new Set(['mari', 'micsora', 'creste', 'scadea', 'reduce', 'muta', 'deplasa', 'roti', 'intarzia', 'accelera', 'incetini', 'misca', 'glisa', 'lungi', 'scurta']);
  const AT_NOUNS = new Set(['secunda', 'minut', 'inceput', 'sfarsit', 'final', 'milisecunda', 'cadru', 'pas', 'ora', 'momentul', 'moment']);
  const ON_NOUNS = new Set(['clic', 'click', 'hover', 'incarcare', 'deschidere', 'apasare', 'pagina', 'panza', 'ecran', 'canvas', 'slide', 'diapozitiv', 'planse', 'plansa']);
  const QUANTITY_NOUNS = new Set(['jumatate', 'sfert', 'treime', 'procent', 'numar', 'total', 'majoritate', 'lista', 'grup', 'set', 'serie', 'colectie', 'multime']);
  const ATTR_NOUNS = new Set(['latime', 'inaltime', 'dimensiune', 'marime', 'durata', 'viteza', 'opacitate', 'rezolutie', 'grosime', 'valoare', 'unghi', 'rotatie']);
  const UNIT_NOUNS = new Set(['pixel', 'grad', 'procent', 'punct', 'secunda', 'milisecunda', 'minut', 'nivel']);
  const LINK_VERBS = new Set(['lega', 'conecta', 'atasa', 'ancora', 'uni', 'fixa']);
  const FROM_VERBS = new Set(['importa', 'elimina', 'sterge', 'scoate', 'extrage', 'copia', 'descarca', 'incarca', 'muta', 'decupa', 'taia', 'exclude', 'genera']);
  const PERSON_VERB = { vreau: 'I want', vrem: 'we want', vrei: 'do you want', doresc: 'I want', dorim: 'we want', pot: 'can I', poti: 'can you', puteti: 'can you', poate: 'can', putem: 'can we', trebuie: 'need to' };

  function senseOf(a, ctxVecs) {
    const S = SENSES[a.lemma];
    if (!S || S.length < 2 || !ctxVecs.length) return null;
    // VSA: score = sum over context items of similarity to sense prototype items (superposition dot product)
    let best = 0, bs = -Infinity;
    S.forEach((s, idx) => {
      let score = 0;
      for (const c of ctxVecs) for (const p of s.ctx) score += (HD.D - 2 * HD.ham(c, p));
      score = score / HD.D;
      if (score > bs + 0.5) { bs = score; best = idx; }
    });
    return bs > 0.5 ? S[best].en : S[0].en;
  }

  function translate(text) {
    const stats = { exact: 0, vsa: 0, unknown: 0, vsaLog: [], vsaPairs: [] };
    const t1 = (typeof performance !== 'undefined' ? performance : Date).now();
    const toks = tokenize(text);
    let items = toks.map(t => {
      if (t.kind === 'W') return Object.assign(t, { cands: analyze(t, stats) });
      return Object.assign(t, { cands: [] });
    });
    for (let i = 1; i < items.length; i++) {
      const it = items[i], pv = items[i - 1];
      const listCtx = pv.kind === 'PUNCT' && /^[:,]$/.test(pv.text) && items.slice(0, i).some(x => x.kind === 'PUNCT' && x.text === ':');
      if (it.kind === 'W' && it.cap && !it.first && (listCtx || pv.kind === 'W' && pv.cands.some(a => a.pos === 'N')) && it.cands.some(a => a.pos !== 'F')) {
        it.cands = [{ pos: 'LIT', lemma: strip(it.text), en: it.text, feats: {}, label: true }];
      }
    }
    // MWE merge
    const merged = [];
    for (let i = 0; i < items.length;) {
      const it = items[i];
      if (it.kind === 'W') {
        const mm = mweMatch(items, i);
        if (mm) {
          const tag = mm.m.tag;
          const pos = tag === 'N' ? 'N' : tag === 'V' ? 'V' : tag === 'ADJ' ? 'A' : 'F';
          const a = { pos, tag: pos === 'F' ? tag : undefined, lemma: mm.m.words.join('_'), en: mm.m.en, feats: pos === 'V' ? ['imp', 'fin', '3sg'] : (mm.feats || {}), mwe: true };
          if (pos === 'N') a.enPl = enPlural(mm.m.en);
          merged.push({ kind: 'W', text: items.slice(i, mm.end).map(x => x.text).join(' '), cands: [a], a });
          for (const c of mm.clitics) merged.push(c);
          i = mm.end; continue;
        }
      }
      merged.push(it); i++;
    }
    items = merged;
    choose(items);
    // context vectors for VSA sense disambiguation
    const ctxLemmas = items.filter(x => x.a && x.a.pos !== 'F' && x.a.pos !== 'LIT').map(x => x.a.lemma);
    for (const it of items) {
      if (!it.a || !SENSES[it.a.lemma]) continue;
      const ctx = ctxLemmas.filter(l => l !== it.a.lemma).map(lemmaVec);
      const en = senseOf(it.a, ctx);
      if (en) it.a = Object.assign({}, it.a, { en });
    }
    // per-token report (for UIs and debugging)
    stats.tokens = items.map(it => {
      if (it.kind === 'PUNCT') return { text: it.text, how: 'punct' };
      if (it.kind !== 'W') return { text: it.text, how: 'literal' };
      const a = it.a || {};
      const how = a.mwe ? 'phrase' : a.how === 'vsa' ? 'vsa' : a.label || a.acr ? 'label' : a.unknown ? 'unknown' : 'exact';
      return { text: it.text, how, lemma: a.lemma, pos: a.pos === 'F' ? a.tag : a.pos, en: a.en, sim: a.sim, match: a.match };
    });
    const out = renderAll(items);
    // confidence for routing: unknown content words or weak VSA matches -> let a neural fallback handle it
    stats.unknownWords = stats.tokens.filter(t => t.how === 'unknown' && /\p{L}{3,}/u.test(t.text)).map(t => t.text);
    stats.weakMatches = stats.tokens.filter(t => t.how === 'vsa' && t.sim < opts.confidentSim).map(t => t.text);
    stats.confident = stats.unknownWords.length === 0 && stats.weakMatches.length === 0;
    const ms = (typeof performance !== 'undefined' ? performance : Date).now() - t1;
    return { text: out, stats, ms };
  }

  function renderAll(items) {
    // split into clauses at CONJ / PUNCT
    const words = [];
    let clause = [];
    let sub = false;
    const flush = () => { if (clause.length) words.push(...renderClause(clause, { sub })); clause = []; sub = false; };
    for (const it of items) {
      if (it.kind === 'PUNCT') { flush(); words.push({ p: it.text }); continue; }
      const a = it.a;
      if (a && a.pos === 'F' && (a.tag === 'CONJ' || a.tag === 'INTJ' || a.tag === 'Q' && a.lemma === 'cand' && clause.length)) {
        flush(); words.push(a.en);
        sub = /^(before|after|when|while|until|if|so that|because)$/.test(a.en) || a.lemma === 'cand';
        continue;
      }
      clause.push(it);
    }
    flush();
    return finish(words);
  }

  function finish(words) {
    let s = '';
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w === null || w === undefined || w === '' || w === '·') continue;
      if (typeof w === 'object') {
        if (w.p === '(') s += (s ? ' ' : '') + '(';
        else s = s.replace(/\s+$/, '') + w.p;
        continue;
      }
      s += (s && !s.endsWith('(') ? ' ' : '') + w;
    }
    // a/an
    s = s.replace(/\b([Aa]) (\S+)/g, (m, a, w) => {
      const lw = w.toLowerCase().replace(/^["„]/, '');
      let vowel = /^[aeio]/.test(lw) || /^u(?!s|n[iy]|ni|ser|r)/.test(lw) || /^h(our|onest)/.test(lw);
      if (/^(one|uni|use|user|euro|once)/.test(lw)) vowel = false;
      if (/^[A-Z]{2,}/.test(w.replace(/^["„]/, ''))) vowel = /^[AEFHILMNORSX]/.test(w.replace(/^["„]/, ''));
      if (/^\d/.test(lw)) vowel = /^(8|11|18|80)/.test(lw);
      return (vowel ? (a === 'A' ? 'An' : 'an') : a) + ' ' + w;
    });
    s = s.replace(/\bthe the\b/g, 'the').replace(/\s+/g, ' ').trim();
    s = s.replace(/\bto to\b/g, 'to').replace(/\bof of\b/g, 'of');
    if (s) s = s[0].toUpperCase() + s.slice(1);
    return s;
  }

  function nounEn(a, plural) {
    if (plural) return a.enPl || (a.loan ? a.en : enPlural(a.en));
    return a.en;
  }

  function renderClause(items, ctxClause) {
    const out = [];
    let i = 0;
    let lastVerb = null;     // lemma of the last verb rendered in this clause
    let subjectSeen = false; // a noun/pronoun before the verb
    let pendingDative = null;   // words to emit after the next object NP ("to the box")
    let dativeFromClitic = false;
    let datNext = false;
    let pendingPreClitics = [];
    let negPending = false;
    let modalPrev = false;   // previous verb was a modal (can/must) -> drop "to"
    let wantPrev = false;
    let qPrev = null;        // previous token was a question word
    let auxHave = null;
    let futPending = false;
    let prevWasAdvMwe = false;
    let lastVerbIdx = -1, lastVerbEn = null;
    const A = k => items[k] && items[k].a;
    const K = k => items[k] && items[k].kind;
    const isLabelLit = x => x && (x.quoted || x.label || x.acr);

    function emptyNP() { return { dets: [], nums: [], adjs: [], head: null, post: [], gens: [], preLits: [], lits: [], poss: null, dem: null, compounds: [] }; }

    function parseNP(j, inPP, isGen) {
      const np = emptyNP(); np.start = j; np.isGen = !!isGen;
      // pre-head
      while (j < items.length) {
        const it = items[j], a = it.a;
        if (it.kind === 'NUMLIT') { np.nums.push(it.text); j++; if (A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++; continue; }
        if (it.kind === 'ORDN') { np.dets.push(it.en); j++; continue; }
        if (!a) break;
        if (a.pos === 'F' && /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL|UNUL)$/.test(a.tag)) {
          if (a.tag === 'NUM') np.nums.push(a.en); else if (a.tag === 'UNUL') np.dets.push('a'); else np.dets.push(a.en);
          if (a.tag === 'CEL' || a.tag === 'UNUL') { np.cel = true; np.celPl = /^(cei|cele)$/.test(a.lemma); }
          if (a.tag === 'QUANT' && /^(ceilalti|celelalte)$/.test(a.lemma)) np.othersPl = true;
          j++;
          if (a.tag === 'NUM' && A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++;
          continue;
        }
        if (a.pos === 'F' && a.tag === 'GENART' && (K(j + 1) === 'ORDN' || A(j + 1) && A(j + 1).pos === 'F' && A(j + 1).tag === 'ORD')) { j++; continue; }
        if (a.pos === 'F' && a.tag === 'QUANT' && a.mwe) { np.dets.push(a.en); j++; continue; }
        break;
      }
      // head
      const h = items[j];
      if (h && h.a && (h.a.pos === 'N' || (h.a.pos === 'LIT' && !isLabelLit(h.a) && !h.quoted))) { np.head = h.a; j++; }
      else if (h && (h.kind === 'LIT' || h.a && isLabelLit(h.a))) {
        // label/acronym directly followed by a noun? ("PDF-ul" is a head; "Start nodul" is rare) -> treat as head
        np.head = { pos: 'LIT', en: h.text, feats: h.a ? h.a.feats : {}, label: true }; j++;
      }
      else if (h && h.a && h.a.pos === 'A' && (np.dets.length || np.nums.length || inPP)) { np.adjs.push(h.a.en); j++; }
      else if (h && h.a && h.a.pos === 'V' && h.a.feats.includes && h.a.feats.includes('part') && np.cel) { np.adjs.push(enInflect(h.a.en, 'part')); j++; }
      // post-head
      while (j < items.length && (np.head || np.lits.length || np.cel)) {
        const it = items[j], a = it.a;
        if (it.kind === 'LIT' || a && isLabelLit(a)) {
          const txt = it.text;
          if (it.hex || it.time || it.ident || (it.quoted || a && a.quoted) && np.head && np.head.lemma && WORDLIKE.has(np.head.lemma)) np.lits.push(txt); else np.preLits.push(txt);
          if (it.time && np.head && np.head.lemma === 'ora') np.timeOnly = true;
          j++; continue;
        }
        if (it.kind === 'NUMLIT' && np.head && !(A(j + 1) && A(j + 1).pos === 'N')) { np.lits.push(it.text); np.numLabel = true; j++; continue; }
        if (!a) break;
        if (a.pos === 'A') {
          if (np.isGen && np.head && np.head.feats && a.feats && a.feats.num && np.head.feats.num && a.feats.num !== np.head.feats.num && !np.head.feats.alsoPl) break;
          (np.head ? np.post : np.adjs).push(a); j++; continue;
        }
        if (a.pos === 'V' && a.feats.includes && a.feats.includes('part') && (a.feats.includes('adj') || !a.feats.includes('imp'))) { (np.head ? np.post : np.adjs).push(np.head ? { en: enInflect(a.en, 'part'), part: true } : enInflect(a.en, 'part')); j++; continue; }
        if (!np.head && np.cel && a.pos === 'F' && a.lemma === 'de' && A(j + 1) && A(j + 1).pos === 'N') { np.compounds.push(nounEn(A(j + 1), false)); j += 2; continue; }
        if (!np.head) break;
        if (a.pos === 'F' && a.tag === 'POSS') { np.poss = a.en; j++; continue; }
        if (a.pos === 'F' && a.tag === 'DEM') { np.dem = a.en; j++; continue; }
        if (a.pos === 'F' && a.lemma === 'de' && np.head.pos === 'N' && items[j + 1] && (items[j + 1].kind === 'NUMLIT' || A(j + 1) && A(j + 1).pos === 'F' && A(j + 1).tag === 'NUM')) {
          const m = [items[j + 1].kind === 'NUMLIT' ? items[j + 1].text : A(j + 1).en]; j += 2;
          if (A(j) && A(j).pos === 'F' && A(j).lemma === 'de') j++;
          if (items[j] && (A(j) && (A(j).pos === 'N' && UNIT_NOUNS.has(A(j).lemma) || A(j).pos === 'LIT' && !isLabelLit(A(j)) && /^(px|ms|s|pt|em|rem|fps|deg)$/i.test(items[j].text)))) {
            const u = A(j); m.push(u.pos === 'N' ? nounEn(u, !/^(1|one)$/.test(m[0])) : items[j].text); j++;
          }
          if (ATTR_NOUNS.has(np.head.lemma)) np.lits.push('of', ...m); else np.measure = m;
          continue;
        }
        if (a.pos === 'F' && a.lemma === 'de' && np.head.pos === 'N' && A(j + 1) && (A(j + 1).pos === 'N' && A(j + 1).feats.def !== true && !A(j + 1).feats.gen || A(j + 1).pos === 'LIT' && !isLabelLit(A(j + 1)))) {
          const comp = A(j + 1);
          if (comp.pos === 'N' && comp.feats.num === 'pl' && !comp.mwe) { const g = emptyNP(); g.head = comp; g.bare = true; np.gens.push({ of: 'of', np: g }); }
          else if (/^(jumatate|sfert|treime)$/.test(np.head.lemma)) { const g = emptyNP(); g.head = comp; g.dets = ['a']; np.gens.push({ of: 'of', np: g }); }
          else np.compounds.push(comp.pos === 'LIT' ? comp.en : nounEn(comp, false));
          j += 2;
          while (A(j) && A(j).pos === 'A' && !np.compounds.length) { np.post.push(A(j)); j++; }
          continue;
        }
        if (a.pos === 'N' && a.feats.gen === true) { const g = parseNP(j, false, true); np.gens.push({ of: 'of', np: g }); j = g.end; continue; }
        if (a.pos === 'N' && a.mwe && a.feats && a.feats.gen) { const g = parseNP(j, false); np.gens.push({ of: 'of', np: g }); j = g.end; continue; }
        if (a.pos === 'F' && a.tag === 'GENART' && A(j + 1) && (A(j + 1).pos === 'N' || A(j + 1).pos === 'F' && /^(DEMGEN|DETGEN|ORD)$/.test(A(j + 1).tag) || A(j + 1).pos === 'LIT')) {
          const g = parseNP(j + 1, false); np.gens.push({ of: 'of', np: g }); j = g.end; continue;
        }
        if (a.pos === 'F' && (a.tag === 'DEMGEN' || a.tag === 'DETGEN')) { const g = parseNP(j, false); np.gens.push({ of: '', np: g }); j = g.end; continue; }
        if (a.pos === 'F' && a.tag === 'GENPRON') {
          if (items[j + 1] && (items[j + 1].kind === 'LIT' || A(j + 1) && A(j + 1).pos === 'LIT')) { const g = emptyNP(); g.preLits = [items[j + 1].text]; np.gens.push({ of: 'of', np: g }); j += 2; continue; }
          np.poss = 'its'; j++; continue;
        }
        break;
      }
      np.end = j;
      return np;
    }

    function renderNP(np, ctx) {
      if (np.timeOnly) return np.lits.slice();
      const w = [];
      const head = np.head;
      const pl = head && (head.feats.num === 'pl' || (np.nums.length && !/^(1|one|unu)$/.test(np.nums[np.nums.length - 1])));
      const predicative = ctx && ctx.predicative && np.post.length && head && head.feats.def;
      const hasDef = head && head.feats.def;
      if (np.dem) w.push(np.dem === 'this' && pl ? 'these' : np.dem === 'that' && pl ? 'those' : np.dem);
      else if (np.poss) w.push(np.poss);
      else if (np.dets.length) {
        for (const d of np.dets) w.push(d === 'all' && hasDef ? (pl ? 'all the' : 'the whole') : d);
      } else if (head && head.pos === 'N' && (hasDef || head.feats.gen) && !np.nums.length && !np.numLabel) w.push('the');
      else if (head && head.pos === 'N' && np.nums.length && head.feats.def === true) w.push('the');
      else if (head && ctx && ctx.addThe && !np.nums.length && !np.numLabel && head.pos === 'N' && head.feats.num !== 'pl' && !QUANTITY_NOUNS.has(head.lemma)) w.push('the');
      w.push(...np.nums);
      if (np.measure) w.push(...np.measure);
      w.push(...np.adjs);
      if (!predicative) for (const p of np.post) w.push(p.en);
      w.push(...np.preLits);
      w.push(...np.compounds);
      if (head) w.push(head.pos === 'LIT' ? head.en : nounEn(head, pl));
      else if (np.cel && (np.adjs.length || np.post.length || np.compounds.length)) w.push(np.celPl ? 'ones' : 'one');
      if (!head && np.othersPl && w.length && w[w.length - 1] === 'the other') w[w.length - 1] = 'the others';
      w.push(...np.lits);
      if (predicative) for (const p of np.post) w.push(p.en);
      for (const g of np.gens) { if (g.of) w.push(g.of); w.push(...renderNP(g.np, { addThe: !g.np.bare })); }
      return w;
    }

    function prepEn(a, k) {
      const nx = items[k + 1], na = nx && nx.a;
      const prevA = A(k - 1);
      const nxNum = nx && (nx.kind === 'NUMLIT' || na && na.pos === 'F' && na.tag === 'NUM');
      const nxLemma = na ? na.lemma : '';
      switch (a.lemma) {
        case 'de':
          if (prevA && prevA.pos === 'F' && prevA.tag === 'NUM' || K(k - 1) === 'NUMLIT') return null;
          if (nxNum && A(k + 2) && A(k + 2).lemma === 'oara') return null; // de 3 ori -> 3 times
          if (prevA && prevA.pos === 'A' && /er$/.test(prevA.en)) return 'than';
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'to';
          if (na && na.pos === 'F' && na.tag === 'ADV') return 'from';
          return 'of';
        case 'la': {
          const unitAfter = A(k + 2) && A(k + 2).pos === 'N' ? A(k + 2).lemma : '';
          if (nxNum && /^(secunda|milisecunda|minut|ora)$/.test(unitAfter) && !(lastVerb && SET_VERBS.has(lastVerb))) return 'at';
          if (nx && nx.kind === 'NUMLIT' && /s$/.test(nx.text) && !(lastVerb && SET_VERBS.has(lastVerb))) return 'at';
          if (nxNum) return 'to';
          if (na && AT_NOUNS.has(nxLemma)) return 'at';
          if (na && /^(clic|click|hover|incarcare|deschidere|apasare)$/.test(nxLemma)) return 'on';
          return 'to';
        }
        case 'in':
          if (nxNum) return 'in';
          if (lastVerb && INTO_VERBS.has(lastVerb)) return 'into';
          if (lastVerb && /^(exporta|salva|descarca|converti|schimba|traduce|seta|modifica|muta|deplasa|redenumi|trimite|copia)$/.test(lastVerb)) return 'to';
          return 'in';
        case 'pe':
          if (na && (na.pos === 'F' && /^(PRON|CEL|UNUL)$/.test(na.tag) || isLabelLit(na) && nx.cap)) return null;
          if (na && na.pos === 'F' && /^(QUANT|DEM)$/.test(na.tag) && prevA && (prevA.pos === 'V' || prevA.pos === 'F' && prevA.tag === 'POSTCLITIC') && !(A(k + 2) && A(k + 2).pos === 'N')) return null;
          return 'on';
        case 'cu': {
          if (nx && nx.kind === 'NUMLIT' && /(px|%|ms|pt|deg|°)$/.test(nx.text)) return 'by';
          if (nxNum) {
            const unit = A(k + 2) && A(k + 2).pos === 'N' ? A(k + 2) : (A(k + 3) && A(k + 3).pos === 'N' ? A(k + 3) : null);
            if (unit && UNIT_NOUNS.has(unit.lemma)) return 'by';
            if (!unit && lastVerb && BY_VERBS.has(lastVerb)) return 'by';
          }
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'to';
          return 'with';
        }
        case 'din':
          if (prevA && prevA.pos === 'N' && QUANTITY_NOUNS.has(prevA.lemma)) return 'of';
          if (prevA && prevA.pos === 'F' && /^(QUANT|NUM|ORD)$/.test(prevA.tag)) return 'of';
          if (lastVerb && FROM_VERBS.has(lastVerb)) return 'from';
          if (prevA && (prevA.pos === 'N' || prevA.pos === 'LIT')) return 'in';
          return 'from';
        case 'dintre':
          if (prevA && prevA.pos === 'F' && /^(QUANT|NUM|ORD)$/.test(prevA.tag)) return 'of';
          return 'between';
        case 'prin':
          if (lastVerb && LINK_VERBS.has(lastVerb)) return 'with';
          return 'through';
        case 'ca': return 'as';
        default: return a.en;
      }
    }

    function renderVerb(k, force3sg) {
      const it = items[k], a = it.a;
      const key = strip(it.text);
      let words = [];
      let form = 'base';
      const feats = Array.isArray(a.feats) ? a.feats : [];
      if (PERSON_VERB[key] && !a.mwe) {
        let s = PERSON_VERB[key];
        if (negPending) { s = s.replace(/^can I$/, "can't I").replace(/^can you$/, "can't you").replace(/^I want$/, "I don't want").replace(/^need to$/, "don't need to"); negPending = false; }
        words.push(s);
        modalPrev = /can|need/.test(s); wantPrev = /want/.test(s);
        lastVerb = a.lemma;
        return words;
      }
      if (a.lemma === 'fi' && !a.mwe) {
        const be = { sunt: 'are', este: 'is', e: 'is', esti: 'are', suntem: 'are', sunteti: 'are', fie: 'be', fi: 'be', fost: 'been', fii: 'be' }[key] || 'is';
        words.push(be); if (negPending) { words.push('not'); negPending = false; }
        lastVerb = 'fi'; qPrev = null; return words;
      }
      if (a.lemma === 'avea' && !a.mwe) {
        const nxa = A(k + 1);
        if (nxa && nxa.pos === 'V' && nxa.feats.includes && nxa.feats.includes('part')) {
          auxHave = { am: 'I have', ai: 'you have', a: 'has', au: 'have', ati: 'you have', avem: 'we have' }[key] || 'have';
          return [];
        }
        words.push({ am: 'I have', ai: 'you have', are: 'has', au: 'have', avem: 'we have', aveti: 'you have' }[key] || 'have');
        lastVerb = 'avea'; return words;
      }
      if (auxHave) { words.push(auxHave); form = 'part'; auxHave = null; }
      else if (feats.includes('ger') && !feats.includes('imp')) form = 'ing';
      else if (force3sg || subjectSeen && !qPrev && feats.includes('3sg') && !modalPrev && !wantPrev && !futPending) form = '3sg';
      if (negPending) {
        if (form === '3sg') { words.push("doesn't"); form = 'base'; }
        else words.push("don't");
        negPending = false;
      }
      if (qPrev && /^(how|where|why)$/.test(qPrev) && form === 'base' && !modalPrev) words.push('do I');
      words.push(form === 'base' ? a.en : enInflect(a.en, form));
      modalPrev = false; wantPrev = false; futPending = false; qPrev = null;
      lastVerb = a.lemma; lastVerbEn = a.en;
      // clitic doubling "nu le modifica pe cele..." -> drop the clitic
      if (A(k + 1) && A(k + 1).pos === 'F' && A(k + 1).lemma === 'pe') pendingPreClitics = [];
      for (const c of pendingPreClitics) words.push(c);
      pendingPreClitics = [];
      return words;
    }

    function emitNP(np, ctx, k) {
      const prevA = A(k - 1);
      // bare dative right after the verb (or after a doubling clitic): indirect object -> "to X" after the direct object
      if (np.head && np.head.pos === 'N' && np.head.feats.gen === true && (datNext || prevA && prevA.pos === 'V' && lastVerb)) {
        pendingDative = ['to'].concat(renderNP(np, ctx)); dativeFromClitic = false; datNext = false;
        return;
      }
      datNext = false;
      if (dativeFromClitic && np.gens.length) {
        const g = np.gens.pop();
        out.push(...renderNP(np, ctx));
        out.push('to', ...renderNP(g.np, { addThe: true }));
        pendingDative = null; dativeFromClitic = false;
        return;
      }
      if (prevWasAdvMwe && np.head && np.head.feats.gen === true) out.push('of');
      out.push(...renderNP(np, ctx));
      if (pendingDative) { out.push(...pendingDative); pendingDative = null; dativeFromClitic = false; }
    }

    while (i < items.length) {
      const it = items[i];
      const a = it.a;
      const wasAdvMwe = prevWasAdvMwe; prevWasAdvMwe = false;
      if (it.kind === 'NUMLIT' || it.kind === 'ORDN' || it.kind === 'LIT' && !a) {
        const np = parseNP(i, false);
        if (np.end === i) { out.push(it.text); i++; continue; }
        prevWasAdvMwe = wasAdvMwe; emitNP(np, {}, i); prevWasAdvMwe = false; qPrev = null; i = np.end;
        continue;
      }
      if (!a) { out.push(it.text); i++; continue; }
      const tg = a.pos === 'F' ? a.tag : a.pos;
      if (tg === 'V') {
        // subordinate clause with verb-subject order: "înainte să apară logo-ul" -> before the logo appears
        if (ctxClause && ctxClause.sub && !lastVerb && !subjectSeen && Array.isArray(a.feats) && (a.feats.includes('subj') || a.feats.includes('3sg') || a.feats.includes('fin')) && A(i + 1) && A(i + 1).pos === 'N' && A(i + 1).feats.def) {
          const np = parseNP(i + 1, false);
          out.push(...renderNP(np, {}));
          subjectSeen = true;
          const vw = renderVerb(i, true); out.push(...vw);
          i = np.end; continue;
        }
        if (modalPrev && /possible/.test(out[out.length - 1] || '')) out.push('to');
        const vw = renderVerb(i); lastVerbIdx = out.length + vw.length - 1; out.push(...vw); i++;
        // post-verbal clitics
        while (A(i) && A(i).pos === 'F' && A(i).tag === 'POSTCLITIC') {
          const c = A(i);
          if (c.feats.kase === 'refl') { i++; continue; }
          if (c.feats.kase === 'dat?') {
            const nx = A(i + 1);
            if (nx && nx.pos === 'N' && nx.feats.gen === true) { datNext = true; i++; continue; }
            const objFollows = items[i + 1] && (items[i + 1].kind === 'NUMLIT' || nx && (nx.pos === 'N' || nx.pos === 'A' || nx.pos === 'F' && /^(DET|NUM|QUANT|DEM|ORD|CEL)$/.test(nx.tag)));
            if (objFollows) { pendingDative = ['to it']; dativeFromClitic = true; } else out.push('them');
          } else if (A(i + 1) && A(i + 1).pos === 'F' && A(i + 1).lemma === 'pe') {
            // clitic doubling: "ascunde-l pe cel original" -> hide the original one
          } else out.push(c.en);
          i++;
        }
        continue;
      }
      if (tg === 'N' || tg === 'LIT' || /^(DET|DEM|QUANT|ORD|NUM|DETGEN|DEMGEN|CEL|UNUL)$/.test(tg) || (tg === 'A' && (A(i + 1) && A(i + 1).pos === 'N'))) {
        const prevA = A(i - 1);
        const predicative = lastVerb && PRED_VERBS.has(lastVerb) && prevA && prevA.pos === 'V';
        const addThe = prevA && prevA.pos === 'F' && prevA.tag === 'PREP' && (prevA.mwe || /^(in|pe|la|din|sub|peste|langa|deasupra|dintre|intre|spre|catre|prin|dupa)$/.test(prevA.lemma));
        const np = parseNP(i, !!addThe);
        if (np.end === i) { out.push(a.en); i++; continue; }
        prevWasAdvMwe = wasAdvMwe;
        emitNP(np, { predicative, addThe }, i);
        prevWasAdvMwe = false;
        if (!lastVerb) subjectSeen = true;
        qPrev = qPrev && np.head ? null : qPrev;
        i = np.end;
        continue;
      }
      if (tg === 'A') { out.push(a.en); i++; continue; }
      if (tg === 'PREP') { const e = prepEn(a, i); if (e) out.push(e); i++; continue; }
      if (tg === 'GENART') { if (!(A(i + 1) && A(i + 1).pos === 'V')) out.push('of'); i++; continue; }
      if (tg === 'GENPRON') { out.push('its'); i++; continue; }
      if (tg === 'PART') { // să
        const lastOut = out[out.length - 1];
        if (lastVerb && /^(pune|lasa)$/.test(lastVerb) && lastVerbIdx >= 0) { out[lastVerbIdx] = lastVerb === 'pune' ? 'make' : 'let'; i++; continue; }
        if (!lastVerb && subjectSeen && out.length) { out.push('should'); modalPrev = true; i++; continue; }
        const drop = modalPrev || out.length === 0 || /^(how to|should|will)$/.test(lastOut || '') || (lastVerb && /^(face|lasa)$/.test(lastVerb)) || lastVerbEn === 'make';
        if (!drop) out.push('to');
        i++; continue;
      }
      if (tg === 'NEG') {
        if (a.mwe) { out.push(a.en); i++; continue; }
        negPending = true; i++;
        if (!(A(i) && (A(i).pos === 'V' || A(i).pos === 'F' && (A(i).tag === 'CLITIC' || A(i).tag === 'POSTCLITIC')))) { out.push('not'); negPending = false; }
        continue;
      }
      if (tg === 'CLITIC' || tg === 'POSTCLITIC') {
        if (a.lemma === 'se' || a.feats && a.feats.kase === 'refl') { i++; continue; }
        if (A(i + 1) && A(i + 1).pos === 'V') { pendingPreClitics.push(a.en); i++; continue; }
        out.push(a.en); i++; continue;
      }
      if (tg === 'PRON') { out.push(a.en); subjectSeen = true; i++; continue; }
      if (tg === 'Q') {
        const pa = A(i - 1);
        if (a.lemma === 'care' && pa && (pa.pos === 'N' || pa.pos === 'LIT')) { out.push('that'); subjectSeen = true; lastVerb = null; i++; continue; }
        out.push(a.en); qPrev = a.en; i++; continue;
      }
      if (tg === 'QV') { out.push(a.en); qPrev = null; if (/how to/.test(a.en)) modalPrev = true; lastVerb = lastVerb || 'q'; i++; continue; }
      if (tg === 'VMOD') { out.push(a.en); modalPrev = /should|possible/.test(a.en); wantPrev = /like/.test(a.en); i++; continue; }
      if (tg === 'AUX') { out.push(a.en); futPending = true; modalPrev = true; i++; continue; }
      if (tg === 'POSS') { out.push(a.en); i++; continue; }
      if (tg === 'ADV') {
        if (a.lemma === 'mai' && A(i + 1) && A(i + 1).pos === 'V') { out.push('also'); i++; continue; }
        out.push(a.en); if (a.mwe) prevWasAdvMwe = true; i++; continue;
      }
      out.push(a.en); i++;
    }
    if (pendingDative) out.push(...pendingDative.filter(x => x !== 'to it' || !dativeFromClitic || true));
    if (pendingPreClitics.length) out.push(...pendingPreClitics);
    return out;
  }

  // ---------------------------------------------------------------- naive baseline (exact dictionary, word by word)
  function translateNaive(text) {
    const toks = tokenize(text);
    const w = [];
    for (const t of toks) {
      if (t.kind === 'PUNCT') { w.push({ p: t.text }); continue; }
      if (t.kind !== 'W') { w.push(t.text); continue; }
      const k = strip(t.text);
      const ans = surf.get(k.replace(/^-/, ''));
      if (k.startsWith('-')) { const c = CLITIC_EN[k]; w.push(c ? c[0] : ''); continue; }
      if (!ans) { w.push(t.text); continue; }
      const a = ans[0];
      w.push(a.pos === 'N' && a.feats.num === 'pl' ? nounEn(a, true) : a.en);
    }
    return finish(w);
  }

  return {
    translate, translateNaive, tokenize,
    warmup() { ensureMemory(); return memoryMs; },
    /** hypervector of a (normalised) word, and its similarity to another word: for visualisation */
    encode(word) { return encodeWord(strip(word)); },
    similarity(a, b) { return HD.sim(encodeWord(strip(a)), encodeWord(strip(b))); },
    get info() { return { D: opts.D, threshold: opts.threshold, forms: surf.size, itemMemory: itemVecs.length, mwes: MWES.length, lexiconMs: Math.round(buildMs), memoryMs }; },
    _cleanup: cleanup,
  };
}

const API = { createTranslator, strip };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VSATranslator = API;
})(typeof window !== 'undefined' ? window : globalThis);

  ; return module.exports; })();
  var _default = null;
  function create(opts) { return ENGINE.createTranslator(LEX, opts); }
  function getDefault() { return _default || (_default = create()); }
  var api = {
    version: '0.1.1',
    /** Translate Romanian text to English. Returns a string. */
    translate: function (text) { return getDefault().translate(text).text; },
    /** Translate and return { text, ms, stats: { exact, vsa, unknown, vsaLog } }. */
    translateDetailed: function (text) { return getDefault().translate(text); },
    /** Word-by-word dictionary baseline (same lexicon, no VSA, no reordering). */
    translateNaive: function (text) { return getDefault().translateNaive(text); },
    /** Build the hypervector item memory now (otherwise built on first unknown word). Returns ms. */
    warmup: function () { return getDefault().warmup(); },
    /** Create an independent translator, e.g. create({ D: 4096, threshold: 0.72 }). */
    create: create,
    info: function () { return getDefault().info; },
    /** 2048-bit hypervector (Uint32Array) of a word, for visualisation. */
    encode: function (w) { return getDefault().encode(w); },
    similarity: function (a, b) { return getDefault().similarity(a, b); },
    lexicon: LEX,
    strip: ENGINE.strip
  };

export default api;
export const translate = api.translate;
export const translateDetailed = api.translateDetailed;
export const translateNaive = api.translateNaive;
export const warmup = api.warmup;
export { create };
export const version = api.version;
