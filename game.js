const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const negativeWords = [
    "부패", "불법", "불공정", "부정", "편법", "차별", "은폐", "조작", "독단", "횡령",
    "부당", "압박", "부주의", "이기주의", "무책임", "비윤리", "불투명", "무관심",
    "불신", "불성실", "비협조", "부정직", "불균형", "독선", "무시", "오용"
];

const words = [];
let score = 0;
let missed = 0;
const missedLimit = 10;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    words.forEach((word, index) => {
        word.y += word.speed;
        ctx.fillText(word.text, word.x, word.y);
        if (word.y > canvas.height) {
            words.splice(index, 1);
            missed += 1;
            if (missed >= missedLimit) {
                gameOver();
            }
        }
    });
    requestAnimationFrame(draw);
}

function addWord() {
    const word = negativeWords[Math.floor(Math.random() * negativeWords.length)];
    const x = Math.random() * (canvas.width - ctx.measureText(word).width);
    const speed = 1 + Math.random();  // Increasing speed randomly for variety
    words.push({ text: word, x, y: 20, speed });
    setTimeout(addWord, 2000 - score * 10); // Decrease interval as score increases
}

function shoot(event) {
    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;
    words.forEach((word, index) => {
        if (clickX >= word.x && clickX <= word.x + ctx.measureText(word.text).width && clickY >= word.y - 20 && clickY <= word.y) {
            words.splice(index, 1);
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    });
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

canvas.addEventListener('click', shoot);
draw();
addWord();
