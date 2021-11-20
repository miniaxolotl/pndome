import crypto from 'crypto';

import config from '../../../../server.config';

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

export const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv(algorithm, config.ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash: {
  iv: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string };
  content: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string };
}) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    config.ENCRYPTION_KEY,
    Buffer.from(hash.iv, 'hex'),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
