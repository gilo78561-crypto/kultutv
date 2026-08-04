import { randomBytes } from "node:crypto";

// Prints a random 48-byte hex string (96 chars) suitable for SESSION_SECRET.
console.log(randomBytes(48).toString("hex"));
