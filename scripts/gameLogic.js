 /**
 * @fileoverview פונקציות עזר לניהול המשחק.
 * @author [Efrat Burshteyn]
 */
 /**מערך סוגי הקלפים */
const ingredients=['chips','falafel','humus','pickles','pita','salad','tahini','broken pita'];
 /**מערך קלפי המשחק */
const deck=[];
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
    let kindCard=0;
    if(level==='easy')
         kindCard=8;
    else{
        kindCard=16
        }
    } 
    for(let i=0;i<kindCard;i++)
        deck.push(ingredients[t]);
    

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