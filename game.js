const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'https://via.placeholder.com/50'; // Placeholder 이미지 URL을 사용합니다. 적절한 URL로 대체하세요.

const positiveWords = ["정직", "투명성", "신뢰", "책임감", "공정", "윤리", "청렴", "존중", "성실", "공익", "배려", "협력", "윤리적 리더십", "정당성", "준법", "도덕성", "진실성", "윤리적 결단력", "사회적 책임", "성과", "지속 가능성", "감사", "가치", "인권", "상생", "자율", "혁신", "소통", "신의", "약속"];
const negativeWords = ["부패", "사기", "불법", "불공정", "부정", "편법", "차별", "은폐", "조작", "독단", "횡령", "부당", "압박", "부주의", "이기주의", "무책임", "탈법", "유린", "비윤리", "착취", "불투명", "무관심", "불신", "불성실", "비협조", "부정직", "불균형", "독선", "무시", "오용"];

const player = { x: canvas.width / 2, y: canvas.height - 60, width: 50, height: 50 };
let score = 0;
let level = 1;
let fallingWords = [];

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function createFallingWord() {
    const word = Math.random() > 0.5 ? positiveWords[Math.floor(Math.random() * positiveWords.length)] : negativeWords[Math.floor(Math.random() * negativeWords.length)];
    fallingWords.push({ text: word, x: Math.random() * (canvas.width - 50), y: 0 });
}

function drawFallingWords() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fallingWords.forEach(wordObj => {
        ctx.font = '20px Arial';
        ctx.fillText(wordObj.text, wordObj.x, wordObj.y);
        wordObj.y += level * 0.5; // 단어의 속도는 레벨에 비례합니다.
    });
}

function updateScore(word) {
    if (positiveWords.includes(word)) {
        score -= 10;
    } else if (negativeWords.includes(word)) {
        score += 10;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkCollision() {
    fallingWords = fallingWords.filter(wordObj => {
        if (wordObj.y > canvas.height) {
            return false;
        }
        if (wordObj.x < player.x + player.width && wordObj.x + ctx.measureText(wordObj.text).width > player.x && wordObj.y < player.y + player.height && wordObj.y + 20 > player.y) {
            updateScore(wordObj.text);
            return false;
        }
        return true;
    });
}

function gameLoop() {
    drawPlayer();
    drawFallingWords();
    checkCollision();

    if (Math.random() < 0.03) {
        createFallingWord();
    }

    if (score >= 100 * level && level < 10) {
        level++;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - player.width / 2;
});

playerImage.onload = () => {
    gameLoop();
};
