import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.NEXT_PUBLIC_SECRET_KEY as string, {
  encoding: "base64",
  pbkdf2Iterations: Number(process.env.NEXT_PUBLIC_ITERATIONS),
  saltLength: Number(process.env.NEXT_PUBLIC_USER_SALT),
});

const encryptor = (text: string) => {
  return cryptr.encrypt(text);
};

const decryptor = (text: string) => {
  return cryptr.decrypt(text);
};

export { encryptor, decryptor };
