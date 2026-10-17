// Country Living Crossword word bank. G-rated, positive, no politics/crime.
// Format: ANSWER|clue. Theme entries are exactly 13 letters (rows 4 and 10 of the grid).
export const THEMES = `
SWEETPOTATOES|Orange root crop Henderson County farms grew back in 1850
BLACKEYEDPEAS|Southern New Year's Day dish for good luck
LAKEPALESTINE|Big reservoir on the Neches near Chandler
KICKAPOOCREEK|Stream that runs through Brownsboro
PEACHCOBBLERS|Warm fruit desserts at a church potluck
COUNTRYKITCHN|---
HOMEMADEJELLY|Mason-jar spread from mayhaws or plums
SUNDAYDINNERS|Big family meals after church
FRIDAYFOOTBAL|---
PECANHARVESTS|Fall gatherings of East Texas tree nuts
COUNTYFAIRDAY|Day of livestock shows and funnel cake
PICKUPTRUCKER|---
FIREFLYNIGHTS|Summer evenings lit by lightning bugs
HAYRIDEHOLLER|---
HONEYBEEHIVES|Homes for pollinators in the orchard
WILDFLOWERRUN|---
MAYHAWJELLIES|East Texas berry preserves, plural
FISHINGTRIPS|---
ROCKINGCHAIRS|Front-porch seats that sway
BACKROADDRIVE|Leisurely trip down a farm-to-market lane
GARDENVEGGIES|Okra, squash and beans from out back
TOMATOFESTIVL|---
WATERMELONPAT|---
BLUEBERRYFARM|Pick-your-own spot for summer fruit
QUILTINGBEES|---
CHURCHPOTLUCK|Covered-dish supper in the fellowship hall
SWEETTEAGLASS|Sweaty vessel on a summer porch
FRESHCORNBREAD|---
TRACTORPARADE|Rolling line of John Deeres down Main Street
BARNRAISINGS|---
HOMEGROWNOKRA|Garden pods for frying, raised yourself
PEACHORCHARDS|Rows of fuzzy-fruit trees
CHICKENCOOPS|---
STRAWBERRYPIE|Summer dessert from the berry patch
PUMPKINPATCHS|---
FALLFESTIVALS|Autumn town celebrations with hayrides
HOMECOMINGMUM|Big Texas ribboned corsage for a fall game
`.trim().split("\n").map((l) => l.split("|")).filter(([a, c]) => a.length === 13 && c !== "---" && /^[A-Z]+$/.test(a));

