import { HttpCode } from '../../lib/constants.js';
import AuthService from '../../service/auth/';
import { EmailService, SenderNodemailer } from '../../service/email';
const authService = new AuthService();

const registration = async (req, res, next) => {
  const { username, email } = req.body;
  const isUserExist = await authService.isUserExist(email, username);
  if (isUserExist) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email or Username in use',
    });
  }

  const data = await authService.create(req.body);
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderNodemailer(),
  );

  const isSend = await emailService.sendVerifyEmail(
    email,
    username,
    data.confirmationToken,
  );
  delete data.confirmationToken;
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.CREATED,
    user: { ...data, isVerifyEmailSended: isSend },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password);

  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Wrong email, password or confirmation',
    });
  }
  const token = authService.getToken(user);
  await authService.setToken(user.id, token);

  const { username } = user;
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { token, user: { username, email } },
  });
};

const logout = async (req, res, next) => {
  await authService.setToken(req.user.id, null);
  res.status(HttpCode.NO_CONTENT).json({
    status: 'success',
    code: HttpCode.NO_CONTENT,
    data: {},
  });
};

const verification = async (req, res, next) => {
  const { confirmationToken } = req.params;

  const user = await authService.isUserWithToken(confirmationToken);

  if (user) {
    await authService.verify(user.id);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Verification successful',
    });
  }

  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'User not found',
  });
};

const repeatVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await authService.findByEmail(email);
  if (user) {
    if (user.confirmedAt) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Verification has already been passed',
      });
    }

    const { username, email, confirmationToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderNodemailer(),
    );

    const isSend = await emailService.sendVerifyEmail(
      email,
      username,
      confirmationToken,
    );

    if (isSend) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Success',
        isVerifyEmailSended: isSend,
      });
    }

    return res.status(HttpCode.UE).json({
      status: 'error',
      code: HttpCode.UE,
      message: 'Unprocessable Entity',
    });
  }

  return res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'User with email not found',
  });
};

export { registration, login, logout, verification, repeatVerificationEmail };
