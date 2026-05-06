/**
 * @fileoverview פונקציות להצגת המשחק.
 * @author [Efrat Burshteyn]
 */
/**יבוא הפונקציות */
import { createDeck, shuffle, drawCard,createKingsDeck,saveToHighScores } from './gameLogic.js';

let deck=[];
let usedCards=[];
let kingsCards=[];
let card;
let kingCard;
let player=0;
let timeInterval;
let floatingCard;

//הגדרת הצלילם sounds
const sndStart = new Audio('../sounds/start.mp3');      // צליל התחלה
const sndbrokenPita = new Audio('../sounds/broken pita.mp3');    // צליל פיתה קרועה
const sndClapping = new Audio('../sounds/clapping.mp3');  // צליל ניצחון
const sndTimeFinish = new Audio('../sounds/time finish.mp3');  // צליל תקתוק (עבור ה-10 שניות)

const startBtn = document.getElementById('startBtn'); 
const drawPile = document.getElementById('drawPile');
const gameSettings = JSON.parse(sessionStorage.getItem('gameSettings'));
const level = gameSettings?.level || "easy";
const levelsText = {
    easy: "קל",
    hard: "קשה"
};

document.getElementById('levelDisplay').textContent = levelsText[level];
/**
 *  handleDraw מקשיבה ללחיצה על הערימה אם לחצו מפעילה את הפונקציה
 */
drawPile.addEventListener('click', () => {
    handleDraw();
});
/**
 * פונקציה המציגה את ערימת המשיכה מיד עם תחילת המשחק.
 */
export const renderInitialDeck = () => {
    if (drawPile) {
        while (drawPile.firstChild) {
            drawPile.removeChild(drawPile.firstChild);
        }
        const backImg = document.createElement('img');
        backImg.src = '../pictures/back.png'; 
        backImg.classList.add('card-img'); 
        backImg.alt = "ערימת משיכה";
        drawPile.appendChild(backImg);
    }
};
/**
 * מציג את ערימת המלכים המרכזית
 */
const renderKingsBank = () => {
    const kingsBank = document.getElementById("kingsBank");

    kingsBank.replaceChildren();

    kingsCards.forEach(() => {
        const img = document.createElement("img");
        img.src = "../pictures/king.png";
        img.classList.add("king-card-style");
        kingsBank.appendChild(img);
    });
};
kingsCards = createKingsDeck();
renderKingsBank();
/**
 * מתחיל משחק חדש בצורה מלאה:
 * מאפס מצב, יוצר חפיסות, מעדכן UI ומפעיל טיימר.
 */
const startGame = () => {
     sndStart.play();
    const modal = document.getElementById('endGameModal');
     modal.classList.add('hidden');
     // 2. עצירת הטיימר הישן מיד (למניעת קפיצות של הודעת "נגמר הזמן")
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval=null
    }
        playersBoards = [
        { ingredients: [], kings: [] },
        { ingredients: [], kings: [] }
    ];
    clearBoardGame();
      player = 0;
    document.getElementById('winnerInfo').textContent = '';
    document.getElementById('discardPile').replaceChildren();
    // יצירת חפיסות
    deck = createDeck();
    shuffle(deck);
    kingsCards = createKingsDeck();
    // תצוגה
    updateNames();
    renderInitialDeck();
    // תור ראשון
    document.getElementById('player1').classList.add('active-turn');
    document.getElementById('player2').classList.remove('active-turn');
    // טיימר
    if (timeInterval) clearInterval(timeInterval);
    startTimer(120)
    // הפעלת משחק
    document.getElementById('drawPile').style.pointerEvents = 'auto';
};

/**אוביקט של מערכי לוחות השחחקנים לכל שחקן דוכם רכיבין ומערך לכרטיסי המלך */
let playersBoards=[{ingredients:[],kings:[]},{ingredients:[],kings:[]}];

