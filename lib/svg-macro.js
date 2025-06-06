const logger = require("@antora/logger")("asciidoctor:svg-macro");

/**
 * @example Inline Embedded SVG
 * svg:ROOT:ui/icons/vector.svg[]
 */
function inlineSvgMacro({ contentCatalog, file }) {
   /**
   * @this { import("@asciidoctor/core/types").Asciidoctor.Extensions.InlineMacroProcessorInstance }
   */
  return function () {
    this.process((parent, target, attrs) => {
      const svgContent = getSvgContent(target, file, contentCatalog);
      if (!svgContent) return;
      const html = svgContent.replace("<svg", `<svg ${htmlAttrs(attrs, "inline-block")}`);
      return this.createInlinePass(
        parent,
        insertLink(insertTitle(html, attrs.title), attrs.link, attrs.window) + renderName(attrs.name)
      );
    });
  };
}

/**
 * @example Block Embedded SVG
 * svg::home:diagrams/graphic.svg[alt="My Graphic"]
 */
function blockSvgMacro({ contentCatalog, file }) {
  /**
   * @this { import("@asciidoctor/core/types").Asciidoctor.Extensions.BlockMacroProcessorInstance }
   */
  return function () {
    this.process((parent, target, attrs) => {
      const svgContent = getSvgContent(target, file, contentCatalog);
      if (!svgContent) return;
      // create an image block and convert it to an html string
      const imageBlockNode = this.createImageBlock(parent, { ...attrs, target});
      imageBlockNode.setId(attrs.id);
      const imageBlockContent = imageBlockNode.convert();
      // replace the <img> tag with the svg content
      const svg = svgContent.replace("<svg", `<svg ${htmlAttrs({ ...attrs, role: undefined, id: undefined })}`);
      const svgBlockContent = imageBlockContent.replace(/<img [^>]*>/, svg);
      // return a passthrough block with the html content
      return this.createPassBlock(parent, svgBlockContent);
    });
  };
}

function insertTitle(svgContent, title) {
  if (!title) return svgContent;
  const svgMatch = svgContent.match(/<svg[^>]*>/);
  const titleTag = `<title>${title}</title>`;
  const svgOpenTag = svgMatch[0];
  const insertionIndex = svgContent.indexOf(svgOpenTag) + svgOpenTag.length;
  const updatedSvgContent =
    svgContent.slice(0, insertionIndex) +
    titleTag +
    svgContent.slice(insertionIndex);

  return updatedSvgContent;
}

function insertLink(svgContent, href, target) {
  if (!href) return svgContent;
  const targetAttr = target ? ` target="${target}"` : "";
  return `<a href="${href}"${targetAttr}>${svgContent}</a>`;
}

function renderName(name) {
  if (!name) return "";
  return ` <b>${name}</b>`;
}

function getSvgContent(target, file, contentCatalog) {
  svgFile = contentCatalog.resolveResource(target, file.src, "image", [
    "image",
  ]);
  if (!svgFile)
    return logger.error({ target, file }, `target of svg not found: ${target}`);
  svgContent = svgFile.contents.toString();
  if (!svgContent.startsWith("<svg"))
    return logger.error({ target, file }, "file contents must be a valid svg");
  return svgContent;
}

function htmlAttrs({ id, width, height, role, alt, ariaLabel, $positional = [] }, klass) {
  const [posAlt, posWidth, posHeight] = $positional;
  return [
    id && `id="${id}"`,
    (width || posWidth) && `width="${width || posWidth}"`,
    (height || posHeight) && `height="${height || posHeight}"`,
    (role || klass) && `class="${[klass, role].filter(Boolean).join(" ")}"`,
    (alt || ariaLabel || posAlt) && `aria-label="${alt || ariaLabel || posAlt}" role="img"`,
    !(alt || ariaLabel || posAlt) && "aria-hidden='true'",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * @param { import("@asciidoctor/core/types").Asciidoctor.Extensions.Registry } registry
 * @param context
 */
function register(registry, context) {
  registry.inlineMacro("svg", inlineSvgMacro(context));
  registry.blockMacro("svg", blockSvgMacro(context));
}

module.exports.register = register;
