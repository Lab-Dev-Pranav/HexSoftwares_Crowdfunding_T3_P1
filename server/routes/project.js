import express from 'express';
import Project from '../models/Project.js';
import Contribution from '../models/Contribution.js';
import Update from '../models/Update.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/top-invested', async (req, res) => {
  try {
    const project = await Project.findOne({ status: 'active' })
      .sort({ currentAmount: -1 })
      .populate('creatorId', 'name username email');
    if (!project) return res.status(404).json({ message: 'No active projects found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top invested project', error: err.message });
  }
});

// get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('creatorId', 'name username email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
});




// Contribute to a project
router.post('/:id/contribute', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid contribution amount' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const maxContribution = project.goalAmount - project.currentAmount;
    if (amount > maxContribution) {
      return res.status(400).json({ message: `You can contribute up to ${maxContribution}` });
    }
    project.currentAmount += amount;
    await project.save();
    const returnAmount = amount + (amount * 0.05);
    const contributionRecord = await Contribution.create({
      projectId: project._id,
      userId: req.user.id || req.user._id,
      amount,
      paymentStatus: 'success',
      transactionId: '',
      returnAmount,
    });
    const updated = await Project.findById(project._id).populate('creatorId', 'name username email');
    res.json({ project: updated, contribution: contributionRecord });
  } catch (err) {
    res.status(500).json({ message: 'Contribution failed', error: err.message });
  }
});

// create a project update
router.post('/:id/updates', authenticate, requireCreator, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const update = await Update.create({
      projectId: project._id,
      title,
      content,
    });
    res.status(201).json(update);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create update', error: err.message });
  }
});

// get all updates for a project
router.get('/:id/updates', async (req, res) => {
  try {
    const updates = await Update.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch updates', error: err.message });
  }
});

// get a single update by update id
router.get('/updates/:updateId', async (req, res) => {
  try {
    const update = await Update.findById(req.params.updateId);
    if (!update) return res.status(404).json({ message: 'Update not found' });
    res.json(update);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch update', error: err.message });
  }
});

router.get('/:id', async (req, res) => {

  const project = await Project.findById(req.params.id).populate('creatorId', 'name username email');
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
});


router.get('/:id/contributions', async (req, res) => {
  try {
    const contributions = await Contribution.find({ projectId: req.params.id })
      .populate('userId', 'name username email');

    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch contributions', error: err.message });
  }
});



async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Invalid token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function requireCreator(req, res, next) {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user || user.role !== 'creator') {

      return res.status(403).json({ message: 'Only creators can perform this action' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'User role check failed' });
  }
}


router.post('/', authenticate, requireCreator, async (req, res) => {
  try {
    const { title, description, goalAmount, category, deadline, creatorId, returnPercentage } = req.body;
    if (!title || !description || !goalAmount || !creatorId || returnPercentage === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (creatorId !== req.user.id && creatorId !== req.user._id) {
      return res.status(403).json({ message: 'creatorId mismatch' });
    }
    const projectData = { title, description, goalAmount, category, creatorId, returnPercentage };
    if (deadline) projectData.deadline = deadline;
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
});


router.put('/:id', authenticate, requireCreator, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });


    const userId = req.user.id || req.user._id;
    if (String(project.creatorId) !== String(userId)) {
      return res.status(403).json({ message: 'Only the creator can edit this project' });
    }

    
    const { title, description, goalAmount, category, deadline, status } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (goalAmount !== undefined) project.goalAmount = goalAmount;
    if (category !== undefined) project.category = category;
    if (deadline !== undefined) project.deadline = deadline;
    if (status !== undefined) project.status = status;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Not found' });
  
  res.json({ message: 'Deleted' });
});

export { router as default };