/**
 * מטפלת בלוגיקה של שליפת קלף מהקופה ועדכון לוח השחקן.
 * הפונקציה בודקת שלושה מצבים:
 * 1. פיתה קרועה: איפוס הדוכן של השחקן הנוכחי.
 * 2. כפילות: העברת הקלף לערימת המשומשים.
 * 3. רכיב חדש: הוספה לדוכן ובדיקת השלמת מנה (7 רכיבים) לקבלת מלך.
 *מציגה שניה ושמה איפה שצריך
*/
const handleDraw=()=>{
   card=drawCard(deck)
   if (!card) {
       determineWinnerByKings("נגמרו הקלפים בחפיסה!");
       return; 
   }
   if(card==='broken pita'){
       sndbrokenPita.currentTime = 0;
       sndbrokenPita.play();
       clearBoard(player);       
    }
    else if(playersBoards[player].ingredients.includes(card)){
              usedCards.push(card);
              renderUsedCard(card);
            }
    else{
         playersBoards[player].ingredients.push(card);
         renderCard(card,player);
         if(playersBoards[player].ingredients.length===7){
            kingCard=kingsCards.pop()
            renderKingsBank();
            playersBoards[player].kings.push(kingCard);
            renderKing(kingCard,player);
             clearBoard(player);
         }
    }
 const floating = document.getElementById("floatingCard");
     // מנקים תוכן קודם בצורה בטוחה
   floating.replaceChildren();

  // יוצרים תמונה
   const img = document.createElement("img");
  img.src = `../pictures/${card}.png`;
    img.className = "card-img";

     // מוסיפים לקונטיינר
    floating.appendChild(img);

   floating.style.display = "block";
   floating.classList.remove("hidden");

    setTimeout(() => {
       floating.style.display = "none";
    }, 1000);
    switchTurn();
 }
 /**
 * מציגה קלף שנזרק לערימת המשומשים (discard pile) בלוח המשחק.
 * הפונקציה יוצרת אלמנט תמונה חדש לפי סוג הקלף,
 * ומוסיפה אותו לאזור המשומשים על המסך.
 * @param {string} card - שם הקלף שיש להציג (למשל: 'pita', 'chips')
 */
const renderUsedCard = (card) => {
    const discard = document.getElementById("discardPile");
    const img = document.createElement("img");
    img.src = `../pictures/${card}.png`;
    img.className = "card-img";
    discard.appendChild(img);
};
 /**
 * פונקציה להחלפת תורות בין השחקנים.
 * הפונקציה מעדכנת את המשתנה הלוגי player ומחליפה את העיצוב הוויזואלי
 * כדי לסמן לשחקנים מי השחקן הפעיל כעת.
 */
 const switchTurn=()=>{
    //זו הדרך לבנות את השם. מכיוון שב-HTML  id="player1", 
    //  מחברים את המילה "player" עם המספר (0+1 או 1+1).
    document.getElementById(`player${player + 1}`).classList.remove('active-turn');
    if(player===0)
        player=1;
    else player=0;
    //  הוספת מחלקת העיצוב לשחקן החדש שתורו כעת
    //  ומוסיף לו את הסטייל
    document.getElementById(`player${player + 1}`).classList.add('active-turn');
 }
/**
 * מנקה את הדוכן של השחקן.
 * הפונקציה מאפסת את המערכים הלוגיים ומנקה את האלמנטים הוויזואליים ב-HTML.
 * @param {number} player - אינדקס השחקן (0 או 1).
 */
 const clearBoard=(player)=>{
    usedCards.push(...playersBoards[player].ingredients);
    playersBoards[player].ingredients=[];
    const standId = document.getElementById(`p${player + 1}Stand`);
    standId.textContent = '';
 }

