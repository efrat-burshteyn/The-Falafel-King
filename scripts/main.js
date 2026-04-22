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
    