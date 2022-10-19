declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USR_DB: string;
      PWD_DB: string;
      ADR_DB: string;
      ST_URI: string;
      ST_API_KEY: string;
    }
  }
}

export {};
