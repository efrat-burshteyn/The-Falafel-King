/**
 * @fileoverview פונקציות להצגת המשחק.
 * @author [Efrat Burshteyn]
 */
/**יבוא הפונקציות */
import { createDeck, shuffle, drawCard,createKingsDeck,saveToHighScores } from './gamLogic.js';

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
drawPile.addEventListener('click', (event) => {
    // שימוש באובייקט האירוע לצורך בדיקה
    if (event.isTrusted) {
        handleDraw();
    }
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
 * פונקציית עזר ליצירת תמונה והוספתה לאלמנט ב-DOM.
 * עונה על דרישת DRY (מניעת קוד כפול) ויצירת אלמנטים דינאמית.
 * @param {HTMLElement} container - האלמנט אליו תתווסף התמונה.
 * @param {string} cardName - שם הקלף לצורך נתיב התמונה וה-alt.
 * @param {string} className - מחלקת ה-CSS לעיצוב.
 */
const renderImageToContainer = (container, cardName, className = "card-img") => {
    const img = document.createElement('img');
    img.src = `../pictures/${cardName}.png`;
    img.classList.add(className);
    img.alt = cardName;
    container.appendChild(img);
};
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
             renderImageToContainer(document.getElementById("discardPile"), card);
            }
    else{
         playersBoards[player].ingredients.push(card);
        renderImageToContainer(document.getElementById(`p${player + 1}Stand`), card);
         if(playersBoards[player].ingredients.length===7){
            kingCard=kingsCards.pop()
            renderKingsBank();
            playersBoards[player].kings.push(kingCard);
            renderImageToContainer(document.getElementById(`p${player + 1}KingsList`), kingCard, "king-card-style");
             clearBoard(player);
         }
    }
 const floating = document.getElementById("floatingCard");
     // מנקים תוכן קודם בצורה בטוחה
   floating.replaceChildren();

   renderImageToContainer(floating, card);

   floating.style.display = "block";
   floating.classList.remove("hidden");

    setTimeout(() => {
       floating.style.display = "none";
    }, 1000);
    switchTurn();
 }
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

/**
 * מאפסת את כל הלוחות והתצוגה.
 * משתמשת ב-forEach (HOF) כדי לעמוד בדרישות הפרויקט.
 */
const clearBoardGame = () => {
    // שימוש ב-forEach על מערך אינדקסים כדי לנקות את הדוכנים
    [0, 1].forEach(pIndex => {
        document.getElementById(`p${pIndex + 1}Stand`).replaceChildren();
        document.getElementById(`p${pIndex + 1}KingsList`).replaceChildren();
    });
    document.getElementById('discardPile').replaceChildren();
};
