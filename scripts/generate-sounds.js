/**
 * Generate simple game sound effects as WAV files
 * Run with: node scripts/generate-sounds.js
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const AUDIO_DIR = path.join(__dirname, '..', 'assets', 'audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Create WAV file header
function createWavHeader(dataLength, sampleRate, channels = 1, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44);
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

// Generate a simple tone
function generateTone(frequency, duration, volume = 0.5, fadeOut = true) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    let amplitude = Math.sin(2 * Math.PI * frequency * t) * volume;
    
    // Apply fade out
    if (fadeOut) {
      const fadeStart = samples * 0.7;
      if (i > fadeStart) {
        amplitude *= 1 - (i - fadeStart) / (samples - fadeStart);
      }
    }

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(sample, i * 2);
  }

  return data;
}

// Generate noise burst (for dice rolling)
function generateNoise(duration, volume = 0.3) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    let amplitude = (Math.random() * 2 - 1) * volume;
    
    // Envelope: quick attack, longer decay
    const attackSamples = samples * 0.1;
    const decaySamples = samples * 0.9;
    
    if (i < attackSamples) {
      amplitude *= i / attackSamples;
    } else {
      amplitude *= 1 - (i - attackSamples) / decaySamples;
    }

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(sample, i * 2);
  }

  return data;
}

// Generate dice roll sound (multiple short noise bursts)
function generateDiceRoll() {
  const duration = 0.4;
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Multiple "clicks" to simulate dice bouncing
    let amplitude = 0;
    const clickTimes = [0.0, 0.08, 0.15, 0.22, 0.28, 0.33, 0.37];
    
    for (const clickTime of clickTimes) {
      const clickDuration = 0.03;
      if (t >= clickTime && t < clickTime + clickDuration) {
        const clickT = (t - clickTime) / clickDuration;
        const clickVolume = 0.4 * (1 - clickTime / duration); // Decreasing volume
        amplitude += (Math.random() * 2 - 1) * clickVolume * (1 - clickT);
      }
    }

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(Math.max(-32768, Math.min(32767, sample)), i * 2);
  }

  return data;
}

// Generate select/click sound
function generateClick() {
  const duration = 0.08;
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    // Quick high-frequency click with fast decay
    let amplitude = Math.sin(2 * Math.PI * 800 * t) * 0.4;
    amplitude += Math.sin(2 * Math.PI * 1200 * t) * 0.2;
    amplitude *= Math.exp(-t * 50); // Fast exponential decay

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(sample, i * 2);
  }

  return data;
}

// Generate score sound (ascending tones)
function generateScore() {
  const duration = 0.25;
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    // Ascending frequency
    const freq = 400 + (t / duration) * 400;
    let amplitude = Math.sin(2 * Math.PI * freq * t) * 0.4;
    
    // Fade out at end
    if (t > duration * 0.7) {
      amplitude *= 1 - (t - duration * 0.7) / (duration * 0.3);
    }

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(sample, i * 2);
  }

  return data;
}

// Generate Yahtzee celebration sound (fanfare)
function generateYahtzee() {
  const duration = 0.8;
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = Buffer.alloc(samples * 2);

  // Musical notes (C major arpeggio going up)
  const notes = [
    { freq: 523, start: 0.0, dur: 0.2 },   // C5
    { freq: 659, start: 0.15, dur: 0.2 },  // E5
    { freq: 784, start: 0.3, dur: 0.2 },   // G5
    { freq: 1047, start: 0.45, dur: 0.35 }, // C6 (held longer)
  ];

  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    let amplitude = 0;

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.dur) {
        const noteT = t - note.start;
        let noteAmp = Math.sin(2 * Math.PI * note.freq * noteT) * 0.3;
        // Add harmonics
        noteAmp += Math.sin(2 * Math.PI * note.freq * 2 * noteT) * 0.1;
        
        // Envelope
        const attack = 0.02;
        const release = 0.1;
        if (noteT < attack) {
          noteAmp *= noteT / attack;
        } else if (noteT > note.dur - release) {
          noteAmp *= (note.dur - noteT) / release;
        }
        
        amplitude += noteAmp;
      }
    }

    const sample = Math.floor(amplitude * 32767);
    data.writeInt16LE(Math.max(-32768, Math.min(32767, sample)), i * 2);
  }

  return data;
}

// Save WAV file
function saveWav(filename, audioData) {
  const header = createWavHeader(audioData.length, SAMPLE_RATE);
  const wav = Buffer.concat([header, audioData]);
  const filepath = path.join(AUDIO_DIR, filename);
  fs.writeFileSync(filepath, wav);
  console.log(`Created: ${filepath} (${wav.length} bytes)`);
}

// Generate all sounds
console.log('Generating game sounds...\n');

saveWav('roll.wav', generateDiceRoll());
saveWav('select.wav', generateClick());
saveWav('score.wav', generateScore());
saveWav('yahtzee.wav', generateYahtzee());

console.log('\nDone! Audio files created in assets/audio/');
