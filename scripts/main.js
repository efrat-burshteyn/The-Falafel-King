/**
 * @fileoverview הקובץ הראשי לניהול דף הכניסה.
 * @author [Efrat Burshteyn]
 */

// ייבוא הפונקציות מקובץ העזרים
import { validatePlayers, saveGameData } from './utils.js';

/**
 * פונקציה ראשית המאותחלת עם טעינת ה-DOM.
 * מגדירה את המאזינים לכפתורי הרמה ולטופס הכניסה.
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const errorDiv = document.querySelector('#errorMessage');
    let selectedLevel = 'easy';
    /**
     * מאזין ללחיצה על כפתורי בחירת רמה.
     * מעדכן את המשתנה selectedLevel לפי ה-data-attribute של הכפתור.
     */
    document.querySelectorAll('.lvl-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedLevel = e.target.dataset.level;
            
            // עדכון ויזואלי של הכפתור הנבחר
            document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    /**
     * מטפל באירוע שליחת הטופס.
     * מבצע אימות שמות, שמירה לזיכרון ומעבר לדף המשחק.
     * @param {Event} event - אובייקט האירוע של שליחת הטופס.
     */
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // מניעת רענון הדף

        const name1 = document.querySelector('#p1').value.trim();
        const name2 = document.querySelector('#p2').value.trim();

        if (validatePlayers(name1, name2)) {
            const config = {
                player1: name1,
                player2: name2,
                level: selectedLevel
            };
    saveGameData(config);

            // מעבר לדף המשחק
            window.location.href = `pages/game.html?level=${selectedLevel}`;
        } else {
            errorDiv.textContent = "השמות חייבים להיות שונים ובני 2 תווים לפחות.";
        }
    });
});