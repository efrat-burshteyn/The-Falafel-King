 /**
 * @fileoverview פונקציות עזר לניהול המשחק.
 * @author [Efrat Burshteyn]
 */
 /**מערך סוגי הקלפים */
const ingredients=['chips','falafel','humus','pickles','pita','salad','tahini','broken pita','king'];
 /**מערך קלפי המשחק */
let deck=[];
let kingsDeck=[];
/**
 * יוצרת את חפיסת הקלפים למשחק.
 * הפונקציה ממלאת את המערך ב-20 עותקים מכל מרכיב תקין,
 * ומוסיפה "פיתות קרועות" בהתאם לרמת הקושי שנשמרה בזיכרון.
 * * @returns {void} הפונקציה מעדכנת את המערך הגלובלי deck.
 */
export const createDeck = () =>{
    let k=0,t=7;
    const level=sessionStorage.getItem('gameSettings');
    deck=[];
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
    return deck;
    } 
    /**
 * יוצרת את חפיסת "מלכי הפלאפל" (המיוחדים).
 * הפונקציה ממלאת מערך ייעודי ב-20 קלפי מלך מתוך רשימת המרכיבים,
 * אותם השחקן יוכל לקבל רק לאחר השלמת מנה מלאה.
 */
   export const createKingsDeck=()=>{
     let z=8;
     kingsDeck=[];
    for(let i=0; i<20; i++)
        kingsDeck.push(ingredients[z]);
    return kingsDeck;
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
};
/**
 * פונקציה השומרת את נתוני המנצח בזיכרון המקומי.
 * @param {string} name - שם השחקן המנצח.
 * @param {number} score - מספר המלכים שצבר.
 */
  export const saveToHighScores = (name, score) => {
    // שליפת נתונים קיימים מהאחסון המקומי
    const rawData = localStorage.getItem('falafelHighScores');
    
    // המרת הנתונים למערך -parseאו יצירת מערך חדש אם אין נתונים
    const records = rawData ? JSON.parse(rawData) : [];

    // יצירת אובייקט עם נתוני המנצח והתאריך הנוכחי
    const newRecord = {
        userName: name,
        userScore: score,
        date: new Date().toLocaleDateString()
    };

    // הוספת הרשומה החדשה לרשימה
    records.push(newRecord);

    // שמירה חזרה לזיכרון המקומי בפורמט טקסטואלי (JSON)
    localStorage.setItem('falafelHighScores', JSON.stringify(records));
};
