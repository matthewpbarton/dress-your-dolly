(function () {
  'use strict';

  var D = window.DollyData;
  var AudioFX = window.DollyAudio;
  var Renderer = window.DollyRenderer;

  var state = {
    scene: 'ballroom',
    skinTone: 'peach',
    expression: 'happy',
    hairstyle: 'wavy_princess',
    hairColor: 'blonde',
    fullOutfit: 'gown_pink',
    top: null,
    bottom: null,
    shoes: 'shoes_glass',
    accessories: {
      headwear: 'hat_tiara',
      wings: null,
      cape: null,
      eyewear: null,
      handheld: null
    },
    pet: 'none',
    activeTab: 'body',
    outfitFilter: 'all',
    isRunway: false
  };

  var renderer = null;
  var toastTimer = null;

  // ==================== INLINE SVG ITEM ICONS ====================
  function svgWrap(inner) {
    return (
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      inner +
      '</svg>'
    );
  }

  function makeHairIcon(styleId, colorObj) {
    var c = colorObj.base;
    var s = colorObj.shadow;
    var face = '<circle cx="32" cy="34" r="14" fill="#fbd3be" stroke="#36203d" stroke-width="2.5"/>';
    if (styleId === 'wavy_princess' || styleId === 'mermaid_long') {
      return svgWrap(
        '<path d="M14,28 Q10,48 16,58 L48,58 Q54,48 50,28 Z" fill="' + s + '" stroke="#36203d" stroke-width="2.5"/>' +
        face +
        '<path d="M17,32 Q18,16 32,16 Q46,16 47,32 Q38,23 32,26 Q26,23 17,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>'
      );
    }
    if (styleId === 'space_buns') {
      return svgWrap(
        '<circle cx="16" cy="18" r="8" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<circle cx="48" cy="18" r="8" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        face +
        '<path d="M17,32 Q19,18 32,18 Q45,18 47,32 Q32,25 17,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>'
      );
    }
    if (styleId === 'high_ponytail') {
      return svgWrap(
        '<path d="M36,15 Q56,12 52,42 Q44,36 40,24 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        face +
        '<path d="M17,32 Q19,17 32,17 Q45,17 47,32 Q32,24 17,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>'
      );
    }
    if (styleId === 'curly_afro') {
      return svgWrap(
        '<circle cx="20" cy="24" r="11" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<circle cx="44" cy="24" r="11" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<circle cx="32" cy="18" r="12" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        face
      );
    }
    if (styleId === 'twin_braids') {
      return svgWrap(
        '<circle cx="17" cy="40" r="5" fill="' + c + '" stroke="#36203d" stroke-width="2"/>' +
        '<circle cx="16" cy="49" r="5" fill="' + s + '" stroke="#36203d" stroke-width="2"/>' +
        '<circle cx="47" cy="40" r="5" fill="' + c + '" stroke="#36203d" stroke-width="2"/>' +
        '<circle cx="48" cy="49" r="5" fill="' + s + '" stroke="#36203d" stroke-width="2"/>' +
        face +
        '<path d="M17,32 Q19,17 32,17 Q45,17 47,32 Q32,24 17,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>'
      );
    }
    if (styleId === 'braided_crown') {
      return svgWrap(
        face +
        '<path d="M16,32 Q18,14 32,14 Q46,14 48,32 Q32,23 16,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<ellipse cx="24" cy="19" rx="5" ry="3.5" fill="' + s + '" stroke="#36203d" stroke-width="1.8"/>' +
        '<ellipse cx="32" cy="17" rx="5" ry="3.5" fill="' + c + '" stroke="#36203d" stroke-width="1.8"/>' +
        '<ellipse cx="40" cy="19" rx="5" ry="3.5" fill="' + s + '" stroke="#36203d" stroke-width="1.8"/>'
      );
    }
    // short_bob or pixie_cut
    var bobBottom = styleId === 'short_bob' ? '<path d="M15,28 Q13,44 22,47 L42,47 Q51,44 49,28 Z" fill="' + s + '" stroke="#36203d" stroke-width="2.5"/>' : '';
    return svgWrap(
      bobBottom +
      face +
      '<path d="M17,32 Q19,16 32,16 Q45,16 47,32 Q32,24 17,32 Z" fill="' + c + '" stroke="#36203d" stroke-width="2.5"/>'
    );
  }

  function makeOutfitIcon(item) {
    var p = item.primary;
    var s = item.secondary;
    var a = item.accent;
    if (item.slot === 'fullOutfit') {
      if (item.id.indexOf('gown_') === 0 || item.id === 'wizard_robe') {
        return svgWrap(
          '<path d="M24,14 L40,14 L38,28 L52,54 Q32,59 12,54 L26,28 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path d="M26,28 Q32,33 38,28" fill="none" stroke="' + a + '" stroke-width="3"/>' +
          '<circle cx="22" cy="45" r="2.5" fill="' + s + '"/>' +
          '<circle cx="42" cy="47" r="2.5" fill="' + a + '"/>'
        );
      }
      // Hero suit or knight armor
      return svgWrap(
        '<path d="M20,13 L44,13 L48,26 L42,29 L40,54 L34,54 L32,38 L30,54 L24,54 L22,29 L16,26 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<polygon points="32,19 34,24 39,24 35,27 36,32 32,29 28,32 29,27 25,24 30,24" fill="' + a + '"/>' +
        '<rect x="23" y="32" width="18" height="4" rx="2" fill="' + s + '"/>'
      );
    }
    if (item.slot === 'top') {
      return svgWrap(
        '<path d="M21,15 L43,15 L52,27 L45,32 L41,25 L41,51 L23,51 L23,25 L19,32 L12,27 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<circle cx="32" cy="32" r="5" fill="' + s + '" stroke="' + a + '" stroke-width="2"/>'
      );
    }
    // Bottoms
    if (item.id === 'bot_pleated' || item.id === 'bot_tulle') {
      return svgWrap(
        '<path d="M22,18 L42,18 L52,48 Q32,53 12,48 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="21" y="15" width="22" height="6" rx="2" fill="' + a + '" stroke="#36203d" stroke-width="2"/>'
      );
    }
    var legLen = item.id === 'bot_shorts' ? 38 : 53;
    return svgWrap(
      '<path d="M20,16 L44,16 L47,' + legLen + ' L35,' + legLen + ' L32,33 L29,' + legLen + ' L17,' + legLen + ' Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="20" y="14" width="24" height="5" rx="2" fill="' + s + '" stroke="#36203d" stroke-width="2"/>'
    );
  }

  function makeShoeIcon(shoe) {
    return svgWrap(
      '<path d="M18,22 L30,22 L32,38 L49,40 Q54,44 50,49 L17,49 Z" fill="' + shoe.primary + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="16" y="45" width="36" height="5" rx="2" fill="' + shoe.secondary + '" stroke="#36203d" stroke-width="2"/>' +
      '<circle cx="38" cy="40" r="3" fill="' + shoe.accent + '"/>'
    );
  }

  function makeAccessoryIcon(acc) {
    var p = acc.primary;
    var s = acc.secondary;
    if (acc.group === 'headwear') {
      if (acc.id === 'hat_wizard') {
        return svgWrap(
          '<ellipse cx="32" cy="46" rx="24" ry="6" fill="' + p + '" stroke="#36203d" stroke-width="2.5"/>' +
          '<path d="M18,44 L34,12 L46,44 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5"/>' +
          '<polygon points="33,26 35,31 40,31 36,34 37,39 33,36 29,39 30,34 26,31 31,31" fill="' + s + '"/>'
        );
      }
      if (acc.id === 'hat_flower') {
        return svgWrap(
          '<path d="M14,38 Q32,24 50,38" fill="none" stroke="' + s + '" stroke-width="5" stroke-linecap="round"/>' +
          '<circle cx="20" cy="33" r="6" fill="' + p + '" stroke="#36203d" stroke-width="2"/>' +
          '<circle cx="32" cy="28" r="7" fill="#ffe066" stroke="#36203d" stroke-width="2"/>' +
          '<circle cx="44" cy="33" r="6" fill="' + p + '" stroke="#36203d" stroke-width="2"/>'
        );
      }
      return svgWrap(
        '<path d="M14,44 L12,24 L23,33 L32,16 L41,33 L52,24 L50,44 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<circle cx="32" cy="34" r="4" fill="' + s + '"/>'
      );
    }
    if (acc.group === 'wings') {
      return svgWrap(
        '<path d="M32,34 Q14,10 10,26 Q8,38 28,40 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<path d="M32,34 Q50,10 54,26 Q56,38 36,40 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5"/>' +
        '<path d="M32,38 Q16,40 16,52 Q26,54 32,44 Z" fill="' + s + '" stroke="#36203d" stroke-width="2.2"/>' +
        '<path d="M32,38 Q48,40 48,52 Q38,54 32,44 Z" fill="' + s + '" stroke="#36203d" stroke-width="2.2"/>'
      );
    }
    if (acc.group === 'cape') {
      return svgWrap(
        '<path d="M22,16 L42,16 L52,50 Q32,56 12,50 Z" fill="' + p + '" stroke="#36203d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M22,16 Q32,22 42,16" fill="none" stroke="' + s + '" stroke-width="4" stroke-linecap="round"/>'
      );
    }
    if (acc.group === 'eyewear') {
      return svgWrap(
        '<circle cx="21" cy="32" r="10" fill="' + s + '" fill-opacity="0.55" stroke="' + p + '" stroke-width="3.5"/>' +
        '<circle cx="43" cy="32" r="10" fill="' + s + '" fill-opacity="0.55" stroke="' + p + '" stroke-width="3.5"/>' +
        '<line x1="31" y1="32" x2="33" y2="32" stroke="' + p + '" stroke-width="3.5"/>'
      );
    }
    // Handheld props
    if (acc.id === 'prop_sword') {
      return svgWrap(
        '<polygon points="44,12 49,15 27,43 22,38" fill="' + p + '" stroke="#36203d" stroke-width="2.3"/>' +
        '<line x1="18" y1="34" x2="31" y2="47" stroke="' + s + '" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="22" y1="43" x2="15" y2="51" stroke="#36203d" stroke-width="4" stroke-linecap="round"/>'
      );
    }
    if (acc.id === 'prop_shield') {
      return svgWrap(
        '<path d="M18,14 L46,14 L44,34 Q32,52 32,52 Q32,52 20,34 Z" fill="' + p + '" stroke="' + s + '" stroke-width="3.5"/>' +
        '<polygon points="32,21 35,28 42,28 36,32 38,39 32,35 26,39 28,32 22,28 29,28" fill="' + s + '"/>'
      );
    }
    // Wand or Scepter
    return svgWrap(
      '<line x1="16" y1="52" x2="40" y2="24" stroke="' + s + '" stroke-width="5" stroke-linecap="round"/>' +
      '<polygon points="42,10 45,18 54,18 47,23 49,31 42,26 35,31 37,23 30,18 39,18" fill="' + p + '" stroke="#36203d" stroke-width="2.2"/>'
    );
  }

  function makePetIcon(pet) {
    if (pet.id === 'none') {
      return '<span class="item-emoji" aria-hidden="true">🚫</span>';
    }
    var emojiMap = {
      pet_dragon: '🐉',
      pet_unicorn: '🦄',
      pet_corgi: '🐶',
      pet_cat: '🐈‍⬛',
      pet_phoenix: '🔥'
    };
    return '<span class="item-emoji" aria-hidden="true">' + (emojiMap[pet.id] || '🐾') + '</span>';
  }

  // ==================== SPARKLE HELPER ====================
  function triggerEquipSparkle(isRemove) {
    if (isRemove) {
      AudioFX.playRemove();
    } else {
      AudioFX.playEquip();
    }
    if (renderer) {
      var x = state.pet && state.pet !== 'none' ? 355 : 400;
      renderer.spawnSparkleBurst(x, 520, isRemove ? 10 : 20);
    }
  }

  // ==================== WARDROBE UI RENDERING ====================
  function makeItemCard(opts) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'item-card' + (opts.selected ? ' selected' : '');
    btn.setAttribute('aria-pressed', opts.selected ? 'true' : 'false');

    var prev = document.createElement('div');
    prev.className = 'item-preview';
    prev.innerHTML = opts.iconHtml;

    var lbl = document.createElement('span');
    lbl.className = 'item-label';
    lbl.textContent = opts.label;

    btn.appendChild(prev);
    btn.appendChild(lbl);
    btn.addEventListener('click', opts.onClick);
    return btn;
  }

  function renderBodyTab(container) {
    // 1. Skin Tones
    var skinSec = document.createElement('div');
    skinSec.className = 'section-block';
    skinSec.innerHTML = '<div class="section-header"><h2 class="section-title">✨ Skin Tone</h2></div>';
    var skinGrid = document.createElement('div');
    skinGrid.className = 'swatch-grid';
    D.SKIN_TONES.forEach(function (tone) {
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'color-swatch' + (state.skinTone === tone.id ? ' selected' : '');
      sw.style.background = tone.base;
      sw.title = tone.label;
      sw.setAttribute('aria-label', tone.label);
      sw.addEventListener('click', function () {
        state.skinTone = tone.id;
        triggerEquipSparkle(false);
        renderWardrobe();
      });
      skinGrid.appendChild(sw);
    });
    skinSec.appendChild(skinGrid);
    container.appendChild(skinSec);

    // 2. Facial Expressions
    var exprSec = document.createElement('div');
    exprSec.className = 'section-block';
    exprSec.innerHTML = '<div class="section-header"><h2 class="section-title">😊 Face Expression</h2></div>';
    var exprGrid = document.createElement('div');
    exprGrid.className = 'item-grid compact';
    D.EXPRESSIONS.forEach(function (ex) {
      exprGrid.appendChild(
        makeItemCard({
          selected: state.expression === ex.id,
          iconHtml: '<span class="item-emoji" aria-hidden="true">' + ex.icon + '</span>',
          label: ex.label,
          onClick: function () {
            state.expression = ex.id;
            triggerEquipSparkle(false);
            renderWardrobe();
          }
        })
      );
    });
    exprSec.appendChild(exprGrid);
    container.appendChild(exprSec);

    // 3. Hair Colors
    var hcSec = document.createElement('div');
    hcSec.className = 'section-block';
    hcSec.innerHTML = '<div class="section-header"><h2 class="section-title">🎨 Hair Color</h2></div>';
    var hcGrid = document.createElement('div');
    hcGrid.className = 'swatch-grid';
    D.HAIR_COLORS.forEach(function (col) {
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'color-swatch' + (state.hairColor === col.id ? ' selected' : '');
      sw.style.background = 'linear-gradient(135deg, ' + col.highlight + ' 0%, ' + col.base + ' 60%, ' + col.shadow + ' 100%)';
      sw.title = col.label;
      sw.setAttribute('aria-label', col.label);
      sw.addEventListener('click', function () {
        state.hairColor = col.id;
        triggerEquipSparkle(false);
        renderWardrobe();
      });
      hcGrid.appendChild(sw);
    });
    hcSec.appendChild(hcGrid);
    container.appendChild(hcSec);

    // 4. Hairstyles
    var hsSec = document.createElement('div');
    hsSec.className = 'section-block';
    hsSec.innerHTML = '<div class="section-header"><h2 class="section-title">💇‍♀️ Hairstyles</h2></div>';
    var hsGrid = document.createElement('div');
    hsGrid.className = 'item-grid';
    var activeHairColor = D.byId(D.HAIR_COLORS, state.hairColor) || D.HAIR_COLORS[0];
    D.HAIRSTYLES.forEach(function (hs) {
      hsGrid.appendChild(
        makeItemCard({
          selected: state.hairstyle === hs.id,
          iconHtml: makeHairIcon(hs.id, activeHairColor),
          label: hs.label,
          onClick: function () {
            state.hairstyle = hs.id;
            triggerEquipSparkle(false);
            renderWardrobe();
          }
        })
      );
    });
    hsSec.appendChild(hsGrid);
    container.appendChild(hsSec);
  }

  function renderOutfitsTab(container) {
    // Filter pills
    var filterBar = document.createElement('div');
    filterBar.className = 'subfilter-bar';
    var filters = [
      { id: 'all', label: '✨ All' },
      { id: 'gowns', label: '👑 Gowns & Suits' },
      { id: 'tops', label: '👚 Tops' },
      { id: 'bottoms', label: '👖 Bottoms' }
    ];
    filters.forEach(function (f) {
      var fb = document.createElement('button');
      fb.type = 'button';
      fb.className = 'subfilter-btn' + (state.outfitFilter === f.id ? ' active' : '');
      fb.textContent = f.label;
      fb.addEventListener('click', function () {
        AudioFX.playClick();
        state.outfitFilter = f.id;
        renderWardrobe();
      });
      filterBar.appendChild(fb);
    });
    container.appendChild(filterBar);

    var grid = document.createElement('div');
    grid.className = 'item-grid';
    D.OUTFITS.forEach(function (item) {
      if (state.outfitFilter !== 'all' && item.category !== state.outfitFilter) return;

      var isSelected =
        (item.slot === 'fullOutfit' && state.fullOutfit === item.id) ||
        (item.slot === 'top' && !state.fullOutfit && state.top === item.id) ||
        (item.slot === 'bottom' && !state.fullOutfit && state.bottom === item.id);

      grid.appendChild(
        makeItemCard({
          selected: isSelected,
          iconHtml: makeOutfitIcon(item),
          label: item.label,
          onClick: function () {
            if (item.slot === 'fullOutfit') {
              if (state.fullOutfit === item.id) {
                state.fullOutfit = null;
                triggerEquipSparkle(true);
              } else {
                state.fullOutfit = item.id;
                state.top = null;
                state.bottom = null;
                triggerEquipSparkle(false);
              }
            } else if (item.slot === 'top') {
              state.fullOutfit = null;
              state.top = item.id;
              if (!state.bottom) state.bottom = 'bot_pleated';
              triggerEquipSparkle(false);
            } else if (item.slot === 'bottom') {
              state.fullOutfit = null;
              state.bottom = item.id;
              if (!state.top) state.top = 'top_graphic';
              triggerEquipSparkle(false);
            }
            renderWardrobe();
          }
        })
      );
    });
    container.appendChild(grid);
  }

  function renderShoesTab(container) {
    var sec = document.createElement('div');
    sec.className = 'section-block';
    var hdr = document.createElement('div');
    hdr.className = 'section-header';
    hdr.innerHTML = '<h2 class="section-title">👠 Royal Shoes &amp; Boots</h2>';

    var bareBtn = document.createElement('button');
    bareBtn.type = 'button';
    bareBtn.className = 'mini-clear-btn';
    bareBtn.textContent = 'Take Off Shoes';
    bareBtn.addEventListener('click', function () {
      state.shoes = null;
      triggerEquipSparkle(true);
      renderWardrobe();
    });
    hdr.appendChild(bareBtn);
    sec.appendChild(hdr);

    var grid = document.createElement('div');
    grid.className = 'item-grid';
    D.SHOES.forEach(function (shoe) {
      grid.appendChild(
        makeItemCard({
          selected: state.shoes === shoe.id,
          iconHtml: makeShoeIcon(shoe),
          label: shoe.label,
          onClick: function () {
            var removing = state.shoes === shoe.id;
            state.shoes = removing ? null : shoe.id;
            triggerEquipSparkle(removing);
            renderWardrobe();
          }
        })
      );
    });
    sec.appendChild(grid);
    container.appendChild(sec);
  }

  function renderAccessoriesTab(container) {
    var hintBar = document.createElement('div');
    hintBar.className = 'section-header';
    hintBar.innerHTML = '<div class="layer-hint" style="flex:1">✨ Mix &amp; Layer! Wear wings, a cape, a crown &amp; a wand all at once!</div>';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'mini-clear-btn';
    clearBtn.textContent = 'Clear All';
    clearBtn.addEventListener('click', function () {
      state.accessories = { headwear: null, wings: null, cape: null, eyewear: null, handheld: null };
      triggerEquipSparkle(true);
      renderWardrobe();
    });
    hintBar.appendChild(clearBtn);
    container.appendChild(hintBar);

    D.ACCESSORY_GROUPS.forEach(function (grp) {
      var sec = document.createElement('div');
      sec.className = 'section-block';
      sec.innerHTML = '<div class="section-header"><h2 class="section-title">' + grp.title + '</h2></div>';
      var grid = document.createElement('div');
      grid.className = 'item-grid compact';

      D.ACCESSORIES.forEach(function (acc) {
        if (acc.group !== grp.id) return;
        var equipped = state.accessories[acc.subSlot] === acc.id;
        grid.appendChild(
          makeItemCard({
            selected: equipped,
            iconHtml: makeAccessoryIcon(acc),
            label: acc.label,
            onClick: function () {
              var removing = state.accessories[acc.subSlot] === acc.id;
              state.accessories[acc.subSlot] = removing ? null : acc.id;
              triggerEquipSparkle(removing);
              renderWardrobe();
            }
          })
        );
      });

      sec.appendChild(grid);
      container.appendChild(sec);
    });
  }

  function renderPetsTab(container) {
    var sec = document.createElement('div');
    sec.className = 'section-block';
    sec.innerHTML = '<div class="section-header"><h2 class="section-title">🐾 Choose a Royal Pet Companion</h2></div>';
    var grid = document.createElement('div');
    grid.className = 'item-grid';
    D.PETS.forEach(function (pet) {
      grid.appendChild(
        makeItemCard({
          selected: state.pet === pet.id,
          iconHtml: makePetIcon(pet),
          label: pet.label,
          onClick: function () {
            state.pet = pet.id;
            triggerEquipSparkle(pet.id === 'none');
            if (renderer && pet.id !== 'none') {
              renderer.spawnSparkleBurst(615, 740, 22);
            }
            renderWardrobe();
          }
        })
      );
    });
    sec.appendChild(grid);
    container.appendChild(sec);
  }

  function renderWardrobe() {
    var content = document.getElementById('wardrobe-content');
    if (!content) return;
    content.innerHTML = '';

    if (state.activeTab === 'body') {
      renderBodyTab(content);
    } else if (state.activeTab === 'outfits') {
      renderOutfitsTab(content);
    } else if (state.activeTab === 'shoes') {
      renderShoesTab(content);
    } else if (state.activeTab === 'accessories') {
      renderAccessoriesTab(content);
    } else if (state.activeTab === 'pets') {
      renderPetsTab(content);
    }
  }

  // ==================== ACTIONS ====================
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomizeDolly() {
    state.skinTone = pickRandom(D.SKIN_TONES).id;
    state.expression = pickRandom(D.EXPRESSIONS).id;
    state.hairstyle = pickRandom(D.HAIRSTYLES).id;
    state.hairColor = pickRandom(D.HAIR_COLORS).id;

    if (Math.random() < 0.55) {
      var gowns = D.OUTFITS.filter(function (o) { return o.slot === 'fullOutfit'; });
      state.fullOutfit = pickRandom(gowns).id;
      state.top = null;
      state.bottom = null;
    } else {
      var tops = D.OUTFITS.filter(function (o) { return o.slot === 'top'; });
      var bottoms = D.OUTFITS.filter(function (o) { return o.slot === 'bottom'; });
      state.fullOutfit = null;
      state.top = pickRandom(tops).id;
      state.bottom = pickRandom(bottoms).id;
    }

    state.shoes = pickRandom(D.SHOES).id;

    var subSlots = ['headwear', 'wings', 'cape', 'eyewear', 'handheld'];
    subSlots.forEach(function (slot) {
      var pool = D.ACCESSORIES.filter(function (a) { return a.subSlot === slot; });
      // Layer 2-3 accessories magically without cluttering every slot every time
      state.accessories[slot] = Math.random() < 0.58 ? pickRandom(pool).id : null;
    });

    var realPets = D.PETS.filter(function (p) { return p.id !== 'none'; });
    state.pet = pickRandom(realPets).id;

    AudioFX.playSurprise();
    if (renderer) {
      renderer.spawnSparkleBurst(355, 490, 36);
      renderer.spawnSparkleBurst(615, 740, 20);
    }
    renderWardrobe();
  }

  function resetDolly() {
    state.fullOutfit = null;
    state.top = null;
    state.bottom = null;
    state.shoes = null;
    state.accessories = {
      headwear: null,
      wings: null,
      cape: null,
      eyewear: null,
      handheld: null
    };
    state.pet = 'none';

    AudioFX.playRemove();
    if (renderer) {
      renderer.spawnSparkleBurst(400, 520, 16);
    }
    renderWardrobe();
  }

  function setScene(sceneId) {
    state.scene = sceneId;
    var btns = document.querySelectorAll('.scene-btn');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-scene') === sceneId);
    });
    AudioFX.playSurprise();
    if (renderer) {
      renderer.spawnSparkleBurst(400, 340, 18);
    }
  }

  function enterRunwayMode() {
    state.isRunway = true;
    var shell = document.getElementById('app');
    var hud = document.getElementById('runway-hud');
    var quoteEl = document.getElementById('judge-quote');

    if (quoteEl) {
      quoteEl.textContent = pickRandom(D.JUDGE_QUOTES);
    }
    if (shell) shell.classList.add('runway-mode');
    if (hud) hud.hidden = false;

    AudioFX.playFanfare();
    if (renderer) {
      renderer.spawnConfettiShower(55);
      renderer.spawnSparkleBurst(380, 440, 32);
    }
  }

  function exitRunwayMode() {
    state.isRunway = false;
    var shell = document.getElementById('app');
    var hud = document.getElementById('runway-hud');
    if (shell) shell.classList.remove('runway-mode');
    if (hud) hud.hidden = true;
    AudioFX.playClick();
  }

  function showToast(msg) {
    var toast = document.getElementById('stage-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 2400);
  }

  function downloadPhoto() {
    var canvas = document.getElementById('dolly-canvas');
    if (!canvas) return;
    AudioFX.playShutter();
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.download = 'dress-your-dolly-royal-photo.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📸 Photo saved to your computer!');
    } catch (e) {
      showToast('⚠️ Unable to save photo in this browser.');
    }
  }

  // ==================== BOOTSTRAP ====================
  function init() {
    var canvas = document.getElementById('dolly-canvas');
    renderer = new Renderer(canvas, function () {
      return state;
    });
    renderer.start();

    window.addEventListener('resize', function () {
      renderer.resize();
    });

    // Scene buttons
    document.querySelectorAll('.scene-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setScene(btn.getAttribute('data-scene'));
      });
    });

    // Wardrobe Tabs
    document.querySelectorAll('.tab-btn').forEach(function (tab) {
      tab.addEventListener('click', function () {
        AudioFX.playClick();
        var nextTab = tab.getAttribute('data-tab');
        state.activeTab = nextTab;
        document.querySelectorAll('.tab-btn').forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderWardrobe();
      });
    });

    // Action Buttons
    document.getElementById('btn-surprise').addEventListener('click', randomizeDolly);
    document.getElementById('btn-reset').addEventListener('click', resetDolly);

    var muteBtn = document.getElementById('btn-mute');
    var muteIco = document.getElementById('mute-ico');
    var muteLbl = document.getElementById('mute-label');
    muteBtn.addEventListener('click', function () {
      var muted = AudioFX.toggleMute();
      muteBtn.classList.toggle('muted', muted);
      muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      muteIco.textContent = muted ? '🔇' : '🔊';
      muteLbl.textContent = muted ? 'Muted' : 'Sound On';
    });

    document.getElementById('btn-finish').addEventListener('click', enterRunwayMode);
    document.getElementById('btn-keep').addEventListener('click', exitRunwayMode);
    document.getElementById('btn-photo').addEventListener('click', downloadPhoto);

    renderWardrobe();
    // Expose debug handle cleanly if needed
    window.DollyApp = {
      getState: function () { return state; }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
