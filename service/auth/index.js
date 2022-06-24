import jwt from 'jsonwebtoken';
import Users from '../../repository/users';
const SECRET_KEY = process.env.JWT_SECRET_KEY;
class AuthService {
  async isUserExist(email, username) {
    const userEmail = await Users.findByEmail(email);
    const userName = await Users.findByUsername(username);
    return !!userEmail || !!userName;
  }

  async isUserWithToken(confirmationToken) {
    const user = await Users.findByToken(confirmationToken);
    return user;
  }

  async create(body) {
    const { username, email, confirmedAt, confirmationToken } =
      await Users.create(body);
    return { username, email, confirmedAt, confirmationToken };
  }

  async getUser(email, password) {
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !user?.confirmedAt) {
      return null;
    }
    return user;
  }

  async findByEmail(email) {
    const user = await Users.findByEmail(email);
    return user;
  }

  getToken(user) {
    const { id, email } = user;
    const payload = { id, email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
    return token;
  }

  async setToken(id, token) {
    await Users.updateToken(id, token);
  }

  async verify(userId) {
    await Users.verify(userId);
  }
}

export default AuthService;
