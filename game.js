const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'https://via.placeholder.com/50'; // 적절한 URL로 대체하세요.

const positiveWords = ["정직", "투명성", "신뢰", "책임감", "공정", "윤리", "청렴", "존중", "성실", "공익", "배려", "협력", "윤리적 리더십", "정당성", "준법", "도덕성", "진실성", "윤리적결단력", "사회적책임", "지속가능성", "가치", "인권", "상생", "자율", "혁신", "소통", "신의", "약속"];
const negativeWords = ["부패", "불법", "불공정", "부정", "편법", "차별", "은폐", "조작", "독단", "횡령", "부당", "압박", "부주의", "이기주의", "무책임", "비윤리", "불투명", "무관심", "불신", "불성실", "비협조", "독선", "무시", "오용"];

const player = { x: canvas.width / 2, y: canvas.height - 60, width: 50, height: 50 };
let score = 0;
let level = 1;
let fallingWords = [];
let bullets = [];
const bulletSpeed = 5;

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function createFallingWord() {
    const word = Math.random() > 0.5 ? positiveWords[Math.floor(Math.random() * positiveWords.length)] : negativeWords[Math.floor(Math.random() * negativeWords.length)];
    fallingWords.push({ text: word, x: Math.random() * (canvas.width - 50), y: 0, isPositive: positiveWords.includes(word) });
}

function drawFallingWords() {
    fallingWords.forEach(wordObj => {
        ctx.font = '20px Arial';
        ctx.fillText(wordObj.text, wordObj.x, wordObj.y);
        wordObj.y += level * 0.5; // 단어의 속도는 레벨에 비례합니다.
    });
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        bullet.y -= bulletSpeed;
    });
    ctx.fillStyle = 'black'; // Reset the fill style
}

function updateScore(wordObj) {
    if (wordObj.isPositive) {
        score -= 10;
    } else {
        score += 10;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkCollisions() {
    fallingWords = fallingWords.filter(wordObj => {
        let hit = false;
        bullets = bullets.filter(bullet => {
            if (bullet.x < wordObj.x + ctx.measureText(wordObj.text).width && bullet.x + 5 > wordObj.x && bullet.y < wordObj.y + 20 && bullet.y + 10 > wordObj.y) {
                updateScore(wordObj);
                hit = true;
                return false;
            }
            return true;
        });
        return !hit && wordObj.y <= canvas.height;
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFallingWords();
    drawBullets();
    checkCollisions();

    if (Math.random() < 0.03 + (level * 0.01)) {
        createFallingWord();
    }

    if (score >= 100 * level && level < 10) {
        level++;
    }

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - player.width / 2;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = player.x + player.width / 2;
    const y = player.y;
    bullets.push({ x: x - 2.5, y: y }); // bullet starting position
});

playerImage.onload = () => {
    gameLoop();
};