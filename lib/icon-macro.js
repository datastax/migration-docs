/**
 * This macro relies on the material-icons font and the lucide icons font being loaded in UI bundle.
 *
 * @example Material Icon
 * icon:material:menu-open[]
 * 
 * @example Lucide Icon
 * icon:boom-box[]
 */
function inlineIconMacro() {
  return function () {
    this.process((parent, target, attrs) => {
      if (target.startsWith("material:")) {
        iconTarget = target
          .replace("material:", "")
          .trim()
          .replace("-", "_");
        return this.createInlinePass(
          parent,
          `<i ${htmlAttrs(attrs, "material-icons")}>${iconTarget}</i>` + renderName(attrs?.name)
        );
      } else {
        iconTarget = target
          .replace("lucide:", "")
          .trim()
        return this.createInlinePass(
          parent,
          `<i ${htmlAttrs(attrs, `icon-${iconTarget}`)}></i>` + renderName(attrs?.name)
        );
      }
    });
  };
}

function renderName(name) {
  if (!name) return "";
  return ` <b>${name}</b>`;
}

function htmlAttrs({ size, role, alt, title, ariaLabel, $positional = [] }, klass) {
  const [posSize] = $positional;
  return [
    (size || posSize) && `style="font-size: ${(size || posSize).replace("px", "").trim()}px;"`,
    (role || klass) && `class="${[klass, role].filter(Boolean).join(" ")}"`,
    title && `title="${title}"`,
    (alt || ariaLabel) && `aria-label="${alt || ariaLabel}" role="img"`,
    !(alt || ariaLabel) && "aria-hidden='true'",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * @param { import("@asciidoctor/core/types").Asciidoctor.Extensions.Registry } registry
 * @param context
 */
function register(registry) {
  registry.inlineMacro("icon", inlineIconMacro());
}

module.exports.register = register;
