//routes/noteRoutes.js

const express = require("express");
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { noteUpload } = require('../middleware/upload');
const {
	createNote, getUserNote, getNote,
	getAllNotes, updateNote, deleteNote
} = require('../controllers/noteController');



/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: CRUD operations for user notes
 */

/**
 * @swagger
 * /notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create a new note for the logged-in user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Meeting notes
 *               content:
 *                 type: string
 *                 example: Discussed project milestones
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [project, meeting]
 *               noteAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Missing title or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     tags: [Notes]
 *     summary: Retrieve all notes of the logged-in user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's notes
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Retrieve a single note by its ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /allNotes:
 *   get:
 *     tags: [Notes]
 *     summary: Retrieve all notes (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notes per page
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter notes by tags
 *     responses:
 *       200:
 *         description: List of all notes with pagination
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Update a note (owner or admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               content:
 *                 type: string
 *                 example: Updated content
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [updated, notes]
 *               noteAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       403:
 *         description: Not authorized to update
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note (owner or admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       403:
 *         description: Not authorized to delete
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */




router.post(
	'/notes', 
	protect,
	noteUpload.fields([
    	{ name: 'noteAttachments', maxCount: 10 }
  	]), 
	createNote
	);
router.get('/notes', protect, getUserNote);
router.get('/notes/:id', protect, getNote);
router.get('/allNotes', protect, admin, getAllNotes);
router.put(
  '/notes/:id',
  protect,
  noteUpload.fields([{ name: 'noteAttachments', maxCount: 10 }]),
  updateNote
);
router.delete('/notes/:id', protect, deleteNote);

module.exports = router;