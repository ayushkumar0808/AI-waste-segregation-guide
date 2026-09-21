export interface WasteRuleSection {
  id: string;
  title: string;
  category: string;
  binColor: string;
  clause: string;
  content: string;
  keywords: string[];
}

export interface SegregationResult {
  item: string;
  category: string;
  binColor: 'Green' | 'Blue' | 'Yellow' | 'Red';
  reason: string;
  tip: string;
  isHazardous: boolean;
  sourceUsed: {
    title: string;
    clause: string;
    snippet: string;
    relevanceScore: number;
  };
  mode: string;
}

export const SWM_2016_RULES: WasteRuleSection[] = [
  {
    id: 'wet-waste',
    title: 'Section 1: Wet Waste (Biodegradable / Compostable)',
    category: 'Wet Waste',
    binColor: 'Green',
    clause: 'SWM Rules 2016, Rule 4(1)(a)',
    content: 'Organic, moist, and decomposable matter originating from kitchens, food preparation, dining, and gardening activities. Decomposes naturally through microbial composting or bio-methanation. Every waste generator shall store biodegradable waste separately in green containers.',
    keywords: ['food', 'banana', 'apple', 'peel', 'peels', 'vegetable', 'fruit', 'egg', 'eggshell', 'tea', 'coffee', 'bone', 'meat', 'rice', 'curry', 'bread', 'leaves', 'leaf', 'garden', 'flower', 'compost', 'wet', 'leftover', 'leftovers']
  },
  {
    id: 'dry-waste',
    title: 'Section 2: Dry Waste (Recyclable Non-Biodegradable)',
    category: 'Dry / Recyclable',
    binColor: 'Blue',
    clause: 'SWM Rules 2016, Rule 4(1)(a) & (d)',
    content: 'Clean, non-decomposable, dry waste items suitable for material recovery facilities and recycling units. Includes clean paper, cardboard boxes, clean plastic containers, PET bottles, clean aluminum foil, cans, newspapers, and glass. For greasy pizza boxes, clean cardboard lids go to Blue Bin, while heavily oil-soaked bases must be segregated for refuse-derived fuel (RDF) or composting.',
    keywords: ['paper', 'cardboard', 'box', 'pizza', 'plastic', 'bottle', 'bottles', 'foil', 'can', 'cans', 'tin', 'newspaper', 'glass', 'carton', 'wrapper', 'cup', 'metal', 'container', 'dry', 'magazine', 'packaging']
  },
  {
    id: 'hazardous-waste',
    title: 'Section 3: Domestic Hazardous Waste',
    category: 'Domestic Hazardous',
    binColor: 'Red',
    clause: 'SWM Rules 2016, Rule 4(1)(c)',
    content: 'Household waste containing toxic, corrosive, flammable, or bio-accumulative chemicals. Includes expired medicines, paint cans, aerosol sprays, pesticide cans, mercury thermometers, and harsh chemical cleaners. Must be kept separate and handed over to designated municipal hazardous collection points.',
    keywords: ['medicine', 'tablet', 'syrup', 'paint', 'spray', 'pesticide', 'insecticide', 'chemical', 'acid', 'mercury', 'thermometer', 'bulb', 'cfl', 'fluorescent', 'bleach', 'toxic', 'poison', 'cleaner']
  },
  {
    id: 'e-waste',
    title: 'Section 4: E-Waste (Electronic & Electrical Equipment)',
    category: 'E-Waste',
    binColor: 'Yellow',
    clause: 'E-Waste (Management) Rules 2016/2022 & SWM 2016',
    content: 'Discarded electrical and electronic items, batteries, circuit boards, and charging peripherals. Must never be thrown into common garbage. Must be channeled through campus e-waste drives, authorized recyclers, or manufacturer Extended Producer Responsibility (EPR) take-back programs.',
    keywords: ['battery', 'batteries', 'cell', 'charger', 'cable', 'cord', 'wire', 'earphone', 'headphones', 'phone', 'mobile', 'laptop', 'remote', 'electronic', 'circuit', 'pcb', 'usb', 'gadget', 'screen', 'keyboard', 'mouse']
  },
  {
    id: 'sanitary-waste',
    title: 'Section 5: Sanitary and Biomedical Waste',
    category: 'Sanitary Waste',
    binColor: 'Red',
    clause: 'SWM Rules 2016, Rule 4(2)',
    content: 'Personal hygiene products and small medical items including used sanitary napkins, diapers, bandages, and lancets. Must be wrapped securely in newspaper or pouches to protect waste workers from occupational infections and biological hazards.',
    keywords: ['sanitary', 'pad', 'napkin', 'diaper', 'band-aid', 'bandage', 'cotton', 'syringe', 'needle', 'lancet', 'gauze', 'biomedical']
  }
];

