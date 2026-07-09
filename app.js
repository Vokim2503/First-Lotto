// ====================================================
// 행복칠TV 철학자 상담소 - 앱의 두뇌(로직) 담당 (app.js)
// ====================================================

// 1. 위대한 철학자들의 명언 데이터베이스 (마음껏 추가할 수 있습니다!)
const quotesDB = {
    // 진로/인생 고민에 대한 명언들
    life: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
            interpretation: "행복칠TV 해석: 남의 눈치를 보며 살기엔 당신의 인생이 너무 짧습니다. 당신만의 길을 가세요.",
            youtubeLink: "https://www.youtube.com/@vokim" // 여기에 실제 쇼펜하우어 영상 링크를 넣으시면 됩니다!
        },
        {
            philosopher: "레프 톨스토이",
            quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
            interpretation: "행복칠TV 해석: 막막한 진로의 돌파구는 거창한 세상이 아니라, 오늘 나의 작은 변화에서 시작됩니다.",
            youtubeLink: "https://www.youtube.com/@vokim" // 여기에 실제 톨스토이 영상 링크를 넣으시면 됩니다!
        }
    ],
    // 인간관계 고민에 대한 명언들
    human: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "인간은 고슴도치와 같다. 너무 가까이하면 가시에 찔리고, 너무 멀어지면 추위를 느낀다.",
            interpretation: "행복칠TV 해석: 상처받지 않으려면 사람들과 '적당한 거리'를 유지하는 지혜가 필요합니다.",
            youtubeLink: "https://www.youtube.com/@vokim"
        },
        {
            philosopher: "프리드리히 니체",
            quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
            interpretation: "행복칠TV 해석: 지금 그 사람 때문에 받는 상처가 결국 당신의 마음 근육을 단단하게 만들어 줄 것입니다.",
            youtubeLink: "https://www.youtube.com/@vokim"
        }
    ],
    // 마음/불안 고민에 대한 명언들
    mind: [
        {
            philosopher: "마르쿠스 아우렐리우스",
            quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
            interpretation: "행복칠TV 해석: 마음이 복잡할 때는 상황이 아니라, 상황을 바라보는 내 '생각'의 방향을 바꿔보세요.",
            youtubeLink: "https://www.youtube.com/@vokim"
        },
        {
            philosopher: "레프 톨스토이",
            quote: "참된 행복은 자기 자신을 버리는 데서 찾을 수 있다.",
            interpretation: "행복칠TV 해석: 내가 모든 것을 통제해야 한다는 강박과 욕심을 내려놓을 때 진정한 평온이 찾아옵니다.",
            youtubeLink: "https://www.youtube.com/@vokim"
        }
    ],
    // 사회/정치 현안 고민에 대한 명언들
    politics: [
        {
            philosopher: "플라톤",
            quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
            interpretation: "행복칠TV 해석: 답답하더라도 우리가 사회와 정치에 계속 관심을 가지고 깨어 있어야 하는 이유입니다.",
            youtubeLink: "https://www.youtube.com/@vokim"
        },
        {
            philosopher: "장자크 루소",
            quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
            interpretation: "행복칠TV 해석: 당연하게 여겨지는 사회의 부조리와 억압에 대해 늘 깨어 질문을 던져야 할 때입니다.",
            youtubeLink: "https://www.youtube.com/@vokim"
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
        spinBtn.disabled = false; // 버튼의 잠금을 풉니다!
        spinBtn.innerText = "철학자의 조언 구하기 🔮"; // 글씨도 바꿉니다.
    } else {
        spinBtn.disabled = true; // 다시 잠급니다.
        spinBtn.innerText = "철학자의 조언 구하기";
    }
});

// 4. '조언 구하기' 버튼을 눌렀을 때 실행되는 룰렛 마법!
spinBtn.addEventListener('click', function() {
    const selectedWorry = worrySelect.value;
    
    // 1) 결과창을 다시 숨기고 스피너(로딩 애니메이션)를 보여줍니다.
    resultArea.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    spinBtn.disabled = true; // 돌아가는 동안 버튼을 또 못 누르게 막습니다.
    
    // 2) 2초(2000밀리초) 동안 신비롭게 고민하는 척을 합니다.
    setTimeout(() => {
        // 해당 고민(life, human, mind)에 맞는 명언 리스트를 가져옵니다.
        const possibleQuotes = quotesDB[selectedWorry];
        
        // 리스트 중에서 무작위로(랜덤) 하나를 뽑습니다.
        const randomIndex = Math.floor(Math.random() * possibleQuotes.length);
        const chosenQuote = possibleQuotes[randomIndex];
        
        // 3) 뽑힌 명언을 화면(HTML)에 쏙쏙 집어넣습니다.
        philosopherNameEl.innerText = chosenQuote.philosopher;
        quoteTextEl.innerText = `"${chosenQuote.quote}"`;
        quoteInterpretationEl.innerText = chosenQuote.interpretation;
        
        // ★ 초자동화 마법: 1100개의 영상 중 찾을 필요 없이, 유튜브 '자동 검색' 링크를 생성합니다!
        // 예: https://www.youtube.com/results?search_query=행복칠TV+쇼펜하우어
        const searchKeyword = "행복칠TV " + chosenQuote.philosopher;
        const autoSearchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(searchKeyword);
        
        youtubeLinkEl.href = autoSearchUrl;
        youtubeLinkEl.innerText = `📺 행복칠TV의 '${chosenQuote.philosopher}' 영상 찾아보기`;
        
        // 4) 로딩을 끝내고 결과창을 화려하게 보여줍니다!
        loadingSpinner.classList.add('hidden');
        resultArea.classList.remove('hidden');
        spinBtn.disabled = false; // 다시 누를 수 있게 버튼 잠금 해제
        
    }, 2000); // 2초 뒤에 이 안의 코드가 실행됨
});
