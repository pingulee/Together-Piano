declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: null | typeof import('mongoose');
      promise: null | Promise<typeof import('mongoose')>;
    };
  }
}
