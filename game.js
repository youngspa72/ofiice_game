const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const negativeWords = [
    "부패", "불법", "불공정", "부정", "편법", "차별", "은폐", "조작", "독단", "횡령",
    "부당", "압박", "부주의", "이기주의", "무책임", "비윤리", "불투명", "무관심",
    "불신", "불성실", "비협조", "부정직", "불균형", "독선", "무시", "오용"
];

let player = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 50 };
let words = [];
let score = 0;
let missed = 0;
const missedLimit = 10;
let gameOver = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawWords();
    if (!gameOver) {
        requestAnimationFrame(draw);
    } else {
        displayGameOver();
    }
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawWords() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    words.forEach((word, index) => {
        word.y += word.speed;
        ctx.fillText(word.text, word.x, word.y);
        if (word.y > canvas.height) {
            words.splice(index, 1);
            missed++;
            document.getElementById('missed').innerText = `Missed: ${missed}`;
            if (missed >= missedLimit) {
                gameOver = true;
            }
        }
    });
}

function addWord() {
    if (!gameOver) {
        const wordText = negativeWords[Math.floor(Math.random() * negativeWords.length)];
        const x = Math.random() * (canvas.width - ctx.measureText(wordText).width);
        const y = 0;
        const speed = 1 + Math.random() * 2;  // Random speed between 1 and 3
        words.push({ text: wordText, x, y, speed });
        setTimeout(addWord, 2000 - score * 10); // Decrease interval as score increases
    }
}

function checkHit(x, y) {
    words = words.filter(word => {
        if (x >= word.x && x <= word.x + ctx.measureText(word.text).width && y >= word.y && y <= word.y + 20) {
            score++;
            document.getElementById('score').innerText = 'Score: ' + score;
            return false;
        }
        return true;
    });
}

function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - player.width / 2;
});

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    checkHit(x, y);
});

draw();
addWord();
