import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LipsyncService {

    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private stream: any;
    private source: MediaStreamAudioSourceNode;
    private data: Float32Array;
    private working: boolean;
    private smoothness: number;
    private pitch: number;
    private threshold: number;
    private fBins: number[];
    private energy: number[];
    private lipsyncBSW: number[];

    constructor() {
        // if (window.location.protocol !== 'https:') {
        //     window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        // }

        if (!window['LS']) {
            window['LS'] = {};
        }

        if (!window['LS']['Globals']) {
            window['LS']['Globals'] = {};
        }

        if (!window['LS']['Globals']['AContext']) {
            window['LS']['Globals']['AContext'] = new AudioContext();
        }

        this.audioContext = window['LS']['Globals']['AContext'];
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024;

        this.smoothness = 0.6;
        this.pitch = 1;
        this.threshold = 0.5;
        this.defineFBins(this.pitch);

        this.data = new Float32Array(this.analyser.frequencyBinCount);

        this.working = false;
        this.energy = [0, 0, 0, 0, 0, 0, 0, 0];
        this.lipsyncBSW = [0, 0, 0];
    }

    private defineFBins(pitch: number): void {
        this.fBins = [0, 500, 700, 3000, 6000].map(bin => bin * pitch);
    }

    private stopSample(): void {
        if (this.source) {
            const tracks = this.source.mediaStream.getAudioTracks();
            for (const track of tracks) {
                if (track.kind === 'audio') {
                    track.stop();
                }
            }
        }

        if (this.stream) {
            const tracks = this.stream.getTracks();
            for (const track of tracks) {
                if (track.kind === 'audio') {
                    track.stop();
                }
            }
            this.stream = null;
        }
    }

    startSample(audioUrl: string): void {
        fetch(audioUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                this.stopSample();

                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext.destination);
                source.onended = () => {
                    this.working = false;
                };
                source.connect(this.analyser);

                source.start(0);
                this.working = true;
            })
            .catch(error => {
                console.error('Failed to load audio:', error);
            });
    }

    startMic(): void {
        this.stopSample();

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.stream = stream;
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
        }).catch(error => {
            console.error('ERROR: getUserMedia:', error);
        });

        this.working = true;
    }

    stop(): void {
        this.stopSample();
        this.working = false;
    }

    update(): number[] {
        if (!this.working) {
            return [];
        }

        this.analyser.getFloatFrequencyData(this.data);
        this.binAnalysis();
        this.lipAnalysis();
        return this.lipsyncBSW;
    }

    private binAnalysis(): void {
        const nfft = this.analyser.frequencyBinCount;
        const fs = this.audioContext.sampleRate;



        this.energy = [0, 0, 0, 0, 0, 0, 0, 0];

        for (let binInd = 0; binInd < this.fBins.length - 1; binInd++) {
            const indxIn = Math.round(this.fBins[binInd] * nfft / (fs / 2));
            const indxEnd = Math.round(this.fBins[binInd + 1] * nfft / (fs / 2));

            for (let i = indxIn; i < indxEnd; i++) {
                const value = this.threshold + (this.data[i] + 20) / 140;
                this.energy[binInd] += Math.max(0, value);
            }

            this.energy[binInd] /= (indxEnd - indxIn);
        }
    }

    private lipAnalysis(): void {
        if (this.energy) {
            this.lipsyncBSW[0] = Math.max(0, Math.min((0.5 - this.energy[2]) * 2, 1));
            this.lipsyncBSW[0] *= Math.max(0, Math.min(this.energy[1] * 5, 1));

            this.lipsyncBSW[1] = Math.max(0, Math.min(this.energy[3] * 3, 1));

            this.lipsyncBSW[2] = Math.max(0, Math.min(this.energy[1] * 0.8 - this.energy[3] * 0.8, 1));
        }
    }
}
