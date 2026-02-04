import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {

  private audioContext!: AudioContext;
  private processor!: ScriptProcessorNode;
  private input!: MediaStreamAudioSourceNode;
  private stream!: MediaStream;
  private pcmData: Float32Array[] = [];

  async startRecording() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.input = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = e => {
      const channelData = e.inputBuffer.getChannelData(0);
      this.pcmData.push(new Float32Array(channelData));
    };

    this.input.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }
    resetRecording() {
    this.pcmData = [];

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null as any;
    }

    if (this.input) {
      this.input.disconnect();
      this.input = null as any;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null as any;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null as any;
    }
  }

  stopRecording(): Blob {
    this.processor.disconnect();
    this.input.disconnect();
    this.stream.getTracks().forEach(t => t.stop());

    const wavBuffer = this.encodeWav(this.mergeBuffers(this.pcmData));
    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  private mergeBuffers(buffers: Float32Array[]): Float32Array {
    const length = buffers.reduce((l, b) => l + b.length, 0);
    const result = new Float32Array(length);
    let offset = 0;
    buffers.forEach(b => {
      result.set(b, offset);
      offset += b.length;
    });
    return result;
  }

  private encodeWav(samples: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (o: number, s: string) =>
      [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 16000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    samples.forEach(s => {
      const v = Math.max(-1, Math.min(1, s));
      view.setInt16(offset, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      offset += 2;
    });

    return buffer;
  }
}
