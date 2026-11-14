(function () {
  'use strict';

  var OUTLINE = '#36203d';
  var VIRTUAL_W = 800;
  var VIRTUAL_H = 960;

  // ==================== DRAWING PRIMITIVES ====================
  function drawSparkle(ctx, x, y, size, color, alpha, rot) {
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = color || '#fff6a8';
    ctx.beginPath();
    var inner = size * 0.28;
    for (var i = 0; i < 8; i++) {
      var r = i % 2 === 0 ? size : inner;
      var a = (i * Math.PI) / 4;
      var px = Math.cos(a) * r;
      var py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(ctx, x, y, size, fill, stroke, lw) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.35);
    ctx.bezierCurveTo(-size * 0.5, -size * 0.1, -size, size * 0.25, 0, size);
    ctx.bezierCurveTo(size, size * 0.25, size * 0.5, -size * 0.1, 0, size * 0.35);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw || 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStar(ctx, x, y, outerR, innerR, points, fill, stroke, lw) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var a = (i * Math.PI) / points - Math.PI / 2;
      var px = Math.cos(a) * r;
      var py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw || 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    var rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function strokeFill(ctx, fill, lineWidth, strokeColor) {
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = strokeColor || OUTLINE;
    ctx.lineWidth = lineWidth || 3.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // ==================== 3 ROYAL CASTLE SCENES ====================
  function drawBallroomScene(ctx, time, isRunway) {
    // Palace wall gradient
    var wallGrad = ctx.createLinearGradient(0, 0, 0, 720);
    wallGrad.addColorStop(0, '#4f286e');
    wallGrad.addColorStop(0.55, '#86489c');
    wallGrad.addColorStop(1, '#c988bd');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, VIRTUAL_W, 730);

    // Subtle damask vertical stripes
    ctx.fillStyle = 'rgba(255, 232, 250, 0.06)';
    for (var sx = 0; sx < VIRTUAL_W; sx += 48) {
      ctx.fillRect(sx, 0, 22, 720);
    }

    // Arched starry night windows in background
    var winXs = [155, 400, 645];
    for (var i = 0; i < winXs.length; i++) {
      var wx = winXs[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(wx, 225, 62, Math.PI, 0, false);
      ctx.lineTo(wx + 62, 510);
      ctx.lineTo(wx - 62, 510);
      ctx.closePath();

      var skyG = ctx.createLinearGradient(wx, 160, wx, 510);
      skyG.addColorStop(0, '#2a1d61');
      skyG.addColorStop(1, '#7967d6');
      ctx.fillStyle = skyG;
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#ffda7a';
      ctx.stroke();

      // Window mullions
      ctx.beginPath();
      ctx.moveTo(wx, 163);
      ctx.lineTo(wx, 510);
      ctx.moveTo(wx - 60, 320);
      ctx.lineTo(wx + 60, 320);
      ctx.moveTo(wx - 60, 415);
      ctx.lineTo(wx + 60, 415);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffeaad';
      ctx.stroke();

      // Twinkling window stars
      drawSparkle(ctx, wx - 25, 230, 7, '#fff7bd', 0.8 + Math.sin(time * 2 + i) * 0.2);
      drawSparkle(ctx, wx + 22, 265, 5, '#d1f2ff', 0.7 + Math.cos(time * 2.5 + i) * 0.25);
      ctx.restore();
    }

    // Marble Pillars
    var pillars = [38, 252, 548, 762];
    for (var p = 0; p < pillars.length; p++) {
      var px = pillars[p];
      var colG = ctx.createLinearGradient(px - 28, 0, px + 28, 0);
      colG.addColorStop(0, '#eed9f5');
      colG.addColorStop(0.4, '#ffffff');
      colG.addColorStop(1, '#d1b5df');
      ctx.fillStyle = colG;
      ctx.fillRect(px - 26, 70, 52, 650);
      ctx.strokeStyle = 'rgba(72, 32, 89, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(px - 26, 70, 52, 650);

      // Gold capital & base
      ctx.fillStyle = '#ffcf56';
      roundRectPath(ctx, px - 34, 56, 68, 24, 8);
      strokeFill(ctx, '#ffcf56', 2.5, '#9e6a15');
      roundRectPath(ctx, px - 34, 702, 68, 24, 8);
      strokeFill(ctx, '#ffcf56', 2.5, '#9e6a15');
    }

    // Golden Wall Trim
    ctx.fillStyle = '#f8cb5e';
    ctx.fillRect(0, 718, VIRTUAL_W, 14);

    // Checkered Marble Floor
    var floorTop = 730;
    ctx.fillStyle = '#f8edff';
    ctx.fillRect(0, floorTop, VIRTUAL_W, VIRTUAL_H - floorTop);
    var rows = 6;
    for (var r = 0; r < rows; r++) {
      var y1 = floorTop + (r * (VIRTUAL_H - floorTop)) / rows;
      var y2 = floorTop + ((r + 1) * (VIRTUAL_H - floorTop)) / rows;
      var cols = 10;
      for (var c = -2; c < cols + 2; c++) {
        if ((r + c) % 2 === 0) continue;
        var t1 = c / cols;
        var t2 = (c + 1) / cols;
        var spread1 = 1 + (r / rows) * 0.45;
        var spread2 = 1 + ((r + 1) / rows) * 0.45;
        var x1L = VIRTUAL_W / 2 + (t1 - 0.5) * VIRTUAL_W * spread1;
        var x1R = VIRTUAL_W / 2 + (t2 - 0.5) * VIRTUAL_W * spread1;
        var x2L = VIRTUAL_W / 2 + (t1 - 0.5) * VIRTUAL_W * spread2;
        var x2R = VIRTUAL_W / 2 + (t2 - 0.5) * VIRTUAL_W * spread2;
        ctx.fillStyle = 'rgba(182, 134, 214, 0.25)';
        ctx.beginPath();
        ctx.moveTo(x1L, y1);
        ctx.lineTo(x1R, y1);
        ctx.lineTo(x2R, y2);
        ctx.lineTo(x2L, y2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Royal Red Carpet
    var carpG = ctx.createLinearGradient(0, floorTop, 0, VIRTUAL_H);
    carpG.addColorStop(0, '#b91b4c');
    carpG.addColorStop(0.5, '#e0245e');
    carpG.addColorStop(1, '#9d103c');
    ctx.beginPath();
    ctx.moveTo(270, floorTop);
    ctx.lineTo(530, floorTop);
    ctx.lineTo(670, VIRTUAL_H);
    ctx.lineTo(130, VIRTUAL_H);
    ctx.closePath();
    ctx.fillStyle = carpG;
    ctx.fill();

    // Gold Carpet Border
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(278, floorTop);
    ctx.lineTo(148, VIRTUAL_H);
    ctx.moveTo(522, floorTop);
    ctx.lineTo(652, VIRTUAL_H);
    ctx.stroke();

    // Crystal Chandeliers
    var chandXs = [215, 585];
    for (var ch = 0; ch < chandXs.length; ch++) {
      var cx = chandXs[ch];
      var sway = Math.sin(time * 1.4 + ch) * 2.5;
      ctx.save();
      ctx.translate(cx + sway, 0);
      // Chain
      ctx.strokeStyle = '#ffd666';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 62);
      ctx.stroke();

      // Glow aura
      var halo = ctx.createRadialGradient(0, 92, 10, 0, 92, 115);
      halo.addColorStop(0, 'rgba(255, 240, 175, 0.55)');
      halo.addColorStop(1, 'rgba(255, 240, 175, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 92, 115, 0, Math.PI * 2);
      ctx.fill();

      // Arms & Candles
      ctx.strokeStyle = '#ffca45';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-64, 92);
      ctx.quadraticCurveTo(0, 118, 64, 92);
      ctx.moveTo(-42, 74);
      ctx.quadraticCurveTo(0, 96, 42, 74);
      ctx.stroke();

      var candleOffsets = [-62, -32, 0, 32, 62];
      for (var k = 0; k < candleOffsets.length; k++) {
        var kx = candleOffsets[k];
        var ky = k === 2 ? 84 : Math.abs(kx) > 40 ? 90 : 75;
        ctx.fillStyle = '#fff9eb';
        ctx.fillRect(kx - 4, ky - 16, 8, 16);
        var flk = 1 + Math.sin(time * 9 + k * 1.7 + ch) * 0.18;
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.ellipse(kx, ky - 22, 4.5 * flk, 8 * flk, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crystal drops
      ctx.fillStyle = '#d9f6ff';
      for (var d = -48; d <= 48; d += 24) {
        ctx.beginPath();
        ctx.moveTo(d, 106);
        ctx.lineTo(d - 5, 120);
        ctx.lineTo(d, 130);
        ctx.lineTo(d + 5, 120);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    if (isRunway) {
      // Extra runway lights on carpet edge
      for (var rl = 0; rl < 6; rl++) {
        var frac = (rl + 0.5) / 6;
        var ly = floorTop + frac * (VIRTUAL_H - floorTop);
        var lxL = 278 + (148 - 278) * frac;
        var lxR = 522 + (652 - 522) * frac;
        var pulse = 0.65 + 0.35 * Math.sin(time * 8 - rl);
        drawSparkle(ctx, lxL, ly, 11 * pulse, '#fff8a6', 0.95, time);
        drawSparkle(ctx, lxR, ly, 11 * pulse, '#fff8a6', 0.95, -time);
      }
    }
  }

  function drawGardenScene(ctx, time, isRunway) {
    // Sunny sky gradient
    var sky = ctx.createLinearGradient(0, 0, 0, 640);
    sky.addColorStop(0, '#5dc8ff');
    sky.addColorStop(0.55, '#a8e6ff');
    sky.addColorStop(1, '#e8fbff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIRTUAL_W, 650);

    // Warm sun with rotating rays
    ctx.save();
    ctx.translate(115, 108);
    var sunGlow = ctx.createRadialGradient(0, 0, 20, 0, 0, 105);
    sunGlow.addColorStop(0, 'rgba(255, 245, 150, 0.9)');
    sunGlow.addColorStop(1, 'rgba(255, 245, 150, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 105, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe159';
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Fluffy drifting clouds
    var clouds = [
      { x: ((220 + time * 8) % 920) - 60, y: 120, s: 1 },
      { x: ((610 + time * 5.5) % 920) - 60, y: 175, s: 0.85 },
      { x: ((440 + time * 6.5) % 920) - 60, y: 85, s: 0.7 }
    ];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    for (var c = 0; c < clouds.length; c++) {
      var cl = clouds[c];
      ctx.save();
      ctx.translate(cl.x, cl.y);
      ctx.scale(cl.s, cl.s);
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.arc(32, -8, 38, 0, Math.PI * 2);
      ctx.arc(68, 2, 28, 0, Math.PI * 2);
      ctx.arc(-28, 8, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Fairytale Castle Silhouette in distance
    ctx.fillStyle = '#f2ddff';
    ctx.fillRect(540, 310, 180, 210);
    ctx.fillRect(565, 240, 44, 100);
    ctx.fillRect(655, 225, 50, 115);
    ctx.fillRect(610, 180, 45, 150);
    // Castle roofs
    var roofs = [
      [560, 240, 587, 188, 614, 240],
      [604, 180, 632, 118, 660, 180],
      [650, 225, 680, 168, 710, 225]
    ];
    ctx.fillStyle = '#ff7ab8';
    for (var rf = 0; rf < roofs.length; rf++) {
      ctx.beginPath();
      ctx.moveTo(roofs[rf][0], roofs[rf][1]);
      ctx.lineTo(roofs[rf][2], roofs[rf][3]);
      ctx.lineTo(roofs[rf][4], roofs[rf][5]);
      ctx.closePath();
      ctx.fill();
    }

    // Rolling Green Hills & Lawn
    ctx.fillStyle = '#8de070';
    ctx.beginPath();
    ctx.moveTo(0, 520);
    ctx.quadraticCurveTo(220, 455, 450, 510);
    ctx.quadraticCurveTo(640, 465, 800, 515);
    ctx.lineTo(800, 730);
    ctx.lineTo(0, 730);
    ctx.closePath();
    ctx.fill();

    var lawnG = ctx.createLinearGradient(0, 620, 0, VIRTUAL_H);
    lawnG.addColorStop(0, '#6ed158');
    lawnG.addColorStop(1, '#3fa646');
    ctx.fillStyle = lawnG;
    ctx.fillRect(0, 620, VIRTUAL_W, VIRTUAL_H - 620);

    // Stone Garden Path (or Royal Runway Carpet over path in Runway mode)
    ctx.beginPath();
    ctx.moveTo(275, 635);
    ctx.lineTo(525, 635);
    ctx.lineTo(665, VIRTUAL_H);
    ctx.lineTo(135, VIRTUAL_H);
    ctx.closePath();
    ctx.fillStyle = isRunway ? '#d9215a' : '#f4e7da';
    ctx.fill();
    ctx.strokeStyle = isRunway ? '#ffd257' : '#d6c1b2';
    ctx.lineWidth = isRunway ? 8 : 5;
    ctx.stroke();

    // Tiered Marble Fountain (Left-background)
    ctx.save();
    ctx.translate(160, 555);
    // Fountain pool
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 62, 105, 30, 0, 0, Math.PI * 2);
    strokeFill(ctx, '#f2e8f7', 3, '#b5a1c4');
    ctx.fillStyle = '#6be2ff';
    ctx.beginPath();
    ctx.ellipse(0, 56, 88, 21, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fountain stem & bowls
    ctx.fillStyle = '#f9f2fc';
    ctx.fillRect(-16, -24, 32, 80);
    ctx.beginPath();
    ctx.ellipse(0, -18, 56, 16, 0, 0, Math.PI * 2);
    strokeFill(ctx, '#ffffff', 3, '#b5a1c4');
    ctx.beginPath();
    ctx.ellipse(0, -56, 32, 10, 0, 0, Math.PI * 2);
    strokeFill(ctx, '#ffffff', 3, '#b5a1c4');

    // Animated water arcs
    ctx.strokeStyle = '#9cf0ff';
    ctx.lineWidth = 3.5;
    for (var wa = -1; wa <= 1; wa += 2) {
      var dropShift = (time * 40) % 24;
      ctx.beginPath();
      ctx.moveTo(0, -64);
      ctx.quadraticCurveTo(wa * 22, -96, wa * 34, -22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wa * 36, -16);
      ctx.quadraticCurveTo(wa * 66, 8, wa * 68, 52);
      ctx.stroke();
      ctx.fillStyle = '#d4f8ff';
      ctx.beginPath();
      ctx.arc(wa * (26 + dropShift * 0.4), -32 + dropShift, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Rose Bushes (Left & Right)
    var bushes = [
      { x: 74, y: 650, r: 62 },
      { x: 148, y: 670, r: 48 },
      { x: 705, y: 645, r: 68 },
      { x: 632, y: 675, r: 50 }
    ];
    for (var b = 0; b < bushes.length; b++) {
      var bu = bushes[b];
      ctx.fillStyle = '#339947';
      ctx.beginPath();
      ctx.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2);
      ctx.arc(bu.x - bu.r * 0.5, bu.y + 16, bu.r * 0.72, 0, Math.PI * 2);
      ctx.arc(bu.x + bu.r * 0.5, bu.y + 18, bu.r * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Blooming roses
      var roseOffsets = [[-22, -16], [14, -24], [24, 10], [-12, 16]];
      for (var ro = 0; ro < roseOffsets.length; ro++) {
        var rx = bu.x + roseOffsets[ro][0];
        var ry = bu.y + roseOffsets[ro][1];
        ctx.fillStyle = (b + ro) % 2 === 0 ? '#ff4d88' : '#ff8ec6';
        ctx.beginPath();
        ctx.arc(rx, ry, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd1e8';
        ctx.beginPath();
        ctx.arc(rx - 2, ry - 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Animated Butterflies
    var butterflies = [
      { bx: 245, by: 360, color: '#ff70c8', speed: 1.5, amp: 24 },
      { bx: 590, by: 410, color: '#ffd24a', speed: 1.9, amp: 28 },
      { bx: 150, by: 455, color: '#64d8ff', speed: 1.3, amp: 20 },
      { bx: 680, by: 315, color: '#b77aff', speed: 1.7, amp: 22 }
    ];
    for (var bf = 0; bf < butterflies.length; bf++) {
      var fl = butterflies[bf];
      var fx = fl.bx + Math.sin(time * fl.speed + bf) * fl.amp;
      var fy = fl.by + Math.cos(time * (fl.speed * 1.4) + bf) * 18;
      var flap = 0.35 + Math.abs(Math.sin(time * 9 + bf)) * 0.65;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(Math.sin(time * 2 + bf) * 0.25);
      ctx.fillStyle = fl.color;
      ctx.beginPath();
      ctx.ellipse(-7 * flap, -3, 9 * flap, 7, -0.3, 0, Math.PI * 2);
      ctx.ellipse(7 * flap, -3, 9 * flap, 7, 0.3, 0, Math.PI * 2);
      ctx.ellipse(-5 * flap, 5, 6 * flap, 5, 0.2, 0, Math.PI * 2);
      ctx.ellipse(5 * flap, 5, 6 * flap, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(-1.5, -7, 3, 14);
      ctx.restore();
    }
  }

  function drawBalconyScene(ctx, time, isRunway) {
    // Deep Twilight Sky
    var sky = ctx.createLinearGradient(0, 0, 0, 720);
    sky.addColorStop(0, '#0f0c36');
    sky.addColorStop(0.5, '#2b1e68');
    sky.addColorStop(1, '#683b96');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIRTUAL_W, 740);

    // Twinkling Stars
    var starCoords = [
      [75, 90], [160, 55], [270, 115], [340, 48], [450, 92],
      [530, 50], [670, 130], [740, 72], [95, 225], [220, 200],
      [580, 210], [725, 240], [415, 165], [140, 320], [690, 330]
    ];
    for (var s = 0; s < starCoords.length; s++) {
      var st = starCoords[s];
      var tw = 0.45 + 0.55 * Math.abs(Math.sin(time * 2.2 + s * 1.1));
      drawSparkle(ctx, st[0], st[1], 6 + (s % 3) * 2.5, '#fff6b8', tw);
    }

    // Glowing Crescent Moon
    ctx.save();
    ctx.translate(648, 128);
    var moonHalo = ctx.createRadialGradient(0, 0, 25, 0, 0, 125);
    moonHalo.addColorStop(0, 'rgba(255, 244, 178, 0.65)');
    moonHalo.addColorStop(1, 'rgba(255, 244, 178, 0)');
    ctx.fillStyle = moonHalo;
    ctx.beginPath();
    ctx.arc(0, 0, 125, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff5b8';
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b144c';
    ctx.beginPath();
    ctx.arc(18, -10, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Distant Fireworks Bursts (3 looping cycles)
    var fireworks = [
      { x: 165, y: 170, color: '#ff6ec7', period: 3.2, offset: 0.0 },
      { x: 470, y: 130, color: '#6beeff', period: 3.6, offset: 1.3 },
      { x: 300, y: 235, color: '#ffe159', period: 3.0, offset: 2.2 }
    ];
    for (var fw = 0; fw < fireworks.length; fw++) {
      var f = fireworks[fw];
      var phase = ((time + f.offset) % f.period) / f.period;
      if (phase < 0.78) {
        var prog = phase / 0.78;
        var radius = 12 + prog * 68;
        var alpha = 1 - Math.pow(prog, 1.8);
        ctx.save();
        ctx.translate(f.x, f.y);
        for (var sp = 0; sp < 12; sp++) {
          var ang = (sp * Math.PI * 2) / 12;
          var px = Math.cos(ang) * radius;
          var py = Math.sin(ang) * radius + prog * prog * 18;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(px, py, 4 * (1 - prog * 0.5), 0, Math.PI * 2);
          ctx.fill();
          drawSparkle(ctx, px * 0.65, py * 0.65, 5, '#ffffff', alpha * 0.8);
        }
        ctx.restore();
      }
    }

    // Distant Castle Towers
    ctx.fillStyle = '#24174f';
    ctx.fillRect(0, 455, 110, 190);
    ctx.fillRect(700, 440, 100, 200);
    ctx.fillStyle = '#ffda78';
    ctx.fillRect(34, 485, 14, 24);
    ctx.fillRect(735, 475, 14, 24);

    // Marble Balcony Balustrade
    ctx.fillStyle = '#e8d7f5';
    ctx.fillRect(0, 622, VIRTUAL_W, 18);
    ctx.fillRect(0, 706, VIRTUAL_W, 18);
    for (var bx = 26; bx < VIRTUAL_W; bx += 54) {
      ctx.fillStyle = '#d3bce6';
      roundRectPath(ctx, bx - 10, 640, 20, 66, 8);
      ctx.fill();
    }

    // Glowing Lanterns on Balcony Posts
    var postXs = [82, 718];
    for (var pl = 0; pl < postXs.length; pl++) {
      var lx = postXs[pl];
      ctx.fillStyle = '#f2e6fa';
      ctx.fillRect(lx - 20, 575, 40, 145);
      var lHalo = ctx.createRadialGradient(lx, 548, 8, lx, 548, 72);
      lHalo.addColorStop(0, 'rgba(255, 224, 125, 0.75)');
      lHalo.addColorStop(1, 'rgba(255, 224, 125, 0)');
      ctx.fillStyle = lHalo;
      ctx.beginPath();
      ctx.arc(lx, 548, 72, 0, Math.PI * 2);
      ctx.fill();
      roundRectPath(ctx, lx - 14, 526, 28, 42, 8);
      strokeFill(ctx, '#ffe275', 3, '#614180');
    }

    // Balcony Starlight Floor
    var floorG = ctx.createLinearGradient(0, 724, 0, VIRTUAL_H);
    floorG.addColorStop(0, '#5a3c85');
    floorG.addColorStop(1, '#311e52');
    ctx.fillStyle = floorG;
    ctx.fillRect(0, 724, VIRTUAL_W, VIRTUAL_H - 724);

    // Royal Carpet on Balcony (always nice in Runway mode, subtle runner otherwise)
    ctx.beginPath();
    ctx.moveTo(270, 724);
    ctx.lineTo(530, 724);
    ctx.lineTo(665, VIRTUAL_H);
    ctx.lineTo(135, VIRTUAL_H);
    ctx.closePath();
    ctx.fillStyle = isRunway ? '#d9215a' : '#7b3999';
    ctx.fill();
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = isRunway ? 8 : 5;
    ctx.stroke();
  }

  function drawScene(ctx, sceneId, time, isRunway) {
    if (sceneId === 'garden') {
      drawGardenScene(ctx, time, isRunway);
    } else if (sceneId === 'balcony') {
      drawBalconyScene(ctx, time, isRunway);
    } else {
      drawBallroomScene(ctx, time, isRunway);
    }

    // Dramatic Spotlight Beams in Runway Celebration Mode
    if (isRunway) {
      ctx.save();
      var spot1 = ctx.createLinearGradient(140, 0, 420, 860);
      spot1.addColorStop(0, 'rgba(255, 250, 196, 0.34)');
      spot1.addColorStop(1, 'rgba(255, 250, 196, 0.02)');
      ctx.fillStyle = spot1;
      ctx.beginPath();
      ctx.moveTo(110, 0);
      ctx.lineTo(240, 0);
      ctx.lineTo(540, 880);
      ctx.lineTo(250, 880);
      ctx.closePath();
      ctx.fill();

      var spot2 = ctx.createLinearGradient(660, 0, 380, 860);
      spot2.addColorStop(0, 'rgba(255, 214, 245, 0.28)');
      spot2.addColorStop(1, 'rgba(255, 214, 245, 0.02)');
      ctx.fillStyle = spot2;
      ctx.beginPath();
      ctx.moveTo(560, 0);
      ctx.lineTo(690, 0);
      ctx.lineTo(530, 880);
      ctx.lineTo(260, 880);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // ==================== Z-INDEX LAYER 1: CAPES (BACK) ====================
  function drawCapeBack(ctx, capeId, time) {
    if (!capeId) return;
    var wave = Math.sin(time * 3.1) * 10;
    ctx.save();
    if (capeId === 'cape_royal') {
      var rg = ctx.createLinearGradient(0, 470, 0, 800);
      rg.addColorStop(0, '#e8295c');
      rg.addColorStop(1, '#9c0e38');
      ctx.beginPath();
      ctx.moveTo(-42, 474);
      ctx.quadraticCurveTo(-110, 635, -134 + wave, 792);
      ctx.quadraticCurveTo(0, 818, 134 + wave, 792);
      ctx.quadraticCurveTo(110, 635, 42, 474);
      ctx.closePath();
      strokeFill(ctx, rg, 3.5);

      // Ermine fur trim at bottom
      ctx.fillStyle = '#fff9f2';
      ctx.beginPath();
      ctx.moveTo(-132 + wave, 774);
      ctx.quadraticCurveTo(0, 800, 132 + wave, 774);
      ctx.lineTo(134 + wave, 792);
      ctx.quadraticCurveTo(0, 818, -134 + wave, 792);
      ctx.closePath();
      strokeFill(ctx, '#fff9f2', 3);

      // Ermine spots
      ctx.fillStyle = OUTLINE;
      for (var s = -95; s <= 95; s += 38) {
        ctx.beginPath();
        ctx.ellipse(s + wave * 0.7, 792, 3.5, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (capeId === 'cape_hero') {
      var hg = ctx.createLinearGradient(0, 470, 0, 745);
      hg.addColorStop(0, '#ff4d63');
      hg.addColorStop(1, '#ff9f1c');
      ctx.beginPath();
      ctx.moveTo(-40, 472);
      ctx.quadraticCurveTo(-105, 595, -122 + wave * 1.2, 735);
      ctx.lineTo(-55 + wave * 0.8, 708);
      ctx.lineTo(0 + wave * 0.6, 742);
      ctx.lineTo(55 + wave * 0.8, 708);
      ctx.lineTo(122 + wave * 1.2, 735);
      ctx.quadraticCurveTo(105, 595, 40, 472);
      ctx.closePath();
      strokeFill(ctx, hg, 3.5);
    } else if (capeId === 'cape_galaxy') {
      var gg = ctx.createLinearGradient(0, 468, 0, 795);
      gg.addColorStop(0, '#462c9c');
      gg.addColorStop(0.5, '#2b1b6b');
      gg.addColorStop(1, '#6845cc');
      ctx.beginPath();
      ctx.moveTo(-44, 472);
      ctx.quadraticCurveTo(-116, 625, -138 + wave, 782);
      ctx.quadraticCurveTo(0, 808, 138 + wave, 782);
      ctx.quadraticCurveTo(116, 625, 44, 472);
      ctx.closePath();
      strokeFill(ctx, gg, 3.5);
      drawSparkle(ctx, -68 + wave * 0.5, 650, 10, '#85f2ff', 0.9, time);
      drawSparkle(ctx, 74 + wave * 0.5, 695, 12, '#ffe875', 0.9, -time);
      drawSparkle(ctx, -20 + wave * 0.4, 740, 8, '#ffffff', 0.85, time * 0.8);
    }
    ctx.restore();
  }

  function drawCapeClasp(ctx, capeId) {
    if (!capeId) return;
    ctx.save();
    if (capeId === 'cape_royal') {
      ctx.fillStyle = '#fff9f2';
      roundRectPath(ctx, -46, 462, 92, 22, 10);
      strokeFill(ctx, '#fff9f2', 3);
      ctx.fillStyle = '#ffbe2e';
      ctx.beginPath();
      ctx.arc(-28, 473, 7, 0, Math.PI * 2);
      ctx.arc(28, 473, 7, 0, Math.PI * 2);
      strokeFill(ctx, '#ffbe2e', 2.5);
    } else if (capeId === 'cape_hero') {
      drawStar(ctx, -28, 475, 10, 4.5, 5, '#ffd447', OUTLINE, 2.5);
      drawStar(ctx, 28, 475, 10, 4.5, 5, '#ffd447', OUTLINE, 2.5);
    } else if (capeId === 'cape_galaxy') {
      ctx.strokeStyle = '#ffd65c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-34, 474);
      ctx.quadraticCurveTo(0, 492, 34, 474);
      ctx.stroke();
      ctx.fillStyle = '#6ceeff';
      ctx.beginPath();
      ctx.arc(0, 484, 7, 0, Math.PI * 2);
      strokeFill(ctx, '#6ceeff', 2.5);
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 2: WINGS ====================
  function drawWings(ctx, wingsId, time) {
    if (!wingsId) return;
    var flap = Math.sin(time * 3.8) * 0.07;

    for (var side = -1; side <= 1; side += 2) {
      ctx.save();
      ctx.translate(side * 24, 510);
      ctx.scale(side, 1);
      ctx.rotate(flap);

      if (wingsId === 'wings_fairy') {
        var fg = ctx.createLinearGradient(0, -100, 170, 90);
        fg.addColorStop(0, 'rgba(182, 245, 255, 0.86)');
        fg.addColorStop(0.5, 'rgba(255, 188, 238, 0.82)');
        fg.addColorStop(1, 'rgba(255, 242, 180, 0.85)');

        // Upper wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(60, -135, 195, -105, 168, -10);
        ctx.bezierCurveTo(148, 35, 65, 25, 0, 15);
        ctx.closePath();
        strokeFill(ctx, fg, 3, '#ff88d1');

        // Lower wing
        ctx.beginPath();
        ctx.moveTo(0, 14);
        ctx.bezierCurveTo(75, 22, 152, 65, 118, 128);
        ctx.bezierCurveTo(75, 145, 22, 92, 0, 28);
        ctx.closePath();
        strokeFill(ctx, fg, 3, '#ff88d1');

        // Wing veins & sparkle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(14, -4);
        ctx.quadraticCurveTo(85, -45, 134, -30);
        ctx.moveTo(12, 22);
        ctx.quadraticCurveTo(65, 58, 92, 98);
        ctx.stroke();
        drawSparkle(ctx, 112, -32, 9, '#ffffff', 0.9);
      } else if (wingsId === 'wings_angel') {
        var ag = ctx.createLinearGradient(0, -110, 175, 85);
        ag.addColorStop(0, '#ffffff');
        ag.addColorStop(1, '#ffeec4');
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.bezierCurveTo(45, -125, 182, -135, 186, -42);
        ctx.quadraticCurveTo(164, -18, 148, -14);
        ctx.quadraticCurveTo(168, 12, 145, 34);
        ctx.quadraticCurveTo(118, 28, 122, 56);
        ctx.quadraticCurveTo(74, 86, 0, 38);
        ctx.closePath();
        strokeFill(ctx, ag, 3.5, '#d6b685');

        ctx.strokeStyle = '#f2dcb8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(32, -16);
        ctx.quadraticCurveTo(96, -55, 148, -42);
        ctx.moveTo(30, 8);
        ctx.quadraticCurveTo(92, -6, 132, 16);
        ctx.stroke();
      } else if (wingsId === 'wings_dragon') {
        var dg = ctx.createLinearGradient(0, -100, 165, 80);
        dg.addColorStop(0, '#7828c8');
        dg.addColorStop(1, '#ff5992');
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.lineTo(86, -98);
        ctx.lineTo(174, -52);
        ctx.quadraticCurveTo(132, -8, 142, 42);
        ctx.quadraticCurveTo(92, 24, 86, 68);
        ctx.quadraticCurveTo(45, 32, 0, 36);
        ctx.closePath();
        strokeFill(ctx, dg, 3.5);

        // Wing bone spine
        ctx.strokeStyle = '#ffca47';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(4, 8);
        ctx.lineTo(86, -96);
        ctx.lineTo(170, -52);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ==================== Z-INDEX LAYER 3: BACK HAIR ====================
  function drawBackHair(ctx, styleId, hairColor) {
    var base = hairColor.base;
    var shad = hairColor.shadow;
    ctx.save();

    if (styleId === 'wavy_princess') {
      var g = ctx.createLinearGradient(0, 270, 0, 615);
      g.addColorStop(0, base);
      g.addColorStop(1, shad);
      ctx.beginPath();
      ctx.moveTo(-78, 340);
      ctx.bezierCurveTo(-118, 430, -82, 515, -112, 595);
      ctx.quadraticCurveTo(-55, 622, 0, 608);
      ctx.quadraticCurveTo(55, 622, 112, 595);
      ctx.bezierCurveTo(82, 515, 118, 430, 78, 340);
      ctx.closePath();
      strokeFill(ctx, g, 3.5);
    } else if (styleId === 'mermaid_long') {
      var mg = ctx.createLinearGradient(0, 270, 0, 690);
      mg.addColorStop(0, base);
      mg.addColorStop(1, shad);
      ctx.beginPath();
      ctx.moveTo(-82, 345);
      ctx.bezierCurveTo(-132, 455, -86, 560, -124, 678);
      ctx.quadraticCurveTo(-60, 706, 0, 686);
      ctx.quadraticCurveTo(60, 706, 124, 678);
      ctx.bezierCurveTo(86, 560, 132, 455, 82, 345);
      ctx.closePath();
      strokeFill(ctx, mg, 3.5);
    } else if (styleId === 'short_bob') {
      ctx.beginPath();
      ctx.moveTo(-88, 348);
      ctx.quadraticCurveTo(-104, 436, -68, 466);
      ctx.lineTo(68, 466);
      ctx.quadraticCurveTo(104, 436, 88, 348);
      ctx.closePath();
      strokeFill(ctx, shad, 3.5);
    } else if (styleId === 'high_ponytail') {
      // Sweeping ponytail behind right/left side
      ctx.beginPath();
      ctx.moveTo(42, 282);
      ctx.bezierCurveTo(132, 268, 152, 390, 118, 520);
      ctx.quadraticCurveTo(86, 492, 74, 420);
      ctx.quadraticCurveTo(68, 340, 28, 310);
      ctx.closePath();
      strokeFill(ctx, base, 3.5);
    } else if (styleId === 'curly_afro') {
      ctx.fillStyle = base;
      ctx.beginPath();
      var puffs = [
        [-84, 330, 44], [84, 330, 44], [-96, 388, 42], [96, 388, 42],
        [-64, 278, 46], [64, 278, 46], [0, 256, 50], [-82, 438, 34], [82, 438, 34]
      ];
      for (var i = 0; i < puffs.length; i++) {
        ctx.moveTo(puffs[i][0] + puffs[i][2], puffs[i][1]);
        ctx.arc(puffs[i][0], puffs[i][1], puffs[i][2], 0, Math.PI * 2);
      }
      strokeFill(ctx, base, 3.5);
    } else if (styleId === 'twin_braids') {
      for (var side = -1; side <= 1; side += 2) {
        for (var seg = 0; seg < 5; seg++) {
          ctx.beginPath();
          ctx.ellipse(side * (78 + seg * 2), 426 + seg * 30, 17, 19, side * -0.15, 0, Math.PI * 2);
          strokeFill(ctx, seg % 2 === 0 ? base : shad, 3);
        }
        // Ribbon tie
        ctx.fillStyle = '#ff6bb5';
        ctx.beginPath();
        ctx.arc(side * 86, 562, 8, 0, Math.PI * 2);
        strokeFill(ctx, '#ff6bb5', 2.5);
      }
    } else if (styleId === 'braided_crown') {
      ctx.beginPath();
      ctx.moveTo(-74, 358);
      ctx.quadraticCurveTo(-84, 442, -52, 495);
      ctx.lineTo(52, 495);
      ctx.quadraticCurveTo(84, 442, 74, 358);
      ctx.closePath();
      strokeFill(ctx, shad, 3.5);
    } else if (styleId === 'space_buns') {
      // Big cute round buns on top corners
      for (var s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.arc(s * 76, 266, 36, 0, Math.PI * 2);
        strokeFill(ctx, base, 3.5);
        // Bun hairband
        ctx.fillStyle = '#ff72b8';
        ctx.beginPath();
        ctx.ellipse(s * 64, 286, 20, 7, s * 0.55, 0, Math.PI * 2);
        strokeFill(ctx, '#ff72b8', 2.5);
      }
    } else if (styleId === 'pixie_cut') {
      ctx.beginPath();
      ctx.arc(0, 350, 88, Math.PI * 0.9, Math.PI * 2.1);
      strokeFill(ctx, shad, 3.5);
    }

    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 4: BASE BODY ====================
  function drawBaseBody(ctx, skin) {
    ctx.save();
    // Legs
    for (var side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(side * 10, 610);
      ctx.quadraticCurveTo(side * 34, 650, side * 34, 712);
      ctx.quadraticCurveTo(side * 35, 765, side * 32, 818);
      ctx.quadraticCurveTo(side * 22, 826, side * 14, 818);
      ctx.quadraticCurveTo(side * 8, 760, side * 6, 710);
      ctx.quadraticCurveTo(side * 2, 650, side * 2, 610);
      ctx.closePath();
      strokeFill(ctx, skin.base, 3.5);

      // Cute knee blush
      ctx.fillStyle = skin.blush;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.ellipse(side * 22, 710, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Arms
    for (var aSide = -1; aSide <= 1; aSide += 2) {
      ctx.beginPath();
      ctx.moveTo(aSide * 38, 474);
      ctx.quadraticCurveTo(aSide * 66, 515, aSide * 78, 586);
      ctx.arc(aSide * 73, 594, 11, 0, Math.PI, false);
      ctx.quadraticCurveTo(aSide * 56, 540, aSide * 34, 496);
      ctx.closePath();
      strokeFill(ctx, skin.base, 3.5);
    }

    // Neck
    ctx.beginPath();
    roundRectPath(ctx, -14, 432, 28, 46, 10);
    strokeFill(ctx, skin.base, 3.5);
    // Neck shadow under chin
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(0, 444, 13, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.beginPath();
    ctx.moveTo(-38, 474);
    ctx.quadraticCurveTo(0, 465, 38, 474);
    ctx.lineTo(28, 566);
    ctx.quadraticCurveTo(42, 602, 34, 624);
    ctx.quadraticCurveTo(0, 636, -34, 624);
    ctx.quadraticCurveTo(-42, 602, -28, 566);
    ctx.closePath();
    strokeFill(ctx, skin.base, 3.5);

    // Cute default pastel tank/slip (so base doll is kid-appropriate before dressing)
    ctx.beginPath();
    ctx.moveTo(-26, 488);
    ctx.lineTo(-22, 472);
    ctx.lineTo(-14, 472);
    ctx.quadraticCurveTo(0, 494, 14, 472);
    ctx.lineTo(22, 472);
    ctx.lineTo(26, 488);
    ctx.lineTo(26, 566);
    ctx.quadraticCurveTo(38, 598, 32, 624);
    ctx.quadraticCurveTo(0, 634, -32, 624);
    ctx.quadraticCurveTo(-38, 598, -26, 566);
    ctx.closePath();
    strokeFill(ctx, '#ffd8ec', 3);
    drawHeart(ctx, 0, 520, 12, '#ff7ab8', null);

    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 5: SHOES ====================
  function drawShoes(ctx, shoesId, time) {
    if (!shoesId) return;
    ctx.save();
    for (var side = -1; side <= 1; side += 2) {
      var fx = side * 23;
      var fy = 815;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.scale(side, 1);

      if (shoesId === 'shoes_glass') {
        var gg = ctx.createLinearGradient(-15, -16, 20, 12);
        gg.addColorStop(0, '#e3fbff');
        gg.addColorStop(1, '#84e0ff');
        ctx.beginPath();
        ctx.moveTo(-12, -14);
        ctx.quadraticCurveTo(0, -2, 16, -2);
        ctx.quadraticCurveTo(22, 6, 16, 12);
        ctx.lineTo(-14, 12);
        ctx.closePath();
        strokeFill(ctx, gg, 2.8, '#3898c9');
        drawSparkle(ctx, 8, -4, 6, '#ffffff', 0.95);
      } else if (shoesId === 'shoes_heels') {
        ctx.beginPath();
        ctx.moveTo(-13, -15);
        ctx.quadraticCurveTo(0, -1, 17, -2);
        ctx.quadraticCurveTo(22, 7, 15, 13);
        ctx.lineTo(-4, 13);
        ctx.lineTo(-8, 4);
        ctx.lineTo(-10, 14);
        ctx.lineTo(-14, 14);
        ctx.closePath();
        strokeFill(ctx, '#ff4d9e', 3);
        drawHeart(ctx, 6, -4, 7, '#ffe066', null);
      } else if (shoesId === 'shoes_sneakers') {
        // High-top sneakers
        roundRectPath(ctx, -14, -36, 28, 36, 8);
        strokeFill(ctx, '#45b7ff', 3);
        ctx.beginPath();
        roundRectPath(ctx, -15, 0, 36, 14, 6);
        strokeFill(ctx, '#ffffff', 3);
        ctx.fillStyle = '#ff5ca8';
        ctx.beginPath();
        ctx.arc(0, -18, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (shoesId === 'shoes_combat') {
        roundRectPath(ctx, -15, -48, 30, 48, 7);
        strokeFill(ctx, '#3b2d4a', 3);
        roundRectPath(ctx, -16, -4, 36, 17, 6);
        strokeFill(ctx, '#261c30', 3);
        ctx.fillStyle = '#ffbe2e';
        ctx.fillRect(-10, -24, 20, 4);
        ctx.fillRect(-10, -12, 20, 4);
      } else if (shoesId === 'shoes_magic') {
        // Glowing levitation ring under boots
        var glow = 0.7 + 0.3 * Math.sin(time * 6);
        ctx.strokeStyle = 'rgba(91, 240, 255, ' + glow + ')';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(2, 16, 22, 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        roundRectPath(ctx, -14, -46, 28, 48, 9);
        strokeFill(ctx, '#8e4eff', 3);
        roundRectPath(ctx, -15, -2, 35, 13, 6);
        strokeFill(ctx, '#5bf0ff', 3);
        drawStar(ctx, 2, -26, 7, 3, 5, '#ffe169', null);
      } else if (shoesId === 'shoes_ballet') {
        // Criss-cross ribbons
        ctx.strokeStyle = '#ff69b4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, -40);
        ctx.lineTo(10, -25);
        ctx.moveTo(10, -40);
        ctx.lineTo(-10, -25);
        ctx.moveTo(-10, -25);
        ctx.lineTo(10, -10);
        ctx.moveTo(10, -25);
        ctx.lineTo(-10, -10);
        ctx.stroke();
        roundRectPath(ctx, -14, -6, 33, 18, 9);
        strokeFill(ctx, '#ffa8d2', 3);
      } else if (shoesId === 'shoes_knight') {
        roundRectPath(ctx, -15, -52, 30, 52, 8);
        strokeFill(ctx, '#b2c0d9', 3);
        roundRectPath(ctx, -16, -2, 36, 15, 7);
        strokeFill(ctx, '#607396', 3);
        ctx.fillStyle = '#ffd24a';
        ctx.fillRect(-15, -48, 30, 6);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 6: BOTTOMS ====================
  function drawBottom(ctx, bottomId) {
    if (!bottomId) return;
    ctx.save();
    if (bottomId === 'bot_pleated') {
      ctx.beginPath();
      ctx.moveTo(-30, 566);
      ctx.lineTo(30, 566);
      ctx.lineTo(76, 682);
      ctx.quadraticCurveTo(0, 696, -76, 682);
      ctx.closePath();
      strokeFill(ctx, '#ff6ba9', 3.5);
      // Pleat lines & white stripe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-70, 668);
      ctx.quadraticCurveTo(0, 682, 70, 668);
      ctx.stroke();
      ctx.strokeStyle = '#b8326a';
      ctx.lineWidth = 2.5;
      for (var p = -20; p <= 20; p += 13) {
        ctx.beginPath();
        ctx.moveTo(p, 572);
        ctx.lineTo(p * 2.3, 680);
        ctx.stroke();
      }
      // Waistband
      roundRectPath(ctx, -31, 562, 62, 14, 5);
      strokeFill(ctx, '#643a7a', 3);
    } else if (bottomId === 'bot_cargo') {
      for (var side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.moveTo(side * 2, 608);
        ctx.lineTo(side * 34, 566);
        ctx.lineTo(side * 44, 780);
        ctx.lineTo(side * 8, 780);
        ctx.closePath();
        strokeFill(ctx, '#6f9c6b', 3.5);
        // Cargo pocket
        roundRectPath(ctx, side > 0 ? 22 : -40, 650, 18, 28, 4);
        strokeFill(ctx, '#4a6e47', 2.5);
      }
      roundRectPath(ctx, -32, 562, 64, 14, 5);
      strokeFill(ctx, '#4a6e47', 3);
    } else if (bottomId === 'bot_jeans') {
      for (var js = -1; js <= 1; js += 2) {
        ctx.beginPath();
        ctx.moveTo(js * 2, 610);
        ctx.lineTo(js * 32, 566);
        ctx.lineTo(js * 36, 782);
        ctx.lineTo(js * 10, 782);
        ctx.closePath();
        strokeFill(ctx, '#4674c9', 3.5);
      }
      roundRectPath(ctx, -32, 562, 64, 15, 5);
      strokeFill(ctx, '#385ea6', 3);
      drawStar(ctx, -22, 668, 9, 4, 5, '#ffde59', OUTLINE, 2);
      drawStar(ctx, 24, 720, 8, 3.5, 5, '#ff8cc2', OUTLINE, 2);
    } else if (bottomId === 'bot_tulle') {
      var tg = ctx.createLinearGradient(0, 566, 0, 712);
      tg.addColorStop(0, '#b578ff');
      tg.addColorStop(1, '#f2dcff');
      ctx.beginPath();
      ctx.moveTo(-30, 566);
      ctx.lineTo(30, 566);
      ctx.bezierCurveTo(70, 615, 96, 656, 86, 698);
      ctx.quadraticCurveTo(42, 714, 0, 704);
      ctx.quadraticCurveTo(-42, 714, -86, 698);
      ctx.bezierCurveTo(-96, 656, -70, 615, -30, 566);
      ctx.closePath();
      strokeFill(ctx, tg, 3.5);
      drawSparkle(ctx, -38, 648, 7, '#ffffff', 0.9);
      drawSparkle(ctx, 35, 662, 8, '#ffe675', 0.9);
      roundRectPath(ctx, -31, 562, 62, 13, 5);
      strokeFill(ctx, '#ffbe2e', 3);
    } else if (bottomId === 'bot_leggings') {
      var lg = ctx.createLinearGradient(0, 566, 0, 786);
      lg.addColorStop(0, '#2d235e');
      lg.addColorStop(0.5, '#5937a8');
      lg.addColorStop(1, '#2d235e');
      for (var ls = -1; ls <= 1; ls += 2) {
        ctx.beginPath();
        ctx.moveTo(ls * 2, 612);
        ctx.lineTo(ls * 31, 566);
        ctx.lineTo(ls * 33, 784);
        ctx.lineTo(ls * 12, 784);
        ctx.closePath();
        strokeFill(ctx, lg, 3.5);
      }
      drawSparkle(ctx, -20, 660, 6, '#62e8ff', 0.95);
      drawSparkle(ctx, 22, 715, 7, '#ff8ce6', 0.95);
    } else if (bottomId === 'bot_shorts') {
      for (var ss = -1; ss <= 1; ss += 2) {
        ctx.beginPath();
        ctx.moveTo(ss * 2, 610);
        ctx.lineTo(ss * 32, 566);
        ctx.lineTo(ss * 42, 646);
        ctx.lineTo(ss * 8, 646);
        ctx.closePath();
        strokeFill(ctx, '#5689e0', 3.5);
      }
      // Pink ruffle hem
      ctx.fillStyle = '#ff8cc2';
      roundRectPath(ctx, -43, 640, 36, 10, 4);
      strokeFill(ctx, '#ff8cc2', 2.5);
      roundRectPath(ctx, 7, 640, 36, 10, 4);
      strokeFill(ctx, '#ff8cc2', 2.5);
      roundRectPath(ctx, -32, 562, 64, 14, 5);
      strokeFill(ctx, '#3b67b5', 3);
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 7: TOPS ====================
  function drawTop(ctx, topId) {
    if (!topId) return;
    ctx.save();
    if (topId === 'top_hoodie') {
      // Sleeves
      for (var s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.moveTo(s * 36, 474);
        ctx.quadraticCurveTo(s * 68, 514, s * 78, 578);
        ctx.lineTo(s * 54, 582);
        ctx.quadraticCurveTo(s * 48, 535, s * 32, 496);
        ctx.closePath();
        strokeFill(ctx, '#a4e3ff', 3.5);
      }
      // Body
      roundRectPath(ctx, -36, 472, 72, 104, 18);
      strokeFill(ctx, '#ff96cf', 3.5);
      // Hood collar & pocket
      ctx.beginPath();
      ctx.ellipse(0, 476, 26, 12, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#a4e3ff', 3);
      roundRectPath(ctx, -20, 534, 40, 26, 8);
      strokeFill(ctx, '#ffb8df', 2.5);
      drawHeart(ctx, 0, 496, 12, '#ffffff', OUTLINE, 2);
    } else if (topId === 'top_denim') {
      // White inner tee
      roundRectPath(ctx, -32, 472, 64, 100, 12);
      strokeFill(ctx, '#ffffff', 3.5);
      // Denim sleeves
      for (var ds = -1; ds <= 1; ds += 2) {
        ctx.beginPath();
        ctx.moveTo(ds * 36, 472);
        ctx.quadraticCurveTo(ds * 66, 515, ds * 76, 574);
        ctx.lineTo(ds * 54, 578);
        ctx.quadraticCurveTo(ds * 46, 534, ds * 30, 498);
        ctx.closePath();
        strokeFill(ctx, '#4c80d4', 3.5);
        // Open jacket panels
        roundRectPath(ctx, ds > 0 ? 8 : -36, 472, 28, 100, 8);
        strokeFill(ctx, '#4c80d4', 3.5);
      }
      drawStar(ctx, -22, 502, 7, 3, 5, '#ffcf56', null);
    } else if (topId === 'top_graphic') {
      // Short sleeves
      for (var gs = -1; gs <= 1; gs += 2) {
        ctx.beginPath();
        ctx.moveTo(gs * 35, 472);
        ctx.lineTo(gs * 60, 508);
        ctx.lineTo(gs * 40, 522);
        ctx.lineTo(gs * 28, 498);
        ctx.closePath();
        strokeFill(ctx, '#ff5ea8', 3.5);
      }
      roundRectPath(ctx, -34, 472, 68, 98, 14);
      strokeFill(ctx, '#ffffff', 3.5);
      drawStar(ctx, 0, 518, 18, 8, 5, '#48c8ff', OUTLINE, 2.5);
    } else if (topId === 'top_tunic') {
      for (var ts = -1; ts <= 1; ts += 2) {
        ctx.beginPath();
        ctx.moveTo(ts * 38, 472);
        ctx.quadraticCurveTo(ts * 64, 512, ts * 72, 568);
        ctx.lineTo(ts * 52, 572);
        ctx.lineTo(ts * 32, 498);
        ctx.closePath();
        strokeFill(ctx, '#c5d2eb', 3.5);
      }
      ctx.beginPath();
      ctx.moveTo(-36, 472);
      ctx.lineTo(36, 472);
      ctx.lineTo(42, 595);
      ctx.lineTo(0, 612);
      ctx.lineTo(-42, 595);
      ctx.closePath();
      strokeFill(ctx, '#3962c7', 3.5);
      // Gold belt & crest
      roundRectPath(ctx, -34, 554, 68, 14, 4);
      strokeFill(ctx, '#ffce47', 3);
      drawStar(ctx, 0, 512, 13, 6, 4, '#ffce47', OUTLINE, 2);
    } else if (topId === 'top_puff') {
      // Puffy princess sleeves
      for (var ps = -1; ps <= 1; ps += 2) {
        ctx.beginPath();
        ctx.arc(ps * 46, 490, 22, 0, Math.PI * 2);
        strokeFill(ctx, '#ffa8d5', 3.5);
      }
      roundRectPath(ctx, -34, 474, 68, 96, 14);
      strokeFill(ctx, '#fff5fa', 3.5);
      // Bow at neck
      drawHeart(ctx, 0, 488, 11, '#ff5ca8', OUTLINE, 2);
    } else if (topId === 'top_varsity') {
      for (var vs = -1; vs <= 1; vs += 2) {
        ctx.beginPath();
        ctx.moveTo(vs * 36, 472);
        ctx.quadraticCurveTo(vs * 66, 515, vs * 75, 575);
        ctx.lineTo(vs * 54, 578);
        ctx.lineTo(vs * 30, 498);
        ctx.closePath();
        strokeFill(ctx, '#fff7e8', 3.5);
      }
      roundRectPath(ctx, -35, 472, 70, 100, 14);
      strokeFill(ctx, '#9549e8', 3.5);
      // Center snap line
      ctx.strokeStyle = '#ffbe2e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 476);
      ctx.lineTo(0, 568);
      ctx.stroke();
      drawStar(ctx, -18, 508, 8, 3.5, 5, '#ffbe2e', null);
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 8: FULL OUTFITS ====================
  function drawBallgown(ctx, primary, secondary, accent) {
    // Puffy princess sleeves
    for (var s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.arc(s * 44, 488, 22, 0, Math.PI * 2);
      strokeFill(ctx, secondary, 3.5);
    }

    // Grand layered ballgown skirt
    var skG = ctx.createLinearGradient(0, 562, 0, 815);
    skG.addColorStop(0, primary);
    skG.addColorStop(1, secondary);
    ctx.beginPath();
    ctx.moveTo(-30, 564);
    ctx.bezierCurveTo(-98, 608, -142, 710, -135, 800);
    ctx.quadraticCurveTo(-72, 822, -32, 804);
    ctx.quadraticCurveTo(0, 826, 32, 804);
    ctx.quadraticCurveTo(72, 822, 135, 800);
    ctx.bezierCurveTo(142, 710, 98, 608, 30, 564);
    ctx.closePath();
    strokeFill(ctx, skG, 4);

    // Overskirt petal drapes
    ctx.beginPath();
    ctx.moveTo(-28, 566);
    ctx.quadraticCurveTo(-68, 632, -88, 668);
    ctx.quadraticCurveTo(-36, 696, 0, 650);
    ctx.quadraticCurveTo(36, 696, 88, 668);
    ctx.quadraticCurveTo(68, 632, 28, 566);
    ctx.closePath();
    strokeFill(ctx, secondary, 3);

    // Corset bodice
    ctx.beginPath();
    ctx.moveTo(-34, 474);
    ctx.quadraticCurveTo(0, 488, 34, 474);
    ctx.lineTo(28, 566);
    ctx.quadraticCurveTo(0, 580, -28, 566);
    ctx.closePath();
    strokeFill(ctx, primary, 3.5);

    // Bodice gemstone & sparkles
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, 496);
    ctx.lineTo(11, 510);
    ctx.lineTo(0, 524);
    ctx.lineTo(-11, 510);
    ctx.closePath();
    strokeFill(ctx, accent, 2.5);

    drawSparkle(ctx, -64, 718, 9, '#ffffff', 0.9);
    drawSparkle(ctx, 68, 738, 10, accent, 0.9);
    drawSparkle(ctx, 4, 760, 8, '#ffffff', 0.85);
  }

  function drawFullOutfit(ctx, outfit) {
    if (!outfit) return;
    ctx.save();
    if (outfit.id.indexOf('gown_') === 0) {
      drawBallgown(ctx, outfit.primary, outfit.secondary, outfit.accent);
    } else if (outfit.id === 'knight_armor') {
      // Shoulder pauldrons
      for (var s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.arc(s * 44, 486, 20, Math.PI, 0, false);
        ctx.closePath();
        strokeFill(ctx, '#b5c2d9', 3.5);
        // Armored sleeves & greaves
        ctx.beginPath();
        ctx.moveTo(s * 38, 492);
        ctx.lineTo(s * 72, 574);
        ctx.lineTo(s * 54, 578);
        ctx.lineTo(s * 28, 502);
        ctx.closePath();
        strokeFill(ctx, '#4d6185', 3);
        // Leg armor
        ctx.beginPath();
        ctx.moveTo(s * 4, 610);
        ctx.lineTo(s * 32, 574);
        ctx.lineTo(s * 36, 770);
        ctx.lineTo(s * 10, 770);
        ctx.closePath();
        strokeFill(ctx, '#4d6185', 3.5);
      }
      // Steel breastplate
      ctx.beginPath();
      ctx.moveTo(-36, 474);
      ctx.lineTo(36, 474);
      ctx.lineTo(30, 568);
      ctx.lineTo(0, 594);
      ctx.lineTo(-30, 568);
      ctx.closePath();
      strokeFill(ctx, '#b5c2d9', 3.5);
      // Tassets skirt
      ctx.beginPath();
      ctx.moveTo(-32, 568);
      ctx.lineTo(32, 568);
      ctx.lineTo(48, 636);
      ctx.lineTo(0, 650);
      ctx.lineTo(-48, 636);
      ctx.closePath();
      strokeFill(ctx, '#4d6185', 3.5);
      drawStar(ctx, 0, 518, 15, 7, 4, '#ffd24a', OUTLINE, 2.5);
    } else if (outfit.id === 'hero_cosmic' || outfit.id === 'hero_solar') {
      // Sleek full superhero bodysuit
      for (var hs = -1; hs <= 1; hs += 2) {
        // Sleeves
        ctx.beginPath();
        ctx.moveTo(hs * 38, 474);
        ctx.lineTo(hs * 75, 575);
        ctx.lineTo(hs * 56, 578);
        ctx.lineTo(hs * 30, 496);
        ctx.closePath();
        strokeFill(ctx, outfit.primary, 3.5);
        // Legs
        ctx.beginPath();
        ctx.moveTo(hs * 3, 612);
        ctx.lineTo(hs * 32, 570);
        ctx.lineTo(hs * 33, 780);
        ctx.lineTo(hs * 12, 780);
        ctx.closePath();
        strokeFill(ctx, outfit.primary, 3.5);
      }
      roundRectPath(ctx, -35, 472, 70, 148, 16);
      strokeFill(ctx, outfit.primary, 3.5);
      // Chest emblem & utility belt
      ctx.fillStyle = outfit.secondary;
      roundRectPath(ctx, -32, 558, 64, 15, 6);
      strokeFill(ctx, outfit.secondary, 3);
      drawStar(ctx, 0, 514, 18, 8, 5, outfit.accent, OUTLINE, 2.5);
    } else if (outfit.id === 'wizard_robe') {
      // Wide flowing wizard sleeves
      for (var ws = -1; ws <= 1; ws += 2) {
        ctx.beginPath();
        ctx.moveTo(ws * 34, 474);
        ctx.lineTo(ws * 76, 576);
        ctx.lineTo(ws * 46, 594);
        ctx.lineTo(ws * 26, 502);
        ctx.closePath();
        strokeFill(ctx, '#49309e', 3.5);
      }
      // Long starry robe
      var wg = ctx.createLinearGradient(0, 472, 0, 800);
      wg.addColorStop(0, '#49309e');
      wg.addColorStop(1, '#835af2');
      ctx.beginPath();
      ctx.moveTo(-36, 474);
      ctx.lineTo(36, 474);
      ctx.lineTo(78, 795);
      ctx.quadraticCurveTo(0, 812, -78, 795);
      ctx.closePath();
      strokeFill(ctx, wg, 3.5);
      // Golden star trim & sash
      roundRectPath(ctx, -32, 558, 64, 16, 6);
      strokeFill(ctx, '#ffd64d', 3);
      drawStar(ctx, -28, 675, 11, 5, 5, '#ffd64d', null);
      drawStar(ctx, 32, 728, 12, 5, 5, '#ffd64d', null);
      drawSparkle(ctx, 6, 632, 9, '#ffffff', 0.9);
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 9: HEAD & EXPRESSIONS ====================
  function drawHead(ctx, skin) {
    ctx.save();
    // Ears
    for (var s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.ellipse(s * 80, 368, 14, 18, s * 0.15, 0, Math.PI * 2);
      strokeFill(ctx, skin.base, 3.5);
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(s * 79, 368, 6, 9, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Face contour
    ctx.beginPath();
    ctx.ellipse(0, 355, 80, 84, 0, 0, Math.PI * 2);
    strokeFill(ctx, skin.base, 3.5);

    // Subtle forehead highlight
    ctx.fillStyle = skin.highlight;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.ellipse(-20, 308, 28, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Cute tiny nose
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 382, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
  }

  function drawExpression(ctx, exprId, skin) {
    ctx.save();
    // Soft cheek blush
    var blushAlpha = exprId === 'blush' ? 0.65 : 0.35;
    ctx.fillStyle = skin.blush;
    ctx.globalAlpha = blushAlpha;
    ctx.beginPath();
    ctx.ellipse(-44, 386, 17, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(44, 386, 17, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (exprId === 'blush') {
      // Extra cute blush lines
      ctx.strokeStyle = '#ff6b98';
      ctx.lineWidth = 2.5;
      for (var s = -1; s <= 1; s += 2) {
        for (var l = -1; l <= 1; l++) {
          ctx.beginPath();
          ctx.moveTo(s * 44 + l * 7 - 3, 390);
          ctx.lineTo(s * 44 + l * 7 + 3, 381);
          ctx.stroke();
        }
      }
    }

    // Eyebrows
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    for (var b = -1; b <= 1; b += 2) {
      var lift = exprId === 'royal' ? -3 : 0;
      ctx.beginPath();
      ctx.moveTo(b * 46, 333 + lift);
      ctx.quadraticCurveTo(b * 34, 326 + lift, b * 20, 333 + lift);
      ctx.stroke();
    }

    // Eyes
    function drawSparkleEye(ex, isStarry) {
      ctx.save();
      ctx.translate(ex, 360);
      // White sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 17, 20, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#ffffff', 3);

      // Iris
      var ig = ctx.createLinearGradient(0, -12, 0, 14);
      ig.addColorStop(0, '#5a327d');
      ig.addColorStop(1, '#9b59e6');
      ctx.fillStyle = ig;
      ctx.beginPath();
      ctx.ellipse(0, 1, 12.5, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#241438';
      ctx.beginPath();
      ctx.ellipse(0, 2, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Catchlights
      if (isStarry) {
        drawStar(ctx, 0, 0, 9, 4, 4, '#fff7a8', null);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-4.5, -5, 4.5, 0, Math.PI * 2);
        ctx.arc(4.5, 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Upper lashes
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 2, 18, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      ctx.restore();
    }

    if (exprId === 'cool') {
      // Built-in cool sunglasses!
      for (var g = -1; g <= 1; g += 2) {
        roundRectPath(ctx, g > 0 ? 8 : -58, 341, 50, 34, 11);
        strokeFill(ctx, '#261d36', 3.5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(g > 0 ? 16 : -50, 366);
        ctx.lineTo(g > 0 ? 32 : -34, 348);
        ctx.stroke();
      }
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-8, 353);
      ctx.lineTo(8, 353);
      ctx.stroke();
    } else if (exprId === 'wink') {
      drawSparkleEye(-34, false);
      // Playful wink arc on right eye
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(34, 365, 15, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else {
      drawSparkleEye(-34, exprId === 'starry');
      drawSparkleEye(34, exprId === 'starry');
    }

    // Mouth
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    if (exprId === 'laugh' || exprId === 'starry') {
      ctx.beginPath();
      ctx.moveTo(-18, 400);
      ctx.quadraticCurveTo(0, 402, 18, 400);
      ctx.quadraticCurveTo(16, 424, 0, 424);
      ctx.quadraticCurveTo(-16, 424, -18, 400);
      ctx.closePath();
      strokeFill(ctx, '#ff6495', 3);
      ctx.fillStyle = '#ffa8c5';
      ctx.beginPath();
      ctx.ellipse(0, 417, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (exprId === 'royal') {
      ctx.beginPath();
      ctx.moveTo(-14, 405);
      ctx.quadraticCurveTo(0, 416, 14, 405);
      ctx.stroke();
    } else if (exprId === 'blush') {
      ctx.beginPath();
      ctx.arc(-6, 404, 6, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(6, 404, 6, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else {
      // Happy / Wink / Cool confident smile
      ctx.beginPath();
      ctx.moveTo(-15, 402);
      ctx.quadraticCurveTo(0, 418, 15, 402);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 10: FRONT HAIR ====================
  function drawFrontHair(ctx, styleId, hairColor) {
    var base = hairColor.base;
    var hi = hairColor.highlight;
    ctx.save();

    if (styleId === 'curly_afro') {
      // Soft curly bangs along forehead
      ctx.beginPath();
      ctx.arc(-44, 286, 26, 0, Math.PI * 2);
      ctx.arc(0, 276, 28, 0, Math.PI * 2);
      ctx.arc(44, 286, 26, 0, Math.PI * 2);
      strokeFill(ctx, base, 3.5);
      ctx.restore();
      return;
    }

    if (styleId === 'braided_crown') {
      // Crown braid wrapped cleanly across top of head
      ctx.beginPath();
      ctx.arc(0, 355, 84, Math.PI * 1.05, Math.PI * 1.95);
      ctx.quadraticCurveTo(45, 318, 0, 314);
      ctx.quadraticCurveTo(-45, 318, -83, 340);
      ctx.closePath();
      strokeFill(ctx, base, 3.5);

      for (var bx = -60; bx <= 60; bx += 24) {
        ctx.beginPath();
        ctx.ellipse(bx, 276 + Math.abs(bx) * 0.25, 16, 12, bx * -0.008, 0, Math.PI * 2);
        strokeFill(ctx, bx % 48 === 0 ? base : hi, 3);
      }
      ctx.restore();
      return;
    }

    // Standard smooth crown + swept bangs for princess/bob/ponytail/mermaid/buns/braids/pixie
    ctx.beginPath();
    ctx.moveTo(-84, 362);
    ctx.bezierCurveTo(-86, 268, -42, 254, 0, 256);
    ctx.bezierCurveTo(42, 254, 86, 268, 84, 362);
    if (styleId === 'short_bob' || styleId === 'space_buns') {
      // Cute straight fringe with side framing
      ctx.quadraticCurveTo(68, 326, 56, 314);
      ctx.quadraticCurveTo(18, 324, 0, 318);
      ctx.quadraticCurveTo(-18, 324, -56, 314);
      ctx.quadraticCurveTo(-68, 326, -84, 362);
    } else if (styleId === 'pixie_cut') {
      ctx.quadraticCurveTo(54, 318, 22, 304);
      ctx.quadraticCurveTo(-10, 324, -52, 306);
      ctx.quadraticCurveTo(-72, 324, -84, 362);
    } else {
      // Swept parted princess bangs + side locks
      ctx.quadraticCurveTo(72, 336, 66, 365);
      ctx.quadraticCurveTo(46, 314, 4, 298);
      ctx.quadraticCurveTo(-42, 314, -66, 365);
      ctx.quadraticCurveTo(-72, 336, -84, 362);
    }
    ctx.closePath();
    strokeFill(ctx, base, 3.5);

    // Glossy hair highlight arc
    ctx.strokeStyle = hi;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 344, 62, Math.PI * 1.22, Math.PI * 1.78);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 11: EYEWEAR ====================
  function drawEyewear(ctx, eyewearId) {
    if (!eyewearId) return;
    ctx.save();
    if (eyewearId === 'glasses_star') {
      for (var s = -1; s <= 1; s += 2) {
        drawStar(ctx, s * 34, 360, 26, 12, 5, 'rgba(255, 82, 168, 0.35)', '#ff52a8', 4);
      }
      ctx.strokeStyle = '#ff52a8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-14, 358);
      ctx.lineTo(14, 358);
      ctx.stroke();
    } else if (eyewearId === 'glasses_heart') {
      for (var hs = -1; hs <= 1; hs += 2) {
        drawHeart(ctx, hs * 34, 344, 24, 'rgba(255, 71, 120, 0.32)', '#ff4778', 4);
      }
      ctx.strokeStyle = '#ff4778';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-12, 355);
      ctx.lineTo(12, 355);
      ctx.stroke();
    } else if (eyewearId === 'glasses_mask') {
      ctx.beginPath();
      ctx.moveTo(-72, 344);
      ctx.quadraticCurveTo(-34, 326, 0, 344);
      ctx.quadraticCurveTo(34, 326, 72, 344);
      ctx.lineTo(66, 376);
      ctx.quadraticCurveTo(34, 386, 0, 368);
      ctx.quadraticCurveTo(-34, 386, -66, 376);
      ctx.closePath();
      strokeFill(ctx, '#5639d9', 3.5);
      // Cutout eye holes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-34, 358, 16, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(34, 358, 16, 11, 0, 0, Math.PI * 2);
      strokeFill(ctx, 'rgba(74, 240, 255, 0.25)', 2.5, '#4af0ff');
    } else if (eyewearId === 'glasses_wizard') {
      ctx.strokeStyle = '#ffbe2e';
      ctx.lineWidth = 4.5;
      for (var ws = -1; ws <= 1; ws += 2) {
        ctx.fillStyle = 'rgba(217, 246, 255, 0.22)';
        ctx.beginPath();
        ctx.arc(ws * 34, 360, 23, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-11, 360);
      ctx.lineTo(11, 360);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 12: HEADWEAR ====================
  function drawHeadwear(ctx, headwearId) {
    if (!headwearId) return;
    ctx.save();
    if (headwearId === 'hat_tiara') {
      ctx.beginPath();
      ctx.moveTo(-48, 272);
      ctx.lineTo(-34, 236);
      ctx.lineTo(-16, 255);
      ctx.lineTo(0, 218);
      ctx.lineTo(16, 255);
      ctx.lineTo(34, 236);
      ctx.lineTo(48, 272);
      ctx.quadraticCurveTo(0, 260, -48, 272);
      ctx.closePath();
      strokeFill(ctx, '#ffd24a', 3);
      ctx.fillStyle = '#ff52a8';
      ctx.beginPath();
      ctx.arc(0, 246, 7, 0, Math.PI * 2);
      strokeFill(ctx, '#ff52a8', 2);
    } else if (headwearId === 'hat_crown') {
      ctx.beginPath();
      ctx.moveTo(-54, 274);
      ctx.lineTo(-60, 214);
      ctx.lineTo(-28, 242);
      ctx.lineTo(0, 200);
      ctx.lineTo(28, 242);
      ctx.lineTo(60, 214);
      ctx.lineTo(54, 274);
      ctx.closePath();
      strokeFill(ctx, '#ffbe2e', 3.5);
      var gems = [[-36, 254, '#5ce1ff'], [0, 248, '#ff427b'], [36, 254, '#5ce1ff']];
      for (var g = 0; g < gems.length; g++) {
        ctx.beginPath();
        ctx.arc(gems[g][0], gems[g][1], 6, 0, Math.PI * 2);
        strokeFill(ctx, gems[g][2], 2);
      }
    } else if (headwearId === 'hat_wizard') {
      // Brim
      ctx.beginPath();
      ctx.ellipse(0, 272, 102, 24, -0.06, 0, Math.PI * 2);
      strokeFill(ctx, '#5634b8', 3.5);
      // Tall wizard cone
      ctx.beginPath();
      ctx.moveTo(-58, 268);
      ctx.quadraticCurveTo(-18, 175, 22, 128);
      ctx.quadraticCurveTo(28, 195, 58, 266);
      ctx.closePath();
      strokeFill(ctx, '#5634b8', 3.5);
      // Gold band & star
      ctx.strokeStyle = '#ffdc52';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(-52, 256);
      ctx.quadraticCurveTo(0, 248, 52, 256);
      ctx.stroke();
      drawStar(ctx, 4, 204, 13, 5.5, 5, '#ffdc52', OUTLINE, 2);
    } else if (headwearId === 'hat_flower') {
      // Vine base
      ctx.strokeStyle = '#48ba5c';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 326, 74, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      var flowers = [
        [-48, 268, '#ff7ab8'], [-24, 256, '#ffe066'], [0, 252, '#ff5e9e'],
        [24, 256, '#a8e6ff'], [48, 268, '#ff94c8']
      ];
      for (var f = 0; f < flowers.length; f++) {
        var fl = flowers[f];
        ctx.fillStyle = fl[2];
        for (var p = 0; p < 5; p++) {
          var a = (p * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.arc(fl[0] + Math.cos(a) * 8, fl[1] + Math.sin(a) * 8, 6.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fff59d';
        ctx.beginPath();
        ctx.arc(fl[0], fl[1], 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 13: HANDHELD PROPS ====================
  function drawHandheld(ctx, propId, time) {
    if (!propId) return;
    ctx.save();
    ctx.translate(78, 590);
    if (propId === 'prop_wand') {
      ctx.rotate(0.42);
      roundRectPath(ctx, -4, -125, 8, 145, 4);
      strokeFill(ctx, '#ff8cc8', 3);
      drawStar(ctx, 0, -135, 24, 10, 5, '#ffd84d', OUTLINE, 3);
      var glow = 0.65 + 0.35 * Math.sin(time * 5);
      drawSparkle(ctx, 0, -135, 16 * glow, '#ffffff', 0.9, time);
    } else if (propId === 'prop_scepter') {
      ctx.rotate(0.35);
      roundRectPath(ctx, -4.5, -138, 9, 162, 4);
      strokeFill(ctx, '#ffd24a', 3);
      drawHeart(ctx, 0, -162, 24, '#6be8ff', OUTLINE, 3);
      drawSparkle(ctx, -6, -152, 7, '#ffffff', 0.95);
    } else if (propId === 'prop_sword') {
      ctx.rotate(0.45);
      // Blade
      ctx.beginPath();
      ctx.moveTo(0, -168);
      ctx.lineTo(12, -135);
      ctx.lineTo(10, -15);
      ctx.lineTo(-10, -15);
      ctx.lineTo(-12, -135);
      ctx.closePath();
      strokeFill(ctx, '#dce6f7', 3);
      // Crossguard & hilt
      roundRectPath(ctx, -24, -18, 48, 11, 5);
      strokeFill(ctx, '#ffbe2e', 3);
      roundRectPath(ctx, -5, -7, 10, 32, 4);
      strokeFill(ctx, '#6941a8', 3);
      ctx.beginPath();
      ctx.arc(0, 28, 8, 0, Math.PI * 2);
      strokeFill(ctx, '#ffbe2e', 3);
    } else if (propId === 'prop_shield') {
      ctx.translate(-12, -12);
      ctx.beginPath();
      ctx.moveTo(-38, -46);
      ctx.lineTo(38, -46);
      ctx.lineTo(34, 16);
      ctx.quadraticCurveTo(0, 56, 0, 56);
      ctx.quadraticCurveTo(0, 56, -34, 16);
      ctx.closePath();
      strokeFill(ctx, '#4b7bec', 4, '#ffd24a');
      drawStar(ctx, 0, -6, 17, 7, 5, '#ffd24a', OUTLINE, 2.5);
    }
    ctx.restore();
  }

  // ==================== Z-INDEX LAYER 14: PET COMPANIONS ====================
  function drawPet(ctx, petId, x, y, time, isRunway) {
    if (!petId || petId === 'none') return;
    var bob = Math.sin(time * (isRunway ? 5.5 : 3.2)) * (isRunway ? 12 : 5);
    var blink = Math.sin(time * 2.1) > 0.96;

    ctx.save();
    ctx.translate(x, y + bob);

    if (petId === 'pet_dragon') {
      // Wings
      var flap = Math.sin(time * 6) * 0.14;
      for (var w = -1; w <= 1; w += 2) {
        ctx.save();
        ctx.translate(w * 20, -24);
        ctx.scale(w, 1);
        ctx.rotate(flap);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(34, -36);
        ctx.lineTo(44, 4);
        ctx.quadraticCurveTo(22, 2, 0, 14);
        ctx.closePath();
        strokeFill(ctx, '#ffd24a', 3);
        ctx.restore();
      }
      // Tail
      ctx.beginPath();
      ctx.moveTo(22, 20);
      ctx.quadraticCurveTo(64, 16, 68, -14);
      ctx.quadraticCurveTo(54, 4, 22, 6);
      ctx.closePath();
      strokeFill(ctx, '#2ba86c', 3);
      // Body & Belly
      ctx.beginPath();
      ctx.ellipse(0, 12, 34, 30, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#39c983', 3.5);
      ctx.beginPath();
      ctx.ellipse(-4, 16, 20, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff2a6';
      ctx.fill();
      // Head & Horns
      for (var h = -1; h <= 1; h += 2) {
        ctx.beginPath();
        ctx.moveTo(h * 16, -54);
        ctx.lineTo(h * 24, -76);
        ctx.lineTo(h * 6, -58);
        ctx.closePath();
        strokeFill(ctx, '#ffd24a', 2.5);
      }
      ctx.beginPath();
      ctx.ellipse(0, -32, 32, 27, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#39c983', 3.5);
      // Cute fire sparkle puff
      drawSparkle(ctx, -44, -28, 9, '#ff8e3c', 0.85, time * 2);
    } else if (petId === 'pet_unicorn') {
      // Rainbow tail
      var tailColors = ['#ff6eb4', '#ffd24a', '#5cd6ff'];
      for (var tc = 0; tc < tailColors.length; tc++) {
        ctx.beginPath();
        ctx.ellipse(38, 6 + tc * 8, 16, 7, 0.3, 0, Math.PI * 2);
        strokeFill(ctx, tailColors[tc], 2.5);
      }
      // Body & legs
      for (var l = -1; l <= 1; l += 2) {
        roundRectPath(ctx, l * 18 - 7, 22, 14, 26, 6);
        strokeFill(ctx, '#ffffff', 3);
      }
      ctx.beginPath();
      ctx.ellipse(0, 12, 36, 24, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#ffffff', 3.5);
      // Rainbow mane
      ctx.beginPath();
      ctx.arc(16, -34, 15, 0, Math.PI * 2);
      strokeFill(ctx, '#ff94d6', 3);
      ctx.beginPath();
      ctx.arc(22, -16, 13, 0, Math.PI * 2);
      strokeFill(ctx, '#7ee8ff', 3);
      // Head & Golden Horn
      ctx.beginPath();
      ctx.ellipse(-8, -28, 28, 25, -0.1, 0, Math.PI * 2);
      strokeFill(ctx, '#ffffff', 3.5);
      ctx.beginPath();
      ctx.moveTo(-14, -52);
      ctx.lineTo(-22, -84);
      ctx.lineTo(-2, -52);
      ctx.closePath();
      strokeFill(ctx, '#ffd447', 3);
    } else if (petId === 'pet_corgi') {
      // Ears
      for (var ce = -1; ce <= 1; ce += 2) {
        ctx.beginPath();
        ctx.moveTo(ce * 12, -48);
        ctx.lineTo(ce * 28, -76);
        ctx.lineTo(ce * 32, -42);
        ctx.closePath();
        strokeFill(ctx, '#f29f4b', 3);
      }
      // Body + Red royal cape
      ctx.beginPath();
      ctx.ellipse(0, 16, 34, 26, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#f29f4b', 3.5);
      ctx.beginPath();
      ctx.arc(4, 12, 28, -0.3, Math.PI * 0.8);
      strokeFill(ctx, '#e0245e', 3);
      // White chest & head
      ctx.beginPath();
      ctx.ellipse(-6, -24, 32, 26, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#f29f4b', 3.5);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-6, -14, 19, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tiny golden crown
      ctx.beginPath();
      ctx.moveTo(-16, -48);
      ctx.lineTo(-18, -66);
      ctx.lineTo(-6, -56);
      ctx.lineTo(0, -68);
      ctx.lineTo(6, -56);
      ctx.lineTo(18, -66);
      ctx.lineTo(16, -48);
      ctx.closePath();
      strokeFill(ctx, '#ffd24a', 2.5);
    } else if (petId === 'pet_cat') {
      // Curled tail
      ctx.strokeStyle = '#2d243b';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(22, 26);
      ctx.bezierCurveTo(60, 22, 62, -16, 42, -14);
      ctx.stroke();
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 14, 28, 30, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#2d243b', 3.5);
      // Ears & Head
      for (var ke = -1; ke <= 1; ke += 2) {
        ctx.beginPath();
        ctx.moveTo(ke * 10, -48);
        ctx.lineTo(ke * 28, -72);
        ctx.lineTo(ke * 28, -36);
        ctx.closePath();
        strokeFill(ctx, '#2d243b', 3);
      }
      ctx.beginPath();
      ctx.ellipse(0, -26, 30, 26, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#2d243b', 3.5);
      // Tiny Purple Wizard Hat
      ctx.beginPath();
      ctx.ellipse(0, -48, 34, 8, -0.08, 0, Math.PI * 2);
      strokeFill(ctx, '#9752eb', 2.5);
      ctx.beginPath();
      ctx.moveTo(-18, -48);
      ctx.lineTo(4, -88);
      ctx.lineTo(18, -48);
      ctx.closePath();
      strokeFill(ctx, '#9752eb', 2.5);
      drawStar(ctx, 2, -62, 6, 2.5, 5, '#ffd84d', null);
    } else if (petId === 'pet_phoenix') {
      // Glowing tail plumes
      var plumeC = ['#ff4d4d', '#ff9f1c', '#ffd93d'];
      for (var pc = 0; pc < plumeC.length; pc++) {
        ctx.beginPath();
        ctx.ellipse(32 - pc * 4, 20 + pc * 6, 24, 9, -0.35 + pc * 0.25, 0, Math.PI * 2);
        strokeFill(ctx, plumeC[pc], 2.5);
      }
      // Body & Wings
      ctx.beginPath();
      ctx.ellipse(0, 12, 28, 28, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#ff6f3c', 3.5);
      ctx.beginPath();
      ctx.ellipse(18, 6, 16, 12, -0.4, 0, Math.PI * 2);
      strokeFill(ctx, '#ffd93d', 3);
      // Head crest
      ctx.beginPath();
      ctx.moveTo(0, -52);
      ctx.lineTo(10, -76);
      ctx.lineTo(14, -50);
      ctx.closePath();
      strokeFill(ctx, '#ffd93d', 2.5);
      ctx.beginPath();
      ctx.ellipse(-4, -28, 27, 25, 0, 0, Math.PI * 2);
      strokeFill(ctx, '#ff6f3c', 3.5);
      drawSparkle(ctx, -38, -48, 8, '#ffe66d', 0.9, time * 2);
    }

    // Cute Pet Eyes & Nose (shared expressive look)
    var eyeX = petId === 'pet_unicorn' ? -18 : -11;
    var eyeX2 = petId === 'pet_unicorn' ? 4 : 11;
    var eyeY = petId === 'pet_corgi' ? -26 : -28;
    if (blink) {
      ctx.strokeStyle = petId === 'pet_cat' ? '#ffd93d' : OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(eyeX - 5, eyeY);
      ctx.lineTo(eyeX + 5, eyeY);
      ctx.moveTo(eyeX2 - 5, eyeY);
      ctx.lineTo(eyeX2 + 5, eyeY);
      ctx.stroke();
    } else {
      ctx.fillStyle = petId === 'pet_cat' ? '#ffe066' : OUTLINE;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 5.5, 0, Math.PI * 2);
      ctx.arc(eyeX2, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX - 2, eyeY - 2, 2, 0, Math.PI * 2);
      ctx.arc(eyeX2 - 2, eyeY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Rosy cheeks
    ctx.fillStyle = 'rgba(255, 118, 165, 0.55)';
    ctx.beginPath();
    ctx.ellipse(eyeX - 6, eyeY + 8, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(eyeX2 + 6, eyeY + 8, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==================== RENDERER ENGINE ====================
  function DollyRenderer(canvas, getState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.getState = getState;
    this.particles = [];
    this.rafId = null;
    this.startTime = performance.now();
    this.currentDollX = 400;
    this.lastConfettiTime = 0;

    this.resize();
  }

  DollyRenderer.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = VIRTUAL_W * dpr;
    this.canvas.height = VIRTUAL_H * dpr;
    this.dpr = dpr;
  };

  DollyRenderer.prototype.spawnSparkleBurst = function (x, y, count) {
    var colors = ['#ffd84d', '#ff70b8', '#75e8ff', '#ffffff', '#b578ff'];
    var total = count || 22;
    for (var i = 0; i < total; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = 1.5 + Math.random() * 5.2;
      this.particles.push({
        kind: i % 3 === 0 ? 'circle' : 'sparkle',
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.8,
        size: 6 + Math.random() * 11,
        color: colors[i % colors.length],
        life: 1,
        decay: 0.015 + Math.random() * 0.018,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.14
      });
    }
  };

  DollyRenderer.prototype.spawnConfettiShower = function (count) {
    var colors = ['#ff4d9e', '#ffbe2e', '#48d6ff', '#9c59ff', '#5be37d', '#ffffff'];
    var total = count || 35;
    for (var i = 0; i < total; i++) {
      this.particles.push({
        kind: i % 4 === 0 ? 'sparkle' : 'confetti',
        x: Math.random() * VIRTUAL_W,
        y: -20 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 2.8,
        vy: 3.2 + Math.random() * 4.2,
        size: 8 + Math.random() * 9,
        color: colors[i % colors.length],
        life: 1,
        decay: 0.0045 + Math.random() * 0.004,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.18
      });
    }
  };

  DollyRenderer.prototype.updateAndDrawParticles = function (ctx) {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.kind === 'confetti') {
        p.vx += Math.sin(p.y * 0.04) * 0.06;
      } else {
        p.vy += 0.08;
      }
      p.rot += p.vRot;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > VIRTUAL_H + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      if (p.kind === 'sparkle') {
        drawSparkle(ctx, p.x, p.y, p.size, p.color, p.life, p.rot);
      } else if (p.kind === 'confetti') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.6, -p.size * 0.35, p.size * 1.2, p.size * 0.7);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };

  DollyRenderer.prototype.renderFrame = function (nowMs) {
    var time = (nowMs - this.startTime) / 1000;
    var state = this.getState();
    var ctx = this.ctx;
    var D = window.DollyData;

    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // 1. Background Castle Scene
    drawScene(ctx, state.scene, time, state.isRunway);

    // 2. Smoothly center doll or shift slightly left when pet is present
    var hasPet = state.pet && state.pet !== 'none';
    var targetDollX = hasPet ? 355 : 400;
    this.currentDollX += (targetDollX - this.currentDollX) * 0.14;

    // Runway dance bounce & joyful twirl
    var bounceY = 0;
    var swayAngle = 0;
    var twirlScaleX = 1;
    if (state.isRunway) {
      bounceY = -Math.abs(Math.sin(time * 4.4)) * 24;
      swayAngle = Math.sin(time * 2.2) * 0.048;
      twirlScaleX = 1 - Math.pow(Math.sin(time * 2.2), 4) * 0.1;

      if (time - this.lastConfettiTime > 0.42) {
        this.lastConfettiTime = time;
        this.spawnConfettiShower(10);
      }
    } else {
      // Gentle living idle breath
      bounceY = Math.sin(time * 2.1) * 2.5;
    }

    // 3. Floor Drop Shadows
    ctx.fillStyle = 'rgba(34, 14, 52, 0.24)';
    ctx.beginPath();
    ctx.ellipse(this.currentDollX, 834, 72 + bounceY * 0.4, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    if (hasPet) {
      ctx.beginPath();
      ctx.ellipse(615, 816, 44, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Doll Character Stack (strict Z-Index layering)
    var skin = D.byId(D.SKIN_TONES, state.skinTone) || D.SKIN_TONES[0];
    var hairColor = D.byId(D.HAIR_COLORS, state.hairColor) || D.HAIR_COLORS[0];
    var outfit = state.fullOutfit ? D.byId(D.OUTFITS, state.fullOutfit) : null;

    ctx.save();
    ctx.translate(this.currentDollX, 825 + bounceY);
    ctx.rotate(swayAngle);
    ctx.scale(twirlScaleX, 1);
    ctx.translate(0, -825);

    drawCapeBack(ctx, state.accessories.cape, time);
    drawWings(ctx, state.accessories.wings, time);
    drawBackHair(ctx, state.hairstyle, hairColor);
    drawBaseBody(ctx, skin);
    drawShoes(ctx, state.shoes, time);
    if (!outfit) {
      drawBottom(ctx, state.bottom);
      drawTop(ctx, state.top);
    } else {
      drawFullOutfit(ctx, outfit);
    }
    drawCapeClasp(ctx, state.accessories.cape);
    drawHead(ctx, skin);
    drawExpression(ctx, state.expression, skin);
    drawFrontHair(ctx, state.hairstyle, hairColor);
    drawEyewear(ctx, state.accessories.eyewear);
    drawHeadwear(ctx, state.accessories.headwear);
    drawHandheld(ctx, state.accessories.handheld, time);

    ctx.restore();

    // 5. Pet Companion next to the Doll
    drawPet(ctx, state.pet, 615, 764, time, state.isRunway);

    // 6. Sparkles & Confetti Particles
    this.updateAndDrawParticles(ctx);

    ctx.restore();
  };

  DollyRenderer.prototype.start = function () {
    var self = this;
    function loop(now) {
      self.renderFrame(now);
      self.rafId = window.requestAnimationFrame(loop);
    }
    if (!this.rafId) {
      this.rafId = window.requestAnimationFrame(loop);
    }
  };

  window.DollyRenderer = DollyRenderer;
})();