export const WORDS = `
ACE|Top card in the deck
ACT|Play part
ADD|Sum up
ADO|Fuss
AGE|Years on the calendar
AGO|In the past
AID|Help out
AIL|Feel poorly
AIM|Point at a target
AIR|What a windmill catches
ALE|Ginger ___ (fizzy drink)
ALL|Every bit
AND|Plus
ANT|Picnic pest
ANY|Even one
APE|Mimic
APT|Fitting
ARC|Rainbow shape
ARE|"Here we ___!"
ARK|Noah's boat
ARM|Limb with an elbow
ART|Craft-fair offering
ASH|Fireplace leftover
ASK|Pose a question
ATE|Had supper
AWE|Wonder
AXE|Woodpile tool
BAG|Feed sack
BAT|Little League club
BAY|Horse color
BED|Garden plot
BEE|Clover visitor
BET|Wager
BIB|Baby's mealtime cover
BIG|Like Texas
BIN|Storage box
BIT|Horse's mouthpiece
BOW|Fiddle stick
BOX|Lunch holder
BUD|Spring blossom-to-be
BUG|Lightning ___
BUN|Hamburger holder
BUS|School ride
BUY|Shop for
CAB|Tractor's enclosed seat
CAN|Put up preserves
CAP|Feed-store hat
CAR|Family vehicle
CAT|Barn mouser
COB|Corn ___
COD|White fish
COT|Camp bed
COW|Pasture mooer
COY|Bashful
CRY|Bawl
CUB|Bear baby
CUP|Coffee holder
CUT|Mow
DAB|Small amount
DAD|Pop
DAM|Beaver's work
DAY|Sunup to sundown
DEN|Fox's home
DEW|Morning grass moisture
DID|Accomplished
DIG|Use a shovel
DIM|Not bright
DIP|Chip go-with
DOE|Mother deer
DOG|Porch pup
DOT|Speck
DRY|Like a drought summer
DUE|Owed
DUG|Excavated
DYE|Easter-egg coloring
EAR|Corn unit
EAT|Dig in
EBB|Low tide
EEL|Slippery swimmer
EGG|Hen's daily gift
ELF|Holiday helper
ELK|Big antlered animal
ELM|Shade tree
EMU|Big flightless bird
END|Finish
ERA|Period of time
EVE|Night before a holiday
EWE|Mother sheep
EYE|Potato spot
FAN|Ceiling cooler
FAR|Way off
FAT|Plump
FED|Gave supper to
FEE|Charge
FEW|Not many
FIG|Backyard fruit tree
FIN|Fish part
FIR|Christmas tree type
FIT|Healthy
FIX|Mend
FLY|Screen-door pest
FOG|Morning mist
FOR|In favor of
FOX|Henhouse prowler
FRY|Cook in a skillet
FUN|Good time
FUR|Coat on a dog
GAL|Lady, in Texas talk
GAP|Fence opening
GAS|Fuel
GEM|Jewel
GET|Fetch
GUM|Chewy treat
GUT|Instinct
GYM|School PE spot
HAM|Easter main dish
HAS|Owns
HAT|Cowboy's topper
HAY|Bale contents
HEM|Skirt edge
HEN|Laying bird
HER|That lady
HEY|"Howdy!"
HID|Played hide-and-seek
HIM|That fellow
HIP|Trendy
HIS|That fellow's
HIT|Smash song
HOE|Weeding tool
HOG|Pig
HOP|Bunny's move
HOT|Like August in Texas
HOW|In what way
HUB|Wheel center
HUE|Shade of color
HUG|Grandma's greeting
HUM|Sing without words
HUT|Small cabin
ICE|Tea glass filler
ICY|Frosty
ILL|Under the weather
INK|Newspaper need
INN|Country lodge
ION|Charged particle
IRE|Anger
ITS|Belonging to it
IVY|Climbing vine
JAM|Biscuit topper
JAR|Mason container
JAY|Blue backyard bird
JET|Plane
JOB|Chore
JOG|Morning run
JOY|Gladness
JUG|Moonshine-free cider holder
KEG|Nail barrel
KEY|Door opener
KID|Young goat
KIN|Family
KIT|Sewing set
LAB|Retriever, for short
LAD|Boy
LAP|Cat's favorite seat
LAW|Rule
LAY|Put down
LEG|Table support
LET|Allow
LID|Pot cover
LIE|Rest on a hammock
LIP|Pitcher spout
LIT|Glowing
LOG|Firewood piece
LOT|Parking area
LOW|Moo
MAN|Fellow
MAP|Road guide
MAT|Welcome ___
MAY|Spring month
MEN|Fellows
MET|Ran into
MIX|Stir together
MOM|Ma
MOP|Floor cleaner
MOW|Cut the lawn
MUD|Rainy-day mess
MUG|Coffee cup
NAP|Sunday afternoon snooze
NET|Fishing gear
NEW|Fresh
NIB|Pen tip
NOD|Yes sign
NOR|Neither's partner
NOT|In no way
NOW|At once
NUT|Pecan, e.g.
OAK|Post ___ (Texas tree)
OAR|Rowboat paddle
OAT|Horse grain
ODD|Unusual
OFF|Not on
OIL|Skillet coat
OLD|Antique
ONE|Single
OPT|Choose
ORB|Sphere
ORE|Mined rock
OUR|Belonging to us
OUT|Not home
OWL|Night hooter
OWN|Possess
PAD|Lily ___
PAL|Buddy
PAN|Skillet
PAT|Gentle tap
PAW|Pup's foot
PAY|Wages
PEA|Pod veggie
PEN|Hog enclosure
PET|Family animal
PIE|Pecan dessert
PIG|Hog
PIN|Quilting need
PIT|Peach center
POD|Pea holder
POP|Dad
POT|Stew holder
PUP|Young dog
PUT|Place
RAG|Polishing cloth
RAM|Male sheep
RAN|Jogged
RAT|Barn rodent
RAW|Uncooked
RAY|Sunbeam
RED|Barn color
RIB|Barbecue cut
RIM|Basket edge
RIP|Tear
ROD|Fishing pole
ROE|Fish eggs
ROW|Corn line
RUB|Barbecue seasoning
RUG|Floor covering
RUN|Sprint
RYE|Bread grain
SAD|Blue
SAG|Droop
SAP|Tree syrup
SAT|Rested on the porch
SAW|Woodworking tool
SAY|Speak
SEA|Ocean
SEE|Look
SET|Ready, ___, go
SEW|Quilt
SHE|That lady
SKY|Big Texas canopy
SLY|Foxy
SOD|Lawn squares
SON|Junior
SOW|Plant seeds
SOY|Bean type
SPA|Relaxing retreat
SUM|Total
SUN|Garden necessity
TAB|Bill
TAG|Playground game
TAN|Summer skin shade
TAP|Faucet
TAR|Road goo
TEA|Sweet porch drink
TEE|Golf peg
TEN|Two fives
THE|Definite article
TIE|Even score
TIN|Can metal
TIP|Helpful hint
TOE|Foot digit
TON|Very heavy load
TOO|Also
TOP|Spinning toy
TOW|Pull a truck
TOY|Plaything
TRY|Attempt
TUB|Washing basin
TUG|Pull
TWO|Pair
URN|Coffee server
USE|Utilize
VAN|Church group vehicle
VAT|Big tank
VET|Animal doctor
VOW|Promise
WAG|Happy tail move
WAR|---
WAS|Used to be
WAX|Candle stuff
WAY|Path
WEB|Spider's work
WED|Marry
WET|Rainy
WHO|"___ goes there?"
WHY|"How come?"
WIG|Hairpiece
WIN|Victory
WIT|Humor
WOK|Stir-fry pan
WON|Took first
WOO|Court
YAK|Chat
YAM|Sweet spud
YAP|Pup bark
YES|Uh-huh
YET|Still
YEW|Evergreen shrub
YOU|"Y'all," singly
ZIP|Close a jacket
ZOO|Animal park
SKI|Snow glider
EMU|Big flightless bird
KEN|Range of knowledge
OAF|Clumsy fellow
UKE|Small strummer, for short
HUH|"Come again?"
OHM|Resistance unit
VIA|By way of
AFT|Toward the stern
TEX|Lone Star nickname
COO|Dove sound
BOA|Feather scarf
FEZ|Tasseled hat
GNU|African antelope
KIT|Young fox
KIWI|Fuzzy fruit
DELI|Sandwich shop
TAXI|City cab
ZINC|Metal in pennies
DISC|Frisbee, e.g.
CHIC|Stylish
MENU|Diner list
TOFU|Bean curd
AQUA|Blue-green
OPAL|October birthstone
OBEY|Mind your elders
OKAY|All right
PREY|Hawk's target
GRAY|Mare color
TOYS|Playthings
DAYS|Calendar squares
BAYS|Coastal inlets
RAYS|Sunbeams
KAYS|---
EYED|Looked over
DYED|Colored, as Easter eggs
EYES|Lookers
HYMN|Church song
LYNX|Wild cat
GYMS|PE spots
SKIP|Hop along
SKIT|Short play
SKID|Slide on ice
KITS|Craft sets
INKY|Very dark
OKIE|Neighbor to the north, informally
JUKE|___ box
JOLT|Jar
JUST|Fair
JABS|Pokes
JAYS|Blue birds
JETS|Planes
JOTS|Notes down
JUGS|Pitchers
BIBS|Baby wear
CUBS|Bear babies
COBS|Corn ___
TUBS|Wash basins
WEBS|Spider works
TABS|Bills
HUBS|Wheel centers
AGOG|Eager
EGGS|Hen's gifts
IGLU|---
FIGS|Backyard fruit
DOGS|Porch pups
HOGS|Pigs
RUGS|Floor covers
BUGS|Insects
LOGS|Firewood
RAGS|Polishing cloths
UNIT|Measure
USED|Second-hand
UPON|On
URGE|Impulse
UNDO|Reverse
UGLY|Not pretty
UNTO|To, old-style
YARD|Back___
YAWN|Sleepy sign
YELL|Holler
YOGA|Stretchy exercise
YUMS|---
WAFT|Drift
VOTE|---
VETS|Animal doctors
VANS|Church group vehicles
VOWS|Promises
VIEWS|---
NONE|Not a one
OUTS|Baseball inning trio
ISLE|Small island
THIS|"___ old house"
ADS|Classified listings
FLEE|Run off
TRIO|Group of three
ONES|Single bills
WASP|Paper-nest builder
ADDS|Tacks on
ANTE|Put in, as chips
TEAS|Sweet and unsweet drinks
SEAS|Oceans
ERAS|Long periods
ARTS|___ and crafts
OATH|Promise
TOES|Foot digits
TEES|Golf pegs
ODES|Poems of praise
ORES|Mined rocks
OWES|Has a tab
EASTS|---
REST|Take a load off
NEST|Robin's home
TEST|Spelling ___
LEST|For fear that
ALSO|Too
SEEN|Spotted
SEES|Spots
TOSS|Pitch
TOTS|Little ones
TOAST|---
RATE|Price
DATE|Calendar day
LATE|Tardy
MATE|Partner
GATES|---
NOTE|Memo
TONE|Pitch
STONE|---
ONTO|Upon
INTO|Within
SOON|Before long
TOON|Cartoon
LOON|Lake bird
NOON|Lunchtime
ROSE|Bloom
NOSE|Sniffer
DOSE|Medicine amount
HOSE|Garden watering line
POSE|Strike a ___
RISE|Get up
WISE|Like an owl
AIDS|Helps
SIDE|Flank
TIDE|Ebb and flow
RIDE|Hayride
HIDE|Play hide-and-seek
WIDE|Broad
SLED|Snow rider
SLOT|Opening
SLOW|Unhurried
SNOW|Rare Texas treat
STEP|Stair
STOP|Halt
SPOT|Dog name
POTS|Stew holders
TOPS|Lids
OPTS|Chooses
POET|Verse writer
TOTE|Carryall
DOTE|Fuss over
NOTED|---
ELSE|Otherwise
ENDS|Finishes
DENS|Fox homes
TENS|Two fives
HENS|Laying birds
PENS|Hog enclosures
TEND|Look after
SEND|Mail
LEND|Loan
MEND|Fix
BEND|Curve in the road
RENT|Lease
TENTS|---
DENT|Truck ding
SENT|Mailed
WENT|Left
LENT|Loaned
EARS|Corn units
EATS|Has supper
SEAT|Chair
TEAR|Rip
NEAR|Close
DEAL|Bargain
REAL|Genuine
SEAL|Close up
HEAR|Listen
YEAR|Twelve months
GEAR|Equipment
PEAS|Black-eyed ___
SEAM|Stitched line
TEAM|Squad
BEAM|Barn rafter
REAP|Harvest
HEAP|Pile
LEAP|Jump
NEAT|Tidy
HEAT|Summer warmth
MEAT|Barbecue fare
BEAT|Drum rhythm
ITEM|Thing
STEM|Stalk
ARMS|Limbs
ARES|Land measures
ACES|Top cards
AGES|Long time
ALES|Ginger drinks
APES|Mimics
APTS|---
ARCS|Rainbows
ASKS|Inquires
ATES|---
AWES|Amazes
INNS|Country lodges
IRES|---
RAIN|Shower
REIN|Bridle strap
RUIN|Spoil
TAIL|Wagger
NAIL|Hammer target
SAIL|Lake boat need
SOIL|Garden dirt
TOIL|Labor
BOIL|Heat to bubbling
COIL|Hose loop
OILS|Lubricates
AILS|Feels poorly
TILE|Floor square
PILE|Heap
MILE|Distance unit
LINE|Row
DINE|Have supper
MINE|Belonging to me
NINE|Baseball team count
PINE|Tall tree
TINE|Fork prong
WINE|---
VINE|Grape plant
SINE|---
TINS|Cans
PINS|Quilting needs
BINS|Storage boxes
FINS|Fish parts
WINS|Victories
NETS|Fishing gear
PETS|Family animals
SETS|Tennis units
LETS|Allows
BETS|Wagers
GETS|Fetches
RODS|Fishing poles
NODS|Says yes silently
PODS|Pea holders
SODS|Lays lawn
ROSY|Pink-cheeked
NOSY|Prying
TIDY|Neat
RIDES|---
DOES|Mother deer
TOED|Steel-___ boots
HOED|Weeded
ROSE|Bloom
ARENA|Rodeo venue
ALONE|Solo
ATONE|Make amends
STONE|Rock
STEAM|Kettle vapor
ABLE|Capable
ACHE|Sore feeling
ACRE|Land measure
AIDE|Helper
ALOE|Soothing plant
AMEN|Prayer ending
ANTS|Picnic pests
APEX|Peak
AREA|Region
ARIA|Opera song
ARID|Dry as dust
ARMS|Limbs
AUNT|Mom's sister
AWAY|Not home
BAKE|Make biscuits
BALE|Hay bundle
BALL|Ballpark sphere
BAND|Marching group
BARN|Hayloft building
BEAD|Necklace bit
BEAN|Pinto, e.g.
BEAR|Big furry animal
BEES|Hive dwellers
BELL|Church steeple sound
BELT|Buckle holder
BEST|Finest
BIKE|Two-wheeler
BIRD|Feeder visitor
BLUE|Sky color
BOAT|Lake vessel
BOLT|Hardware piece
BOOT|Cowboy footwear
BOWL|Gravy holder
BUCK|Male deer
BUSH|Shrub
CAFE|Diner
CAKE|Birthday treat
CALF|Young cow
CALM|Peaceful
CAMP|Summer getaway
CANE|Sugar ___
CARD|Birthday greeting
CART|Wagon
CAVE|Bat home
CHAT|Visit
CHIN|Face part
CITY|Big town
CLAM|Shellfish
CLAY|Pottery stuff
COAT|Jacket
COLD|Chilly
COLT|Young horse
COMB|Honey___
COOK|Make supper
COOP|Henhouse
CORD|Firewood measure
CORN|Ears in a field
COZY|Snug
CREW|Team
CROP|Harvest yield
CROW|Rooster's call
CUBE|Ice shape
CURE|Remedy
CUTE|Adorable
DALE|Valley
DAME|Lady
DARE|Challenge
DART|Dash
DAWN|Sunup
DEAR|Sweetheart
DECK|Back porch platform
DEED|Land paper
DEER|Woods animal
DESK|School furniture
DIAL|Radio knob
DICE|Game cubes
DIET|Eating plan
DIME|Ten cents
DIRT|Garden soil
DISH|Casserole
DOCK|Lake pier
DOLL|Toy figure
DOOR|Screen ___
DOVE|Cooing bird
DOWN|Feather fluff
DRUM|Band beat maker
DUCK|Pond swimmer
DUNE|Sand hill
DUST|Plain-road cloud
EACH|Every one
EARL|Nobleman
EARN|Make wages
EARS|Corn units
EASE|Comfort
EAST|Sunrise direction
EASY|Simple
ECHO|Canyon reply
EDGE|Border
EMIT|Give off
EPIC|Grand story
EVEN|Level
EVER|At all
EWES|Mother sheep
FACE|Clock front
FAIR|County ___
FARM|Crop place
FAWN|Young deer
FEED|Chicken scratch
FERN|Shady plant
FILL|Top off
FIRE|Campfire
FISH|Lake catch
FLAG|Banner
FLAP|Tent door
FLOW|Run, as a creek
FOAL|Young horse
FOLK|Kin
FOOD|Grub
FOOT|Twelve inches
FORK|Supper utensil
FORT|Kids' blanket structure
FROG|Pond hopper
FUEL|Gas
GAME|Ballgame
GATE|Pasture entry
GEAR|Fishing ___
GIFT|Present
GLAD|Happy
GLOW|Firefly light
GLUE|Craft adhesive
GOAT|Kid's mother
GOLD|Medal color
GOOD|Fine
GOWN|Long dress
GRIN|Big smile
GROW|Sprout
GULF|___ of Mexico
HALL|Fellowship ___
HAND|Ranch helper
HARE|Rabbit
HARP|Angel's instrument
HAWK|Soaring bird
HEAL|Mend
HEAT|Texas summer feature
HELP|Lend a hand
HERB|Basil or sage
HERD|Cattle group
HIKE|Trail walk
HILL|Rise in the road
HIVE|Bee home
HOLD|Grasp
HOME|Where the heart is
HONK|Goose call
HOOD|Truck engine cover
HOOF|Horse foot
HOPE|Optimism
HORN|Truck beeper
HOSE|Garden watering line
HOUR|Sixty minutes
HUSK|Corn shuck
IDEA|Bright thought
IDLE|Not busy
IDLY|Without hurry
INCH|Small measure
IRON|Skillet metal
ITEM|Thing
JOKE|Funny line
JUMP|Leap
KALE|Leafy green
KEEP|Hold onto
KIND|Nice
KING|Checkers crown
KITE|Spring sky toy
KNEE|Leg joint
KNIT|Make a scarf
KNOT|Rope tie
LACE|Shoe tie
LAKE|Fishing spot
LAMB|Young sheep
LAMP|Reading light
LAND|Acreage
LANE|Country road
LARK|Songbird
LAWN|Mowing job
LEAF|Fall faller
LEAN|Not fatty
LEND|Loan
LIFT|Raise
LILY|Pond flower
LIME|Citrus fruit
LINE|Fishing ___
LION|Big cat
LIST|Grocery ___
LOAF|Bread unit
LOAN|Lend
LOFT|Hay storage
LONG|Not short
LOOM|Weaver's frame
LOVE|Big affection
LUCK|Good fortune
MAIL|Post
MAIN|___ Street
MANE|Horse's hair
MAPS|Road guides
MARE|Female horse
MEAL|Supper
MEAT|Barbecue fare
MEET|Gather
MELT|Thaw
MILD|Gentle
MILE|Distance unit
MILK|Dairy product
MILL|Grain grinder
MINT|Tea herb
MOON|Night light
MOSS|Shady ground cover
MULE|Sturdy farm animal
NAIL|Hammer target
NAME|Moniker
NEAR|Close by
NEAT|Tidy
NEST|Bird home
NEWS|Paper contents
NICE|Kind
NOON|Lunch time
NOSE|Sniffer
NOTE|Message
OATS|Horse grain
OBOE|Woodwind
OKRA|Fried Southern pod
ONCE|One time
ONTO|Upon
OPEN|Not shut
OVAL|Egg shape
OVEN|Pie baker
OVER|Finished
PACE|Speed
PACK|Backpack
PAGE|Book leaf
PAIL|Bucket
PAIR|Two
PALM|Hand part
PARK|Picnic spot
PATH|Trail
PEAR|Orchard fruit
PEAS|Black-eyed ___
PEEP|Chick sound
PICK|Choose
PIER|Fishing dock
PINE|Tall East Texas tree
PINK|Rosy
PLAN|Scheme
PLAY|School drama
PLOW|Field tiller
PLUM|Purple fruit
POEM|Verse
POLE|Fishing rod
POND|Stock tank
PONY|Small horse
POOL|Swimming hole
PORK|Barbecue choice
POST|Fence ___
PURR|Content cat sound
RACE|Run
RAFT|River float
RAIN|Garden waterer
RAKE|Leaf gatherer
RANT|Long tirade
READ|Peruse the paper
REAL|Genuine
REED|Pond grass
REST|Relax
RICE|Grain
RIDE|Hayride
RING|Bell sound
RISE|Get up
ROAD|Farm-to-market ___
ROAR|Lion sound
ROBE|Bathrobe
ROCK|Stone
ROOF|Tin ___
ROOM|Space
ROOT|Carrot, e.g.
ROPE|Lasso
ROSE|Garden bloom
RUST|Old tractor coating
SAFE|Secure
SAGE|Herb in stuffing
SAIL|Lake boat need
SALT|Shaker contents
SAND|Beach stuff
SEAT|Chair
SEED|Planting need
SEMI|Big rig
SHED|Tool shelter
SHIP|Big boat
SHOE|Horse ___
SHOP|Store
SIGN|Road marker
SILK|Smooth fabric
SING|Choir task
SNUG|Cozy
SOAP|Suds maker
SOCK|Foot warmer
SOFA|Couch
SOIL|Garden dirt
SONG|Tune
SOUP|Bowl of broth
SOUR|Tart
SPUD|Potato
STAR|Lone ___ State
STEM|Flower stalk
STEW|Hearty dish
STIR|Mix
SWIM|Lake activity
TAIL|Dog wagger
TAME|Gentle
TANK|Stock ___
TEAM|Squad
TENT|Camp shelter
TIDE|Ocean rise
TIDY|Neat
TILL|Turn soil
TIME|Clock reading
TOAD|Garden hopper
TOOL|Shed item
TOTE|Carryall bag
TOUR|Visit
TOWN|Small city
TREE|Shade giver
TRIM|Neaten
TUBA|Big brass horn
TUNA|Sandwich fish
TUNE|Melody
VASE|Flower holder
VEST|Sleeveless jacket
VIEW|Scenery
VINE|Grape plant
WADE|Walk in the creek
WAGE|Pay
WALK|Stroll
WALL|Room side
WARM|Toasty
WASH|Clean
WAVE|Friendly hello
WEED|Garden pest
WELL|Water source
WEST|Sunset direction
WHEAT|---
WIND|Breeze
WING|Bird part
WISH|Hope
WOOD|Lumber
WOOL|Sheep coat
WORN|Well-used
YARD|Back___
YARN|Knitting supply
YEAR|Twelve months
YOLK|Egg center
ZERO|Nothing
ZONE|Area
`.trim().split("\n").map((l) => l.split("|")).filter(([a, c]) => c !== "---" && /^[A-Z]{3,4}$/.test(a));

