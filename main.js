'use strict'

// 各種要素の取得
const container = document.querySelector('#card_container');
const btn = document.querySelector('button');
const select = document.querySelector('select');
const clearGameWindow = document.querySelector('#game_clear');

// 各種初期値
let gameLevel = 0;
let flipCount = 0;
let firstCard = null;
let secondCard = null;
let firstFlag;
let secondFlag;
let firstImg;
let secondImg;
let firstCardFront;
let secondCardFront;

let correctCount = 0;
let mistakeCount = 0;

// ******************
// *   音関連の処理   *
// ******************

// ここに音楽のパスを追加
const sound = [
  'sound/opening.mp3',
  'sound/click001.mp3',
  'sound/gamestart.mp3',
  'sound/cardclick.mp3',
  'sound/cardget.mp3',
  'sound/clear.mp3',
  'sound/Battle.mp3'
];
addSounds();

// HTMLにaudioタグを音楽パスの分だけ追加する処理
function addSounds() {
  for (let i = 0; i < sound.length; i++) {
    const audio = document.createElement('audio');
    audio.src = sound[i];
    audio.preload = 'auto';
    document.querySelector('#sounds').appendChild(audio);
  }
}

//音を鳴らす処理
function playSoud(s) {
  const audios = document.querySelectorAll('audio');
  audios[s].play().currentTime = 0;
  if (s == 6) audios[s].volume = .2;
}

// 音を止める処理
function stopSoud(s) {
  const audios = document.querySelectorAll('audio');
  audios[s].pause();
}


// ****************
// *   表示の処理   *
// ****************

// カード表面
const cardPictures = [];

// カード裏面  ＊ここに画像パスを追加
const cardPictures2 = [
  'img/cat001.jpg',
  'img/cat002.jpg',
  'img/cat003.jpg',
  'img/cat004.jpg',
  'img/cat005.jpg',
  'img/cat006.jpg',
  'img/cat007.jpg',
  'img/cat008.jpg',
  'img/cat009.jpg',
  'img/cat010.jpg',
  'img/cat011.jpg',
  'img/cat012.jpg',
  'img/cat013.jpg',
  'img/cat014.jpg',
  'img/cat015.jpg',
  'img/cat016.jpg',
  'img/cat017.jpg',
  'img/cat018.jpg',
  'img/cat019.jpg',
  'img/cat020.jpg'
];

// レベルselectボックス生成
let gameLevels = [];
for (let i = 1 ;i < 11; i++) {
  gameLevels.push(i);
}
for (let i = 0; i < gameLevels.length; i++) {
  const opt = document.createElement('option');
  opt.innerHTML = `ゲームレベル<span id="levelNum">${gameLevels[i]}</span>`;
  opt.value = gameLevels[i];
  opt.classList.add('level');
  select.appendChild(opt);
}

// ****************************************
// *  レベル選択 → ゲームスタート → ゲーム開始  *
// ****************************************

