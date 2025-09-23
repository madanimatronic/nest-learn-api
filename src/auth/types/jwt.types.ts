interface BaseJwtPayload {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export type JwtPayload<T extends object = { [key: string]: any }> =
  BaseJwtPayload & T;
