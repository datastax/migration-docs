'use strict'

// This extension allows for overriding content source branches at build time
//
// CONTENT_SOURCES should be a JSON object in the format of
// {
//    "content_source_url" : { "build_branch": "[name of branch to be overridden]", "draft_branch": "[name of branch to use instead]" }
// }
//
// ex:
//
// { "https://github.com/riptano/datastax-docs-site.git": { "build_branch": "main", "draft_branch": "pull-request-branch" } }
//
// Above will replace the content source with URL https://github.com/riptano/datastax-docs-site.git
// with the object contents provided. In this case replacing the "branches" attribute with the provided value.
//
// usage:
//
// CONTENT_SOURCES='{ "https://github.com/riptano/datastax-docs-site.git" : { "build_branch": "main", "draft_branch": "test-pr" } }' \
//   antora --stacktrace --fetch antora-playbooks/release.yaml --extension lib/pull-request-draft.js

// Helper method for wrapping item into an array if not already an array
const arrayWrap = (obj) => (
  Array.isArray(obj)
    ? obj
    : (obj === null || obj === undefined) ? [] : [obj]
  );

// Register the extension
module.exports.register = function () {
  this.once('playbookBuilt', async ({ playbook }) => {
    const logger = this.getLogger('pr-draft-extension')

    const providedContentSources = process.env.CONTENT_SOURCES;

    if (!providedContentSources || providedContentSources == "{}") {
      logger.warn("No content source changes specified. Using content sources defined in playbook as-is.");
      return;
    }

    let contentSourceChanges;

    try {
      contentSourceChanges = JSON.parse(providedContentSources);
    } catch(e) {
      logger.error('CONTENT_SOURCES error! ' + e);
      return;
    }

    // Replace each content source with its provided override, if any.
    playbook.content.sources.map((source) => {
      let override = contentSourceChanges[source.url];
      if (override) {
        let branches = source.branches || arrayWrap(playbook.content.branches || 'main')
        branches = branches.map(branch => branch == override.build_branch ? override.draft_branch : branch);
        let sourceOverride = Object.assign(source, { branches: branches });
        return sourceOverride;
      } else {
        return source;
      }
    });
  })
}
