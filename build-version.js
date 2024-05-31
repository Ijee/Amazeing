const { execSync } = require('child_process');
const fs = require('fs');
const dotenv = require('dotenv');

try {
    // Fetch the current commit hash.
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    // Fetch the Git tag associated with the current commit.
    const version = execSync(`git describe --tags ${commitHash}`).toString().trim();

    fs.writeFileSync('.env', `VERSION=${version}\n`);
    console.log(`VERSION=${version}`);
} catch (error) {
    console.error('Error fetching Git tag:', error);
    process.exit(1);
}

dotenv.config();

const targetPath = './src/environments/environment.prod.ts';

const version = process.env.VERSION || 'unknown';

const envConfigFile = `
export const environment = {
  production: true,
  version: '${version}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Environment file generated at ${targetPath}`);
