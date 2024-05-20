declare interface EmailMessage {
  id: int,
  created_at: string,
  email: string,
  email_timestamp: string,
  content: string | null,
  valid: boolean,
  tag: boolean | null,
  tag_timestamp: string | null,
}