/**
 * מאפסת את כל התצוגה הוויזואלית של לוח המשחק.
 * הפונקציה מנקה את כל האלמנטים הקשורים למצב המשחק הקודם מה־DOM:
 * - דוכני השחקנים (הרכיבים שנאספו)
 * - אזורי המלכים של כל שחקן
 * - ערימת הקלפים שנזרקו (discard pile)
 * מיועדת לאיפוס התצוגה בלבד לקראת התחלת משחק חדש.
 */
 const clearBoardGame = () => {
    document.getElementById('p1Stand').replaceChildren();
    document.getElementById('p2Stand').replaceChildren();

    document.getElementById('p1KingsList').replaceChildren();
    document.getElementById('p2KingsList').replaceChildren();

    document.getElementById('discardPile').replaceChildren();
};
/**
 * מציירת (מרנדרת) את הקלף על המסך.
 * @param {string} card - שם הקלף (למשל: 'pita')
 * @param {number} player - איזה שחקן קיבל את הקלף (0 או 1)
 */
 const renderCard = (card, player) => {
    const stand = document.getElementById(`p${player + 1}Stand`);
    const img = document.createElement('img');
    
    img.src = `../pictures/${card}.png`; 
    
    //הוספת ה-Alt (הסבר על התמונה)
    img.alt = card; 
    
    img.classList.add('card-img'); 
    stand.appendChild(img);
};
/**
 * מציגה את קלף המלך שהשחקן זכה בו באזור המלכים שלו.
 * @param {string} king -  קלף המלך.
 * @param {number} player - אינדקס השחקן (0 או 1).
 */
const renderKing = (king, player) => {
    //  מציאת אזור רשימת המלכים (לפי ה-ID ב-HTML : p1KingsList / p2KingsList)
    const kingsContainer = document.getElementById(`p${player + 1}KingsList`);
    //  יצירת אלמנט התמונה
    const img = document.createElement('img');
    img.src = `../pictures/${king}.png`; 
    img.alt = "מלך הפלאפל";
    //  הוספת עיצוב מיוחד למלכים 
    img.classList.add('king-card-style'); 
    // הוספה למסך
    kingsContainer.appendChild(img);
};
/**
 * מעדכנת את שמות השחקנים המוצגים על הלוח.
 * הפונקציה שולפת את השמות שנשמרו בזיכרון הדפדפן (sessionStorage) 
 * ומזריקה אותם לאלמנטים המתאימים ב-HTML.
 */
const updateNames = () => {
    // שליכת השמות ששמורים ב-SessionStorage 
    //אם נכנסו לא תקין יהיה במקום שם NULL-ריק יהיה  שחקן1 ושחקן2
      const gameSettings = JSON.parse(sessionStorage.getItem('gameSettings')) || {};

    const p1 = gameSettings.player1 || "שחקן 1";
    const p2 = gameSettings.player2 || "שחקן 2";
    
    document.getElementById('p1Name').textContent = p1;
    document.getElementById('p2Name').textContent = p2;
};
/**
 * מסיימת את המשחק ומציגה חלון תוצאה.
 * עוצרת את הטיימר ומונעת המשך אינטראקציה עם המשחק.
 * @param {string} message - הודעת סיום המשחק
 * @returns {void}
 */
const endGame=(message)=>{
    //אם נגמר הזמן:
    // עצירת פעולת הטיימר
    if(timeInterval)
        clearInterval(timeInterval);
    // עדכון תוכן ההודעה במודל
    const winnerInfo = document.getElementById('winnerInfo');
    if (winnerInfo) {
        winnerInfo.textContent = message;
    };
    // הצגת חלון סיום המשחק
    const modal = document.getElementById('endGameModal');
    if (modal) {
        modal.classList.remove('hidden');
    }

    // ניטרול אפשרות לחיצה על ערימת המשיכה
    const drawPile = document.getElementById('drawPile');
    if (drawPile) {
        drawPile.style.pointerEvents = 'none';
    }
};
/**
 * מאזין ללחיצות מקלדת ומפעיל שליפת קלף מהחפיסה בלחיצה על רווח.
 * כאשר המשתמש לוחץ על מקש הרווח (Space), הפונקציה handleDraw()
 * מופעלת ומבצעת שליפה של קלף מהערימה המרכזית במשחק.
 * זה מאפשר לשחקן לבצע פעולה גם ללא לחיצה על העכבר.
 * @param {KeyboardEvent} e - אירוע לחיצה על מקש במקלדת.
 */
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleDraw();
    }
});
/**
 * פונקציה המכריעה את תוצאת המשחק ובודקת האם יש מנצח או איפוס.
 * @param {string} reason - סיבת הסיום (זמן או קלפים).
 */
