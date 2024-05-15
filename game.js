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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawWords();
    requestAnimationFrame(draw);
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawWords() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    words.forEach(word => {
        ctx.fillText(word.text, word.x, word.y);
        word.y += word.speed;
        if (word.y > canvas.height) {
            words.splice(words.indexOf(word), 1);
        }
    });
}

function addWord() {
    const wordText = negativeWords[Math.floor(Math.random() * negativeWords.length)];
    const x = Math.random() * (canvas.width - 100);
    const y = 0;
    const speed = 1 + Math.random() * 2;  // Random speed between 1 and 3
    words.push({ text: wordText, x, y, speed });
    setTimeout(addWord, 2000);
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
