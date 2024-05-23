declare interface EmailMessage {
  id: int,
  created_at: string,
  email: string,
  email_timestamp: string,
  subject: string,
  from: string,
  content: string,
  valid: boolean,
  tag: boolean | null,
  tagger: string | null,
  tag_timestamp: string | null,
}
declare interface HistoryItem {
  oldValue: EmailMessage,
  newValue: EmailMessage,
  text: string,
  timestamp: Date,
  allowUndo: boolean,
}