/**
 * @fileoverview פונקציות להצגת המשחק.
 * @author [Efrat Burshteyn]
 */
/**יבוא הפונקציות */
import { createDeck, shuffle, drawCard,createKingsDeck } from './gameLogic.js';

let deck=[];
let usedCards=[];
let kingsCards=[];
let card;
let player=0;
let timeInterval;
//הגדרת הצלילם sounds
const sndStart = new Audio('sounds/start.mp3');      // צליל התחלה
const sndbrokenPita = new Audio('sounds/broken pita.mp3');    // צליל פיתה קרועה
const sndClapping = new Audio('sounds/clapping.mp3');  // צליל ניצחון
const sndTimeFinish = new Audio('sounds/time finish.mp3');  // צליל תקתוק (עבור ה-10 שניות)

btnStart.addEventListener('click', () => {
    sndStart.currentTime = 0; 
    sndStart.play();
    startGame(); 
});
/**
 * פונקציית האתחול של המשחק.
 * יוצרת את החפיסת הקלפים, מערבבת אותה ויוצרת את חפיסת קלפי המלכים ומכינה את המשתנים לתחילת המשחק.
  *ועדכון השחקן הראשון כפעיל  
 */
const initGame=()=>{
    deck=createDeck();
    shuffle(deck);
    kingsCards=createKingsDeck();
    player=0;
}
/**אוביקט של מערכי לוחות השחחקנים לכל שחקן דוכם רכיבין ומערך לכרטיסי המלך */
let playersBoards=[{ingredients:[],kings:[]},{ingredients:[],kings:[]}];

/**
 * מטפלת בלוגיקה של שליפת קלף מהקופה ועדכון לוח השחקן.
 * הפונקציה בודקת שלושה מצבים:
 * 1. פיתה קרועה: איפוס הדוכן של השחקן הנוכחי.
 * 2. כפילות: העברת הקלף לערימת המשומשים.
 * 3. רכיב חדש: הוספה לדוכן ובדיקת השלמת מנה (7 רכיבים) לקבלת מלך.
 */
const handleDraw=()=>{
   card=drawCard()
   if(card==='broken pita'){
       sndbrokenPita.currentTime = 0;
       sndbrokenPita.play();
       clearBoard(player);
    }
    else if(playersBoards[player].ingredients.includes(card))
              usedCards.push(card);
    else{
         playersBoards[player].ingredients.push(card);
         renderCard(card,player);
         if(playersBoards[player].ingredients.length===7){
             clearBoard(player);
             const kingCard=kingsCards.pop()
              playersBoards[player].kings.push(kingCard);
             renderKing(kingCard,player);
         }
    }
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
 * מנקה את הדוכן של השחקן הנוכחי.
 * @param {number} player - אינדקס השחקן (0 או 1).
 */
 const clearBoard=(player)=>{
    playersBoards[player].ingredients=[];
    const standId = document.getElementById(`p${player + 1}Stand`);
    standId.textContent = '';
 }
/**
 * מציירת (מרנדרת) את הקלף על המסך.
 * @param {string} card - שם הקלף (למשל: 'pita')
 * @param {number} player - איזה שחקן קיבל את הקלף (0 או 1)
 */
 const renderCard = (card, player) => {
    const stand = document.getElementById(`p${player + 1}Stand`);
    const img = document.createElement('img');
    
    img.src = `pictures/${card}.png`; 
    
    // 1. הוספת ה-Alt (הסבר על התמונה)
    img.alt = card; 
    
    // 2. הוספת ה-Class (חיבור ל-CSS לעיצוב)
    img.classList.add('card-style'); 
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
    img.src = `pictures/${king}.png`; 
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
    const p1 = sessionStorage.getItem('p1Name') || "שחקן 1";
    const p2 = sessionStorage.getItem('p2Name') || "שחקן 2";
    
    document.getElementById('p1Name').textContent = p1;
    document.getElementById('p2Name').textContent = p2;
};
/**
 * פונקציה המבצעת את סגירת המשחק מבחינה לוגית וויזואלית.
 * @param {string} message - ההודעה שתופיע למשתמש בחלון סיום המשחק.
 */
const endGame=(massage)=>{
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
    // שליפת נתוני השחקנים
    const k1 = playersBoards[0].kings.length;
    const k2 = playersBoards[1].kings.length;
    const name1 = document.getElementById('p1Name').textContent;
    const name2 = document.getElementById('p2Name').textContent;

    let finalMessage = "";

    // בדיקה האם הסיום הוא בגלל זמן (כאן נכנסת הלוגיקה של איפוס/תיקו)
    if (reason === "נגמר הזמן") {
        finalMessage = "הזמן תם! לא נקבע מנצח והתוצאות התאפסו.";
    } 
    // במידה והסיום הוא בגלל שנגמרו הקלפים - מחשבים מנצח
    else {
        finalMessage = reason + " ";
        if (k1 > k2) {
            finalMessage += `המנצח הוא ${name1} עם ${k1} מלכים!`;
            saveToHighScores(name1, k1);
        } else if (k2 > k1) {
            finalMessage += `המנצח הוא ${name2} עם ${k2} מלכים!`;
            saveToHighScores(name2, k2);
        } else {
            finalMessage += "תיקו! לשני השחקנים מספר זהה של מלכים.";
        }
    }

    // שליחה לפונקציית התצוגה הסופית
    endGame(finalMessage);
};
/**
 * מתניעה את תהליך המשחק.
 * הפונקציה מאתחלת את הנתונים, מעדכנת את שמות השחקנים, מנקה את הלוחות הוויזואליים,
 * מפעילה את טיימר הספירה לאחור ומאפשרת אינטראקציה עם ערימת הקלפים.
 */
const startGame = () => {
    initGame(); 
    updateNames();
    
    //  איפוס הלוחות הוויזואליים (ניקוי הדוכנים)
    clearBoard(0);
    clearBoard(1);
    
    //  הפעלת הטיימר
    startTimer(300); 
    
    //  סימון השחקן הראשון כפעיל
    document.getElementById('player1').classList.add('active-turn');
    
    //  פתיחת האפשרות ללחוץ על הערימה
    document.getElementById('drawPile').style.pointerEvents = 'auto';
};
