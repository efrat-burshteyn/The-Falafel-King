/**
 * @fileoverview פונקציות להצגת המשחק.
 * @author [Efrat Burshteyn]
 */
/**יבוא הפונקציות */
import { createDeck, shuffle, drawCard,createKindsDeck } from './gameLogic.js';

let deck=[];
let usedCards=[];
let kindsCards=[];
let card;
let player=0;
/**
 * פונקציית האתחול של המשחק.
 * יוצרת את החפיסת הקלפים, מערבבת אותה ויוצרת את חפיסת קלפי המלכים ומכינה את המשתנים לתחילת המשחק.
  *ועדכון השחקן הראשון כפעיל  
 */
const initGame=()=>{
    deck=createDeck();
    shuffle(deck);
    kindsCards=createKindsDeck();
    player=0;
}
/**אוביקט של מערכי לוחות השחחקנים לכל שחקן דוכם רכיבין ומערך לכרטיסי המלך */
let playersBoards=[{ingredients:[],kinds:[]},{ingredients:[],kinds:[]}];

/**
 * מטפלת בלוגיקה של שליפת קלף מהקופה ועדכון לוח השחקן.
 * הפונקציה בודקת שלושה מצבים:
 * 1. פיתה קרועה: איפוס הדוכן של השחקן הנוכחי.
 * 2. כפילות: העברת הקלף לערימת המשומשים.
 * 3. רכיב חדש: הוספה לדוכן ובדיקת השלמת מנה (7 רכיבים) לקבלת מלך.
 */
const handleDraw=()=>{
   card=drawCard()
   if(card==='broken pita')
       clearBoard(playersBoards[player].ingredients);
    else if(playersBoards[player].ingredients.includes(card))
              usedCards.push(card);
    else{
         playersBoards[player].ingredients.push(card);
         if(playersBoards[player].ingredients.length===7){
             playersBoards[player].kinds.push(kindsCards.pop());
             clearBoard(playersBoards[player].ingredients);
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
    const standId = `p${player + 1}Stand`;
    document.getElementById(standId).innerHTML = '';
 }
 


