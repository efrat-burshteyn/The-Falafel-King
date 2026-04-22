/**
 * @fileoverview פונקציות עזר לניהול נתוני המשחק.
 * @author [Efrat Burshteyn]
 */

/**
 * בודק אם שמות השחקנים תקינים ושונים זה מזה.
 * @param {string} name1 - שם שחקן א'.
 * @param {string} name2 - שם שחקן ב'.
 * @returns {boolean} - אמת אם השמות תקינים.
 */
export const validatePlayers = (name1, name2) => {
    return name1.length >= 2 && name2.length >= 2 && name1 !== name2;
};