document.addEventListener('DOMContentLoaded', () => {
    
    let currentTheme = 'nothing'; // 기본 테마
    let userSeedData = []; // 시드 생성을 위한 데이터
    let energy = 0;
    
    // 실시간 뉴스 기사 가져오기 (대구매일신문 RSS)
    let currentTrend = "압도적인 긍정 에너지"; // 기본값
    let newsLink = "#";
    const newsRSSUrl = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.imaeil.com%2Frss";
    
    // API 응답 지연을 방지하기 위한 3초 타임아웃
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch(newsRSSUrl, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
            clearTimeout(timeoutId);
            if(data && data.items && data.items.length > 0) {
                // 특정 키워드(정치인 등)가 포함된 기사를 제외하는 필터링 로직
                const forbiddenKeywords = ['윤석열', '대통령', '김건희', '한동훈', '이재명', '정부', '여당', '야당'];
                
                const filteredItems = data.items.filter(item => {
                    const title = item.title || "";
                    // 제목에 금지어가 하나라도 포함되어 있으면 제외
                    return !forbiddenKeywords.some(keyword => title.includes(keyword));
                });

                // 필터링된 기사가 없으면 원본 데이터라도 사용하되, 가급적 필터링된 목록에서 선택
                const validItems = filteredItems.length > 0 ? filteredItems : data.items;

                // 상위 5개(또는 필터링된 전체) 기사 중 하나를 무작위로 선택하여 노출
                const maxIndex = Math.min(5, validItems.length);
                const randomIndex = Math.floor(Math.random() * maxIndex);
                const newsItem = validItems[randomIndex];
                currentTrend = newsItem.title;
                newsLink = newsItem.link;
                
                const keywordEl = document.getElementById('live-trend-keyword');
                if(keywordEl) {
                    keywordEl.innerHTML = `<a href="${newsLink}" target="_blank" style="color: #fff; text-decoration: underline; text-decoration-color: var(--primary-glow); text-underline-offset: 4px;">"${currentTrend}"</a>`;
                }
            }
        })
        .catch(err => {
            console.log("뉴스 로딩 실패 또는 지연", err);
            const keywordEl = document.getElementById('live-trend-keyword');
            if(keywordEl) keywordEl.innerText = `[오늘의 긍정적인 파동]`;
        });

    // --- 0단계: 메인 버튼 클릭 ---
    const btnStartCalc = document.getElementById('btn-start-calc');
    if(btnStartCalc) {
        btnStartCalc.addEventListener('click', () => {
            // 버튼 컨테이너 숨기고
            document.getElementById('calc-action-container').style.display = 'none';
            // 통합 터미널 열기
            document.getElementById('integrated-terminal').style.display = 'block';
            
            runTerminalAnimation();
        });
    }

    // --- 1단계: 터미널 연산 애니메이션 ---
    function runTerminalAnimation() {
        const titleEl = document.getElementById('term-news-title');
        const lengthEl = document.getElementById('term-news-length');
        const timeSyncEl = document.getElementById('term-time-sync');
        const timeEl = document.getElementById('term-click-time');
        const calcStartEl = document.getElementById('term-calc-start');
        const finalSeedEl = document.getElementById('term-final-seed');
        const actionBtn = document.getElementById('stage1-action');
        const btnToCatch = document.getElementById('btn-to-catch');

        // Reset
        [titleEl, lengthEl, timeSyncEl, timeEl, calcStartEl, finalSeedEl, actionBtn].forEach(el => {
            if(el) el.style.display = 'none';
        });

        // 1. 이슈 데이터 표시
        setTimeout(() => {
            titleEl.innerText = `선택된 이슈: [${currentTrend}]`;
            titleEl.style.display = 'block';
        }, 800);

        setTimeout(() => {
            lengthEl.innerText = `기사 문자 길이 값 추출: ${currentTrend.length} bytes`;
            lengthEl.style.display = 'block';
        }, 1600);

        // 2. 시간 동기화
        setTimeout(() => {
            timeSyncEl.style.display = 'block';
        }, 2400);

        let clickTimeMs = Date.now();
        setTimeout(() => {
            const date = new Date(clickTimeMs);
            const timeStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ` +
                            `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}.${date.getMilliseconds()}`;
            timeEl.innerText = `사용자 고유 클릭 시간: ${timeStr}`;
            timeEl.style.display = 'block';
        }, 3200);

        // 3. 연산 시작
        setTimeout(() => {
            calcStartEl.style.display = 'block';
        }, 4000);

        // 4. 결과 출력
        setTimeout(() => {
            const finalSeed = clickTimeMs * currentTrend.length;
            userSeedData = [finalSeed]; // 저장
            
            finalSeedEl.innerText = `=> 고유 난수(Seed): ${finalSeed} 생성 완료!`;
            finalSeedEl.style.display = 'block';
        }, 5500);

        // 5. 버튼 표시
        setTimeout(() => {
            actionBtn.style.display = 'block';
        }, 6000);

        // 다음 단계로
        btnToCatch.addEventListener('click', () => {
            goToStage(2, userSeedData[0]);
        }, {once: true});
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

        // 🚀 자동화: 행복칠TV(UCeDsZt5n75Wh4UXuVl9wICg) 최신 영상 가져오기
        const ytContainer = document.getElementById('youtube-promo-container');
        const channelRSS = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCeDsZt5n75Wh4UXuVl9wICg";
        
        fetch(channelRSS)
            .then(res => res.json())
            .then(data => {
                if(data && data.items && data.items.length > 0) {
                    const latestVideo = data.items[0]; // 가장 최신 영상
                    document.getElementById('yt-thumb').src = latestVideo.thumbnail;
                    document.getElementById('yt-title').innerText = latestVideo.title;
                    
                    ytContainer.style.display = 'block';
                    ytContainer.onclick = () => {
                        window.open(latestVideo.link, '_blank');
                    };
                }
            })
            .catch(err => console.log("유튜브 로딩 실패", err));
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
