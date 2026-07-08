document.addEventListener('DOMContentLoaded', () => {
    
    let currentTheme = 'universe'; // 기본 테마
    let userSeedData = []; // 시드 생성을 위한 데이터
    let energy = 0;
    
    // 성경/불경 더미 데이터
    const bibleVerses = [
        "여호와는 나의 목자시니 내게 부족함이 없으리로다 (시편 23:1)",
        "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라 (빌립보서 4:13)",
        "두려워하지 말라 내가 너와 함께 함이라 (이사야 41:10)",
        "구하라 그러면 너희에게 주실 것이요 (마태복음 7:7)"
    ];
    const buddhaVerses = [
        "마음이 모든 것을 만든다. (법구경)",
        "지나간 과거에 매달리지 말고 미래를 원하지도 말라. (아함경)",
        "스스로를 등불로 삼고 의지하라. (열반경)",
        "물방울이 모여 바다를 이룬다. (잡아함경)"
    ];

    // --- 0단계: 테마 선택 ---
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.currentTarget.dataset.theme;
            selectTheme(theme);
        });
    });

    function selectTheme(theme) {
        currentTheme = theme;
        // 1. 테마 CSS 클래스 적용
        document.body.className = `theme-${theme}`;
        
        // 2. 구글 애널리틱스 등 데이터 수집을 위한 가상 로깅 (여기서 사용자 성향 데이터를 수집합니다)
        console.log(`[분석용 데이터] 사용자가 '${theme}' 테마를 선택했습니다.`);
        // 실제 운영 시: gtag('event', 'select_theme', { 'theme_name': theme });

        // 3. 1단계 화면 셋업
        setupStage1();
        
        // 4. 스테이지 전환
        goToStage(1);
    }

    // --- 1단계: 테마별 난수 생성 UI 셋업 ---
    let interactionElement = null;
    let chargeInterval = null;

    function setupStage1() {
        energy = 0;
        userSeedData = [];
        updateProgress();
        
        const interactionArea = document.getElementById('interaction-area');
        interactionArea.innerHTML = ''; // 초기화
        
        const title = document.getElementById('stage1-title');
        const subtitle = document.getElementById('stage1-subtitle');

        if (currentTheme === 'bible') {
            title.textContent = '말씀의 힘';
            subtitle.textContent = '성경책을 터치하여 말씀을 읽고 에너지를 채우세요.';
            
            interactionElement = document.createElement('div');
            interactionElement.className = 'bible-book';
            
            const verseText = document.createElement('div');
            verseText.className = 'bible-verse';
            interactionArea.appendChild(verseText);
            interactionArea.appendChild(interactionElement);
            
            interactionElement.addEventListener('click', () => {
                const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
                verseText.textContent = randomVerse;
                verseText.style.opacity = 1;
                
                // 구절의 문자열 길이나 코드를 바탕으로 시드 누적
                userSeedData.push(randomVerse.length * Math.random());
                addEnergy(25); // 4번 누르면 100%
            });
            
        } else if (currentTheme === 'buddha') {
            title.textContent = '마음의 평화';
            subtitle.textContent = '목탁을 두드려 번뇌를 씻고 기운을 채우세요.';
            
            interactionElement = document.createElement('div');
            interactionElement.className = 'moktak';
            interactionArea.appendChild(interactionElement);
            
            interactionElement.addEventListener('click', () => {
                // 클릭할 때마다 시드 누적
                userSeedData.push(Date.now());
                addEnergy(10); // 10번 두드리면 100%
            });

        } else if (currentTheme === 'tarot') {
            title.textContent = '운명의 카드';
            subtitle.textContent = '카드를 터치하여 운명의 에너지를 이끌어내세요.';
            
            interactionElement = document.createElement('div');
            interactionElement.className = 'tarot-card';
            interactionArea.appendChild(interactionElement);
            
            interactionElement.addEventListener('click', () => {
                userSeedData.push(Math.random() * 1000);
                addEnergy(35); // 3번 클릭
            });
            
        } else {
            // universe (기존 구슬 방식)
            title.textContent = '우주의 에너지';
            subtitle.textContent = '구슬을 문지르거나 꾹 눌러 에너지를 채워주세요.';
            
            interactionElement = document.createElement('div');
            interactionElement.className = 'orb-core';
            interactionArea.appendChild(interactionElement);
            
            // 기존 마우스/터치 홀드 로직
            const startCharge = (e) => {
                interactionElement.classList.add('charging');
                userSeedData.push(e.clientX || (e.touches && e.touches[0].clientX) || 0);
                chargeInterval = setInterval(() => addEnergy(2), 30);
            };
            const stopCharge = () => {
                interactionElement.classList.remove('charging');
                clearInterval(chargeInterval);
            };
            
            interactionElement.addEventListener('mousedown', startCharge);
            document.addEventListener('mouseup', stopCharge);
            interactionElement.addEventListener('touchstart', startCharge, {passive: false});
            document.addEventListener('touchend', stopCharge);
        }
    }

    function addEnergy(amount) {
        if (energy >= 100) return;
        energy += amount;
        if (energy >= 100) {
            energy = 100;
            finishCharging();
        }
        updateProgress();
    }

    function updateProgress() {
        document.getElementById('seed-progress').style.width = `${energy}%`;
        document.getElementById('energy-text').textContent = `${Math.floor(energy)}%`;
    }

    function finishCharging() {
        if(chargeInterval) clearInterval(chargeInterval);
        
        // 1. 사용자 데이터를 기반으로 최종 난수 시드 생성
        const seedSum = userSeedData.reduce((a, b) => a + b, 1);
        
        // 2. 다음 단계로
        setTimeout(() => {
            goToStage(2, seedSum);
        }, 800);
    }

    // --- 스테이지 전환 관리 ---
    function goToStage(stageNum, seed) {
        document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
        document.getElementById(`stage-${stageNum}`).classList.add('active');
        
        if (stageNum === 2) initStage2(seed);
        else if (stageNum === 3) initStage3();
    }

    // --- 2단계: 후보군 떠다니기 로직 ---
    const orbField = document.getElementById('orb-field');
    let selectedNumbers = [];
    let physicsInterval;
    let orbs = [];

    function customRandom(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function initStage2(seed) {
        orbField.innerHTML = '';
        selectedNumbers = [];
        document.querySelectorAll('.slot').forEach(s => {
            s.classList.remove('filled'); s.textContent = '';
        });
        orbs = [];

        let allNumbers = Array.from({length: 45}, (_, i) => i + 1);
        let currentSeed = seed;
        for (let i = allNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(customRandom(currentSeed++) * (i + 1));
            [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
        }
        const candidateNumbers = allNumbers.slice(0, 15);

        const fieldRect = orbField.getBoundingClientRect();
        
        candidateNumbers.forEach((num) => {
            const orb = document.createElement('div');
            orb.classList.add('candidate-orb');
            orb.textContent = num; 
            
            const x = Math.random() * (fieldRect.width - 50);
            const y = Math.random() * (fieldRect.height - 50);
            const vx = (Math.random() - 0.5) * 2.5;
            const vy = (Math.random() - 0.5) * 2.5;

            orb.style.left = `${x}px`;
            orb.style.top = `${y}px`;
            orbField.appendChild(orb);
            
            const orbData = { el: orb, num: num, x: x, y: y, vx: vx, vy: vy };
            orbs.push(orbData);

            orb.addEventListener('click', () => handleOrbClick(orbData));
        });

        startPhysics();
    }

    function startPhysics() {
        if (physicsInterval) clearInterval(physicsInterval);
        const fieldRect = orbField.getBoundingClientRect();

        physicsInterval = setInterval(() => {
            orbs.forEach(orb => {
                if (orb.el.classList.contains('selected')) return;
                orb.x += orb.vx; orb.y += orb.vy;
                if (orb.x <= 0 || orb.x >= fieldRect.width - 50) orb.vx *= -1;
                if (orb.y <= 0 || orb.y >= fieldRect.height - 50) orb.vy *= -1;
                orb.el.style.transform = `translate(${orb.x}px, ${orb.y}px)`;
            });
        }, 16);
    }

    function handleOrbClick(orbData) {
        if (selectedNumbers.length >= 6) return;
        if (orbData.el.classList.contains('selected')) return;

        orbData.el.classList.add('selected');
        const slot = document.querySelector(`.slot[data-index="${selectedNumbers.length}"]`);
        slot.textContent = orbData.num;
        slot.classList.add('filled');
        selectedNumbers.push(orbData.num);

        if (selectedNumbers.length === 6) {
            clearInterval(physicsInterval);
            setTimeout(() => goToStage(3), 1000);
        }
    }

    // --- 3단계: 결과 로직 ---
    function initStage3() {
        const resultContainer = document.getElementById('result-numbers');
        resultContainer.innerHTML = '';
        
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        
        // 종교/테마별로 마무리 멘트를 다르게 줄 수 있습니다.
        const resultMsg = document.getElementById('result-message');
        if(currentTheme === 'bible') resultMsg.textContent = "기도와 함께하는 행운의 번호입니다.";
        else if(currentTheme === 'buddha') resultMsg.textContent = "마음을 비운 자에게 찾아온 행운의 번호입니다.";
        else if(currentTheme === 'tarot') resultMsg.textContent = "운명의 카드가 계시한 당신의 번호입니다.";
        else resultMsg.textContent = "우주의 기운이 담긴 당신의 로또 번호입니다.";

        sortedNumbers.forEach((num, index) => {
            const orb = document.createElement('div');
            orb.classList.add('result-orb');
            orb.textContent = num;
            
            // 기존 동행복권 색상
            if(num <= 10) orb.style.background = 'linear-gradient(135deg, #facc15, #eab308)';
            else if(num <= 20) orb.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
            else if(num <= 30) orb.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            else if(num <= 40) orb.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
            else orb.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
            
            orb.style.animationDelay = `${index * 0.1}s`;
            resultContainer.appendChild(orb);
        });
    }

    document.getElementById('btn-retry').addEventListener('click', () => {
        // 완전 초기화 후 0단계(테마선택)로
        document.body.className = 'theme-default';
        goToStage(0);
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        const text = `나의 [${currentTheme}] 성향 로또 번호: ${sortedNumbers.join(', ')}`;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btn-copy');
            const originalText = btn.textContent;
            btn.textContent = '복사 완료!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    });
});
