import { hashPassword } from "@/lib/auth/credentials";

const password = process.argv[2];
if (!password) {
  console.error('Usage: bun run scripts/hash-password.ts "your-strong-password"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

console.log(hashPassword(password));
