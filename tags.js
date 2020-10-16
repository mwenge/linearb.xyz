var tagValues = [
];

var tags = new Map();
for (var tag of tagValues) {
  if (tags.has(tag[0])) {
    tags.get(tag[0]).push(tag[1]);
    continue;
  }
  tags.set(tag[0], [tag[1]]);
}

var periodNames = new Map([
["EM", "3500-1900 BCE"],
["EMI", "3500-2900 BCE"],
["EMII", "2900-2300 BCE"],
["EMIIIi", "2300-1900 BCE"],
["MHIII", "2000-1550 BCE"],
["MM", "1900-1650 BCE"],
["MMI", "1900-1800 BCE"],
["MMIA", "1900-1850 BCE"],
["MMIB", "1900-1800 BCE"],
["MMII", "1800-1650 BCE"],
["MMIIA", "1800-1750 BCE"],
["MMIIB", "1750-1650 BCE"],
["MMIII", "1750-1600 BCE"],
["MMIIIA", "1750-1650 BCE"],
["NP",  "1650-1450 BCE"],
["MMIIIB", "(1650-1600 BCE"],
["LMI", "1600-1450 BCE"],
["LMIA", "1600-1500 BCE"],
["LMIB", "1500-1450 BCE"],
["CM",  "1450-1100 BCE"],
["LHI",  "1550-1450 BCE"],
["LBI",  "1550-1400 BCE"],
["LMII", "1  1450-1350 BCE"],
["LMIII",  "1400-1100 BCE"],
["LMIIIA",  "1350-1100 BCE"],
["SM",  "1100-1000 BCE"],
["Geometric",  "1000BCE"],
["LH IIIA", "c.1400–c.1300 BC"],
["LH IIIB/C", "c.1300–c.1060 BC"],
["LH IIIB2/LH IIIC", "c.1300–c.1060 BC"],
["LH IIIB", "c.1300–c.1200 BC"],
["LH IIIB:1", "c.1300–c.1200 BC"],
["LH IIIB:1", "c.1300–c.1200 BC"],
["LH IIIB:2", "c.1230–c.1190 BC"],
["LH IIIB:2", "c.1230–c.1190 BC"],
["LH IIIB:2", "c.1230–c.1190 BC"],
["LM IIIB", "1400-1100 BCE"],
["LM BIII", "1400-1100 BCE"],
["LM IIIA1?", "1400-1100 BCE"],
["LM IIIA2-early?", "1400-1100 BCE"],
["LM IIIA2-late?", "1400-1100 BCE"],
["LH IIIA2", "c.1400–c.1300 BC"],
["LH IIIA:2-LH IIIB?", "c.1400–c.1300 BC"],
["LH IIIB", "c.1300–c.1200 BC"],
["LH IIIB/C", "c.1300–c.1200 BC"],
["LH IIIA-2late?", "c.1400–c.1300 BC"],
["LH IIIA:2", "c.1400–c.1300 BC"],
["LH IIIB2", "c.1400–c.1300 BC"],
["LM IIIB:1!", "1350-1100 BCE"],
["LM IIIB:1", "1350-1100 BCE"],
["LM IIIB:2!", "1350-1100 BCE"],
["LM IIIB:2/C!", "1350-1100 BCE"],
["LM BIII:2!", "1350-1100 BCE"],
["LM BIII:2%", "1350-1100 BCE"],
["LM IIIB:1!", "1350-1100 BCE"],
["LM IIIB:1", "1350-1100 BCE"],
["LM IIIB:2!", "1350-1100 BCE"],
]);