export const LONG = `
PLAYS|School dramas
STAYS|Remains
TRAYS|Serving platters
PRAYS|Says grace
LATHE|Woodshop machine
BATHE|Wash up
BROWN|Pecan color
CROWN|Pageant topper
FLOWS|Runs, as a creek
GROWN|Matured
SHOWS|Fair exhibits
BLOWS|Gusts
HOBBY|Pastime
LOBBY|Entry hall
TABBY|Striped cat
CUBBY|School storage nook
BOBBY|---
NOBLE|Honorable
TABLE|Supper spot
CABLE|Wire
FABLE|Aesop tale
SABLE|Dark fur
SOUPS|Kettle fare on a cool day
WEARY|Tired out after a day in the field
TOTAL|Sum at the bottom of a tally sheet
APPLE|Orchard fruit for pie
ACORN|Oak seed
ANGEL|Tree-topper figure
APRON|Kitchen cover-up
BACON|Breakfast strips
BAKER|Kolache maker
BANJO|Bluegrass instrument
BASIN|Washbowl
BEACH|Sandy shore
BERRY|Bramble fruit
BIBLE|Book on the church pew
BLOOM|Flower
BOOTS|Ropers, e.g.
BREAD|Loaf
BRICK|Chimney block
BROOK|Small stream
BROOM|Porch sweeper
BUNNY|Easter hopper
CABIN|Log home
CANOE|Lake paddler's craft
CHAIR|Rocker, e.g.
CHILI|Cook-off bowl
CHORE|Farm task
CIDER|Apple drink
CLOUD|Sky puff
CLOVE|Spice in a ham
COCOA|Hot winter drink
CREEK|Kickapoo ___
CROPS|Field harvest
DAISY|White-petaled flower
DANCE|Two-step
DINER|Main Street eatery
DITCH|Roadside trench
EAGLE|Soaring raptor
EARTH|Soil
FAIRS|County events
FENCE|Pasture border
FIELD|Pasture
FLOUR|Biscuit base
FLUTE|Band woodwind
FRESH|Just picked
FROST|First fall freeze sign
FRUIT|Peaches and plums
GRAIN|Wheat or oats
GRAPE|Vine fruit
GRASS|Lawn
GRAVY|Biscuit topper
GREEN|Pasture color
GROVE|Pecan ___
HAPPY|Glad
HEART|Love symbol
HEDGE|Shrub row
HOMES|Houses
HONEY|Bee product
HORSE|Saddle animal
HOUSE|Home
JELLY|Toast spread
LEMON|Lemonade fruit
LIGHT|Lamp glow
LODGE|Lake cabin
MANGO|Tropical fruit
MAPLE|Syrup tree
MARSH|Wetland
MELON|Summer fruit
MOVIE|Picture show
MUSIC|Fiddle sounds
OASIS|Desert green spot
OCEAN|Big sea
ONION|Tearful veggie
OTTER|River swimmer
PAINT|Barn coat
PASTA|Noodles
PATCH|Pumpkin ___
PEACH|Fuzzy fruit
PEARL|Gem from an oyster
PECAN|Texas state tree
PIANO|Church keyboard
PLANT|Sow
PLATE|Dinner dish
PORCH|Rocking-chair spot
PRIDE|Hometown feeling
QUILT|Patchwork blanket
RADIO|Farm report source
RANCH|Cattle spread
RIVER|Neches, e.g.
ROBIN|Red-breasted bird
RODEO|Bronc-riding event
ROOST|Hen's perch
SALAD|Garden bowl
SAUCE|Barbecue topper
SCOUT|Merit-badge earner
SEEDS|Planting packets
SHADE|Tree's gift
SHEEP|Flock members
SHELL|Pea-podding job
SMILE|Grin
SPOON|Stirring utensil
STALL|Barn compartment
STEER|Young bull
STORE|Shop
STORY|Tale
STOVE|Kitchen range
STRAW|Hay cousin
SUGAR|Sweetener
SUNNY|Bright
SUPER|Great
SWEET|Like iced tea, Texas-style
TABLE|Supper spot
TOAST|Breakfast bread
TRACK|School running oval
TRAIL|Hiking path
TRAIN|Railroad car line
TREAT|Goodie
TRUCK|Pickup
TULIP|Spring bulb bloom
UNCLE|Dad's brother
WAGON|Hay hauler
WATER|Well output
WHEAT|Flour grain
WHEEL|Wagon part
YEAST|Bread riser
YOUTH|Young folks
NESTLED|Settled snugly, as a hen on her eggs
ORDERED|Sent away for, as seeds from a catalog
SUPPOSE|Reckon
ADHERED|Stuck fast
AWESOME|Wonderful
BALCONY|Upper porch
BANQUET|Big feast
BASKETS|Picnic carriers
BEDTIME|Story hour
BISCUIT|Gravy partner
BLANKET|Quilt
BLOSSOM|Spring flower
BLUEJAY|Noisy backyard bird
BONFIRE|Homecoming blaze
BOUQUET|Flower bunch
BRISKET|Texas barbecue cut
BUFFALO|Bison
CABBAGE|Slaw veggie
CAMPING|Tent trip
CANDIES|Sweets
CARROTS|Orange root veggies
CATFISH|Fried Friday fish
CHAPELS|Small churches
CHEERED|Rooted for the team
CHICKEN|Coop bird
CORNDOG|Fair food on a stick
CORRALS|Horse pens
COTTAGE|Small home
COUNTRY|Rural area
COWBELL|Pasture clanger
COWBOYS|Ranch hands
CRAYONS|Coloring box
CRICKET|Chirping insect
CUSTARD|Pie filling
DAYTIME|Hours of sun
DOORWAY|Entry
EARNEST|Sincere
EVENING|Supper time
FARMERS|Field workers
FEATHER|Down piece
FESTIVE|Merry
FIDDLER|Square-dance musician
FISHING|Lake pastime
FOREVER|Always
FREEDOM|Liberty
FREIGHT|Train cargo
GARDENS|Veggie plots
GRANDMA|Nana
GRANDPA|Papaw
HARVEST|Fall gathering
HEALTHY|Fit
HEAVENS|Starry sky
HIGHWAY|State road
HOLIDAY|Day off
HOTCAKE|Pancake
HUNDRED|Ten tens
INSTEAD|In place of that
JOURNEY|Trip
KINDEST|Nicest
KITCHEN|Biscuit-making room
LANTERN|Porch light
LAUGHED|Chuckled
LEATHER|Saddle material
LETTERS|Mail
LIBRARY|Book-lending spot
MAILBOX|Roadside post holder
MEADOWS|Grassy fields
MORNING|Sunup time
MUFFINS|Bakery treats
NOTABLE|Worth noting
OATMEAL|Hot breakfast cereal
OCTOBER|Fair month in Texas
ORCHARD|Fruit-tree grove
OUTDOOR|Al fresco
PANCAKE|Flapjack
PARADES|Main Street processions
PEANUTS|Ballpark snack
PICKLES|Dill jars
PICNICS|Outdoor meals
PILGRIM|Thanksgiving figure
PITCHER|Tea server
PLANTED|Sowed
POPCORN|Movie snack
POTLUCK|Covered-dish supper
POTTERY|Clay crafts
PRAIRIE|Grassland
PRESENT|Gift
PUMPKIN|Jack-o'-lantern
RAINBOW|Arc after a storm
RANCHER|Cattle owner
READERS|Newspaper fans
RESTFUL|Peaceful
ROOSTER|Morning crower
SADDLES|Horse seats
SANDBOX|Kids' dig spot
SEASONS|Fall and spring
SERVICE|Sunday worship
SHELTER|Refuge
SINGING|Choir work
SKILLET|Cast-iron pan
SPARKLE|Twinkle
STADIUM|Football field
STATION|Depot
SUNBEAM|Ray of light
SUNRISE|Daybreak
SUNSETS|Evening glows
TEACHER|School instructor
THEATER|Show house
THUNDER|Storm rumble
TRACTOR|Field machine
TRAILER|Horse hauler
TURKEYS|Thanksgiving birds
UPRIGHT|Piano type
VILLAGE|Small town
VISITOR|Guest
WARMEST|Coziest
WEATHER|Farm-report topic
WELCOME|Doormat word
WESTERN|Cowboy movie
WILDCAT|Bobcat
WINDOWS|Panes
WINTERS|Cold seasons
`.trim().split("\n").map((l) => l.split("|")).filter(([a, c]) => c && c !== "---" && /^[A-Z]{5}$|^[A-Z]{7}$/.test(a));

