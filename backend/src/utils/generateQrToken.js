import crypto from "crypto";

export const generateQrToken = (sessionId) => {
  const randomPart = crypto.randomUUID().replace(/-/g, "");
  return `session-${sessionId}-${randomPart}`;
};
