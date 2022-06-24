import User from '../model/user';

const findById = async id => {
  return await User.findById(id);
};

const findByUsername = async username => {
  return await User.findOne({ username });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findByToken = async confirmationToken => {
  return await User.findOne({ confirmationToken });
};

const create = async body => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const verify = async userId => {
  return await User.updateOne(
    { _id: userId },
    { confirmationToken: null, confirmedAt: true },
  );
};

export default {
  findById,
  findByUsername,
  findByEmail,
  findByToken,
  create,
  updateToken,
  verify,
};
