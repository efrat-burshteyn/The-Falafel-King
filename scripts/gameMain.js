/**
 * @fileoverview פונקציות להצגת המשחק.
 * @author [Efrat Burshteyn]
 */
/**יבוא הפונקציות */
import { createDeck, shuffle, drawCard } from './gameLogic.js';

let deck=[];
let usedCards=[];
/**
 * פונקציית האתחול של המשחק.
 * יוצרת את החפיסה, מערבבת אותה ומכינה את המשתנים לתחילת המשחק.
 */
const initGame=()=>{
    deck=createDeck();
    shuffle(deck);
}