// Everyday fill words (clean, common), added Oct. 12, 2026 so the generator can fill grids on its own.
const MORE = `
BUT|However
HAD|Owned
SIX|Half a dozen
BAD|Not good
BAR|Candy ___
BOY|Lad
BID|Auction offer
MAX|Upper limit
SUB|Hoagie
GUY|Fellow
MID|Middle
AVE|Main St. alternative
SIR|Polite address
SIT|Take a seat
WOW|"Gee whiz!"
BIO|Life story, briefly
MED|Doctor's prescription, for short
MAD|Upset
APP|Phone program
DUO|Pair
YEA|"Yes," in old-time talk
BYE|"See ya!"
EAU|Water, in French
GIG|Band booking
PIC|Snapshot
AYE|Sailor's yes
RID|Free (of)
ZEN|Calm state
THAT|"___'s a fine pie!"
WITH|Alongside
FROM|Sent by
YOUR|"___ turn!"
HAVE|Own
MORE|Extra
FREE|No charge
THEY|Those folks
WHAT|"Say ___?"
ONLY|Just
WHEN|At what time
HERE|"Come ___, pup!"
BEEN|Has ___ there
WERE|Used to be
SOME|A few
LIKE|Enjoy
THAN|Compared to
FIND|Discover
BACK|Rear
NEXT|Following
WORK|Labor
LAST|Final
MOST|Greatest amount
MAKE|Build
THEM|Those folks
THEN|After that
HIGH|Tall
BOOK|Library loan
NEED|Must have
MANY|Lots
SAID|Spoke
FULL|Stuffed
LIFE|Living
KNOW|Understand
PART|Piece
MUST|Have to
MADE|Built
TYPE|Kind
TAKE|Grab
WANT|Wish for
SHOW|County fair exhibit
MUCH|A lot
FILE|Nail tool
LINK|Chain loop
CASE|Pickle ___ (jar box)
SAME|Identical
BOTH|The two
CARE|Look after
SIZE|Shoe number
FORM|Shape
CALL|Phone
SAVE|Put away for later
SALE|Garage ___
JOIN|Sign up
LOOK|Peek
LEFT|Departed
WEEK|Seven days
LIVE|Dwell
COST|Price
COME|"___ on in!"
LESS|Fewer
GIVE|Donate
SELL|Peddle
BODY|Physique
CLUB|Garden ___
HARD|Tough
FOUR|Quartet number
BABY|Newborn
TERM|School semester
HEAD|Lettuce unit
SELF|Own person
SURE|Certain
TELL|Say
PAST|Bygone days
FIVE|Fingers on a hand
SAYS|States
DONE|Finished
WORD|Term
BILL|Duck's beak
TALK|Chat
KIDS|Young goats
TRUE|Factual
MARK|Grade
TIPS|Hints
PLUS|In addition
EDIT|Revise
FAST|Quick
FACT|Truth
FEEL|Touch
BANK|Creek side
GOLF|Links game
SORT|Kind
HALF|Fifty percent
BASE|Bottom
STAY|"___ awhile!"
TURN|Rotate
MEAN|Average
COPY|Duplicate
CASH|Money
PORT|Harbor
HELD|Gripped
MIND|Brain
LOST|Missing
ROLE|Play part
CAME|Arrived
FINE|Just dandy
HUGE|Enormous
MOVE|Relocate
LEAD|Guide
MODE|Way of doing
FUND|Bake sale goal
TOOK|Grabbed
FALL|Autumn
PAID|Settled up
HAIR|Mane
THUS|Therefore
WAYS|Paths
RULE|Guideline
TOLD|Said
FEET|Twelve inches each
COOL|Chilly
USES|Employs
PASS|Hand over
FEES|Charges
SKIN|Peel
BOYS|Lads
DEEP|Not shallow
BORN|Arrived as a baby
CORE|Apple center
DARK|Not light
HOST|Party giver
TRIP|Journey
POOR|Needy
LORD|Nobleman
GOES|Departs
WIFE|Spouse
HITS|Smash songs
FLAT|Level
LOTS|Plenty
FIRM|Solid
GOAL|Target
SOLD|Bought
WILD|Untamed
SOFT|Cushy
WAIT|Hold on
LOAD|Wagonful
TAGS|Labels
DROP|Dew bead
RICH|Wealthy
SEEM|Appear
HIRE|Employ
GAVE|Donated
RANK|Order
GONE|Away
GENE|Heredity unit
ICON|Symbol
CAST|Play's actors
FELT|Craft fabric
SOUL|Spirit
GAIN|Increase
LACK|Shortage
KNEW|Understood
ZOOM|Speed along
BLOW|Gust
CLIP|Fasten
WIRE|Fence strand
TAPE|Sticky roll
CENT|Penny
ROLL|Dinner bread
BATH|Tub soak
JAZZ|Music genre
BAGS|Sacks
WEAR|Have on
RARE|Uncommon
BARS|Candy units
LADY|Ma'am
FANS|Supporters
TOLL|Bridge fee
WHOM|To which person
MATH|Arithmetic
KEPT|Saved
BASS|Lake fish
HOLE|Golf cup
RUNS|Ball game scores
PEAK|Summit
PLUG|Outlet insert
LOSE|Misplace
SEEK|Look for
EXIT|Way out
KEYS|Piano parts
HOLY|Sacred
DRAW|Sketch
LEGS|Table supports
REAR|Back
LOCK|Door fastener
BOND|Tie
PURE|Unspoiled
LENS|Camera eye
LOOP|Ring
VARY|Change
PUSH|Shove
TWIN|One of a pair
SUIT|Dress up
CHIP|Potato snack
GRID|Crossword pattern
PULL|Tug
PUMP|Well handle
EXAM|Test
GREY|Ash color
BOLD|Brave
SCAN|Look over
AGED|Mellowed
BULK|Large amount
BONE|Dog treat
BUSY|Occupied
NECK|Giraffe feature
TINY|Wee
RAIL|Fence bar
TUBE|Inner ___
PIPE|Plumbing piece
THIN|Slender
MALL|Shopping center
FELL|Tumbled
POUR|Serve tea
WAKE|Rise
HUNT|Egg ___
BURN|Sunburn
LAID|Set down
ODDS|Chances
WOLF|Howler
FITS|Suits
KICK|Punt
SLIP|Slide
CAPS|Lids
SPIN|Twirl
HERO|Champion
MICE|Barn critters
VAST|Huge
WRAP|Bundle up
MOOD|Feeling
QUIZ|Pop test
SHUT|Closed
MASK|Costume face
COAL|Stove fuel
BEEF|Brisket meat
HATS|Caps
SURF|Ride waves
HOOK|Fishing need
TONS|Lots
HANG|Put up
FAME|Renown
DREW|Sketched
GREW|Sprouted
TIES|Knots
CHEF|Cook
COIN|Quarter, e.g.
ARCH|Curved doorway
LANG|---
TIED|Knotted
FOLD|Crease
LIPS|Smile makers
TIRE|Truck wheel
RIPE|Ready to pick
RELY|Depend
NUTS|Pecans and such
PADS|Cushions
CUPS|Mugs
FOAM|Suds
LOUD|Noisy
PRAY|Say grace
BARE|Empty
DIVE|Jump in the lake
GRIP|Hold
SNAP|Green bean
SWAP|Trade
FLIP|Turn a pancake
TRAY|Serving platter
GRAB|Snatch
TRAP|Snare
MEMO|Note
REEF|Coral ridge
CLAN|Family group
MESA|Flat-topped hill
ABOUT|Concerning
OTHER|Different
WHICH|What one
THEIR|Belonging to them
THERE|In that place
FIRST|Number one
WOULD|"___ you like some pie?"
THESE|This bunch
PRICE|Cost
STATE|Texas, e.g.
WORLD|Globe
AFTER|Following
WHERE|In what place
BOOKS|Library holdings
ORDER|Request
GROUP|Bunch
UNDER|Below
GAMES|Board ___
GREAT|Terrific
RIGHT|Correct
LOCAL|Hometown
THOSE|Them over there
PHONE|Call
BLACK|Coal color
CHECK|Verify
TODAY|This day
SOUTH|Toward Houston from Tyler
FOUND|Discovered
PHOTO|Snapshot
POWER|Strength
WHILE|During
THREE|Trio number
PLACE|Spot
THINK|Ponder
NORTH|Up on a map
GUIDE|Lead
BOARD|Plank
WHITE|Snow color
SMALL|Little
TIMES|Occasions
LEVEL|Even
HOURS|Store schedule
TITLE|Name of a book
CLASS|School group
STILL|Motionless
MONEY|Cash
EVERY|Each
VISIT|Stop by
TOOLS|Shed contents
VALUE|Worth
PRESS|Iron
LEARN|Study
PRINT|Publish
STOCK|Livestock
POINT|Tip
LARGE|Big
START|Begin
HUMAN|Person
GOING|Leaving
STUDY|Learn
AGAIN|Once more
NEVER|Not ever
BELOW|Beneath
ABOVE|Overhead
YOUNG|Youthful
PAPER|Newspaper
NIGHT|Evening
TEXAS|Lone Star State
WRITE|Pen a letter
OFFER|Propose
GIVEN|Granted
EVENT|Happening
MIGHT|Strength
MONTH|Calendar page
SPACE|Room
CARDS|Greeting ___
CHILD|Youngster
SHARE|Split
ADDED|Tacked on
UNTIL|Up to
COLOR|Hue
LEAST|Smallest
TRADE|Swap
CLOSE|Near
DRIVE|Sunday ride
SHORT|Not tall
DAILY|Every day
STYLE|Fashion
FRONT|Porch side
EARLY|Before sunup
MILES|Road distances
SOUND|Noise
THING|Object
THIRD|Bronze-medal place
COVER|Lid
OFTEN|Frequently
WATCH|Look
WORDS|Crossword answers
CLEAR|Cloudless
QUICK|Fast
WHOLE|Entire
LATER|Afterward
BASIC|Simple
ALONG|Beside
AMONG|Amid
SPEED|Pace
BRAND|Cattle mark
DOING|Up to
SHOES|Sneakers
ENTRY|Doorway
NOTES|Music marks
ALBUM|Photo book
PLANS|Blueprints
BUILD|Construct
LINES|Rows
APPLY|Put on
ASKED|Inquired
CROSS|Go over
WEEKS|Seven-day spans
LOWER|Let down
UNION|Joining
NAMES|Monikers
LEAVE|Depart
SCORE|Game tally
SHOWN|Displayed
IDEAS|Thoughts
ALLOW|Permit
CAUSE|Reason
FOCUS|Attention
ROOMS|Spaces
VOICE|Singing ability
GLASS|Tea holder
THANK|Show gratitude
READY|Prepared
ROUND|Circular
BUILT|Constructed
AWARD|Prize
EXTRA|Additional
QUITE|Very
STARS|Night lights
OWNER|Proprietor
BRING|Carry along
GRAND|Splendid
WROTE|Penned
GUEST|Visitor
TRUST|Faith
GRADE|School year
FLOOR|Ground level
MATCH|Campfire starter
SENSE|Feel
STAGE|Theater platform
MAYBE|Perhaps
ENJOY|Like
BLOCK|Toy cube
STEEL|Strong metal
SONGS|Tunes
HANDS|Ranch workers
WORTH|Value
PEACE|Calm
COAST|Shoreline
AGREE|Concur
SCALE|Weigh
STAND|Roadside produce ___
FRAME|Picture border
CHIEF|Leader
HEARD|Listened
BEGIN|Start
CLEAN|Tidy
PIECE|Slice of pie
SHEET|Bed linen
SEVEN|Days in a week
OLDER|Elder
LOOKS|Glances
STONE|Rock
LABEL|Jar tag
COUNT|Tally
ALONE|Solo
SAINT|Holy one
UPPER|Higher
PRIME|Top quality
BEGAN|Started
STEPS|Stairs
SHOPS|Stores
TOURS|Visits
HEAVY|Weighty
SOLID|Firm
TOUCH|Feel
SERVE|Dish up
MAGIC|Wonder
SMART|Clever
BIRTH|Arrival
FAITH|Belief
CHAIN|Swing support
REACH|Extend
TRUTH|Fact
CHART|Graph
EQUAL|Same
FUNNY|Humorous
TRIED|Attempted
MOUSE|Barn critter
DREAM|Wish
CARRY|Tote
HELLO|Howdy
EIGHT|Octet number
QUEEN|Chess piece
SPEAK|Talk
RURAL|Country
SLEEP|Rest
SCENE|View
DRINK|Sip
AHEAD|In front
TREES|Shade givers
DRESS|Sunday frock
CLOCK|Timepiece
CREAM|Coffee add-in
BOXES|Crates
HILLS|Rolling rises
AWARE|Mindful
SHAPE|Form
SHARP|Keen
COACH|Team leader
PLAIN|Simple
BUDDY|Pal
STICK|Twig
EXACT|Precise
STORM|Thunder event
NOVEL|Book
BROAD|Wide
GUARD|Protect
LUNCH|Midday meal
TOWER|Water ___
SOLAR|Sun-powered
CATCH|Grab
DOORS|Entries
TWICE|Two times
BIRDS|Feeder visitors
TEACH|Instruct
HUMOR|Wit
PLANE|Aircraft
GRACE|Mealtime prayer
TASTE|Sample
PROUD|Pleased
GIANT|Huge
SEATS|Chairs
QUIET|Hushed
CRAFT|Handiwork
PRIZE|Blue ribbon
ALIVE|Living
WINGS|Bird parts
RIDGE|Hilltop line
SKILL|Talent
BOATS|Lake craft
ROADS|Byways
LAKES|Fishing spots
DIARY|Journal
FLAGS|Banners
SINGLE|---
BLANK|Empty
PANTS|Trousers
`.trim().split("\n").map((l) => l.split("|")).filter(([a, c]) => c && c !== "---" && /^[A-Z]{3,5}$|^[A-Z]{7}$/.test(a));
for (const e of MORE) (e[0].length <= 4 ? WORDS : LONG).push(e);

