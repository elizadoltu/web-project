const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');
const PDFDocument = require('pdfkit');

module.exports = function generatePDF(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get('email');

    if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email is required' }));
        return;
    }

    const sql = `
        SELECT 
            users.username, 
            users.email, 
            users.password, 
            user_allergies.allergies, 
            users.vegan, 
            users.vegetarian 
        FROM 
            users 
        LEFT JOIN 
            user_allergies 
        ON 
            users.email = user_allergies.email
        WHERE 
            users.email = ?
    `;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error retrieving user', details: err.message }));
            return;
        }

        const doc = new PDFDocument();
        let filename = 'user.pdf';
        filename = encodeURIComponent(filename);
        res.setHeader('Content-Disposition', 'attachment;filename="' + filename + '"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(18).text('User Statistics', { align: 'center' });
        doc.moveDown();

        rows.forEach(row => {
            doc.fontSize(12).text(`Username: ${row.username}`);
            doc.text(`Email: ${row.email}`);
            doc.text(`Password: ${row.password}`);
            doc.text(`Allergies: ${row.allergies}`);
            doc.text(`Vegan: ${row.vegan}`);
            doc.text(`Vegetarian: ${row.vegetarian}`);
            doc.moveDown();
        });

        doc.end();
    });
};
