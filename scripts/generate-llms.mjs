#!/usr/bin/env node

/**
 * Generates public/llms-full.txt from all documentation files.
 *
 * Usage:
 *   node scripts/generate-llms.mjs
 *
 * Environment:
 *   SITE_URL - Base URL for absolute links (default: https://docs.pubky.org)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "src", "content", "docs");
const OUT_DIR = join(ROOT, "public");

const SITE_URL = (
  process.env.SITE_URL || "https://docs.pubky.org"
).replace(/\/+$/, "");

/**
 * Recursively discover all .md/.mdx files under a directory.
 * Returns relative paths sorted: files first (index files before others),
 * then subdirectories recursively.
 */
function discoverPages(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  const dirs = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(entry.name);
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entry.name);
    }
  }

  // Sort files: index first, then alphabetically
  files.sort((a, b) => {
    const aIsIndex = a.startsWith("index.");
    const bIsIndex = b.startsWith("index.");
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;
    return a.localeCompare(b);
  });

  dirs.sort();

  const result = [];

  // Add files at this level
  for (const f of files) {
    result.push(relative(DOCS_DIR, join(dir, f)));
  }

  // Recurse into subdirectories
  for (const d of dirs) {
    result.push(...discoverPages(join(dir, d)));
  }

  return result;
}

/**
 * Extract frontmatter title from markdown content.
 */
