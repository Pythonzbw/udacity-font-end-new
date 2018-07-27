// 卡片元素数组初始化
const cardIcons = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-anchor",
  "fa-leaf",
  "fa-bicycle",
  "fa-diamond",
  "fa-bomb",
  "fa-leaf",
  "fa-bomb",
  "fa-bolt",
  "fa-bicycle",
  "fa-paper-plane-o",
  "fa-cube"
];

// 初始化游戏中一些重要变量
let openCards = [];  //打开卡牌数组，用来匹配卡牌元素是否一致
let matchedCards = []; //匹配用数组
let moveCounter = 0;
let msg = "";
let starNum = 3;
let starResultHtml = "";
let startDate = null;
let finalTime = 0;
let timerID = null;
let firstClick = true;
// 实例化
const bg = document.getElementsByClassName("bg")[0];
const xingxing = document.getElementsByClassName("xingxing")[0];
const moves = document.getElementsByClassName("moves")[0];
const gameSj = document.getElementsByClassName("gameSj")[0];
const newgameBtn = document.getElementsByClassName("restart")[0];
const model = document.getElementsByClassName("model")[0];
const successmsg = document.getElementsByClassName("success-sub-msg")[0];
const newone = document.getElementsByClassName("new-one")[0];



// 添加事件监听，条件是dom内容加载，也就是说在页面dom内容加载完毕后，会执行以下两个函数，重置游戏以及
function initialize() {
  document.addEventListener("DOMContentLoaded", function() {
    restartGame();
    events();
  });
}

// events函数，
function events() {
  // bg Event
  // 事件委托
  bg.addEventListener("click", function(e) {
    let event = e || window.event;
    let target = event.target || event.srcElement;
    if (
      target.nodeName.toLocaleLowerCase() === "li" &&
      !hasClass(target, "open")
    ) {
      if (firstClick) {
        // 倒计时
        startDate = new Date();  
        timerID = setInterval(function() {
          finalTime = Math.round((new Date() - startDate) / 1000);
          gameSj.innerHTML = finalTime;
        }, 1000);

        firstClick = false;
      }

      open_card(target);  //执行打开函数
      addCardToOpenCards(target);  //放入打开卡片
      if (openCards.length === 2) {
        xingxing_sum();
        // 三元运算符，判断opencards数组中的第一个元素是否与最新打开的html代码相同，如相同执行已匹配卡片函数，
        //如为false，则执行选择错误函数，为错误的卡片元素添加相应的动画效果，并通过定时器，初始化相应元素CSS类名
        openCards[0].innerHTML === target.innerHTML
          ? lockMatchedCard()
          : hideCardSymbol();
      }
    }
  });
  // Reset Event
  newgameBtn.addEventListener("click", function() {
    restartGame();
  });

  newone.addEventListener("click", function() {
    model.className = "model";
    restartGame();
  });
}

//重置游戏函数，也就是对所有变量进行初始化
function restartGame() {
  clearInterval(timerID);
  openCards = [];
  matchedCards = [];
  moveCounter = 0;
  msg = "";
  starNum = 3;
  startDate = null;
  finalTime = 0;
  timerID = null;
  firstClick = true;
  starResultHtml = "";
  moves.innerHTML = "0";
  bg.innerHTML = "";
  xingxing.innerHTML =
    '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
  successmsg.innerHTML = "With #{move} moves in #{time} seconds #{xingxing}.";
  gameSj.innerHTML = "0";
  shuffleCards(cardIcons);
}

/**
 * shuffleCards - shuffle ALL Cards
 * @param {array} arr - Card Icon Class Array
 */
function shuffleCards(arr) {
  // 打乱数组
  shuffle(arr);//打乱顺序函数，传进来的参数是cardicons数组，即包含所有卡片元素的数组，
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str = str + `<li class="card"><i class="fa ${arr[i]}"></i></li>\n`;
  }
  bg.insertAdjacentHTML("afterbegin", str);// 将str的值解析成HTML代码并插入到DOM中,afterbegin为插入到开始标签之后
}

/* 根据移动步数moveCounter的值来判断星星数量  */
function xingxing_sum() {
  moves.innerHTML = "";
  moveCounter++;

  if (moveCounter > 10 && moveCounter < 20) {
    starNum = 2;
    xingxing.innerHTML = `<li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>`;
  } else if (moveCounter >= 20) {
    starNum = 1;
    xingxing.innerHTML = `<li><i class="fa fa-star"></i></li>`;
  } else {
    starNum = 3;
  }

  moves.insertAdjacentHTML("afterbegin", moveCounter);
}
//
function open_card(el) {
  el.className += " open show animated flipInY";
}

function addCardToOpenCards(el) {
  openCards.push(el);  //push函数向数组末尾添加新的元素，即将打开的卡片添加进打开的数组中
}
//
function hideCardSymbol() {
  openCards.forEach(function(card) {
    card.className = "card open show error animated shake";
    setTimeout(function() {
      card.className = "card";
    }, 1000);
  });
  openCards = [];
}
//
function lockMatchedCard() {
  openCards.forEach(function(card) {
    card.className = "card open match animated bounceIn";
    matchedCards.push(card);
  });
  isWin();
  openCards = [];
}
//判断是否获胜
function isWin() {
  if (matchedCards.length === 16) {
    setTimeout(function() {
      alertmsg();
    }, 500);
  }
}

/**
 * 获得游戏胜利之后弹出胜利对话框
 */
function alertmsg() {
  if (starNum === 3) {
    starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>`;
  } else if (starNum === 2) {
    starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i>`;
  } else if (starNum === 1) {
    starResultHtml = `<i class="fa fa-star">`;
  }
  model.className += " active";
  msg = successmsg.textContent.replace("#{move}", moveCounter);//替换文本内容
  msg = msg.replace("#{xingxing}", starResultHtml);
  msg = msg.replace("#{time}", finalTime);
  successmsg.innerHTML = "";
  successmsg.insertAdjacentHTML("afterbegin", msg);
}

// Utils
/**
 * [hasClass description]
 * @param  {object}  el         - Which element do you want to check  
 * @param  {string}  className  - What is the class name,    
 * @return {Boolean}            - True or false  返回布尔值
 */
function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className); //获取想要检查元素列表的类名
  } else {
    return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);  
  }
}

/**
 * shuffle - Shuffle function from http://stackoverflow.com/a/2450976
 * @param  {array} array - A Array
 * @return {array} - Return random Cards
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

initialize();
