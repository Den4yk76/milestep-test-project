import Task from '../model/task';

const removeTask = async (userId, taskId) => {
  const result = await Task.findOneAndRemove({
    _id: taskId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email',
  });
  return result;
};

const addTask = async (userId, body) => {
  const result = await Task.create({ ...body, owner: userId });
  return result;
};

const updateTask = async (userId, taskId, body) => {
  const result = await Task.findOneAndUpdate(
    {
      _id: taskId,
      owner: userId,
    },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'email',
  });
  return result;
};

const markIsDone = async (userId, taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });

  if (!task.isDone) {
    const result = await Task.findOneAndUpdate(
      {
        _id: taskId,
        owner: userId,
      },
      { isDone: true },
      { new: true },
    ).populate({
      path: 'owner',
      select: 'username',
    });
    return result;
  } else return false;
};

const unmarkIsDone = async (userId, taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });

  if (task.isDone) {
    const result = await Task.findOneAndUpdate(
      {
        _id: taskId,
        owner: userId,
      },
      { isDone: false },
      { new: true },
    ).populate({
      path: 'owner',
      select: 'username',
    });
    return result;
  } else return false;
};

export default {
  removeTask,
  addTask,
  updateTask,
  markIsDone,
  unmarkIsDone,
};
