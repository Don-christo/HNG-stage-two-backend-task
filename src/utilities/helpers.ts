// import { ENV } from '../config';
import bcrypt from 'bcrypt';

// export const passwordUtils = {
//   length: ENV.IS_PROD ? 8 : 4,
//   regex: ENV.IS_PROD
//     ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.&])[A-Za-z\d@$!%*?.&]{8,}$/
//     : /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?.&]{4,}$/,
//   error: ENV.IS_PROD
//     ? "Password: Min 8 characters, with an uppercase, a lowercase, a number, and a special character."
//     : "Password: Min 4 characters, with a lowercase and a number.",
// };

export class PasswordHarsher {
  static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
