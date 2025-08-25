class LoveMeter {
    constructor() {
        this.loveLevel = 0;
        this.maxLevel = 100;
        this.clickCount = 0;
        this.isAnimating = false;
        
        this.elements = {
            heart: document.getElementById('mainHeart'),
            loveValue: document.getElementById('loveValue'),
            yuuta: document.getElementById('yuuta'),
            rina: document.getElementById('rina'),
            yuutaSpeech: document.getElementById('yuuta-speech'),
            rinaSpeech: document.getElementById('rina-speech'),
            effectsContainer: document.getElementById('effectsContainer'),
            finalCelebration: document.getElementById('finalCelebration'),
            clickSound: document.getElementById('clickSound'),
            finalSound: document.getElementById('finalSound')
        };
        
        this.speeches = {
            yuuta: [
                "頑張ろう！", "リナちゃん可愛い♡", "もっとクリック！", 
                "ドキドキするね", "君が好きだ！", "一緒にいると楽しい", 
                "君の笑顔が見たい", "ずっと一緒にいよう"
            ],
            rina: [
                "きゃー♡", "ユウタくん♡", "恥ずかしい〜", 
                "ドキドキ♡", "もっと近くに♡", "大好き！", 
                "嬉しいな♡", "ずっと一緒だよ♡"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.elements.heart.addEventListener('click', (e) => this.handleHeartClick(e));
        this.updateDisplay();
        this.startRandomSpeech();
        this.addCharacterHoverEffects();
        this.createFloatingHearts();
    }
    
    handleHeartClick(event) {
        if (this.isAnimating || this.loveLevel >= this.maxLevel) return;
        
        this.clickCount++;
        this.loveLevel = Math.min(this.loveLevel + 1, this.maxLevel);
        
        this.playClickSound();
        this.createClickEffect(event);
        this.updateDisplay();
        this.updateCharacterPositions();
        this.updateHeartAppearance();
        this.triggerRandomSpeech();
        
        if (this.loveLevel >= this.maxLevel) {
            this.triggerFinalCelebration();
        } else if (this.loveLevel % 10 === 0) {
            this.triggerMilestone();
        }
    }
    
    playClickSound() {
        try {
            this.elements.clickSound.currentTime = 0;
            this.elements.clickSound.play().catch(() => {});
        } catch (e) {}
    }
    
    createClickEffect(event) {
        const rect = this.elements.heart.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFloatingHeart(x, y);
            }, i * 100);
        }
        
        this.elements.heart.style.transform = 'scale(1.3)';
        setTimeout(() => {
            this.elements.heart.style.transform = '';
        }, 200);
    }
    
    createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = ['💖', '💕', '💗', '💘'][Math.floor(Math.random() * 4)];
        
        const randomX = (Math.random() - 0.5) * 100;
        const randomRotation = Math.random() * 360;
        
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--random-x', randomX + 'px');
        heart.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
        
        this.elements.effectsContainer.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
    
    updateDisplay() {
        this.elements.loveValue.textContent = this.loveLevel;
        this.elements.loveValue.style.color = this.loveLevel >= this.maxLevel ? '#ff1744' : '#e91e63';
        
        if (this.loveLevel >= this.maxLevel) {
            this.elements.loveValue.style.animation = 'sparkle 0.5s ease-in-out infinite';
        }
    }
    
    updateCharacterPositions() {
        const progress = this.loveLevel / this.maxLevel;
        const maxMove = 150;
        const moveDistance = progress * maxMove;
        
        this.elements.yuuta.classList.add('moving');
        this.elements.rina.classList.add('moving');
        
        this.elements.yuuta.style.transform = `translateX(${moveDistance}px)`;
        this.elements.rina.style.transform = `translateX(-${moveDistance}px)`;
        
        if (progress >= 1) {
            setTimeout(() => {
                this.elements.yuuta.style.transform = `translateX(${maxMove}px) scale(1.1)`;
                this.elements.rina.style.transform = `translateX(-${maxMove}px) scale(1.1)`;
            }, 500);
        }
    }
    
    updateHeartAppearance() {
        const progress = this.loveLevel / this.maxLevel;
        const scale = 1 + (progress * 0.5);
        const hue = progress * 360;
        
        this.elements.heart.style.setProperty('--heart-scale', scale);
        this.elements.heart.querySelector('.heart-inner').style.filter = 
            `hue-rotate(${hue}deg) brightness(${1 + progress * 0.5})`;
        
        if (this.loveLevel >= 50) {
            this.elements.heart.style.animation = 'heartbeat 1s ease-in-out infinite';
        }
        
        if (this.loveLevel >= 75) {
            this.elements.heart.style.filter = 'drop-shadow(0 0 30px #ff1744)';
        }
    }
    
    triggerRandomSpeech() {
        const isYuuta = Math.random() < 0.5;
        const character = isYuuta ? 'yuuta' : 'rina';
        const speeches = this.speeches[character];
        const randomSpeech = speeches[Math.floor(Math.random() * speeches.length)];
        
        this.showSpeech(character, randomSpeech);
    }
    
    showSpeech(character, text) {
        const speechElement = this.elements[character + 'Speech'];
        speechElement.textContent = text;
        speechElement.style.opacity = '1';
        speechElement.style.animation = 'speechFloat 3s ease-in-out forwards';
        
        setTimeout(() => {
            speechElement.style.opacity = '0';
        }, 2500);
    }
    
    triggerMilestone() {
        this.elements.heart.classList.add('level-milestone');
        
        setTimeout(() => {
            this.elements.heart.classList.remove('level-milestone');
        }, 800);
        
        this.createMilestoneEffect();
        
        if (this.loveLevel === 25) {
            this.showSpeech('yuuta', 'いい感じだね！');
            this.showSpeech('rina', 'ドキドキしちゃう♡');
        } else if (this.loveLevel === 50) {
            this.showSpeech('yuuta', '君ともっと近くにいたい');
            this.showSpeech('rina', 'わたしも♡');
        } else if (this.loveLevel === 75) {
            this.showSpeech('yuuta', 'もうすぐだね！');
            this.showSpeech('rina', 'ユウタくん♡♡');
        }
    }
    
    createMilestoneEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = window.innerWidth * Math.random();
                const y = window.innerHeight * 0.2;
                this.createFloatingHeart(x, y);
            }, i * 50);
        }
    }
    
    triggerFinalCelebration() {
        this.isAnimating = true;
        
        this.showSpeech('yuuta', 'やったー！大好きだよ！');
        this.showSpeech('rina', 'わたしも大好き♡♡♡');
        
        setTimeout(() => {
            this.elements.finalCelebration.style.display = 'flex';
            this.playFinalSound();
            this.createHeartRain();
            this.addFinalCharacterAnimation();
            
            setTimeout(() => {
                this.elements.finalCelebration.style.display = 'none';
                this.isAnimating = false;
            }, 5000);
        }, 1000);
    }
    
    playFinalSound() {
        try {
            this.elements.finalSound.currentTime = 0;
            this.elements.finalSound.play().catch(() => {});
        } catch (e) {}
    }
    
    createHeartRain() {
        const heartRain = this.elements.finalCelebration.querySelector('.heart-rain');
        const hearts = ['💖', '💕', '💗', '💘', '💝', '💟', '♥️', '💞'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const heartDrop = document.createElement('div');
                heartDrop.className = 'heart-drop';
                heartDrop.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                heartDrop.style.left = Math.random() * 100 + '%';
                heartDrop.style.animationDelay = Math.random() * 2 + 's';
                heartDrop.style.animationDuration = (2 + Math.random() * 2) + 's';
                
                heartRain.appendChild(heartDrop);
                
                setTimeout(() => {
                    if (heartDrop.parentNode) {
                        heartDrop.parentNode.removeChild(heartDrop);
                    }
                }, 4000);
            }, i * 50);
        }
    }
    
    addFinalCharacterAnimation() {
        this.elements.yuuta.style.animation = 'celebrationPulse 0.5s ease-in-out infinite';
        this.elements.rina.style.animation = 'celebrationPulse 0.5s ease-in-out infinite';
        
        setTimeout(() => {
            this.elements.yuuta.style.animation = '';
            this.elements.rina.style.animation = '';
        }, 5000);
    }
    
    startRandomSpeech() {
        setInterval(() => {
            if (!this.isAnimating && Math.random() < 0.3) {
                this.triggerRandomSpeech();
            }
        }, 3000);
    }
    
    addCharacterHoverEffects() {
        [this.elements.yuuta, this.elements.rina].forEach(character => {
            character.addEventListener('mouseenter', () => {
                character.style.transform += ' scale(1.05)';
                character.querySelector('.speech-bubble').style.opacity = '1';
            });
            
            character.addEventListener('mouseleave', () => {
                const currentTransform = character.style.transform.replace(' scale(1.05)', '');
                character.style.transform = currentTransform;
                
                setTimeout(() => {
                    character.querySelector('.speech-bubble').style.opacity = '0';
                }, 1000);
            });
        });
    }
    
    createFloatingHearts() {
        setInterval(() => {
            if (!this.isAnimating && Math.random() < 0.1) {
                const x = Math.random() * window.innerWidth;
                const y = window.innerHeight;
                this.createFloatingHeart(x, y);
            }
        }, 2000);
    }
}

