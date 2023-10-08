export type EmailArgs = {
  to: string;
  from?: string;
  subject: string;
  html: string;
};

export interface EmailProvider {
  send(args: EmailArgs);
}
