import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface UploadRequest {
  email: string;
  messages: {
    timestamp: string;
    subject: string;
    from: string;
    content: string;
  }[];
}

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
  const { email, messages } = await request.json() as UploadRequest;

  // Check if email is provided
  if (!email) {
    return json({ error: 'Missing email' }, { status: 400 });
  }

  // Check if messages are provided
  if (!messages || messages.length === 0) {
    return json({ error: 'Missing messages' }, { status: 400 });
  }

  // Check if messages have a timestamp
  const missingTimestamp = messages.filter(message => !message.timestamp);

  if (missingTimestamp.length > 0) {
    return json({ error: 'Invalid messages', messages: missingTimestamp }, { status: 400 });
  }

  // Format the messages to match the database schema
  const formattedMessages = messages.map(({ timestamp, subject, from, content }) => {
    return {
      email,
      email_timestamp: timestamp,
      subject,
      from,
      content,
      valid: true,
    }
  })
  
  // Save the email and messages to the database
  const { data, error } = await supabase
    .from('emails')
    .insert(formattedMessages)
    .select();

  if (error) {
    return json({ error }, { status: 500 });
  }

  return json({ success: true, data });
}