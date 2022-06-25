import { Router } from 'express';
import {
  addTask,
  removeTask,
  updateTask,
  markIsDone,
  unmarkIsDone,
} from '../../../controllers/tasks';

import {
  validateCreate,
  validateUpdate,
  validateMarkIsDone,
  validateUnMarkIsDone,
  validateId,
} from './validation.js';
import guard from '../../../middlewares/guard';

const router = new Router();

router.post('/', [guard, validateCreate], addTask);

router.delete('/:id', [guard, validateId], removeTask);

router.patch('/:id', [guard, validateId, validateUpdate], updateTask);

router.get(
  '/:id/markIsDone',
  [guard, validateId, validateMarkIsDone],
  markIsDone,
);

router.get(
  '/:id/unmarkIsDone',
  [guard, validateId, validateUnMarkIsDone],
  unmarkIsDone,
);

export default router;
