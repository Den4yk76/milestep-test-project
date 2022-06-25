import Mailgen from 'mailgen';

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = 'https://b513-185-244-159-151.ngrok.io';
        break;
      case 'test':
        this.link = 'http://localhost:5000';
        break;
      case 'production':
        this.link = 'https://milestep-test-api.herokuapp.com';
        break;
      default:
        this.link = 'http://localhost:3000';
    }
  }

  createEmailTemplate(username, confirmationToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'MILESTEP-TEST-MAILING',
        link: this.link,
      },
    });

    const email = {
      body: {
        name: username,
        intro: "Welcome! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with our API, please click here:',
          button: {
            color: '#22BC66',
            text: 'Verify your account',
            link: `${this.link}/api/users/verify/${confirmationToken}`,
          },
        },
        outro: 'Thank you for being with us!',
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, username, confirmationToken) {
    const emailBody = this.createEmailTemplate(username, confirmationToken);
    const msg = {
      to: email,
      subject: 'Email verification',
      html: emailBody,
    };

    try {
      const result = await this.sender.send(msg);
      console.log('msg result ', result);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}

export default EmailService;