// レベル選択の処理
select.addEventListener('change', (e) => {
  playSoud(1);
  let a = 1;
  if (a != 0) select.disabled = true;
  document.querySelector('#game_level').textContent = `You choice level ${e.target.value}`;
  gameLevel = e.target.value;

  createPicture(cardPictures);
  shuffle(cardPictures);
  shuffle(cardPictures2);
  // カードの中身の数字を生成
  function createPicture(arr) {
    for (let i = 1; i < gameLevel + 1; i++) {
      arr.push(i);
      arr.push(i);
    }
    // createCardFront();
  }

// ****************
// *   カード生成   *
// ****************

  // カードを生成する処理
  function createCard(c) {
    for (let i = 0; i < gameLevel * 2; i++) {
      // カードの枠生成
      const cards = document.createElement('div');
      cards.classList.add('card','animate__animated','animate__rollIn');
      container.appendChild(cards);
      // カードの表(数字)を生成
      setTimeout(() => {
        const cardFront = document.createElement('div');
        cardFront.classList.add('card_front');
        cardFront.innerHTML = c.shift();
        cards.appendChild(cardFront);
      }, 100);
      // カードの裏(絵)生成する処理
      const cardBack = document.createElement('div');
      cardBack.classList.add('card_back');
      const img = document.createElement('img');
      img.src = cardPictures2[i];
      cardBack.appendChild(img);
      cards.appendChild(cardBack);
      setTimeout(() => cards.classList.remove('animate__animated','animate__rollIn'), 700);
    }
    cardClick();
  }

  // カードをシャッフルする処理
  function shuffle(arr) {
    let backup = 0;
    for (let i = 0; i < 500; i++) {
      let randomA = Math.floor(Math.random() * gameLevel * 2);
      let randomB = Math.floor(Math.random() * gameLevel * 2);
      backup = arr[randomA];
      arr[randomA] = arr[randomB];
      arr[randomB] = backup;
    }
  }

  //ゲームスタートボタンを押した時の処理
  btn.addEventListener('click', function() {
    playSoud(2);
    playSoud(6);
    btn.innerHTML = `<a href="" id="restart">RESTART</a>`;
    let b = 1;
    if (b == 1) btn.disabled = true;
    createCard(cardPictures);
  });


  // カードをクリックした時の処理
  function cardClick() {
    const card = document.querySelectorAll('.card')
    card.forEach(node => node.addEventListener('click', function(e) {
      if (this.classList.contains('flipMoution_1') == true) return;
      playSoud(3);
      if (secondImg != undefined) {
      }
      flipCount++;
      this.classList.add('flipMoution_1');
      e.target.classList.add('transparent');
      if (flipCount == 1) {
        firstCardClick(this);
      } else if (flipCount == 2) {
        secondCardClick(this);
        if (firstCard == secondCard) {
          seikai();
        } else {
          machigai();
        }
      }

      //正解回数・ミス回数の出力
      document.querySelector('#correct_count').textContent = correctCount;
      document.querySelector('#mistake_count').textContent = mistakeCount;

      // 正解数がゲームレベルと等しくなったらゲーム終了！
      if (correctCount == gameLevel) {
        stopSoud(6);
        playSoud(5);
        gameClear();
      }

      // １枚目のカードをクリックしたときの処理
      function firstCardClick(_this) {
        firstCard = _this.innerText; //カードフロントの中の数字
        firstFlag = _this; //カードそのもの
        firstImg = e.target; //カードバックのイメージ
        firstCardFront =  _this.childNodes[1]; //カードフロント
      }

      // ２枚目のカードをクリックしたときの処理
      function secondCardClick(_this) {
        secondCard = _this.innerText;
        secondFlag = _this;
        secondImg = e.target;
        secondCardFront = _this.childNodes[1];
      }

      // 正解の時の処理
      function seikai() {
        setTimeout(() => playSoud(4), 100);
        setTimeout(() => {
          firstCardFront.classList.add('correct');
          secondCardFront.classList.add('correct');
        }, 200);
        setTimeout(() => {
          firstCardFront.classList.add('transparent');
          secondCardFront.classList.add('transparent');
        }, 600);
        setTimeout(() => firstFlag.classList.add('animate__animated','animate__bounceOutUp'),200);
        secondFlag.classList.add('animate__animated','animate__bounceOutUp');
        firstCard = null;
        secondCard = null;
        flipCount = 0;
        correctCount++;
      }

      // 間違いの時の処理
      function machigai() {
        setTimeout(() => {
          firstImg.classList.remove('transparent');
          secondImg.classList.remove('transparent');
        }, 600);
        setTimeout(() => {
          firstFlag.classList.remove('flipMoution_1');
          secondFlag.classList.remove('flipMoution_1');
          firstFlag.classList.add('flipMoution_2');
          secondFlag.classList.add('flipMoution_2');
        }, 500);
        firstCard = null;
        secondCard = null;
        flipCount = 0;
        mistakeCount++;
      }

      // ゲームクリアー時の処理
      function gameClear() {
        document.querySelector('#game_level').textContent = 'Now in a great state!!';
        document.querySelector('#game_level').style.color = 'red';
        setTimeout(() => {
          btn.style.opacity = 0;
          select.style.opacity = 0;
        }, 500);
        clearGameWindow.classList.add('animate__animated','animate__rubberBand');
        setTimeout(() => clearGameWindow.style.display = 'block', 500);
      }

    }));
  }

// 次のゲームへすすむボタンのアニメーション処理
  clearGameWindow.addEventListener('mouseover', function(e) {
    e.target.classList.remove('animate__rubberBand');
    e.target.classList.add('animate__bounce');
  }, false);
  clearGameWindow.addEventListener('mouseleave', function(e) {
    e.target.classList.remove('animate__bounce');
  }, false);
});
