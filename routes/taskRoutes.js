//routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { taskUpload } = require('../middleware/upload');
const {
	createTask, getMyTask, getTaskById,
	getAllTask, updateTaskStatus, updateTask, deleteTask
} = require('../controllers/taskController');



/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints (create, assign, update, delete)
 */

/**
 * @swagger
 * /task:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task and assign to a user
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
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish report
 *               description:
 *                 type: string
 *                 example: Complete the financial report
 *               assignedTo:
 *                 type: string
 *                 description: Email of the user to assign task
 *                 example: user@example.com
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-01
 *               taskAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing title or validation error
 *       404:
 *         description: Assigned user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Retrieve all tasks for the logged-in user (created or assigned)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Retrieve a task by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /allTasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Retrieve all tasks (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title
 *     responses:
 *       200:
 *         description: List of all tasks with pagination
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task status (assigned user or admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 */




router.post(
	'/task', 
	protect,
	taskUpload.fields([
    	{ name: 'taskAttachments', maxCount: 10 }
  	]),
  	createTask 
  	);

router.get('/tasks', protect, getMyTask);
router.get('/tasks/:id', protect, getTaskById);
router.get('/allTasks', protect, admin, getAllTask);
router.put(                                              //update task status
	'/tasks/:id',
	protect,
	taskUpload.fields([
    	{ name: 'taskAttachments', maxCount: 10 }
  	]),
  	updateTaskStatus
	);

router.put(                                             //update task fields
	'/task/:id',
	protect,
	taskUpload.fields([
    	{ name: 'taskAttachments', maxCount: 10 }
  	]),
  	updateTask
	);


router.delete('/tasks/:id', protect, deleteTask);


module.exports = router;
