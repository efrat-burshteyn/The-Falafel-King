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
    };
    //  הוספת שורות  textContent 
    records.forEach((record, index) => {
        const row = document.createElement('tr');

        // יצירת תאים והכנסת טקסט נקי
        const cellRank = document.createElement('td');
        cellRank.textContent = index + 1;

        const cellName = document.createElement('td');
        cellName.textContent = record.userName;

        const cellScore = document.createElement('td');
        cellScore.textContent = record.userScore;

        const cellDate = document.createElement('td');
        cellDate.textContent = record.date;

        // חיבור התאים לשורה
        row.appendChild(cellRank);
        row.appendChild(cellName);
        row.appendChild(cellScore);
        row.appendChild(cellDate);
        // חיבור השורה לטבלה
        tableBody.appendChild(row);
    });
};
const btnHome = document.getElementById('btnHome');
if (btnHome) {
    btnHome.addEventListener('click', () => {
        window.location.href = '../enter.html'; // וודא שהשם והנתיב נכונים
    });
}