export function runTfidfAndClassify(input: string): SegregationResult {
  const cleanInput = input.trim().toLowerCase();
  const inputWords = cleanInput.split(/\s+/).filter(w => w.length > 1);

  // 1. Calculate TF-IDF style keyword match scores against SWM sections
  let bestSection = SWM_2016_RULES[1]; // default dry waste
  let highestScore = 0;

  for (const section of SWM_2016_RULES) {
    let matchCount = 0;
    for (const word of inputWords) {
      if (section.keywords.some(k => k.includes(word) || word.includes(k))) {
        matchCount += 1;
      }
    }
    const score = inputWords.length > 0 ? matchCount / inputWords.length : 0;
    if (score > highestScore) {
      highestScore = score;
      bestSection = section;
    }
  }

  // 2. Specific Rule Matching & Nuance Logic
  const has = (terms: string[]) => terms.some(t => cleanInput.includes(t));

  if (has(['pizza']) && has(['box', 'grease', 'oily', 'used', 'soiled'])) {
    return {
      item: input,
      category: 'Dry / Recyclable (Special Caution)',
      binColor: 'Blue',
      reason: 'Grease and cheese oils saturate paper fibers, making them unrecyclable at paper mills. Only clean parts go into the Blue Bin.',
      tip: 'Tear off the clean cardboard top lid for the Blue recycling bin. Place the food-stained greasy bottom part into organic waste or non-recyclable refuse.',
      isHazardous: false,
      sourceUsed: {
        title: bestSection.title,
        clause: 'SWM Rules 2016, Rule 4(1)(d) - Contaminated Recyclables',
        snippet: 'Cardboard contaminated with grease or food oils cannot be recycled with clean paper streams and must be segregated.',
        relevanceScore: Math.max(0.88, highestScore)
      },
      mode: 'Rule-Based Engine (Demo Mode)'
    };
  }

  if (has(['battery', 'cell', 'charger', 'earphone', 'cable', 'phone', 'laptop', 'wire', 'e-waste', 'gadget', 'circuit'])) {
    return {
      item: input,
      category: 'E-Waste',
      binColor: 'Yellow',
      reason: 'Contains electronic components, chemical electrolytes, and heavy metals that pollute landfills and pose fire hazards.',
      tip: 'Tape the battery terminals with masking tape to avoid short circuits, and deposit at campus or municipal e-waste collection bins.',
      isHazardous: true,
      sourceUsed: {
        title: SWM_2016_RULES[3].title,
        clause: SWM_2016_RULES[3].clause,
        snippet: SWM_2016_RULES[3].content,
        relevanceScore: Math.max(0.92, highestScore)
      },
      mode: 'Rule-Based Engine (Demo Mode)'
    };
  }

  if (has(['medicine', 'tablet', 'syrup', 'paint', 'pesticide', 'chemical', 'mercury', 'thermometer', 'bulb', 'cfl'])) {
    return {
      item: input,
      category: 'Domestic Hazardous Waste',
      binColor: 'Red',
      reason: 'Poses chemical, toxic, or environmental pollution risks to soil, groundwater, and municipal waste workers.',
      tip: 'Keep out of reach of children and pets. Do not pour down the drain; wait for municipal hazardous collection drives.',
      isHazardous: true,
      sourceUsed: {
        title: SWM_2016_RULES[2].title,
        clause: SWM_2016_RULES[2].clause,
        snippet: SWM_2016_RULES[2].content,
        relevanceScore: Math.max(0.95, highestScore)
      },
      mode: 'Rule-Based Engine (Demo Mode)'
    };
  }

  if (has(['sanitary', 'diaper', 'pad', 'napkin', 'band-aid', 'bandage', 'syringe', 'needle'])) {
    return {
      item: input,
      category: 'Sanitary / Biomedical Waste',
      binColor: 'Red',
      reason: 'Contains bodily fluids and potential biological pathogens requiring secure wrapping to safeguard sanitation staff.',
      tip: 'Wrap securely in several layers of newspaper or a biodegradable pouch with a red dot before disposal. Never flush down toilets.',
      isHazardous: true,
      sourceUsed: {
        title: SWM_2016_RULES[4].title,
        clause: SWM_2016_RULES[4].clause,
        snippet: SWM_2016_RULES[4].content,
        relevanceScore: Math.max(0.91, highestScore)
      },
      mode: 'Rule-Based Engine (Demo Mode)'
    };
  }

  if (has(['banana', 'peel', 'food', 'vegetable', 'fruit', 'curry', 'rice', 'bread', 'tea', 'coffee', 'egg', 'bone', 'compost', 'leaf', 'leaves', 'garden'])) {
    return {
      item: input,
      category: 'Wet Waste (Biodegradable)',
      binColor: 'Green',
      reason: 'Organic biodegradable matter that naturally decomposes into nutrient-rich compost or biogas via aerobic digestion.',
      tip: 'Drain liquids before binning to prevent odor, or use a small balcony composter to generate organic compost for hostel or home plants.',
      isHazardous: false,
      sourceUsed: {
        title: SWM_2016_RULES[0].title,
        clause: SWM_2016_RULES[0].clause,
        snippet: SWM_2016_RULES[0].content,
        relevanceScore: Math.max(0.89, highestScore)
      },
      mode: 'Rule-Based Engine (Demo Mode)'
    };
  }

  // Default: Dry / Recyclable
  return {
    item: input,
    category: bestSection.category,
    binColor: bestSection.binColor as any,
    reason: 'Non-biodegradable, clean material suitable for segregation, sorting, and mechanical recycling at Material Recovery Facilities (MRFs).',
    tip: 'Rinse off residues, dry the packaging, and flatten containers or cardboard to conserve bin space.',
    isHazardous: bestSection.binColor === 'Red' || bestSection.binColor === 'Yellow',
    sourceUsed: {
      title: bestSection.title,
      clause: bestSection.clause,
      snippet: bestSection.content,
      relevanceScore: Math.max(0.75, highestScore)
    },
    mode: 'Rule-Based Engine (Demo Mode)'
  };
}
