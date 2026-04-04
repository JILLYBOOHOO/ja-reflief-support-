const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Submit a hazard report
router.post('/report', upload.array('pictures', 5), async (req, res, next) => {
  try {
    const { reporterName, dangerType, description, location, mediaLink } = req.body;
    const mediaPaths = req.files ? req.files.map(f => f.filename).join(',') : null;

    const sql = `
      INSERT INTO hazard_reports (reporterName, dangerType, description, location, mediaPath, mediaLink)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      reporterName || 'Anonymous',
      dangerType,
      description,
      location,
      mediaPaths,
      mediaLink
    ]);

    res.status(201).json({ message: 'Hazard report submitted successfully', reportId: result.insertId });
  } catch (err) {
    next(err);
  }
});

// Get all hazard reports (for admin)
router.get('/all', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM hazard_reports ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Update status (Approve/Resolve)
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE hazard_reports SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
