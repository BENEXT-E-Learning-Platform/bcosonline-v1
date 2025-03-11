import axios from 'axios';
import { EmailAdapter, SendEmailOptions } from 'payload';

const brevoAdapter = (): EmailAdapter => {
  const adapter = () => ({
    name: 'brevo',
    defaultFromAddress: process.env.BREVO_SENDER_EMAIL as string,
    defaultFromName: process.env.BREVO_SENDER_NAME as string,
    sendEmail: async (message: SendEmailOptions): Promise<unknown> => {
      // Check if Brevo email adapter is active
      if (!process.env.BREVO_EMAIL_ACTIVE) {
        console.warn('Brevo email adapter is not active');
        return;
      }

      try {
        // Validate required fields
        if (!message.to || !message.subject || !message.html) {
          throw new Error('Missing required email fields');
        }

        const res = await axios({
          method: 'post',
          url: 'https://api.brevo.com/v3/smtp/email',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
            'accept': 'application/json'
          },
          data: {
            sender: {
              name: process.env.BREVO_SENDER_NAME as string,
              email: process.env.BREVO_SENDER_EMAIL as string,
            },
            to: [
              {
                email: message.to, // Change 'name' to 'email'
                name: message.to, // Optional: you can keep the name if needed
              }
            ],
            subject: message.subject,
            htmlContent: message.html,
          },
        });
        
        return res.data;
      } catch (error) {
        console.error('Brevo email adapter error:', error);
        throw error; // Re-throw to allow Payload to handle the error
      }
    }
  });

  return adapter;
};

export default brevoAdapter;