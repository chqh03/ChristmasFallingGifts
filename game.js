let player = document.getElementById('player');
let scoreElement = document.getElementById('score');
let timerElement = document.getElementById('timer');
let gameContainer = document.querySelector('.game-container');
let gameOverElement = document.getElementById('gameOver'); // 게임 종료 메시지를 표시할 요소
let gameBg = document.querySelector('.game-container').style.backgroundImage = "url('GameBg.jpg')";
let EndText = document.getElementById('endText')

let score = 0;
let timer = 30;
let gifts = [];  // 선물 여러 개를 저장할 배열
let playerPositionX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;

let gameInterval;
let timerInterval;


/*public class SimpleApplet extends Applet {
    @Override
    public void paint(Graphics g) {
        g.drawString("게임 시작!", 50, 50);  // 텍스트 그리기
    }
}*/
//alert('게임이 시작..')
// 선물 클래스 생성
class Gift {
    constructor() {
        this.element = document.createElement('img');  // div 대신 img 태그로 변경
        this.element.classList.add('gift');
        this.element.src = 'present.png';  // 선물 이미지를 present.png로 설정
        this.element.style.position = 'absolute';
        this.element.style.top = '0px'; // 화면 위에서 떨어지도록
        this.element.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px'; // 랜덤한 X위치
        this.speed = Math.random() * 8 + 15;  // 랜덤 속도 (7에서 12 사이)
        this.rotation = 0;  // 선물의 회전 각도 (0도부터 시작)
        gameContainer.appendChild(this.element);
    }
    destroy(){
        this.element.style.display = "none";
    }
    fall() {
        let top = parseInt(this.element.style.top); // 현재 top 위치
        if (top + this.element.offsetHeight >= gameContainer.offsetHeight - player.offsetHeight &&
            parseInt(this.element.style.left) >= playerPositionX &&
            parseInt(this.element.style.left) <= playerPositionX + player.offsetWidth) {
            // 선물이 플레이어와 맞았을 때
            score++;
            scoreElement.innerText = `score: ${score}`;  // 점수 업데이트
            this.resetPosition();
        } else if (top >= gameContainer.offsetHeight) {
            // 선물이 바닥에 닿으면 위치 초기화
            this.resetPosition();
        } else {
            this.element.style.top = top + this.speed + 'px'; // 선물이 떨어짐
            this.rotation += 1;  // 1도씩 회전
            this.element.style.transform = `rotate(${this.rotation}deg)`;  // 회전 적용
        }
    }

    resetPosition() {
        this.element.style.top = '0px';  // 선물을 위로 초기화
        this.element.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px'; // 새로운 랜덤 위치로 이동
    }
}

// 플레이어 이동
let moveLeft = false;
let moveRight = false;

function movePlayer() {
    if (moveLeft) {
        playerPositionX = Math.max(0, playerPositionX - 15); // 왼쪽으로 이동
    }
    if (moveRight) {
        playerPositionX = Math.min(gameContainer.offsetWidth - player.offsetWidth, playerPositionX + 15); // 오른쪽으로 이동
    }
    player.style.left = playerPositionX + 'px';
    requestAnimationFrame(movePlayer); // 다음 프레임에 다시 호출하여 부드러운 움직임 구현
}
// 타이머 카운트다운
function startTimer() {
    timerInterval = setInterval(function () {
        if (timer > 0) {
            timer--;
            timerElement.innerText = `time: ${timer}`;  // 타이머 업데이트
        } else {
            clearInterval(timerInterval);
            EndText.innerText = `game end!`
            gameOver(); // 타이머 종료 시 게임 종료 함수 호출
            
            gifts.fall()
        }
    }, 1000);
}

// 선물 떨어지기
function dropGifts() {
    gifts.forEach(gift => {
        gift.fall();
    });
}

// 게임 종료 처리
function gameOver() {
    gameOverElement.style.display = 'block';  // 게임 종료 메시지 보이기
    //gameOverElement.innerText = `게임 종료! 최종 점수: ${score}`;  // 최종 점수 표시
    clearInterval(gameInterval);  // 선물 떨어지기 종료
    gameBg = document.querySelector('.game-container').style.backgroundImage = "url('gameover2.png')";
    
    // 더 이상 키보드 입력을 받지 않도록 처리
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);

    player.style.display = "none";
    gifts.forEach(gift => {
        gift.destroy();
    });
}

// 키보드 이벤트 처리
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft = true;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        moveRight = true;
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft = false;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        moveRight = false;
    }
}

// 게임 시작
function startGame() {
    // 여러 개의 선물을 만들기
    for (let i = 0; i < 5; i++) {  // 5개의 선물이 떨어지도록
        gifts.push(new Gift());
    }

    gameInterval = setInterval(dropGifts, Math.random() * 3 + 15); // 선물 떨어짐 간격
    startTimer();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    movePlayer(); // 처음에 플레이어 움직임 시작
}

startGame();