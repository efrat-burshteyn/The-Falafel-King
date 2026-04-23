/**
 * @fileoverview ניהול דף ההוראות של המשחק "מלך הפלאפל".
 * הסקריפט נטען עם מאפיין defer לשיפור ביצועי הטעינה.
 * @author [Efrat Burshteyn]
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /** @type {HTMLButtonElement} - רפרנס לכפתור החזרה למסך הבית */
    const backBtn = document.querySelector('#backToHome');

    /**
     * פונקציה לניווט חזרה לדף הבית.
     * @returns {void}
     */
    const navigateToHome = () => {
        window.location.href = '../enter.html';
    };

    // בדיקה שהאלמנט קיים לפני הצמדת המאזין
    if (backBtn) {
        backBtn.addEventListener('click', navigateToHome);
    }
});