// イースターエッグとボーナス機能
class EasterEggs {
    constructor(loveMeter) {
        this.loveMeter = loveMeter;
        this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        this.konamiIndex = 0;
        this.doubleClickTimer = null;
        this.clickTimes = [];
        
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => this.checkKonamiCode(e));
        document.addEventListener('dblclick', () => this.handleDoubleClick());
        this.loveMeter.elements.heart.addEventListener('click', (e) => this.checkRapidClicks(e));
    }
    
    checkKonamiCode(event) {
        if (event.keyCode === this.konamiCode[this.konamiIndex]) {
            this.konamiIndex++;
            if (this.konamiIndex === this.konamiCode.length) {
                this.activateKonamiBonus();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }
    
    activateKonamiBonus() {
        this.loveMeter.loveLevel = Math.min(this.loveMeter.loveLevel + 10, 100);
        this.loveMeter.updateDisplay();
        this.loveMeter.updateCharacterPositions();
        this.loveMeter.updateHeartAppearance();
        
        this.loveMeter.showSpeech('yuuta', '隠しコマンド発見！');
        this.loveMeter.showSpeech('rina', 'すごーい♡');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.5;
                this.loveMeter.createFloatingHeart(x, y);
            }, i * 50);
        }
    }
    
    handleDoubleClick() {
        if (this.loveMeter.loveLevel < 100) {
            this.loveMeter.loveLevel = Math.min(this.loveMeter.loveLevel + 5, 100);
            this.loveMeter.updateDisplay();
            this.loveMeter.updateCharacterPositions();
            this.loveMeter.updateHeartAppearance();
            
            this.loveMeter.showSpeech('yuuta', 'ダブルクリック！');
            this.loveMeter.showSpeech('rina', '嬉しいな♡');
        }
    }
    
    checkRapidClicks(event) {
        const now = Date.now();
        this.clickTimes.push(now);
        
        this.clickTimes = this.clickTimes.filter(time => now - time < 2000);
        
        if (this.clickTimes.length >= 10) {
            this.activateRapidClickBonus();
            this.clickTimes = [];
        }
    }
    
    activateRapidClickBonus() {
        this.loveMeter.showSpeech('yuuta', '連打すごい！');
        this.loveMeter.showSpeech('rina', '情熱的♡♡');
        
        document.body.style.animation = 'gradientShift 0.5s ease infinite';
        
        setTimeout(() => {
            document.body.style.animation = 'gradientShift 8s ease infinite';
        }, 3000);
    }
}

