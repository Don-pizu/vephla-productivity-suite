//controllers/noteController.js

const User = require('../models/User');
const Note = require('../models/note');
const redis = require('../config/redis');
const cloudinary = require('../config/cloudinary');


//POST   Create note linked to a user
exports.createNote = async (req, res) => {
	try {

		 // delete attachments
    	delete req.body.attachments;
    	delete req.body.noteAttachments;

		//user id requesting to create note
		const userId = req.user._id;

		const { title, content } = req.body;
    	const tags = req.body.tags
      		? Array.isArray(req.body.tags)
        	? req.body.tags
        	: [req.body.tags]
      	: [];


		//validate title
		if (!title)
			return res.status(400).json({ message: 'Title is required for creating a note'});

		//Handle cloudinary upload for attachment
		const files = req.files?.noteAttachments || [];

		const attachments = files.map(file => ({
		  url: file.path,
		  publicId: file.filename,
		  type: file.mimetype
		}));

		//Create note
		const createNote = await Note.create ({
			user: userId,
			title,
			content,
			tags,
			attachments
		}); 

		//delete redis cache
		await redis.del(`notes:${userId}`);

		res.status(201).json({
			message: 'Note created successfully!',
			createNote
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

//GET  Retrive note relating to the user
exports.getUserNote = async (req,res) => {
	try {
		const userId = req.user._id;

		//check notes related to a user id in redis
		const cacheKey = `notes:${userId}`;

		//get cached note key
		const cached = await redis.get(cacheKey);
		if (cached)
			return res.json(JSON.parse(cached));

		//find notes related to a userId and sort 
		const notes = await Note.find({ user: userId })
								.sort({ createdAt: -1});

		//add and set it to redis after
		await redis.setex(cacheKey, 300, JSON.stringify(notes));   //5 mins

		res.json(notes);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

//GET Retrive note by id
exports.getNote = async (req, res) => {
	try {
		const cacheKey = `note:${req.user.id}`;

		//get cached note
		const cached = await redis.get(cacheKey);
	  	if (cached) 
	    	return res.json(JSON.parse(cached));

	    //find note by id
		const note = await Note.findById(req.params.id);
		if(!note)
			return res.status(404).json({ message: 'Note not found'});

		await redis.setex(cacheKey, 300, JSON.stringify(note) ); // 5 min

		res.json(note);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//GET Retrive all notes
exports.getAllNotes = async (req, res) => {
	try {

		const { page = 1, limit = 10, tags} = req.query;
		const query = {};

		if(tags)
			query.tags = tags;

		const skip = (page - 1) * limit;

		const note = await Note.find(query)
							.populate('user', 'name email role')
							.skip(skip)
							.limit(parseInt(limit))
							.sort({createdAt: -1});

		//count total Notes
		const totalNotes = await Note.countDocuments(query);

		//total pages
		const totalPages = Math.ceil (totalNotes / limit);

		res.json({
			note,
			pages: parseInt(page),
			totalNotes,
			totalPages
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//PUT Update note
exports.updateNote = async (req, res) => {
	try {

		//remove Multer-injected strings
    	delete req.body.attachments;
    	delete req.body.noteAttachments;

		const note = await Note.findById(req.params.id);

		if(!note)
			return res.status(404).json({ message: 'NOte not found!'});

		//Allow only note owner to update
		if (
			note.user.toString() !== req.user._id.toString() &&
			req.user.role !== 'admin'
		) {
			return res.status(403).json({ message: 'Not authorized' });
		}

		//Copy all the field(details) in the note 
		const allowed = ['title', 'content', 'tags'];
		//Object.assign(note, pick(req.body, allowed));
		//Object.assign(note, req.body);
		['title', 'content', 'tags'].forEach(field => {
      		if (req.body[field] !== undefined) note[field] = req.body[field];
    	});

		const files = req.files?.noteAttachments || [];

		if (files.length > 0) {
		  note.attachments = files.map(file => ({
		    url: file.path,
		    publicId: file.filename,
		    type: file.mimetype
		  }));
		}

		await note.save();

		//Delete or invalidate user's note list (redis for read not write)
		await redis.del(`notes:${req.user._id}`);

		//Delete or Invalidate the single-note cache
  		await redis.del(`note:${req.params.id}`);


		res.status(200).json({ 
			message: 'Note updated successfully!',
			note
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//DELETE delete note
exports.deleteNote = async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if(!note)
			return res.status(404).json({ message: 'Note not found!'});

		//Allow only note owner to update
		if (
			note.user.toString() !== req.user._id.toString() &&
			req.user.role !== 'admin'
		) {
			return res.status(403).json({ message: 'Not authorized' });
		}

		//delete note
		await note.deleteOne();

		//Delete or invalidate user's note list (redis for read not write)
		await redis.del(`notes:${req.user._id}`);

		//Delete or Invalidate the single-note cache
  		await redis.del(`note:${req.params.id}`);

		res.status(200).json({ message: "Note deleted successfully!"});		

	} catch (err) {
		res.status(500).json({ message: err.message});
	}
};