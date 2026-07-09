// ====================================================
// 행복칠TV 철학자 상담소 - 앱의 두뇌(로직) 담당 (app.js)
// ====================================================

const categoryVideos = {
    "life": "https://www.youtube.com/@vokim",      // 쇼펜하우어 인생 조언 (행복칠TV 채널로 임시 연결)
    "human": "https://www.youtube.com/@vokim",     // 인간관계 상처 명상 (행복칠TV 채널로 임시 연결)
    "mind": "https://www.youtube.com/@vokim",      // 우울/불안 극복 명상 (행복칠TV 채널로 임시 연결)
    "politics": "https://www.youtube.com/@vokim"   // 하이에크 사회 현안 (행복칠TV 채널로 임시 연결)
};

// 1. 위대한 철학자들의 명언 데이터베이스 (마음껏 추가할 수 있습니다!)
const quotesDB = {
    // 진로/인생 고민에 대한 명언들
    life: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
            interpretation: "행복칠TV 해석: 남의 눈치를 보며 살기엔 당신의 인생이 너무 짧습니다. 당신만의 길을 가세요.",
            // ★ 타임스탬프 비법: 유튜브 주소 뒤에 '?t=초' 또는 '&t=분m초s'를 붙이면 그 장면부터 바로 시작합니다!
            // 예: 1분 20초부터 보여주고 싶다면 아래처럼 적습니다.
            youtubeLink: "" 
        },
        {
            philosopher: "레프 톨스토이",
            quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
            interpretation: "행복칠TV 해석: 막막한 진로의 돌파구는 거창한 세상이 아니라, 오늘 나의 작은 변화에서 시작됩니다.",
            youtubeLink: "" // 여기에 실제 톨스토이 영상 링크를 넣으시면 됩니다!
        }
    ],
    // 인간관계 고민에 대한 명언들
    human: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "인간은 고슴도치와 같다. 너무 가까이하면 가시에 찔리고, 너무 멀어지면 추위를 느낀다.",
            interpretation: "행복칠TV 해석: 상처받지 않으려면 사람들과 '적당한 거리'를 유지하는 지혜가 필요합니다.",
            youtubeLink: ""
        },
        {
            philosopher: "프리드리히 니체",
            quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
            interpretation: "행복칠TV 해석: 지금 그 사람 때문에 받는 상처가 결국 당신의 마음 근육을 단단하게 만들어 줄 것입니다.",
            youtubeLink: ""
        }
    ],
    // 마음/불안 고민에 대한 명언들
    mind: [
        {
            philosopher: "마르쿠스 아우렐리우스",
            quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
            interpretation: "행복칠TV 해석: 마음이 복잡할 때는 상황이 아니라, 상황을 바라보는 내 '생각'의 방향을 바꿔보세요.",
            youtubeLink: ""
        },
        {
            philosopher: "레프 톨스토이",
            quote: "참된 행복은 자기 자신을 버리는 데서 찾을 수 있다.",
            interpretation: "행복칠TV 해석: 내가 모든 것을 통제해야 한다는 강박과 욕심을 내려놓을 때 진정한 평온이 찾아옵니다.",
            youtubeLink: ""
        }
    ],
    // 사회/정치 현안 고민에 대한 명언들
    politics: [
        {
            philosopher: "플라톤",
            quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
            interpretation: "행복칠TV 해석: 답답하더라도 우리가 사회와 정치에 계속 관심을 가지고 깨어 있어야 하는 이유입니다.",
            youtubeLink: ""
        },
        {
            philosopher: "장자크 루소",
            quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
            interpretation: "행복칠TV 해석: 당연하게 여겨지는 사회의 부조리와 억압에 대해 늘 깨어 질문을 던져야 할 때입니다.",
            youtubeLink: ""
        }
    ]
};

