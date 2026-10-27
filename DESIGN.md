# Design — supabase-common docs

The docs site is Docusaurus v3 at `apps/docs`. Its theme lives in `apps/docs/src/css/custom.css`, which is this repo's own file and no longer a copy of the repo-tooling theme. Design inside Docusaurus' structure: use Infima `--ifm-*` tokens and swizzle nothing that the CSS can handle.

## Tokens

| Token | Light | Dark |
|---|---|---|
| `--ifm-color-primary` | `#147a4c` (emerald, deepened for AA on white) | `#3ecf8e` (Supabase emerald) |
| `--ifm-background-color` | `#ffffff` | `#0a0f14` |
| `--ifm-background-surface-color` | `#ffffff` | `#111a1f` |
| `--ifm-heading-color` | `#0b1120` | `#ffffff` |
| `--ifm-font-color-base` | `#35404f` | `#dfe7e3` |
| `--ifm-toc-border-color` | `rgba(12, 20, 18, 0.1)` | `rgba(255, 255, 255, 0.08)` |
| `--ifm-code-background` | `#f2f8f5` | `#0d151a` |
| `--docusaurus-highlighted-code-line-bg` | `rgba(20, 122, 76, 0.12)` → `#d7e9e1` on the code surface | `rgba(62, 207, 142, 0.15)` |

The default colour mode is `dark`, with `respectPrefersColorScheme: true`. Light mode therefore only shows for visitors whose OS prefers light, so check every change in both modes.

## Type

- Base font: Geist (400–800). Headings use weight 800.
- Monospace: Geist Mono (400–600), with `--ifm-code-font-size: 92%`.

## Code blocks

In both modes the code surface matches inline code and the home install card. They all use `--ifm-code-background`, so code reads as one material across the site.

### Light mode (#180)

- **Prism theme:** use `vsLight` with these overrides, in `prism.theme` (the light slot):
  - `plain.backgroundColor: 'var(--ifm-code-background)'`. Docusaurus writes this into the inline `--prism-background-color`, so the block follows the token and needs no `!important`.
  - Token colours. Stock `vsLight` fails AA on this surface, especially on highlighted lines.

    | Prism types | Stock | Use | On `#f2f8f5` | On `#d7e9e1` |
    |---|---|---|---|---|
    | `comment` | `#008000` | `#006b00` | 6.3 | 5.4 |
    | `builtin` | `#0070c1` | `#005a9e` | 6.6 | 5.6 |
    | `number`, `variable`, `inserted` | `#098658` | `#06704a` | 5.7 | 4.9 |
    | `attr-name` | `#ff0000` | `#c40000` | 5.8 | 5.0 |
    | `class-name` | `#267f99` | `#1f6a80` | 5.7 | 4.9 |

    Keep every other `vsLight` colour as it is. All of them are ≥ 6.1:1 on both surfaces: string `#a31515`, keyword/function `#0000ff`, punctuation `#0451a5`, tag `#800000`, constant `#811f3f`, plain `#000000`.
- **Edge:** add a 1px `var(--ifm-toc-border-color)` border on `.theme-code-block`, scoped to `[data-theme="light"]`. The surface is close to white, so the border is what defines the block.
- The title bar (`codeBlockTitle`) and the copy button inherit the surface. Don't style them separately.

### Dark mode

- `prism.darkTheme` stays stock `vsDark` (`#1e1e1e` surface). Leave it alone.

### Rules

- Never pin a code-block background with `!important`. Change the Prism theme's `plain.backgroundColor` or the token instead.
- Any new token colour must pass 4.5:1 against both the code surface and the highlighted-line colour. Run the WCAG maths before merging.
