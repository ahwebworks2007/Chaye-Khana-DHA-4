import 'dotenv/config';
import { provisionAdminUser } from '../server/auth';
import { CK_BRANCHES } from '../src/data/branchesData';

// Parse command-line flags or environment variables
// Usage:
// npm run create-admin -- --email=dha4@example.com --branch=dha-phase-4 --password=custompass
// or:
// ADMIN_EMAIL=... ADMIN_BRANCH=... ADMIN_PASSWORD=... npm run create-admin

function parseArgs(): { email?: string; branchId?: string; password?: string } {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, ...vals] = arg.slice(2).split('=');
      if (key && vals.length > 0) {
        parsed[key] = vals.join('=');
      }
    }
  }

  return {
    email: parsed.email || process.env.ADMIN_EMAIL,
    branchId: parsed.branch || parsed.branchId || process.env.ADMIN_BRANCH,
    password: parsed.password || process.env.ADMIN_PASSWORD,
  };
}

async function main() {
  const { email, branchId, password } = parseArgs();

  console.log('\n======================================================');
  console.log('Chaayé Khana — Admin Account Provisioning Tool');
  console.log('======================================================\n');

  if (!email || !branchId || !password) {
    console.error('Error: Missing required parameters.\n');
    console.log('Usage:');
    console.log('  npm run create-admin -- --email=<email> --branch=<branchId> --password=<password>\n');
    console.log('Or using environment variables:');
    console.log('  ADMIN_EMAIL=<email> ADMIN_BRANCH=<branchId> ADMIN_PASSWORD=<password> npm run create-admin\n');
    console.log('Built-in branch IDs:');
    for (const b of CK_BRANCHES) {
      console.log(`  • ${b.id.padEnd(16)} (${b.name})`);
    }
    console.log('');
    process.exit(1);
  }

  const validBranchIds = CK_BRANCHES.map((b) => b.id);
  if (!validBranchIds.includes(branchId)) {
    console.warn(
      `[Warning] "${branchId}" is not one of the default branches (${validBranchIds.join(', ')}). Proceeding with custom branchId.`
    );
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.\n');
    process.exit(1);
  }

  console.log(`Target Email:     ${email}`);
  console.log(`Assigned Branch:  ${branchId}`);
  console.log(`Security:         Generating 16-byte cryptographic salt & scrypt key derivation...`);

  const result = await provisionAdminUser(email, branchId, password);

  if (!result.success) {
    console.error(`\nFailed to provision admin account: ${result.error}\n`);
    process.exit(1);
  }

  console.log('\nSUCCESS: Admin account provisioned successfully.');
  console.log('------------------------------------------------------');
  console.log(`User ID:          ${result.user?.id}`);
  console.log(`Email:            ${result.user?.email}`);
  console.log(`Assigned Branch:  ${result.user?.branchId}`);
  console.log(`Role:             ${result.user?.role} (Strict single-branch access)`);
  console.log(`Storage:          PostgreSQL (if configured) + Local encrypted fallback`);
  console.log(`Plaintext Pass:   [NEVER STORED OR LOGGED - CRYPTOGRAPHIC SCRYPT HASH SAVED]`);
  console.log('------------------------------------------------------\n');
  console.log('To login: Navigate to /admin and enter the credentials.\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
