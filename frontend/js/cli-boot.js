/**
 * CLI Boot Screen Handler
 * Simulates a terminal boot sequence before loading the time machine
 */

class CLIBoot {
    constructor() {
        this.input = null;
        this.output = null;
        this.backgroundMusic = null;
        this.started = false;
        this.commands = {
            'start': () => this.startTimeMachine(),
            'help': () => this.showHelp(),
            'about': () => this.showAbout(),
            'clear': () => this.clearScreen()
        };
        this.bootSequenceComplete = false;
    }

    init() {
        this.input = document.getElementById('cli-input');
        this.output = document.getElementById('cli-output');
        const inputContainer = document.getElementById('cli-input-container');
        const clickPrompt = document.getElementById('click-to-start');

        if (!this.input || !this.output) return;

        // Wait for user interaction to start
        const startSequence = () => {
            if (this.started) return;
            this.started = true;

            // Hide click prompt
            if (clickPrompt) clickPrompt.remove();

            // Show input container
            if (inputContainer) inputContainer.style.display = 'flex';

            // Start music immediately
            this.playBackgroundMusic();

            // Run boot sequence
            this.runBootSequence();

            // Focus input
            this.input.focus();
        };

        // Start on any click
        document.addEventListener('click', startSequence, { once: true });

        // Start on any key press
        document.addEventListener('keydown', startSequence, { once: true });

        // Handle input commands
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(this.input.value.trim().toLowerCase());
                this.input.value = '';
            }
        });

        // Auto-focus input when clicking
        document.addEventListener('click', () => {
            if (this.started && this.input) {
                this.input.focus();
            }
        });
    }

    playBackgroundMusic() {
        if (this.backgroundMusic) return; // Already playing

        // Create audio context and oscillators for a retro synth sound
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        // Play a simple retro-futuristic melody
        this.backgroundMusic = audioCtx;
        
        // Create a simple ambient background sound
        const playAmbientNote = (frequency, startTime, duration) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + startTime);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + startTime + duration);
            
            oscillator.start(audioCtx.currentTime + startTime);
            oscillator.stop(audioCtx.currentTime + startTime + duration);
        };
        
        // Simple ambient melody loop
        const playMelodyLoop = () => {
            const notes = [
                { freq: 261.63, time: 0, dur: 1.5 },    // C4
                { freq: 329.63, time: 1.5, dur: 1.5 },  // E4
                { freq: 392.00, time: 3, dur: 2 },      // G4
                { freq: 523.25, time: 5, dur: 1.5 },    // C5
            ];
            
            notes.forEach(note => {
                playAmbientNote(note.freq, note.time, note.dur);
            });
            
            // Loop the melody
            setTimeout(playMelodyLoop, 7000);
        };
        
        playMelodyLoop();
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.close();
            this.backgroundMusic = null;
        }
    }

    async runBootSequence() {
        await this.sleep(500);
        
        await this.printLine('Initializing temporal displacement system...');
        await this.sleep(500);
        
        const bootLines = [
            { text: 'Checking flux capacitor... ', delay: 300, suffix: '[OK]', suffixClass: 'success' },
            { text: 'Calibrating temporal sensors... ', delay: 400, suffix: '[OK]', suffixClass: 'success' },
            { text: 'Loading 1.21 gigawatts... ', delay: 500, suffix: '[OK]', suffixClass: 'success' },
            { text: 'Initializing music database... ', delay: 600, suffix: '[OK]', suffixClass: 'success' },
            { text: 'Connecting to AI DJ service... ', delay: 700, suffix: '[OK]', suffixClass: 'success' },
            { text: '&nbsp;', delay: 200 },
            { text: 'System ready.', delay: 300, class: 'success' },
            { text: '&nbsp;', delay: 100 },
            { text: 'Type "start" to begin your time travel journey.', delay: 100, class: 'info' },
            { text: 'Type "help" for available commands.', delay: 100, class: 'info' }
        ];

        for (const line of bootLines) {
            await this.sleep(line.delay);
            await this.printLine(line.text, line.class, line.suffix, line.suffixClass);
        }

        this.bootSequenceComplete = true;
    }

    async printLine(text, className = '', suffix = '', suffixClass = '') {
        const line = document.createElement('div');
        line.className = 'cli-line' + (className ? ' ' + className : '');
        line.innerHTML = text;
        this.output.appendChild(line);

        if (suffix) {
            await this.sleep(300);
            const suffixSpan = document.createElement('span');
            suffixSpan.className = suffixClass;
            suffixSpan.textContent = suffix;
            line.appendChild(suffixSpan);
        }

        // Auto-scroll
        this.output.scrollTop = this.output.scrollHeight;
    }

    async handleCommand(cmd) {
        // Echo command
        await this.printLine(`root@time-machine:~$ ${cmd}`);

        if (!cmd) return;

        if (this.commands[cmd]) {
            await this.commands[cmd]();
        } else {
            await this.printLine(`Command not found: ${cmd}`, 'error');
            await this.printLine('Type "help" for available commands.', 'info');
        }
    }

    async startTimeMachine() {
        await this.printLine('Loading and initializing<span class="loading-dots"></span>', 'info');
        await this.sleep(1500);

        // Transition to time machine
        this.transitionToTimeMachine();
    }

    async showHelp() {
        await this.printLine('&nbsp;');
        await this.printLine('Available commands:', 'info');
        await this.printLine('  start  - Begin time travel journey');
        await this.printLine('  help   - Show this help message');
        await this.printLine('  about  - About Time Travel Radio');
        await this.printLine('  clear  - Clear the screen');
        await this.printLine('&nbsp;');
    }

    async showAbout() {
        await this.printLine('&nbsp;');
        await this.printLine('TIME TRAVEL RADIO v1.21', 'info');
        await this.printLine('&nbsp;');
        await this.printLine('A retro radio experience that lets you travel through time');
        await this.printLine('and enjoy music from the 70s, 80s, and 90s.');
        await this.printLine('&nbsp;');
        await this.printLine('Features:');
        await this.printLine('  • AI-powered DJs with unique personalities');
        await this.printLine('  • Authentic retro radio interfaces');
        await this.printLine('  • Curated playlists from each decade');
        await this.printLine('  • Immersive time travel animations');
        await this.printLine('&nbsp;');
        await this.printLine('© 2025 Temporal Dynamics Corporation', 'info');
        await this.printLine('&nbsp;');
    }

    async clearScreen() {
        this.output.innerHTML = `
            <div class="cli-line cli-logo">
 _____ _                  _____                    _   ____            _ _       
|_   _(_)_ __ ___   ___  |_   _| __ __ ___   _____| | |  _ \\ __ _  __| (_) ___  
  | | | | '_ \` _ \\ / _ \\   | || '__/ _\` \\ \\ / / _ \\ | | |_) / _\` |/ _\` | |/ _ \\ 
  | | | | | | | | |  __/   | || | | (_| |\\ V /  __/ | |  _ < (_| | (_| | | (_) |
  |_| |_|_| |_| |_|\\___|   |_||_|  \\__,_| \\_/ \\___|_| |_| \\_\\__,_|\\__,_|_|\\___/ 
            </div>
            <div class="cli-line">Time Travel Radio System v1.21</div>
            <div class="cli-line">Copyright (c) 2025 Temporal Dynamics Corporation</div>
            <div class="cli-line">&nbsp;</div>
        `;
    }

    transitionToTimeMachine() {
        const cliBoot = document.getElementById('cli-boot');
        const landingPage = document.getElementById('landing-page');

        // Stop background music
        this.stopBackgroundMusic();

        // Fade out CLI
        cliBoot.style.transition = 'opacity 1s ease-out';
        cliBoot.style.opacity = '0';

        setTimeout(() => {
            cliBoot.classList.remove('active');
            cliBoot.style.display = 'none';
            landingPage.classList.add('active');
            
            // Trigger any landing page animations
            if (window.Animations && window.Animations.init) {
                window.Animations.init();
            }
        }, 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize CLI boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const cli = new CLIBoot();
        cli.init();
    });
} else {
    const cli = new CLIBoot();
    cli.init();
}