// アクセシビリティ機能
class Accessibility {
    constructor() {
        this.init();
    }
    
    init() {
        this.addKeyboardSupport();
        this.addAriaLabels();
        this.addFocusIndicators();
    }
    
    addKeyboardSupport() {
        document.getElementById('mainHeart').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        });
        
        document.getElementById('mainHeart').setAttribute('tabindex', '0');
    }
    
    addAriaLabels() {
        const elements = {
            mainHeart: 'ハートをクリックしてラブレベルを上げる',
            loveValue: '現在のラブレベル',
            yuuta: 'ユウタキャラクター',
            rina: 'リナキャラクター'
        };
        
        Object.entries(elements).forEach(([id, label]) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('aria-label', label);
            }
        });
    }
    
    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .heart:focus {
                outline: 3px solid #ff1744;
                outline-offset: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const loveMeter = new LoveMeter();
    const easterEggs = new EasterEggs(loveMeter);
    const accessibility = new Accessibility();
    
    // PWA サポート
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    
    // パフォーマンス最適化
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'transform';
            } else {
                entry.target.style.willChange = 'auto';
            }
        });
    });
    
    document.querySelectorAll('.character, .heart').forEach(el => {
        observer.observe(el);
    });
    
    console.log('🎮 ユウタ♡リナ ラブメーター が正常に起動しました！');
    console.log('💡 隠し機能: コナミコマンド、ダブルクリック、連打ボーナスを試してみてね！');
});