import { readFileSync } from "node:fs";
import process from "node:process";

interface FirebaseCredential {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

const toEnvVarName = (key: string) => `FB_${key.toUpperCase()}`;

const escapeValue = (value: unknown) =>
  typeof value === "string" ? value.replace(/\n/g, "\\n") : String(value);

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Usage: node main.ts <path-to-firebase-admin.json>");
  process.exit(1);
}

try {
  const data: FirebaseCredential = JSON.parse(readFileSync(jsonPath, "utf8"));

  console.log("# Firebase Environment Variables");
  console.log("# Copy these lines to your .env file:\n");

  for (const [key, value] of Object.entries(data)) {
    console.log(`${toEnvVarName(key)}="${escapeValue(value)}"`);
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
}
