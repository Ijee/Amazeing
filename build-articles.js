import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Renderer } from 'marked';

/**
 * This script runs during the ci build and converts all markdown files in the assets/articles
 * directory into json files because I added some additonal frontmatter data.
 */

async function processFiles(path) {
    try {
        // Read the list of files and directories in the specified path
        const entries = await readdir(path, { withFileTypes: true });
        await mkdir('src/assets/articles', { recursive: true });

        console.log(`Processing files in: ${path}`);

        const markedOptions = {
            renderer: new CustomMarkdownRenderer()
        };

        for (const entry of entries) {
            const fullPath = join(path, entry.name);

            // Check if the entry is a file
            if (entry.isFile()) {
                try {
                    // Read the content of the file
                    const parsedMD = matter.read(fullPath, { language: 'yaml' });

                    // Convert markdown content to appropriate html structure.
                    parsedMD.content = marked.parse(parsedMD.content, markedOptions);

                    writeFile(
                        'src/assets/articles/' + entry.name.replace('.md', '') + '.json',
                        JSON.stringify(parsedMD),
                        'utf-8'
                    );
                    console.log(`--- Processed content of ${entry.name}`);
                } catch (readFileErr) {
                    console.error(`Error reading file ${entry.name}:`, readFileErr);
                }
            }
        }
        console.log('Finished processing all files.');
    } catch (readdirErr) {
        console.error(`Error reading directory ${path}:`, readdirErr);
    }
}

/**
 * So that the resulting html can be properly styled with the classes the Bulma CSS framework provides.
 */
class CustomMarkdownRenderer extends Renderer {
    heading(token) {
        // Access the rendered text from the 'text' property of the token object
        const level = token.depth; // depth property already gives the level (1-6)
        const text = token.text; // Access the rendered text
        return `<h${level} class="title is-${level}">${text}</h${level}>`;
    }
}

processFiles('assets/articles');
