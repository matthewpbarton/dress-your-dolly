(function () {
  'use strict';

  var ctx = null;
  var muted = false;

  function ensureContext() {
    if (muted) return null;
    try {
      if (!ctx) {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(function () {});
      }
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function playTone(freqStart, freqEnd, duration, type, volume, delay) {
    var audio = ensureContext();
    if (!audio) return;
    var now = audio.currentTime + (delay || 0);
    var osc = audio.createOscillator();
    var gain = audio.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume || 0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playClick() {
    playTone(540, 780, 0.085, 'sine', 0.12, 0);
  }

  function playEquip() {
    playTone(523.25, 523.25, 0.12, 'triangle', 0.14, 0);     // C5
    playTone(783.99, 783.99, 0.14, 'triangle', 0.13, 0.055); // G5
    playTone(1046.5, 1174.66, 0.22, 'sine', 0.12, 0.11);     // C6 -> D6 sparkle
  }

  function playRemove() {
    playTone(659.25, 523.25, 0.1, 'sine', 0.1, 0);
    playTone(440.0, 392.0, 0.14, 'sine', 0.09, 0.06);
  }

  function playSurprise() {
    var notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
    for (var i = 0; i < notes.length; i++) {
      playTone(notes[i], notes[i] * 1.01, 0.18, 'triangle', 0.11, i * 0.055);
    }
  }

  function playShutter() {
    var audio = ensureContext();
    if (!audio) return;
    try {
      var bufferSize = Math.floor(audio.sampleRate * 0.06);
      var buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      var noise = audio.createBufferSource();
      noise.buffer = buffer;

      var filter = audio.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2600;

      var gain = audio.createGain();
      gain.gain.setValueAtTime(0.18, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      noise.start();
    } catch (e) {}
    playTone(1318.5, 1567.98, 0.22, 'sine', 0.12, 0.04);
  }

  function playFanfare() {
    var audio = ensureContext();
    if (!audio) return;

    // Triumphant royal brass + sparkle cadence
    var melody = [
      { freq: 523.25, dur: 0.14, delay: 0.0 },   // C5
      { freq: 659.25, dur: 0.14, delay: 0.13 },  // E5
      { freq: 783.99, dur: 0.16, delay: 0.26 },  // G5
      { freq: 1046.5, dur: 0.30, delay: 0.41 },  // C6
      { freq: 783.99, dur: 0.14, delay: 0.72 },  // G5
      { freq: 880.00, dur: 0.14, delay: 0.86 },  // A5
      { freq: 987.77, dur: 0.15, delay: 1.00 },  // B5
      { freq: 1046.5, dur: 0.55, delay: 1.15 }   // C6!
    ];

    for (var i = 0; i < melody.length; i++) {
      var n = melody[i];
      // Warm brassy triangle + octave bell shimmer
      playTone(n.freq, n.freq, n.dur, 'triangle', 0.16, n.delay);
      playTone(n.freq * 0.5, n.freq * 0.5, n.dur, 'sawtooth', 0.05, n.delay);
      playTone(n.freq * 2, n.freq * 2, n.dur * 0.85, 'sine', 0.06, n.delay + 0.01);
    }

    // Final sparkle chord (C6 - E6 - G6)
    playTone(1046.5, 1046.5, 0.65, 'sine', 0.1, 1.16);
    playTone(1318.5, 1318.5, 0.65, 'sine', 0.09, 1.20);
    playTone(1567.98, 1567.98, 0.72, 'sine', 0.09, 1.24);
  }

  function isMuted() {
    return muted;
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    if (!muted) {
      playClick();
    }
    return muted;
  }

  function toggleMute() {
    return setMuted(!muted);
  }

  window.DollyAudio = {
    playClick: playClick,
    playEquip: playEquip,
    playRemove: playRemove,
    playSurprise: playSurprise,
    playShutter: playShutter,
    playFanfare: playFanfare,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute
  };
})();