const MORE4 = `
AREA|Region
ERIE|One of the Great Lakes
OLEO|Margarine
ALOE|Soothing plant
ALSO|As well
ALTO|Choir voice
ANEW|Once more
AVID|Eager
AXLE|Wagon rod
EAST|Toward Tyler from Dallas
EDEN|Garden paradise
ELSE|Otherwise
ENTER|---
EPIC|Grand tale
ETCH|Engrave
EVER|At any time
EXIT|Way out
IDEA|Notion
IDOL|Hero
INTO|Inside of
IOTA|Tiny bit
IRIS|Spring bloom
ISLE|Small island
LEST|For fear that
LOAN|Lend
LONE|___ Star State
NAPE|Back of the neck
NEAR|Close
NEON|Bright sign gas
NERD|Bookworm
OARS|Rowboat paddles
OATS|Horse feed
OBOE|Woodwind
OGLE|Stare at
OMEN|Sign of things to come
ONES|Singles
OPEN|Unlocked
ORAL|Spoken
OVAL|Racetrack shape
OVEN|Pie baker
OWED|Had a tab
OWLS|Night hooters
RANT|Long gripe
RARE|Uncommon
RATE|Speed
RAVE|Glowing review
REAR|Back end
REDO|Do over
RENT|Lease
ROAM|Wander
ROLE|Part
ROTE|Memorization
ROVE|Wander
RUDE|Impolite
RUNE|Ancient letter
SAGA|Long story
SALE|Bargain event
SANE|Sensible
SASH|Window frame
SEAR|Brown on a grill
SERE|Dry
SLAT|Fence board
SLAW|Barbecue side
SLED|Snow rider
SNOB|Stuck-up sort
SOAR|Glide high
SODA|Fizzy drink
SOLO|Singing alone
SORE|Achy
STAR|Lone ___
STIR|Mix
TACO|Folded tortilla
TALE|Story
TAPE|Sticky roll
TARO|Island root
TART|Lemon pastry
TEAL|Blue-green
TERN|Seabird
TIER|Wedding cake layer
TOGA|Roman robe
TONE|Sound quality
TORE|Ripped
TOTE|Carry
TRAP|Snare
TREK|Long hike
TRIO|Threesome
TUNE|Melody
UNTIL|---
URGE|Impulse
VASE|Flower holder
VETO|Reject
ACHE|Hurt
ACRE|Farm measure
AGOG|Eager
AHEM|Throat clearer
ALAS|"Too bad!"
ALOE|Burn soother
AMID|In the middle of
ANTE|Poker-free pot? No
APSE|Church nook
ARCH|Doorway curve
ATOP|On top of
AUNT|Uncle's wife
AURA|Glow
AWED|Amazed
BAIT|Worm on a hook
BALD|Hairless
BARE|Uncovered
BEET|Red root veggie
BLUR|Fuzzy image
BOAR|Wild hog
BRIM|Hat edge
CAPE|Cloak
CARE|Concern
CLOD|Dirt clump
COLA|Soft drink
CORE|Center
CUBE|Ice ___
DARE|Challenge
DEAN|College head
DEBT|What's owed
DIRE|Serious
DOTE|Fuss over
DRAB|Dull
DUET|Song for two
EARL|British noble
EASE|Comfort
EDGE|Rim
ELAN|Flair
ELMS|Shade trees
EMIT|Give off
ENDS|Finishes
EONS|Ages
EPEE|Fencing sword
ERAS|Ages
ERRS|Slips up
EVEN|Level
EVES|Holiday nights before
FARE|Bus price
FATE|Destiny
FLEA|Dog pest
FOES|Rivals
GALE|Strong wind
GLEE|Joy
GLEN|Valley
GOAL|Aim
HALO|Angel's ring
HARE|Rabbit cousin
HEAL|Get better
HEEL|Shoe part
HERO|Champion
HIRE|Take on
HOLE|Golf cup
HOSE|Garden line
IDLE|Not busy
INCH|Small measure
IRON|Press clothes
ITEM|Article
JADE|Green gem
KEEN|Sharp
KITE|Breezy-day toy
LACE|Shoe tie
LADE|Load up
LAIR|Den
LANE|Country road
LARD|Pie crust fat
LATE|Tardy
LEAN|Tilt
LIAR|Fibber
LIEN|---
LIME|Citrus fruit
LIRA|Old Italian money
LOBE|Ear part
LODE|Ore vein
LORE|Folk tales
LOSE|Misplace
LOUT|Clod
LURE|Fishing bait
MANE|Lion's hair
MARE|Horse mom
MEAN|Average
MERE|Just
MESA|Flat-top hill
MILE|Distance
MITE|Tiny bug
MOAT|Castle ditch
MOLE|Garden digger
MOTE|Speck
MULE|Farm animal
MUSE|Inspiration
NEAT|Tidy
NODE|Branch point
NONE|Not any
NOSE|Sniffer
OBEY|Mind
ODOR|Smell
OPAL|Gem
OREO|Cookie favorite
OUST|Remove
PALE|Light-colored
PANE|Window glass
PARE|Peel
PEAR|Fruit
PEEL|Skin
PIER|Dock
POET|Verse writer
PORE|Study closely
RACE|Run
RAIL|Fence bar
RAKE|Leaf tool
RAPT|Engrossed
REED|Marsh plant
REEL|Fishing gear
REIN|Bridle strap
RILE|Annoy
RIND|Melon skin
ROAN|Horse color
SAGE|Wise
SALT|Shaker item
SCAR|Old wound mark
SEED|Plant start
SEEN|Spotted
SILO|Grain tower
SITE|Location
SNAG|Catch
SOLE|Shoe bottom
SORT|Kind
STAG|Male deer
STEP|Stair
TAME|Docile
TARE|Container weight
TEAR|Rip
TEEN|Teenager
TELL|Say
TIDE|Ocean flow
TILE|Floor square
TOAD|Hopper
TOLL|Road fee
TRAIL|---
TRIM|Clip
TUNA|Fish
UNDO|Reverse
USER|App person
VEIL|Bride's cover
VOLE|Field mouse
WADE|Walk in water
WANE|Fade
WARE|Pottery
WEAR|Have on
WEIR|Low dam
WHET|Sharpen
WREN|Small songbird
YELL|Holler
ACTS|Performs
ALIT|Landed
AMES|---
ARID|Dry
ASEA|Out on the ocean
ATES|---
EARN|Make
EATEN|---
ELKS|Big deer
ERST|---
ESTE|---
ETAS|---
LEAD|Guide
LIED|Fibbed
LOAD|Fill
LOIN|Pork cut
NEED|Want
NOEL|Christmas carol
ONTO|Upon
OPTS|Picks
ORCA|Black-and-white whale
OTTO|---
RAID|Fridge ___ (late snack)
READ|Peruse
REST|Relax
RIDE|Hayride
ROAR|Lion's sound
ROSE|Bloom
RUSE|Trick
SAID|Spoke
SEAT|Chair
SIDE|Edge
SLID|Slipped
SNIT|Huff
STEAL|---
TEND|Look after
TIED|Even
TOIL|Labor
TRIP|Journey
TROT|Horse gait
`.trim().split("\n").map((l) => l.split("|")).filter(([a, c]) => c && c !== "---" && !c.includes("?") && /^[A-Z]{4}$/.test(a));
WORDS.push(...MORE4);
