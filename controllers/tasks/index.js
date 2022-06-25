import repositoryTasks from '../../repository/tasks.js';
import { HttpCode } from '../../lib/constants.js';

const addTask = async (req, res, next) => {
  const { id: userId } = req.user;
  const newTask = await repositoryTasks.addTask(userId, req.body);
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.OK,
    data: { task: newTask },
  });
};

const removeTask = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const task = await repositoryTasks.removeTask(userId, id);
  if (task) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { task } });
  }
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const task = await repositoryTasks.updateTask(userId, id, req.body);
  if (task) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { task } });
  }
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
};

const markIsDone = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const task = await repositoryTasks.markIsDone(userId, id);
  if (task) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { task } });
  }
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'Already marked',
  });
};

const unmarkIsDone = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const task = await repositoryTasks.unmarkIsDone(userId, id);
  if (task) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { task } });
  }
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'Already marked',
  });
};

export { addTask, removeTask, updateTask, markIsDone, unmarkIsDone };
