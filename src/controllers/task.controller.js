import { Task } from '../models/tasks/taskModel.js';

export const createTask = async (req, res) => {
  try {
    const { taskTitle, taskDueDate, taskPriority } = req.body;
    const studentId = req.user._id;

    if (!taskTitle || !taskPriority) {
      return res.status(400).json({
        success: false,
        message: 'Task title and priority are required',
      });
    }

    const task = await Task.create({
      student: studentId,
      taskTitle: taskTitle.trim(),
      taskStatus: 'Pending',
      taskDueDate: taskDueDate ? new Date(taskDueDate) : undefined,
      taskPriority,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: {
        _id: task._id,
        taskTitle: task.taskTitle,
        taskStatus: task.taskStatus,
        taskDueDate: task.taskDueDate,
        taskPriority: task.taskPriority,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ student: req.user._id })
      .sort({ taskPriority: 1, taskDueDate: 1 });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks',
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskStatus } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(taskStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task status',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, student: req.user._id },
      { taskStatus },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
};

export const updateTaskPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskPriority } = req.body;

    if (!['High', 'Medium', 'Low'].includes(taskPriority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task priority',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, student: req.user._id },
      { taskPriority },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task priority updated',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, student: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task',
    });
  }
};
