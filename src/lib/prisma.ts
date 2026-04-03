import { PrismaClient } from '@prisma/client';

// Factory ensures TypeScript infers the full generated type (including all models)
// from the call site, not from a potentially stale cached global type annotation.
function makePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

type PrismaClientType = ReturnType<typeof makePrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientType | undefined;
}

const prismaInstance: PrismaClientType =
  globalThis.prismaGlobal ?? makePrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaInstance;
}

export const prisma: PrismaClientType = prismaInstance;
export default prismaInstance;
