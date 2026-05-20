declare module "*.md" {
  const content: string;
  export default content;
}

declare module "markdown-it-attrs" {
  import type MarkdownIt from "markdown-it";
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}