// 2. 화면에 있는 요소들(HTML)을 자바스크립트로 가져옵니다.
const worrySelect = document.getElementById('worry-select');
const spinBtn = document.getElementById('spin-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const resultArea = document.getElementById('result-area');

const philosopherNameEl = document.getElementById('philosopher-name');
const quoteTextEl = document.getElementById('quote-text');
const quoteInterpretationEl = document.getElementById('quote-interpretation');
const youtubeLinkEl = document.getElementById('youtube-link'); // 유튜브 버튼 가져오기

// 3. 사용자가 '고민'을 선택했을 때 버튼을 활성화하는 마법
worrySelect.addEventListener('change', function() {
    // 만약 '-- 고민을 선택해주세요 --' 가 아닌 다른 진짜 고민을 골랐다면?
    if (this.value !== 'none') {
        spinBtn.innerText = "철학자의 조언 구하기 🔮"; // 글씨도 바꿉니다.
        spinBtn.disabled = false; // 버튼 활성화
    } else {
        spinBtn.innerText = "철학자의 조언 구하기";
        spinBtn.disabled = true; // 버튼 비활성화
    }
});

// 4. 룰렛 버튼 클릭 이벤트 처리
spinBtn.addEventListener('click', () => {
    let category = worrySelect.value;
    let originalCategory = category; // 랜덤 검색어 키워드를 위해 원본 카테고리 보존
    
    // 아무것도 선택하지 않았을 때
    if (category === "none") {
        alert("위의 메뉴에서 지금 안고 계신 고민을 먼저 선택해주세요! 😊");
        return;
    }

    // 확장된 구체적인 고민들을 기존의 4가지 카테고리로 자연스럽게 연결해줍니다.
    const categoryMap = {
        "money": "life",
        "burnout": "life",
        "compare": "life",
        "family": "human",
        "work": "human",
        "aging": "mind"
    };
    
    // 만약 확장된 카테고리라면 매핑된 기본 카테고리로 변경
    if (categoryMap[category]) {
        category = categoryMap[category];
    }
    
    // 1) 결과창을 다시 숨기고 스피너(로딩 애니메이션)를 보여줍니다.
    resultArea.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    spinBtn.disabled = true; // 돌아가는 동안 중복 클릭을 막습니다.
    
    // 2) 2초(2000밀리초) 동안 신비롭게 고민하는 척을 합니다.
    setTimeout(() => {
        // 해당 고민(life, human, mind)에 맞는 명언 리스트를 가져옵니다.
        const possibleQuotes = quotesDB[category];
        
        // 리스트 중에서 무작위로(랜덤) 하나를 뽑습니다.
        const randomIndex = Math.floor(Math.random() * possibleQuotes.length);
        const chosenQuote = possibleQuotes[randomIndex];
        
        // 3) 뽑힌 명언을 화면(HTML)에 쏙쏙 집어넣습니다.
        philosopherNameEl.innerText = chosenQuote.philosopher;
        quoteTextEl.innerText = `"${chosenQuote.quote}"`;
        quoteInterpretationEl.innerText = chosenQuote.interpretation;

        // ★ 지시사항 반영: 중복 방문자를 위해, 선택한 고민에 맞는 유사 키워드를 랜덤으로 조합하여 
        // 매번 다른 영상이 검색되도록(랜덤으로 열리도록) 처리합니다.
        const randomKeywords = {
            "money": ["돈", "부자", "가난", "성공", "현실"],
            "human": ["상처", "인간관계", "사람", "위로", "마음"],
            "compare": ["비교", "자존감", "열등감", "나 자신", "기준"],
            "burnout": ["무기력", "번아웃", "우울", "휴식", "지칠 때"],
            "life": ["진로", "미래", "인생", "방향", "목표"],
            "aging": ["건강", "나이", "노후", "시간", "세월"],
            "family": ["가족", "부모", "이해", "용서", "갈등"],
            "work": ["직장", "스트레스", "상사", "동료", "일"]
        };
        
        // 사용자가 선택한 세부 고민(originalCategory)에 맞는 키워드 목록 가져오기 (없으면 '지혜'로 기본값)
        // ★ 궁극의 하이브리드 해결책: [과거 전체 영상 1,112개] + [실시간 최신 영상 15개] 결합!
        // videos.js 파일에 저장된 1,112개의 과거 영상 배열을 기본으로 사용합니다.
        let vokimMasterVideos = typeof historicalVideos !== 'undefined' ? [...historicalVideos] : [];

        // 대표님 채널 ID (UCeDsZt5n75Wh4UXuVl9wICg) - 실시간 새 영상 감지용 RSS
        const channelRSS = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCeDsZt5n75Wh4UXuVl9wICg";
        
        fetch(channelRSS)
            .then(response => response.json())
            .then(data => {
                if(data && data.items && data.items.length > 0) {
                    const newVideos = data.items.map(item => item.link);
                    // 과거 1,112개 영상 풀에 방금 올린 최신 15개 영상 추가 (새 영상도 랜덤 뽑기에 반영!)
                    vokimMasterVideos = [...newVideos, ...vokimMasterVideos];
                }
            })
            .catch(error => console.log("유튜브 실시간 목록 불러오기 실패, 기본 1,112개 리스트만 사용합니다."));

        // 영상 목록 중에서 무작위로 하나 골라서 직행! (중복 방문자를 위한 완전 랜덤 시스템)
        let finalVideoUrl = "";
        if (vokimMasterVideos.length > 0) {
            finalVideoUrl = vokimMasterVideos[Math.floor(Math.random() * vokimMasterVideos.length)];
        } else {
            // 비상시 기본 영상
            finalVideoUrl = "https://youtu.be/at9kev-k_YY";
        }
        
        // 만약 특정 명언에 전용 링크가 입력되어 있다면 그걸 최우선으로 씁니다.
        if (chosenQuote.youtubeLink && chosenQuote.youtubeLink.trim() !== "") {
            finalVideoUrl = chosenQuote.youtubeLink; 
        }

        // 새 창으로 나가지 않고 모달 띄우기 처리 (로컬에서는 새 창)
        youtubeLinkEl.href = "#";
        youtubeLinkEl.onclick = function(e) {
            e.preventDefault();
            openVideoModal(finalVideoUrl);
        };
        youtubeLinkEl.innerText = `📺 @vokim 채널의 '${chosenQuote.philosopher}' 영상 보러가기`;
        
        // 4) 로딩을 끝내고 결과창을 화려하게 보여줍니다!
        loadingSpinner.classList.add('hidden');
        resultArea.classList.remove('hidden');
        spinBtn.disabled = false; // 다시 누를 수 있게 버튼 잠금 해제
        
    }, 2000); // 2초 뒤에 이 안의 코드가 실행됨
});

// ==========================================
// 5. 철학자 갤러리 클릭 이벤트 (영상 연결 or 명언 팝업)
// ==========================================

// 철학자 데이터베이스 (영상 링크와 팝업용 명언 설정)
const philosopherGalleryData = {
    "쇼펜하우어": {
        videoLink: "", // 여기에 실제 유튜브 영상 링크를 넣으세요! (빈칸이면 팝업이 뜹니다)
        quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
        advice: "남의 시선에 얽매이지 말고 당신만의 길을 가세요."
    },
    "톨스토이": {
        videoLink: "", 
        quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
        advice: "가장 큰 변화는 바로 내 안에서부터 시작됩니다."
    },
    "니체": {
        videoLink: "", 
        quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
        advice: "지금의 시련이 당신을 더 단단하게 만들어 줄 것입니다."
    },
    "아우렐리우스": {
        videoLink: "", 
        quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
        advice: "상황을 바꿀 수 없다면, 상황을 바라보는 생각을 바꿔보세요."
    },
    "플라톤": {
        videoLink: "", 
        quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
        advice: "세상의 불의에 침묵하지 말고 늘 깨어 있으세요."
    },
    "루소": {
        videoLink: "", 
        quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
        advice: "당신을 얽매고 있는 보이지 않는 사슬을 끊고 자유를 찾으세요."
    }
};

// 갤러리 카드(위쪽 철학자 사진들)를 클릭했을 때의 동작
document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault(); // 기본 링크 이동 방지
        
        const philosopherName = this.getAttribute('data-philosopher');
        const data = philosopherGalleryData[philosopherName];
        
        if (!data) return;
        
        // 1) 영상 링크가 입력되어 있다면 해당 링크를 사이트 내부 모달(내장 플레이어)로 띄웁니다!
        if (data.videoLink && data.videoLink.trim() !== "") {
            openVideoModal(data.videoLink);
        } 
        // 2) 영상 링크가 없다면 준비된 명언 팝업 띄우기!
        else {
            showPhilosopherModal(philosopherName, data.quote, data.advice);
        }
    });
});

