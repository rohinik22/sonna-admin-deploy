// Enhanced Type definitions for Deno Edge Functions with better security and type safety
export {};

// Supabase client type definitions
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export interface SupabaseClient {
    from(table: string): QueryBuilder;
  }

  export interface QueryBuilder {
    select(columns: string): QueryBuilder;
    eq(column: string, value: any): QueryBuilder;
    single(): Promise<{ data: any; error: any }>;
    update(values: Record<string, any>): QueryBuilder;
  }

  export function createClient(url: string, key: string, options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
    }
  }): SupabaseClient;
}

// BCrypt type definitions with enhanced security
declare module 'https://esm.sh/bcryptjs@2' {
  interface BCryptStatic {
    compare(data: string, encrypted: string): Promise<boolean>;
    hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
    genSalt(rounds?: number): Promise<string>;
    compareSync(data: string, encrypted: string): boolean;
    hashSync(data: string | Buffer, saltOrRounds: string | number): string;
  }
  
  const bcrypt: BCryptStatic;
  export default bcrypt;
}

// JWT type definitions with comprehensive options
declare module 'https://esm.sh/jsonwebtoken@9' {
  interface JWTPayload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
  }

  interface SignOptions {
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    subject?: string;
    noTimestamp?: boolean;
    header?: Record<string, any>;
    keyid?: string;
  }

  interface VerifyOptions {
    algorithms?: string[];
    audience?: string | string[];
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    subject?: string | string[];
    clockTolerance?: number;
    maxAge?: string | number;
    clockTimestamp?: number;
    nonce?: string;
  }

  interface JWTStatic {
    sign(payload: string | Buffer | object, secretOrPrivateKey: string, options?: SignOptions): string;
    verify(token: string, secretOrPublicKey: string, options?: VerifyOptions): JWTPayload;
    decode(token: string, options?: { complete?: boolean; json?: boolean }): null | JWTPayload | string;
  }

  const jwt: JWTStatic;
  export default jwt;
}

// Enhanced Deno global definitions
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
      set(key: string, value: string): void;
    };
    serve(handler: (request: Request) => Response | Promise<Response>, options?: {
      port?: number;
      hostname?: string;
    }): void;
  };
}

// Application-specific types
export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login?: string;
  permissions?: string[];
}

export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

export interface SecurityHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Headers': string;
  'Access-Control-Allow-Methods': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Content-Security-Policy'?: string;
  'Strict-Transport-Security'?: string;
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface JWTClaims {
  id: string;
  email: string;
  role: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  jti: string;
  permissions?: string[];
}
