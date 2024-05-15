const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const negativeWords = [
    "부패", "불법", "불공정", "부정", "편법", "차별", "은폐", "조작", "독단", "횡령", 
    "부당", "압박", "부주의", "이기주의", "무책임", "비윤리", "불투명", "무관심", 
    "불신", "불성실", "비협조", "부정직", "불균형", "독선", "무시", "오용"
];

const words = [];
const wordSpeed = 1;
const spawnRate = 1000; // 단어 생성 간격 (밀리초)
let lastSpawn = -1;
let score = 0;
let gameOver = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    words.forEach((word, index) => {
        word.y += wordSpeed;
        ctx.fillText(word.text, word.x, word.y);
        if (word.y > canvas.height) {
            words.splice(index, 1);
            checkGameOver();
        }
    });

    if (!gameOver) {
        requestAnimationFrame(draw);
    } else {
        displayGameOver();
    }
}

function spawnWord(timestamp) {
    if (!gameOver && (lastSpawn === -1 || timestamp - lastSpawn >= spawnRate)) {
        const word = negativeWords[Math.floor(Math.random() * negativeWords.length)];
        const x = Math.random() * (canvas.width - ctx.measureText(word).width);
        const y = 20;
        words.push({ text: word, x: x, y: y });
        lastSpawn = timestamp;
    }
    if (!gameOver) {
        requestAnimationFrame(spawnWord);
    }
}

function shoot(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    words.forEach((word, index) => {
        if (clickX >= word.x && clickX <= word.x + ctx.measureText(word.text).width &&
            clickY >= word.y - 20 && clickY <= word.y) {
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
            words.splice(index, 1);
        }
    });
}

function checkGameOver() {
    // 조건을 변경하여 게임 종료 조건을 설정하세요.
    // 예를 들어, 일정 점수 도달 또는 놓친 단어 수 제한 등
    if (words.length = 1) {  // 예시 조건
        gameOver = true;
    }
}

function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener('click', shoot);
requestAnimationFrame(draw);
requestAnimationFrame(spawnWord);
