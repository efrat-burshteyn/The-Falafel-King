/**
 * @fileoverview ניהול והצגת לוח השיאים של המשחק.
 * @author [Efrat Burshteyn]
 */

/**
 * פונקציה המציגה את השיאים השמורים בטבלה.
 */
const renderScores = () => {
    const tableBody = document.getElementById('highScoresBody');
    if (!tableBody) return;

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    const rawData = localStorage.getItem('falafelHighScores');
    const records = rawData ? JSON.parse(rawData) : [];
    //ממינת מהגדול לקטן לפי כמות קלפי המלך
    records.sort((a, b) => b.userScore - a.userScore);
    if (records.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.textContent = 'טרם נרשמו שיאים במערכת.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
    }