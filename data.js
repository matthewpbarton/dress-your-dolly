(function () {
  'use strict';

  var SCENES = [
    { id: 'ballroom', label: 'Ballroom', icon: '🏰' },
    { id: 'garden', label: 'Garden', icon: '🌹' },
    { id: 'balcony', label: 'Balcony', icon: '🌙' }
  ];

  var SKIN_TONES = [
    { id: 'porcelain', label: 'Porcelain', base: '#ffe7dc', shadow: '#f2c3b3', highlight: '#fff5f0', blush: '#ff96ad' },
    { id: 'peach', label: 'Peach Blossom', base: '#fbd3be', shadow: '#e4a78c', highlight: '#ffebdf', blush: '#ff879e' },
    { id: 'honey', label: 'Warm Honey', base: '#ecc098', shadow: '#cf9465', highlight: '#fadbbb', blush: '#f77d8c' },
    { id: 'olive', label: 'Golden Olive', base: '#d9aa7e', shadow: '#b58052', highlight: '#ecc7a1', blush: '#ec7484' },
    { id: 'caramel', label: 'Caramel Glow', base: '#be8356', shadow: '#945d36', highlight: '#d69f74', blush: '#e06478' },
    { id: 'cinnamon', label: 'Cinnamon Bronze', base: '#9e623d', shadow: '#774325', highlight: '#b87b54', blush: '#cf566a' },
    { id: 'cocoa', label: 'Rich Cocoa', base: '#76462b', shadow: '#522c17', highlight: '#8e5a3d', blush: '#be4f64' },
    { id: 'espresso', label: 'Deep Espresso', base: '#512e1e', shadow: '#351b10', highlight: '#6a412d', blush: '#b0485e' }
  ];

  var EXPRESSIONS = [
    { id: 'happy', label: 'Happy Smile', icon: '😊' },
    { id: 'wink', label: 'Wink', icon: '😉' },
    { id: 'royal', label: 'Royal Poise', icon: '👑' },
    { id: 'laugh', label: 'Excited Laugh', icon: '😄' },
    { id: 'cool', label: 'Cool Shades', icon: '😎' },
    { id: 'blush', label: 'Cute Blush', icon: '🥰' },
    { id: 'starry', label: 'Starry Eyes', icon: '🤩' }
  ];

  var HAIR_COLORS = [
    { id: 'blonde', label: 'Golden Blonde', base: '#f7cf52', shadow: '#cf9a24', highlight: '#fff1a6' },
    { id: 'chestnut', label: 'Chestnut Brown', base: '#754128', shadow: '#4c2614', highlight: '#9e6142' },
    { id: 'black', label: 'Midnight Black', base: '#252134', shadow: '#13101d', highlight: '#4a4366' },
    { id: 'ginger', label: 'Ginger Copper', base: '#dd602a', shadow: '#a63c14', highlight: '#ff965e' },
    { id: 'caramel', label: 'Honey Caramel', base: '#c58444', shadow: '#945b24', highlight: '#e7ae6e' },
    { id: 'espresso', label: 'Dark Espresso', base: '#42261c', shadow: '#27140e', highlight: '#663f30' },
    { id: 'pink', label: 'Pastel Pink', base: '#ff8ec9', shadow: '#d6569b', highlight: '#ffc9e7' },
    { id: 'blue', label: 'Royal Blue', base: '#3d72f5', shadow: '#2148b5', highlight: '#89b4ff' },
    { id: 'purple', label: 'Magic Purple', base: '#9e54e8', shadow: '#6b2bb5', highlight: '#d09eff' },
    { id: 'silver', label: 'Moon Silver', base: '#d9e3f4', shadow: '#9eadc7', highlight: '#ffffff' },
    { id: 'mint', label: 'Fairy Mint', base: '#4bd6b5', shadow: '#269c81', highlight: '#a7f7e2' },
    { id: 'ruby', label: 'Ruby Red', base: '#db2b58', shadow: '#9c1539', highlight: '#ff7296' }
  ];

  var HAIRSTYLES = [
    { id: 'wavy_princess', label: 'Princess Waves' },
    { id: 'braided_crown', label: 'Braided Crown' },
    { id: 'space_buns', label: 'Space Buns' },
    { id: 'short_bob', label: 'Cute Bob' },
    { id: 'high_ponytail', label: 'High Ponytail' },
    { id: 'curly_afro', label: 'Curly Afro' },
    { id: 'twin_braids', label: 'Twin Braids' },
    { id: 'mermaid_long', label: 'Mermaid Locks' },
    { id: 'pixie_cut', label: 'Fairy Pixie' }
  ];

  var OUTFITS = [
    // Full Dresses & Suits
    { id: 'gown_pink', slot: 'fullOutfit', category: 'gowns', label: 'Pink Ballgown', primary: '#ff74b8', secondary: '#ffd6eb', accent: '#ffe169' },
    { id: 'gown_gold', slot: 'fullOutfit', category: 'gowns', label: 'Gold Ballgown', primary: '#ffbe33', secondary: '#fff1b8', accent: '#ff5ca8' },
    { id: 'gown_ice', slot: 'fullOutfit', category: 'gowns', label: 'Ice Blue Gown', primary: '#5bc9ff', secondary: '#dff5ff', accent: '#ffffff' },
    { id: 'gown_emerald', slot: 'fullOutfit', category: 'gowns', label: 'Emerald Gown', primary: '#22b573', secondary: '#a8f2cb', accent: '#ffd34d' },
    { id: 'knight_armor', slot: 'fullOutfit', category: 'gowns', label: 'Royal Armor', primary: '#b5c2d9', secondary: '#4d6185', accent: '#ffd24a' },
    { id: 'hero_cosmic', slot: 'fullOutfit', category: 'gowns', label: 'Cosmic Hero', primary: '#6941e8', secondary: '#ff4ba6', accent: '#4af0ff' },
    { id: 'hero_solar', slot: 'fullOutfit', category: 'gowns', label: 'Solar Hero', primary: '#ff4e50', secondary: '#ffbe2e', accent: '#fff4a3' },
    { id: 'wizard_robe', slot: 'fullOutfit', category: 'gowns', label: 'Wizard Robe', primary: '#49309e', secondary: '#835af2', accent: '#ffd64d' },

    // Tops
    { id: 'top_hoodie', slot: 'top', category: 'tops', label: 'Pastel Hoodie', primary: '#ff96cf', secondary: '#a4e3ff', accent: '#ffffff' },
    { id: 'top_denim', slot: 'top', category: 'tops', label: 'Denim Jacket', primary: '#4c80d4', secondary: '#ffffff', accent: '#ffcf56' },
    { id: 'top_graphic', slot: 'top', category: 'tops', label: 'Star Tee', primary: '#ffffff', secondary: '#ff5ea8', accent: '#48c8ff' },
    { id: 'top_tunic', slot: 'top', category: 'tops', label: 'Knight Tunic', primary: '#3962c7', secondary: '#c5d2eb', accent: '#ffce47' },
    { id: 'top_puff', slot: 'top', category: 'tops', label: 'Princess Blouse', primary: '#fff5fa', secondary: '#ffa8d5', accent: '#ffd35c' },
    { id: 'top_varsity', slot: 'top', category: 'tops', label: 'Varsity Jacket', primary: '#9549e8', secondary: '#fff7e8', accent: '#ffbe2e' },

    // Bottoms
    { id: 'bot_pleated', slot: 'bottom', category: 'bottoms', label: 'Pleated Skirt', primary: '#ff6ba9', secondary: '#ffe3f1', accent: '#643a7a' },
    { id: 'bot_cargo', slot: 'bottom', category: 'bottoms', label: 'Cargo Pants', primary: '#6f9c6b', secondary: '#4a6e47', accent: '#ffd466' },
    { id: 'bot_jeans', slot: 'bottom', category: 'bottoms', label: 'Star Jeans', primary: '#4674c9', secondary: '#77a5f2', accent: '#ffde59' },
    { id: 'bot_tulle', slot: 'bottom', category: 'bottoms', label: 'Tulle Skirt', primary: '#b578ff', secondary: '#f2dcff', accent: '#ffffff' },
    { id: 'bot_leggings', slot: 'bottom', category: 'bottoms', label: 'Galaxy Leggings', primary: '#2d235e', secondary: '#8258ff', accent: '#62e8ff' },
    { id: 'bot_shorts', slot: 'bottom', category: 'bottoms', label: 'Denim Shorts', primary: '#5689e0', secondary: '#ff8cc2', accent: '#ffffff' }
  ];

  var SHOES = [
    { id: 'shoes_glass', label: 'Glass Slippers', primary: '#b5eeff', secondary: '#ffffff', accent: '#75d6ff' },
    { id: 'shoes_heels', label: 'Sparkly Heels', primary: '#ff52a2', secondary: '#ffbddf', accent: '#ffe066' },
    { id: 'shoes_sneakers', label: 'High-Tops', primary: '#45b7ff', secondary: '#ffffff', accent: '#ff5ca8' },
    { id: 'shoes_combat', label: 'Combat Boots', primary: '#3b2d4a', secondary: '#6b5382', accent: '#ffbe2e' },
    { id: 'shoes_magic', label: 'Floating Boots', primary: '#8e4eff', secondary: '#5bf0ff', accent: '#ffe169' },
    { id: 'shoes_ballet', label: 'Ballet Ribbons', primary: '#ffa8d2', secondary: '#fff2f8', accent: '#ff69b4' },
    { id: 'shoes_knight', label: 'Knight Boots', primary: '#b2c0d9', secondary: '#607396', accent: '#ffd24a' }
  ];

  var ACCESSORIES = [
    // Headwear
    { id: 'hat_tiara', subSlot: 'headwear', group: 'headwear', label: 'Princess Tiara', primary: '#ffd24a', secondary: '#ff70b8' },
    { id: 'hat_crown', subSlot: 'headwear', group: 'headwear', label: 'Royal Crown', primary: '#ffbe2e', secondary: '#ff427b' },
    { id: 'hat_wizard', subSlot: 'headwear', group: 'headwear', label: 'Wizard Hat', primary: '#5634b8', secondary: '#ffdc52' },
    { id: 'hat_flower', subSlot: 'headwear', group: 'headwear', label: 'Flower Crown', primary: '#ff7ab8', secondary: '#6de084' },

    // Wings
    { id: 'wings_fairy', subSlot: 'wings', group: 'wings', label: 'Fairy Wings', primary: '#a8f2ff', secondary: '#ffb8e8' },
    { id: 'wings_angel', subSlot: 'wings', group: 'wings', label: 'Angel Wings', primary: '#ffffff', secondary: '#ffe9a8' },
    { id: 'wings_dragon', subSlot: 'wings', group: 'wings', label: 'Dragon Wings', primary: '#8234c9', secondary: '#ff699e' },

    // Capes
    { id: 'cape_royal', subSlot: 'cape', group: 'cape', label: 'Royal Cape', primary: '#d92356', secondary: '#fff8e8' },
    { id: 'cape_hero', subSlot: 'cape', group: 'cape', label: 'Hero Cape', primary: '#ff4a5e', secondary: '#ffce3b' },
    { id: 'cape_galaxy', subSlot: 'cape', group: 'cape', label: 'Star Cloak', primary: '#39287d', secondary: '#7ee8ff' },

    // Handheld
    { id: 'prop_wand', subSlot: 'handheld', group: 'handheld', label: 'Magic Wand', primary: '#ffd84d', secondary: '#ff7ac6' },
    { id: 'prop_sword', subSlot: 'handheld', group: 'handheld', label: 'Royal Sword', primary: '#dce6f7', secondary: '#ffbe2e' },
    { id: 'prop_scepter', subSlot: 'handheld', group: 'handheld', label: 'Crystal Scepter', primary: '#6be8ff', secondary: '#ffd24a' },
    { id: 'prop_shield', subSlot: 'handheld', group: 'handheld', label: 'Knight Shield', primary: '#4b7bec', secondary: '#ffd24a' },

    // Eyewear
    { id: 'glasses_star', subSlot: 'eyewear', group: 'eyewear', label: 'Star Glasses', primary: '#ff52a8', secondary: '#fff275' },
    { id: 'glasses_heart', subSlot: 'eyewear', group: 'eyewear', label: 'Heart Glasses', primary: '#ff4778', secondary: '#ffd1e3' },
    { id: 'glasses_mask', subSlot: 'eyewear', group: 'eyewear', label: 'Hero Mask', primary: '#5639d9', secondary: '#4af0ff' },
    { id: 'glasses_wizard', subSlot: 'eyewear', group: 'eyewear', label: 'Round Glasses', primary: '#ffbe2e', secondary: '#d9f6ff' }
  ];

  var ACCESSORY_GROUPS = [
    { id: 'headwear', title: '👑 Hats, Tiaras & Crowns' },
    { id: 'wings', title: '🦋 Magical Wings' },
    { id: 'cape', title: '🦸 Flowing Capes' },
    { id: 'handheld', title: '🪄 Wands, Swords & Gear' },
    { id: 'eyewear', title: '🕶️ Glasses & Masks' }
  ];

  var PETS = [
    { id: 'none', label: 'No Pet', primary: '#ece0f5', secondary: '#ffffff' },
    { id: 'pet_dragon', label: 'Baby Dragon', primary: '#39c983', secondary: '#ffd24a' },
    { id: 'pet_unicorn', label: 'Fluffy Unicorn', primary: '#ffffff', secondary: '#ff94d6' },
    { id: 'pet_corgi', label: 'Royal Corgi', primary: '#f29f4b', secondary: '#ffffff' },
    { id: 'pet_cat', label: 'Magic Cat', primary: '#2d243b', secondary: '#9752eb' },
    { id: 'pet_phoenix', label: 'Baby Phoenix', primary: '#ff6f3c', secondary: '#ffd93d' }
  ];

  var JUDGE_QUOTES = [
    '5/5 Stars! Royal Masterpiece!',
    '5/5 Stars! Super Magical Style!',
    '5/5 Stars! Legendary Castle Icon!',
    '5/5 Stars! Runway Superstar!',
    '5/5 Stars! Fairy-Tale Perfection!',
    '5/5 Stars! Dazzling Royal Sparkle!'
  ];

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  window.DollyData = {
    SCENES: SCENES,
    SKIN_TONES: SKIN_TONES,
    EXPRESSIONS: EXPRESSIONS,
    HAIR_COLORS: HAIR_COLORS,
    HAIRSTYLES: HAIRSTYLES,
    OUTFITS: OUTFITS,
    SHOES: SHOES,
    ACCESSORIES: ACCESSORIES,
    ACCESSORY_GROUPS: ACCESSORY_GROUPS,
    PETS: PETS,
    JUDGE_QUOTES: JUDGE_QUOTES,
    byId: byId
  };
})();
