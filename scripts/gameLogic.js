 /**
 * @fileoverview פונקציות עזר לניהול המשחק.
 * @author [Efrat Burshteyn]
 */
 /**מערך סוגי הקלפים */
const ingredients=['chips','falafel','humus','pickles','pita','salad','tahini','broken pita','kind'];
 /**מערך קלפי המשחק */
let deck=[];
let kindsDeck=[];
/**
 * יוצרת את חפיסת הקלפים למשחק.
 * הפונקציה ממלאת את המערך ב-20 עותקים מכל מרכיב תקין,
 * ומוסיפה "פיתות קרועות" בהתאם לרמת הקושי שנשמרה בזיכרון.
 * * @returns {void} הפונקציה מעדכנת את המערך הגלובלי deck.
 */
export const createDeck = () =>{
    let k=0,t=7;
    const level=sessionStorage.getItem('selectedLevel');
  for(let i=0; i<20; i++){
        for(let j=0; j<7; j++ ){
        deck[k++]=ingredients[j];
    }
}
    let brokenCard=0;
    if(level==='easy')
         brokenCard=8;
    else{
        brokenCard=16
        }
        for(let i=0;i<brokenCard;i++)
        deck.push(ingredients[t]);
    } 
    /**
 * יוצרת את חפיסת "מלכי הפלאפל" (המיוחדים).
 * הפונקציה ממלאת מערך ייעודי ב-20 קלפי מלך מתוך רשימת המרכיבים,
 * אותם השחקן יוכל לקבל רק לאחר השלמת מנה מלאה.
 */
   export const createKindsDeck=()=>{
     let z=8
    for(let i=0; i<20; i++)
        kindsDeck.push(ingredients[z])
   }
    

/**
 * מערבבת את חפיסת הקלפים.
 * הפונקציה עוברת על כל איברי המערך ומחליפה כל איבר עם איבר במיקום אקראי.
 * @param {Array} deck - מערך קלפי המשחק.
 */
export const shuffle=(deck)=>{
    for(let i=0; i<deck.length; i++){
        const j=Math.floor(Math.random()*deck.length);
        [deck[i],deck[j]]= [deck[j],deck[i]];   
    }
}
/**
 * שולפת ומחזירה את הקלף האחרון מהחפיסה.
 * הפונקציה מקצרת את המערך ב-1 בכל שליפה.
 * @param {Array} deck - מערך קלפי המשחק.
 * @returns {string} - שם המרכיב שנשלף (למשל: 'chips').
 */
export const drawCard = (deck) =>{
    return deck.pop();
}