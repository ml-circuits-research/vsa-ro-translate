// Romanian -> English lexicon for technical / agentic commands
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
avea|irr|have|am,ai,are,avem,aveți,au,avut,aibă
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
ușor|ușoară|ușori|ușoare|slight
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
