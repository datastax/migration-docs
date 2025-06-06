"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function updateTailwindConfig(configPath, outputDir, logger) {
  try {
    // Read the existing config
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Create a temporary file with updated content
    const updatedContent = configContent.replace(
      /content:\s*\[.*?'\.\/build\/site\/.*?'\]/s,
      `content: ['${outputDir}/**/*.{html,js}']`
    );

    const tempConfigPath = path.join(path.dirname(configPath), 'tailwind.temp.js');
    fs.writeFileSync(tempConfigPath, updatedContent);
    logger.info(`Created temporary Tailwind config with updated output dir: ${outputDir}`);

    return tempConfigPath;
  } catch (error) {
    logger.error(`Error updating Tailwind config: ${error.message}`);
    throw error;
  }
}

function cleanup(tempConfigPath, logger) {
  try {
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
      logger.info('Cleaned up temporary Tailwind config');
    }
  } catch (error) {
    logger.warn(`Error cleaning up temporary config: ${error.message}`);
  }
}

module.exports.register = (context) => {
  context.once("sitePublished", ({ playbook }) => {
    const logger = context.getLogger('tailwind-processor-extension');
    const outputDir = playbook?.output?.dir || "build/site";

    logger.info("Building Tailwind");

    try {
      // Find the config and CSS files
      const configPath = execSync(`find ${outputDir} -name tailwind.config.js`)
        .toString()
        .trim();

      const cssPath = execSync(`find ${outputDir} -name site*.css`)
        .toString()
        .trim();

      // Create temporary config with updated output directory
      const tempConfigPath = updateTailwindConfig(configPath, outputDir, logger);

      // Run Tailwind with the temporary config
      logger.info(
        `Running Tailwind with config: ${tempConfigPath} and CSS: ${cssPath}`
      );

      execSync(
        `npm run tailwindcss --tailwind-config-path=${tempConfigPath} --css-path=${cssPath}`,
        { stdio: "inherit" }
      );

      // Clean up
      cleanup(tempConfigPath, logger);

      logger.info("Tailwind Build Successful");
    } catch (error) {
      logger.error(`Tailwind build failed: ${error.message}`);
      throw error;
    }
  });
};