// 모달 관련 요소 가져오기
const modalOverlay = document.getElementById('philosopher-modal');
const modalName = document.getElementById('modal-name');
const modalQuote = document.getElementById('modal-quote');
const modalAdvice = document.getElementById('modal-advice');
const modalCloseBtn = document.getElementById('modal-close');

// 모달을 화면에 보여주는 함수
function showPhilosopherModal(name, quote, advice) {
    if(!modalOverlay) return;
    modalName.innerText = name;
    modalQuote.innerText = `"${quote}"`;
    modalAdvice.innerText = `💡 행복칠TV 해석: ${advice}`;
    
    // 모달 내부의 유튜브 버튼 설정 (큰따옴표 완전 일치 검색으로 강제)
    const searchKeyword = `"행복칠TV" "${name}"`;
    const autoSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchKeyword)}`;
    const modalYoutubeLink = document.getElementById('modal-youtube-link');
    if(modalYoutubeLink) {
        modalYoutubeLink.href = autoSearchUrl;
        modalYoutubeLink.innerText = `📺 행복칠TV에서 '${name}' 영상 찾기`;
    }
    
    modalOverlay.classList.remove('hidden');
}

// 닫기 버튼 클릭 시 모달 숨기기
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}

// ==========================================
// 6. 비디오 전용 모달 (타 채널 영상 완전 차단 시스템)
// ==========================================
const videoModal = document.getElementById('video-modal');
const videoCloseBtn = document.getElementById('video-close');
const youtubeIframe = document.getElementById('youtube-iframe');

function openVideoModal(url) {
    let videoId = "";
    
    // 로컬(file://) 환경에서는 유튜브 보안(153 에러)으로 모달 재생이 차단되므로 새 창으로 엽니다.
    if (window.location.protocol === 'file:') {
        window.open(url, '_blank');
        return;
    }
    
    // 유튜브 링크에서 ID(고유번호)만 추출합니다.
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
    } else {
        // 혹시라도 일반 링크면 그냥 새 창으로 엽니다.
        window.open(url, '_blank');
        return;
    }
    
    // ★ 핵심 마법: youtube-nocookie.com을 사용하면 로컬 폴더(file://) 실행 시 발생하는 보안/차단 오류(153 에러)를 우회할 수 있습니다.
    youtubeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
    videoModal.classList.remove('hidden');
}

// 비디오 모달 닫기
if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', () => {
        videoModal.classList.add('hidden');
        // 모달을 닫을 때 영상을 완전히 멈춥니다(소리 차단).
        youtubeIframe.src = "";
    });
}
