const frameClass =
  "my-6 block overflow-hidden border border-border bg-background";
const headerClass =
  "flex min-h-9 items-center gap-3 border-b border-border bg-muted px-3 py-2";
const languageClass =
  "min-w-0 flex-1 truncate text-[0.7rem] tracking-[0.18em] text-muted-foreground";
const buttonClass =
  "text-[0.7rem] tracking-[0.16em] text-muted-foreground underline decoration-border decoration-dotted underline-offset-4 hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent focus-visible:outline-none";

const toClassName = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
};

const getLanguage = (node) => {
  const dataLanguage = node.properties?.dataLanguage;
  const rawLanguage = Array.isArray(dataLanguage)
    ? dataLanguage[0]
    : dataLanguage;

  if (typeof rawLanguage === "string" && rawLanguage) return rawLanguage;

  const code = node.children?.find(
    (child) => child.type === "element" && child.tagName === "code",
  );
  const languageClass = toClassName(code?.properties?.className).find((item) =>
    item.startsWith("language-"),
  );

  return languageClass?.replace("language-", "") ?? "sh";
};

const formatLanguage = (language) =>
  `.${(language === "text" ? "sh" : language).toLowerCase()}`;

const visitParents = (node, callback, parent = undefined) => {
  callback(node, parent);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visitParents(child, callback, node);
  }
};

const isAstroCodePre = (node) =>
  node.type === "element" &&
  node.tagName === "pre" &&
  toClassName(node.properties?.className).includes("astro-code");

const createText = (value) => ({ type: "text", value });

const createElement = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});

export default function rehypeCodeFrame() {
  return (tree) => {
    visitParents(tree, (node, parent) => {
      if (!parent?.children || !isAstroCodePre(node)) return;

      const index = parent.children.indexOf(node);
      if (index === -1) return;

      const language = getLanguage(node);
      const label = formatLanguage(language);

      node.properties = {
        ...node.properties,
        dataCopySource: "",
      };

      parent.children[index] = createElement(
        "code-copy-frame",
        {
          className: toClassName(frameClass),
          dataThemeTransitionStatic: "",
        },
        [
          createElement(
            "div",
            {
              className: toClassName(headerClass),
            },
            [
              createElement(
                "span",
                {
                  className: toClassName(languageClass),
                  dataCodeLanguage: "",
                },
                [createText(label)],
              ),
              createElement(
                "button",
                {
                  type: "button",
                  className: toClassName(buttonClass),
                  dataCopyCode: "",
                  ariaLabel: `copy ${label} code`,
                },
                [createText("copy")],
              ),
            ],
          ),
          node,
        ],
      );
    });
  };
}
