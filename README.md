# Starlight Starter Kit: Basics

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

```
npm create astro@latest -- --template starlight
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run generate-llms:full` | Generate `public/llms-full.txt` (deterministic) |
| `npm run generate-llms`   | Generate both `llms-full.txt` and `llms.txt` (requires Claude CLI) |

## AI-Accessible Documentation (llms.txt)

This project generates machine-readable documentation files following the [llms.txt](https://llmstxt.org/) spec, so AI models can load the full Pubky docs as context.

### Files

| File | Description | Generation |
|------|-------------|------------|
| `public/llms-full.txt` | Complete docs content (~380 KB, all pages concatenated + resources) | Deterministic script |
| `public/llms.txt` | Summary index with section links and one-line descriptions | Claude CLI |
| `.llms-generation` | Commit hash of when the files were last generated | Auto-written |

### How to regenerate

After changing any documentation in `src/content/docs/`:

```bash
# Generate both files (requires Claude CLI to be installed and authenticated)
SITE_URL=https://pubky-knowledge-base-starlight.vercel.app npm run generate-llms

# Or generate only llms-full.txt (no Claude CLI needed)
SITE_URL=https://pubky-knowledge-base-starlight.vercel.app npm run generate-llms:full
```

Review the git diff of the generated files before committing. The `llms.txt` summary is AI-generated and should be checked for accuracy.

Commit all three files together: `public/llms-full.txt`, `public/llms.txt`, and `.llms-generation`.

### CI freshness check

A GitHub Actions workflow (`.github/workflows/check-llms-freshness.yml`) runs on every push/PR to `main`. It compares the commit hash in `.llms-generation` against HEAD to detect if any docs files have changed since the last generation. If docs changed, the check fails with a list of modified files.

### Why not automated in CI?

The `llms.txt` generation uses Claude CLI, which runs under the Claude Max plan. This plan does not include API access, so it can’t run in CI without a separate API subscription. For now, generation runs locally. This can be migrated to a GitHub Action once API access is available.
