//controllers/taskController.js

const Task = require('../models/task');
const User = require ('../models/User');
const redis = require('../config/redis');
const cloudinary = require('../config/cloudinary');

//POST Create and Assign task
exports.createTask = async (req, res) => {

	try {
		//user id requesting to create note
		const userId = req.user._id;

    	const { title, description, assignedTo, dueDate } = req.body;

    	if (!title) 
      		return res.status(400).json({ message: 'Title is required' });
    	
    	// email to user
	    const assignee = await User.findOne({ email: assignedTo });
	    if (!assignee)
	      return res.status(404).json({ message: 'Assigned user not found' });


	    const attachments =
	      req.files?.taskAttachments?.map(file => ({
	        url: file.path,
	        publicId: file.filename,
	        type: file.mimetype
	      })) || [];

	    const task = await Task.create({
	      title,
	      description,
	      assignedTo: assignee._id,
	      dueDate,
	      attachments,
	      createdBy: req.user._id
	    });

	    //delete redis cache
	    await redis.del(`tasks:${userId}`);
	    await redis.del(`tasks:${assignedTo}`);

	    res.status(201).json({ 
	    	message: 'Task created successfully!', 
	    	task 
	    });

  	} catch (err) {
    	res.status(500).json({ message: err.message });
	}
};


//GET  Retrive my Task 
exports.getMyTask = async (req, res) => {
	try { 

		const userId = req.user._id;

		//check tasks related to userId in redis
		const cacheKey = `tasks:${req.user._id}`;

		//get cached task key
		const cached = await redis.get(cacheKey);
    	if (cached) 
    		return res.json(JSON.parse(cached));

    	//Get my Tasks or the ones assigned to mine
    	const tasks = await Task.find({ 
    									$or: [
											{ assignedTo: userId },
										    { createdBy: userId }
										]
									})
      										.sort({ createdAt: -1 })
     										.populate('createdBy', 'name email');

     	//add and set task to redis after
		await redis.setex(cacheKey, 300, JSON.stringify(tasks));

		res.json(tasks);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//GET  Get Task by Id
exports.getTaskById = async (req, res) => {
	try {

		//check for task key
		const cacheKey = `task:${req.params.id}`;

		//get task in redis
		const cached = await redis.get(cacheKey);
	  	if (cached) 
	    	return res.json(JSON.parse(cached));
		
		//Get task by id
		const task = await Task.findById(req.params.id)
								.populate('assignedTo', 'name email')
      							.populate('createdBy', 'name email');
		
		if(!task)
			return res.status(404).json({ message: 'Task not found!' });

		//set to redis
		await redis.setex(cacheKey, 300, JSON.stringify(task));

		res.json(task);

	} catch (err) {
		res.status(500).json({ message: err.message });	
	}
};


//GET  Get all tasks (admin)
exports.getAllTask = async (req, res) => {
	try { 
		const { page = 1, limit = 10, title } = req.query;
		const query = {};

		if(title)
			query.title = title;

		const skip = (page - 1) * limit;

		const task = await Task.find(query)
							.populate('assignedTo', 'name email role')
							.populate('createdBy', 'name email')
							.skip(skip)
							.limit(parseInt(limit))
							.sort({createdAt: -1});

		//count total Task
		const totalTask = await Task.countDocuments(query);

		//total pages
		const totalPages = Math.ceil (totalTask / limit);

		res.json({
			task,
			pages: parseInt(page),
			totalTask,
			totalPages
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//PUT Update Task Status
exports.updateTaskStatus = async (req, res) => {
  	try {
    	const { status } = req.body;

    	//Find Task
    	const task = await Task.findById(req.params.id);
    	if (!task) 
    		return res.status(404).json({ message: 'Task not found' });

    	//Accessing must be task assigned to or admin
    	if (
      		task.assignedTo.toString() !== req.user._id.toString() &&
      		req.user.role !== 'admin'
    	) {
      		return res.status(403).json({ message: 'Not authorized, you have to be task assignedTo or admin' });
    	}

    	//allowed status
    	const allowed = ['pending', 'in-progress', 'completed'];
    	if (!allowed.includes(status))
    		return res.status(400).json({ message: 'Allowed status: pending, in-progress, completed'});

    	//Update status
    	task.status = status || task.status;
    	await task.save();

    	//Delete or Invalidate the task cache
    	await redis.del(`tasks:${task.assignedTo}`);

    	res.json({ 
    		message: 'Task updated', 
    		task 
    	});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//PUT Update task by the creator
exports.updateTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if(!task)
			return res.status(404).json({ message: 'Task not found!'});

		//Accessing must be task creator to or admin
    	if (
      		task.createdBy.toString() !== req.user._id.toString() &&
      		req.user.role !== 'admin'
    	) {
      		return res.status(403).json({ message: 'Not authorized, you must be admin or the task created by you' });
    	}

    	//Details to update
    	const allowed = [ 'title', 'description', 'assignedTo', 'dueDate' ];

    	[ 'title', 'description', 'assignedTo', 'dueDate' ].forEach(field => {
    		if (req.body[field] !== undefined) note[field] = req.body[field];
    	});

    	const files = req.files?.taskAttachments || [];

		if (files.length > 0) {
		  note.attachments = files.map(file => ({
		    url: file.path,
		    publicId: file.filename,
		    type: file.mimetype
		  }));
		}

		await task.save();

		//Delete or Invalidate the task cache for user owner
    	await redis.del(`tasks:${req.user._id}`);

    	//Delete or Invalidate the task cache
  		await redis.del(`task:${req.params.id}`);  //or task._id

  		res.status(200).json({
  			message: 'Task updated successfully!',
  			task
  		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//DELETE  Delete Task
exports.deleteTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if(!task)
			return res.status(404).json({ message: 'Task not found!' });

	//Deelete access must be task owner or admin
	if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized, You must be admin or Task creator' });
    }

    //Delete Task
    await task.deleteOne();

    //Delete assined to task
    await redis.del(`tasks:${task.assignedTo}`);

    //Delete creator task redis
    await redis.del(`tasks:${req.user._id}`);

    //Delete or invalidate the task cache
    await redis.del(`task${req.params.id}`);

    res.status(200).json({ message: 'Task deleted successfully!'});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};