const determineWinnerByKings = (reason) => {
    if(!reason)
        return;
    // שליפת נתוני השחקנים
    const k1 = playersBoards[0].kings.length;
    const k2 = playersBoards[1].kings.length;
    const name1 = document.getElementById('p1Name').textContent;
    const name2 = document.getElementById('p2Name').textContent;

    let finalMessage = "";

    // בדיקה האם הסיום הוא בגלל זמן
    if (reason === "נגמר הזמן") {
        finalMessage = "הזמן תם! לא נקבע מנצח והתוצאות התאפסו⏱️.";
    } 
    // במידה והסיום הוא בגלל שנגמרו הקלפים - מחשבים מנצח
    else {
        finalMessage =" ";
        if (k1 > k2) {
            sndClapping.play();
            finalMessage += `המנצח הוא ${name1} עם ${k1} מלכים!🏆`;
            saveToHighScores(name1, k1);
        } else if (k2 > k1) {
            sndClapping.play();
            finalMessage += `המנצח הוא ${name2} עם ${k2} מלכים!🏆`;
            saveToHighScores(name2, k2);
        } else {
            finalMessage += "תיקו! לשני השחקנים מספר זהה של מלכים 🏆.";
        }
    }

    // שליחה לפונקציית התצוגה הסופית
    endGame(finalMessage);
};
/**
 * מנהלת את טיימר הספירה לאחור של המשחק.
 * הפונקציה מעדכנת את התצוגה בכל שנייה, משמיעה התראה קולית ב-10 השניות האחרונות,
 * ומפעילה את תהליך סיום המשחק כאשר הזמן אוזל.
 * 
 * @param {number} seconds - מספר השניות לספירה לאחור (למשל 300 עבור 5 דקות).
 */
const startTimer = (seconds) => {
    let timeLeft = seconds;

    // איפוס טיימר קודם אם קיים
    if (timeInterval) clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        timeLeft--;

        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
           const minutes = Math.floor(timeLeft / 60);
           const seconds = timeLeft % 60;
           timerDisplay.textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // השמעת צליל ב-10 השניות האחרונות
        if (timeLeft <= 10 && timeLeft > 0) {
            sndTimeFinish.currentTime = 0;
            sndTimeFinish.play();
        }

        // סיום המשחק כשהזמן נגמר
        if (timeLeft <= 0) {
            clearInterval(timeInterval);
            determineWinnerByKings("נגמר הזמן");
        }
    }, 1000);
};
/**
 * מתניעה את תהליך המשחק.
 * הפונקציה מאתחלת את הנתונים, מעדכנת את שמות השחקנים, מנקה את הלוחות הוויזואליים,
 *עוצרים את הטימר מפעילה את טיימר הספירה לאחור ומאפשרת אינטראקציה עם ערימת הקלפים.
 */

/**
 * מאזין לאירוע טעינת ה-DOM כדי להבטיח שהדף מוכן לפני תחילת הרינדור.
 */
document.addEventListener('DOMContentLoaded', () => {
       startGame();
      
    document.getElementById("btnRestart").addEventListener("click", () => {
    sndStart.play();
    startGame();
});

document.getElementById("btnClose").addEventListener("click", () => {
    // סגירת המשחק  חזרה לדף הכניסה)
    window.location.href = "../index.html"; 
});

document.getElementById("btnLeaderboard").addEventListener("click", () => {
    window.location.href = "../pages/highScores.html";
});
});