function extractTitle(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  const titleMatch = match[1].match(/title:\s*["']?(.+?)["']?\s*$/m);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Remove frontmatter from markdown content.
 */
function stripFrontmatter(content) {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
}

/**
 * Strip MDX imports and Astro/Starlight component syntax.
 */
function stripMdxComponents(content) {
  // Remove import statements
  content = content.replace(/^import\s+.*?;\s*$/gm, "");

  // Convert <LinkCard title="X" href="Y" description="Z" /> to markdown link
  content = content.replace(
    /<LinkCard\s+title=["'](.+?)["']\s+href=["'](.+?)["']\s+description=["'](.+?)["']\s*\/>/g,
    "- [$1]($2) — $3"
  );
  content = content.replace(
    /<LinkCard\s+title=["'](.+?)["']\s+href=["'](.+?)["']\s*\/>/g,
    "- [$1]($2)"
  );

  // Convert <Card title="X" icon="Y">content</Card> to section
  content = content.replace(
    /<Card\s+title=["'](.+?)["'][^>]*>([\s\S]*?)<\/Card>/g,
    "**$1**: $2"
  );

  // Remove container components (CardGrid, etc.)
  content = content.replace(/<\/?CardGrid>/g, "");
  content = content.replace(/<\/?Card[^>]*>/g, "");

  // Clean up excessive blank lines
  content = content.replace(/\n{3,}/g, "\n\n");

  return content.trim();
}

/**
 * Convert a file path to its URL slug.
 */
function fileToSlug(filePath) {
  return filePath
    .replace(/\.mdx?$/, "")
    .replace(/\/index$/, "")
    .replace(/^index$/, "");
}

/**
 * Build the resources appendix.
 */
function buildResourcesSection() {
  return `
---

# Resources

## Websites

- [pubky.org](https://pubky.org/) — Official Pubky website
- [pubky.tech](https://pubky.tech/) — Ecosystem directory and community resources
- [synonym.to](https://synonym.to/) — Synonym (company behind Pubky)
- [docs.pubky.org](https://docs.pubky.org/) — Official documentation
- [pkdns.net](https://pkdns.net/) — PKDNS public resolver
- [pubkyring.app](https://pubkyring.app/) — Pubky Ring key manager

## Live Applications

- [pubky.app](https://pubky.app/) — Decentralized social media app
- [explorer.pubky.app](https://explorer.pubky.app/) — Pubky data explorer
- [pubky.observer](https://pubky.observer/) — Network observer
- [eventky.app](https://eventky.app/) — Event management on Pubky

## Core GitHub Repositories (github.com/pubky)

- [pubky-core](https://github.com/pubky/pubky-core) — Open protocol for per-public-key backends for censorship-resistant web applications
- [pkarr](https://github.com/pubky/pkarr) — Public Key Addressable Resource Records (sovereign TLDs)
- [mainline](https://github.com/pubky/mainline) — BitTorrent Mainline DHT implementation
- [pkdns](https://github.com/pubky/pkdns) — DNS server resolving pkarr self-sovereign domains
- [pubky-nexus](https://github.com/pubky/pubky-nexus) — The Nexus between Pubky homeservers and Pubky-App social features
- [pubky-app](https://github.com/pubky/pubky-app) — Pubky social media application
- [pubky-ring](https://github.com/pubky/pubky-ring) — Mobile key manager app
- [pubky-cli](https://github.com/pubky/pubky-cli) — Command-line companion for interacting with Pubky homeservers
- [pubky-docker](https://github.com/pubky/pubky-docker) — One-click Pubky deployments
- [pubky-app-specs](https://github.com/pubky/pubky-app-specs) — Pubky-app data schemas
- [pubky-explorer](https://github.com/pubky/pubky-explorer) — Data explorer
- [pubky-notes](https://github.com/pubky/pubky-notes) — Note-taking app using Pubky protocol
- [pubky-core-client](https://github.com/pubky/pubky-core-client) — Rust client for connecting to Pubky homeserver
- [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) — Pubky Core Mobile SDK
- [pubky-app-ffi](https://github.com/pubky/pubky-app-ffi) — Pubky App FFI bindings
- [react-native-pubky](https://github.com/pubky/react-native-pubky) — React Native bindings
- [pubky-crypto](https://github.com/pubky/pubky-crypto) — Minimal crypto utilities
- [pubky-locks](https://github.com/pubky/pubky-locks) — P2P commerce
- [pubky-ai-bot](https://github.com/pubky/pubky-ai-bot) — AI capabilities for Pubky
- [pubky-ai-kit](https://github.com/pubky/pubky-ai-kit) — Context for building with Pubky and AI
- [pubky-4u](https://github.com/pubky/pubky-4u) — Sovereign recommendation engine with Web-of-Trust algorithms
- [homegate](https://github.com/pubky/homegate) — Gateway service
- [http-relay](https://github.com/pubky/http-relay) — HTTP relay
- [pkdns-publisher](https://github.com/pubky/pkdns-publisher) — PKDNS record publisher
- [pkdns-resolver-extension](https://github.com/pubky/pkdns-resolver-extension) — Browser extension for PKDNS resolution
- [pkdns-digger](https://github.com/pubky/pkdns-digger) — Resolvable sovereign keys tool
- [workshop](https://github.com/pubky/workshop) — Live coding workshop for building JS apps with pubky-sdk
- [atomicity](https://github.com/pubky/atomicity) — Proposal for a P2P credit system
- [paykit-rs](https://github.com/pubky/paykit-rs) — Payment toolkit

## Community GitHub Projects

- [pubky-node](https://github.com/BitcoinErrorLog/pubky-node) — Node.js Pubky implementation
- [personal-homeserver](https://github.com/BitcoinErrorLog/personal-homeserver) — Personal homeserver setup
- [pubky-noise](https://github.com/BitcoinErrorLog/pubky-noise) — Pubky Noise
- [pak](https://github.com/aljazceru/pak) — Pubky Army Knife
- [pypkarr](https://github.com/aljazceru/pypkarr) — Python pkarr library
- [pubky-nextjs-template](https://github.com/PastaGringo/pubky-nextjs-template) — Next.js template for Pubky apps
- [pubkytree](https://github.com/PastaGringo/pubkytree) — Pubky tree visualization
- [tagky](https://github.com/PastaGringo/tagky) — Tag-based Pubky app
- [eventky](https://github.com/gillohner/eventky/) — Event management on Pubky
- [pubky-canva](https://github.com/gillohner/pubky-canva) — Collaborative canvas on Pubky
- [pubky-mint](https://github.com/ok300/pubky-mint) — Mint on Pubky
- [vanity-pubky](https://github.com/coreyphillips/vanity-pubky) — Vanity key generator
- [pubky-private-messenger](https://github.com/coreyphillips/pubky-private-messenger) — Private messaging
- [homeserver-dashboard](https://github.com/francismars/homeserver-dashboard) — Homeserver dashboard UI
- [pkdns-vanity](https://github.com/jphastings/pkdns-vanity) — PKDNS vanity key generator

## Package Registries

- [crates.io/crates/pubky](https://crates.io/crates/pubky) — Rust SDK
- [npmjs.com/package/@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) — JavaScript/TypeScript SDK
- [npmjs.com/package/@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky) — React Native SDK

## Community Channels

- [Telegram: pubkycore](https://t.me/pubkycore) — Community chat
- [Discord](https://discord.gg/DxTBJXvJxn) — Developer community
- [X/Twitter: @getpubky](https://x.com/getpubky) — Official updates
- [YouTube](https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg) — Tutorials and demos
- [Medium: pubky](https://medium.com/pubky) — Blog posts and articles

## Videos & Talks

- [PKDNS Explainer](https://youtu.be/GJHMlyKUoWY) — How PKDNS works
- [Pubky Explorer Explainer](https://youtu.be/qESmEhDNl4E) — Using the Pubky Explorer
- [Pubky Notes Explainer](https://youtu.be/dXsFe3jmtHE) — Note-taking with Pubky
- [Pubky Password Manager](https://www.youtube.com/watch?v=5uUt2HHlawE) — Password management demo
- [Pubky Arcade](https://www.youtube.com/watch?v=hUzN68mNfP4) — Gaming on Pubky
- [Pubky AI Social Bot](https://www.youtube.com/watch?v=cbOPwbqOKHQ) — AI integration demo
- [Nuh @ Thank God for Nostr podcast](https://fountain.fm/episode/HXQpcOdQU9Tnxa9BQO2v) — Podcast interview
`.trim();
}

// --- Main ---

mkdirSync(OUT_DIR, { recursive: true });

const pages = discoverPages(DOCS_DIR);
const sections = [];

for (const relPath of pages) {
  const filePath = join(DOCS_DIR, relPath);
  const raw = readFileSync(filePath, "utf-8");

  const fmTitle = extractTitle(raw) || relPath;
  const slug = fileToSlug(relPath);
  const url = slug ? `${SITE_URL}/${slug}.md` : `${SITE_URL}/`;

  let body = stripFrontmatter(raw);
  body = stripMdxComponents(body);

  // Use the in-body H1 as the section title if present, removing it from the body.
  // Only match H1 lines that are outside of code fences.
  const title = (() => {
    let inCodeBlock = false;
    const lines = body.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (!inCodeBlock && /^#\s+.+/.test(lines[i])) {
        const h1Text = lines[i].replace(/^#\s+/, "");
        // Remove the H1 line (and any trailing blank line)
        lines.splice(i, lines[i + 1] === "" ? 2 : 1);
        body = lines.join("\n");
        return h1Text;
      }
    }
    return fmTitle;
  })();

  sections.push(`\n---\n\n# ${title}\n\nSource: ${url}\n\n${body}`);
}

const header = `# Pubky Documentation

> Pubky is an open protocol for key-based, censorship-resistant web applications.
> It provides identity via public keys, data storage on homeservers, and discovery
> via the Mainline DHT — all over simple HTTP/REST APIs.
>
> This file contains the complete Pubky documentation.
> For a summary index, see: ${SITE_URL}/llms.txt
`;

const output = header + "\n" + sections.join("\n") + "\n\n" + buildResourcesSection() + "\n";

writeFileSync(join(OUT_DIR, "llms-full.txt"), output, "utf-8");

console.log(
  `Generated public/llms-full.txt (${(output.length / 1024).toFixed(1)} KB, ${sections.length} pages)`
);
