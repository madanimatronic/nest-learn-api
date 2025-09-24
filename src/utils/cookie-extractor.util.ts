import { Request } from 'express';

export const cookieExtractorWrapper =
  (cookieName: string) => (req: Request) => {
    let value: string | null = null;
    if (req && req.cookies) {
      value = (req.cookies[cookieName] as string | undefined) ?? null;
    }
    return value;
  };
