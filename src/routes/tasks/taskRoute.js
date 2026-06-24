import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskDetails,
  deleteTask,
} from '../../controllers/task.controller.js';
import { verifyToken } from '../../middlewares/middleware.js';

const router = Router();

router.use(verifyToken);

router.route('/').get(getTasks).post(createTask);
router.route('/:id/status').patch(updateTaskStatus);
router.route('/:id/priority').patch(updateTaskPriority);
router.route('/:id').patch(updateTaskDetails).delete(deleteTask);


export default router;
