import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
    // Fetch the current commit hash. (not needed for HEAD tag just in case I need it again)
    // const commitHash = execSync('git rev-parse HEAD').toString().trim();
    // Fetch the Git tag associated with the current commit.
    const version = execSync('git describe --tags --always').toString().trim();

    const targetPath = './src/environments/environment.prod.ts';

    const envConfigFile = `
export const environment = {
  production: true,
  version: '${version}'
};`;

    writeFileSync(targetPath, envConfigFile);
    console.log(`Environment file generated at ${targetPath} with version: ${version}`);
} catch (error) {
    console.error('Error generating environment file: ', error);
    process.exit(1);
}
