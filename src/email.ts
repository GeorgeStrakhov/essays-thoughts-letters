interface SendArgs {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  attachmentName?: string;
  attachmentContent?: string;
}

export async function sendMarkdownEmail(args: SendArgs): Promise<void> {
  const body: Record<string, unknown> = {
    from: args.from,
    to: args.to,
    subject: args.subject,
    text: args.text,
  };
  if (args.attachmentName && args.attachmentContent) {
    const base64 = btoa(unescape(encodeURIComponent(args.attachmentContent)));
    body.attachments = [
      {
        filename: args.attachmentName,
        content: base64,
        content_type: "text/markdown",
      },
    ];
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("[email] resend failed", response.status, text);
  }
}
