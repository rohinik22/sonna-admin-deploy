// Type definitions for Deno Edge Functions
export {};

// Simple module declarations for ESM.sh imports
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string): any;
}

declare module 'https://esm.sh/bcryptjs@2' {
  interface BCrypt {
    compare(data: string, encrypted: string): Promise<boolean>;
    hash(data: string, saltOrRounds: string | number): Promise<string>;
  }
  const bcrypt: BCrypt;
  export default bcrypt;
}

declare module 'https://esm.sh/jsonwebtoken@9' {
  interface JWT {
    sign(payload: any, secretOrPrivateKey: string, options?: any): string;
    verify(token: string, secretOrPublicKey: string, options?: any): any;
  }
  const jwt: JWT;
  export default jwt;
}

declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve(handler: (request: Request) => Response | Promise<Response>): void;
  };
}