var periodNamesVerbose = new Map([
["EM", "Pre-palace period 3500-1900 BCE"],
["EMI", "Early Minoan I  3500-2900 BCE"],
["EMII", "Early Minoan IIA, IIB  2900-2300 BCE"],
["EMIIIi", "Early Minoan III, Middle Minoan IA  2300-1900 BCE"],
["MHIII", "Middle Helladic 2000-1550 BCE"],
["MM", "Old Palace period 1900-1650 BCE"],
["MMI", "Middle Minoan I  1900-1800 BCE"],
["MMIA", "Middle Minoan IA  1900-1850 BCE"],
["MMIB", "Middle Minoan IB  1900-1800 BCE"],
["MMII", "Middle Minoan II  1800-1650 BCE"],
["MMIIA", "Middle Minoan IIA  1800-1750 BCE"],
["MMIIB", "Middle Minoan IIB, IIIA 1750-1650 BCE"],
["MMIII", "Middle Minoan III 1750-1600 BCE"],
["MMIIIA", "Middle Minoan IIB, IIIA 1750-1650 BCE"],
["NP",  "New Palace period 1650-1450 BCE"],
["MMIIIB", "(first) Middle Minoan IIIB  1650-1600 BCE"],
["LMI", "Late Minoan I 1600-1450 BCE"],
["LMIA", "Late Minoan IA 1600-1500 BCE"],
["LMIB", "Late Minoan IB  1500-1450 BCE"],
["CM",  "Creto-Mycenaean period  1450-1100 BCE"],
["LHI",  "1550-1450 BCE"],
["LBI",  "1550-1400 BCE"],
["LMII", "Third Palace period, Late Minoan II, IIIA1  1450-1350 BCE"],
["LMIII",  "Post Palace period. Late Minoan IIIA2, IIIB, IIIC 1400-1100 BCE"],
["LMIIIA",  "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["SM",  "Sub-Minoan period 1100-1000 BCE"],
["Geometric",  "1000BCE"],
["LH IIIA", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LH IIIB/C", "Late Helladic IIIB  c.1300–c.1060 BC"],
["LH IIIB2/LH IIIC", "Late Helladic IIIB  c.1300–c.1060 BC"],
["LH IIIB", "Late Helladic IIIB  c.1300–c.1200 BC"],
["LH IIIB:1", "Late Helladic IIIB  c.1300–c.1200 BC"],
["LH IIIB:1", "Late Helladic IIIB  c.1300–c.1200 BC"],
["LH IIIB:2", "Late Helladic IIIB  c.1230–c.1190 BC"],
["LH IIIB:2", "Late Helladic IIIB  c.1230–c.1190 BC"],
["LH IIIB:2", "Late Helladic IIIB  c.1230–c.1190 BC"],
["LM IIIB", "Post Palace period. 1400-1100 BCE"],
["LM BIII", "Post Palace period. 1400-1100 BCE"],
["LM IIIA1?", "Post Palace period. 1400-1100 BCE"],
["LM IIIA2-early?", "Post Palace period. 1400-1100 BCE"],
["LM IIIA2-late?", "Post Palace period. 1400-1100 BCE"],
["LH IIIA2", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LH IIIA:2-LH IIIB?", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LH IIIB", "Late Helladic IIIB  c.1300–c.1200 BC"],
["LH IIIB/C", "Late Helladic IIIB  c.1300–c.1200 BC"],
["LH IIIA-2late?", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LH IIIA:2", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LH IIIB2", "Late Helladic IIIA  c.1400–c.1300 BC"],
["LM IIIB:1!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:1", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:2!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:2/C!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM BIII:2!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM BIII:2%", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:1!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:1", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["LM IIIB:2!", "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
]);


var contexts = new Map();
for (var inscription of inscriptions.values()) {
  var key = inscription.name;
  var context = inscription.context;
  if (contexts.has(key)) {
    contexts.get(key).push(periodNames.get(context));
    continue;
  }
  if (!context) {
    continue;
  }
  if (!periodNames.has(context)) {
    console.log("Missing context: " + context);
  }
  contexts.set(key, [periodNames.get(context)]);
}

var syllableValues = [
  ["𐀀", "a"],
  ["𐀁", "e"],
  ["𐀂", "i"],
  ["𐀃", "o"],
  ["𐀄", "u"],
  ["𐀅", "da"],
  ["𐀆", "de"],
  ["𐀇", "di"],
  ["𐀈", "do"],
  ["𐀉", "du"],
  ["𐀊", "ja"],
  ["𐀋", "je"],
  ["𐀍", "jo"],
  ["𐀎", "ju"],
  ["𐀏", "ka"],
  ["𐀐", "ke"],
  ["𐀑", "ki"],
  ["𐀒", "ko"],
  ["𐀓", "ku"],
  ["𐀔", "ma"],
  ["𐀕", "me"],
  ["𐀖", "mi"],
  ["𐀗", "mo"],
  ["𐀘", "mu"],
  ["𐀙", "na"],
  ["𐀚", "ne"],
  ["𐀛", "ni"],
  ["𐀜", "no"],
  ["𐀝", "nu"],
  ["𐀞", "pa"],
  ["𐀟", "pe"],
  ["𐀠", "pi"],
  ["𐀡", "po"],
  ["𐀢", "pu"],
  ["𐀣", "qa"],
  ["𐀤", "qe"],
  ["𐀥", "qi"],
  ["𐀦", "qo"],
  ["𐀨", "ra"],
  ["𐀩", "re"],
  ["𐀪", "ri"],
  ["𐀫", "ro"],
  ["𐀬", "ru"],
  ["𐀭", "sa"],
  ["𐀮", "se"],
  ["𐀯", "si"],
  ["𐀰", "so"],
  ["𐀱", "su"],
  ["𐀲", "ta"],
  ["𐀳", "te"],
  ["𐀴", "ti"],
  ["𐀵", "to"],
  ["𐀶", "tu"],
  ["𐀷", "wa"],
  ["𐀸", "we"],
  ["𐀹", "wi"],
  ["𐀺", "wo"],
  ["𐀼", "za"],
  ["𐀽", "ze"],
  ["𐀿", "zo"],
  ["𐁀", "a2"],
  ["𐁁", "a3"],
  ["𐁁", "ai"],
  ["𐁂", "au"],
  ["𐁃", "dwe"],
  ["𐁄", "dwo"],
  ["𐁅", "nwa"],
  ["𐁆", "pu2"],
  ["𐁇", "pte"],
  ["𐁈", "ra2"],
  ["𐁉", "ra3"],
  ["𐁊", "ro2"],
  ["𐁋", "ta2"],
  ["𐁌", "twe"],
  ["𐁍", "two"],
  ["𐁐", "*18"],
  ["𐁑", "*19"],
  ["𐁓", "*34"],
  ["𐁔", "*47"],
  ["𐁕", "*49"],
  ["𐁖", "*56"],
  ["𐁗", "*63"],
  ["𐁘", "*64"],
  ["𐁙", "*79"],
  ["𐁚", "*82"],
  ["𐁛", "*83"],
  ["𐁜", "*86"],
  ["𐁝", "*89"],
  ["𐂗", "*132"],
  ["𐂜", "*142"],
  ["𐂞", "*146"],
  ["𐂟", "*150"],
  ["𐂡", "*152"],
  ["𐂢", "*153"],
  ["𐂣", "*154"],
  ["𐂥", "*157"],
  ["𐂦", "*158"],
  ["𐂨", "*160"],
  ["𐂩", "*161"],
  ["𐂬", "*164"],
  ["𐂭", "*165"],
  ["𐂮", "*166"],
  ["𐂯", "*167"],
  ["𐂰", "*168"],
  ["𐂱", "*169"],
  ["𐂲", "*170"],
  ["𐂳", "*171"],
  ["𐂴", "*172"],
  ["𐂶", "*174"],
  ["𐂸", "*177"],
  ["𐂹", "*178"],
  ["𐂺", "*179"],
  ["𐂻", "*180"],
  ["𐂼", "*181"],
  ["𐂽", "*182"],
  ["𐂾", "*183"],
  ["𐂿", "*184"],
  ["𐃀", "*185"],
  ["𐃁", "*189"],
  ["𐃂", "*190"],
  ["𐃈", "*232"],
  ["𐃊", "*234"],
  ["𐃐", "*245"],
  ["𐃑", "*246"],
  ["𐃓", "*248"],
  ["𐃔", "*249"],
  ["𐃕", "*251"],
  ["𐃖", "*252"],
  ["𐃗", "*253"],
  ["𐃙", "*255"],
  ["𐃚", "*256"],
  ["𐃛", "*257"],
  ["𐃜", "*258"],
  ["𐃝", "*259"],
  ["𐃺", "*305"],
  ["𐄇", "1"],
  ["𐄈", "2"],
  ["𐄈𐄊", "6"],
  ["𐄉", "3"],
  ["𐄊", "4"],
  ["𐄋", "5"],
  ["𐄌", "6"],
  ["𐄍", "7"],
  ["𐄎", "8"],
  ["𐄏", "9"],
  ["𐄐", "10"],
  ["𐄐𐄇", "11"],
  ["𐄐𐄈", "12"],
  ["𐄐𐄉", "13"],
  ["𐄐𐄊", "14"],
  ["𐄐𐄋", "15"],
  ["𐄐𐄌", "16"],
  ["𐄐𐄍", "17"],
  ["𐄐𐄎", "18"],
  ["𐄐𐄏", "19"],
  ["𐄑", "20"],
  ["𐄑𐄇", "21"],
  ["𐄑𐄈", "22"],
  ["𐄑𐄉", "23"],
  ["𐄑𐄊", "24"],
  ["𐄑𐄋", "25"],
  ["𐄑𐄌", "26"],
  ["𐄑𐄍", "27"],
  ["𐄑𐄎", "28"],
  ["𐄑𐄏", "29"],
  ["𐄑𐄓𐄊", "64"],
  ["𐄒", "30"],
  ["𐄒𐄇", "31"],
  ["𐄒𐄈", "32"],
  ["𐄒𐄉", "33"],
  ["𐄒𐄊", "34"],
  ["𐄒𐄋", "35"],
  ["𐄒𐄌", "36"],
  ["𐄒𐄍", "37"],
  ["𐄓", "40"],
  ["𐄓𐄇", "41"],
  ["𐄓𐄈", "42"],
  ["𐄓𐄉", "43"],
  ["𐄓𐄋", "45"],
  ["𐄓𐄌", "46"],
  ["𐄓𐄍", "47"],
  ["𐄓𐄎", "48"],
  ["𐄔", "50"],
  ["𐄔𐄇", "51"],
  ["𐄔𐄈", "52"],
  ["𐄔𐄉", "53"],
  ["𐄔𐄊", "54"],
  ["𐄔𐄋", "55"],
  ["𐄔𐄌", "56"],
  ["𐄔𐄍", "57"],
  ["𐄔𐄎", "58"],
  ["𐄕", "60"],
  ["𐄕𐄇", "61"],
  ["𐄕𐄊", "64"],
  ["𐄕𐄋", "65"],
  ["𐄕𐄌", "66"],
  ["𐄕𐄍", "67"],
  ["𐄖", "70"],
  ["𐄖𐄇", "71"],
  ["𐄖𐄊", "74"],
  ["𐄖𐄋", "75"],
  ["𐄖𐄎", "78"],
  ["𐄗", "80"],
  ["𐄗𐄇", "81"],
  ["𐄗𐄊", "82"],
  ["𐄗𐄌", "84"],
  ["𐄗𐄍", "87"],
  ["𐄘", "90"],
  ["𐄘𐄉", "93"],
  ["𐄘𐄋", "95"],
  ["𐄘𐄍", "97"],
  ["𐄙", "100"],
  ["𐄙𐄈", "102"],
  ["𐄙𐄊", "104"],
  ["𐄙𐄋", "105"],
  ["𐄙𐄎", "108"],
  ["𐄙𐄏", "109"],
  ["𐄙𐄐", "110"],
  ["𐄙𐄐𐄉", "113"],
  ["𐄙𐄑", "120"],
  ["𐄙𐄑𐄉", "123"],
  ["𐄙𐄑𐄏", "129"],
  ["𐄙𐄒", "130"],
  ["𐄙𐄒𐄊", "134"],
  ["𐄙𐄓", "140"],
  ["𐄙𐄔𐄌", "156"],
  ["𐄙𐄕", "160"],
  ["𐄙𐄕𐄇", "161"],
  ["𐄙𐄕𐄋", "165"],
  ["𐄙𐄗", "180"],
  ["𐄙𐄘𐄍", "197"],
  ["𐄚", "200"],
  ["𐄚𐄇", "201"],
  ["𐄚𐄍", "207"],
  ["𐄚𐄑", "220"],
  ["𐄚𐄒", "230"],
  ["𐄚𐄒𐄉", "233"],
  ["𐄚𐄒𐄊", "234"],
  ["𐄚𐄒𐄋", "235"],
  ["𐄚𐄓", "240"],
  ["𐄚𐄓𐄋", "245"],
  ["𐄚𐄔", "250"],
  ["𐄚𐄘", "290"],
  ["𐄚𐄘𐄈", "291"],
  ["𐄛", "300"],
  ["𐄛𐄒𐄋", "335"],
  ["𐄛𐄔𐄉", "353"],
  ["𐄜", "400"],
  ["𐄜𐄑", "402"],
  ["𐄜𐄔𐄈", "451"],
  ["𐄝", "500"],
  ["𐄝𐄖", "570"],
  ["𐄞", "600"],
  ["𐄞𐄑", "620"],
  ["𐄞𐄗", "680"],
  ["𐄞𐄗𐄊", "684"],
  ["𐄟", "700"],
  ["𐄠", "800"],
  ["𐄡", "900"],
  ["𐄡𐄓𐄇", "941"],
  ["𐄡𐄖𐄌", "976"],
  ["𐄢", "1000"],
  ["𐄣", "2000"],
  ["𐄤", "3000"],
  ["𐄥", "4000"],
  ["𐄦", "5000"],
  ["𐄧", "6000"],
  ["𐄨", "7000"],
  ["𐄩", "8000"],
  ["𐄪", "9000"],
  ["𐄫", "10000"],
  ["𐄬", "20000"],
  ["𐄭", "30000"],
  ["𐄮", "40000"],
  ["𐄯", "50000"],
  ["𐄰", "60000"],
  ["𐄱", "70000"],
  ["𐄲", "80000"],
  ["𐄳", "90000"],
  ["𐝀", "6/10", ""],
  ["𐝀", "≈ ¹⁄₆", ""],
  ["𐝁", "¹⁄₃", ""],
  ["𐝂", "¹⁄₅", ""],
  ["𐝂𐝂", "double mina"],
  ["𐝃", "¹⁄₄", ""],
  ["𐝃𐝄", "³⁄₈", ""],
  ["𐝄", "¹⁄₈", ""],
  ["𐝅", "≈ ¹⁄₆", ""],
  ["𐝆", "¹⁄₂", ""],
  ["𐝆𐝃", "³⁄₄"],
  ["𐝆𐝄", "⅝"],
  ["𐝆𐝉", "13/20"],
  ["𐝇", "¹⁄₁₆", ""],
  ["𐝌", "cum 𐙕", ""],
  ["𐝎", ".3"],
  ["𐝏", "≈ ¹⁄₄", ""],
  ["𐝐", "cum 𐚥 ≈ ¹⁄₂", ""],
  ["𐝕", "³⁄₄"],
];

var syllableToGlyph = new Map();
var glyphToSyllable = new Map();
for (var syllableValue of syllableValues) {
  var glyph = syllableValue[0];
  var syllable = syllableValue[1];
  if (!syllableToGlyph.has(key)) {
    syllableToGlyph.set(syllable, glyph);
  }
  if (!glyphToSyllable.has(key)) {
    glyphToSyllable.set(glyph, syllable);
  }
}

