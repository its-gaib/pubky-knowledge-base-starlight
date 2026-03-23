// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Pubky Knowledge Base',
			logo: {
				src: './src/assets/pubky-logo.webp',
				alt: 'Pubky',
			},
			favicon: '/favicon.svg',
			plugins: [starlightClientMermaid()],
			customCss: ['./src/styles/custom.css'],
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				Hero: './src/components/Hero.astro',
				SocialIcons: './src/components/SocialIcons.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/pubky' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/getpubky' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/pubkycore' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/DxTBJXvJxn' },
				{ icon: 'external', label: 'Medium', href: 'https://medium.com/pubky' },
				{ icon: 'external', label: 'pubky.app', href: 'https://pubky.app/profile/ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y/posts' },
				{ icon: 'external', label: 'crates.io', href: 'https://crates.io/crates/pubky' },
				{ icon: 'external', label: 'npm', href: 'https://www.npmjs.com/package/@synonymdev/pubky' },
			],
			sidebar: [
				{ label: 'Home', slug: 'index' },
				{ label: 'Overview', slug: 'overview' },
				{ label: 'Getting Started', slug: 'getting-started' },
				{ label: 'TL;DR', slug: 'tldr' },
				{ label: 'FAQ', slug: 'faq' },
				{ label: 'Glossary', slug: 'glossary' },
				{ label: 'Architecture', slug: 'architecture' },
				{ label: 'The Vision of Pubky', slug: 'the-vision-of-pubky' },
				{ label: 'Comparisons', slug: 'comparisons' },
				{ label: 'Contributing', slug: 'contributing' },
				{ label: 'Troubleshooting', slug: 'troubleshooting' },
				{
					label: 'Concepts',
					items: [
						{ label: 'Censorship', slug: 'explore/concepts/censorship' },
						{ label: 'Credible Exit', slug: 'explore/concepts/credible-exit' },
						{ label: 'Semantic Social Graph', slug: 'explore/concepts/semantic-social-graph' },
					],
				},
				{
					label: 'Pubky Core',
					items: [
						{ label: 'Introduction', slug: 'explore/pubkycore/introduction' },
						{ label: 'ELI5', slug: 'explore/pubkycore/eli5' },
						{ label: 'Authentication', slug: 'explore/pubkycore/authentication' },
						{ label: 'Homeserver', slug: 'explore/pubkycore/homeserver' },
						{ label: 'API', slug: 'explore/pubkycore/api' },
						{ label: 'SDK', slug: 'explore/pubkycore/sdk' },
						{ label: 'Security Model', slug: 'explore/pubkycore/security-model' },
						{
							label: 'Pkarr',
							items: [
								{ label: 'Introduction', slug: 'explore/pubkycore/pkarr/introduction' },
								{ label: 'Why Pkarr', slug: 'explore/pubkycore/pkarr/why-pkarr' },
								{ label: 'Getting Started', slug: 'explore/pubkycore/pkarr/getting-started' },
								{ label: 'Expectations', slug: 'explore/pubkycore/pkarr/expectations' },
								{ label: 'Architecture', slug: 'explore/pubkycore/pkarr/architecture' },
								{ label: 'ELI5', slug: 'explore/pubkycore/pkarr/eli5' },
							],
						},
					],
				},
				{
					label: 'Pubky Apps',
					items: [
						{ label: 'Introduction', slug: 'explore/pubky-apps/introduction' },
						{ label: 'ELI5', slug: 'explore/pubky-apps/eli5' },
						{ label: 'App Specs', slug: 'explore/pubky-apps/app-specs' },
						{
							label: 'App Architectures',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/app-architectures/introduction' },
								{ label: 'Client ↔ Homeserver', slug: 'explore/pubky-apps/app-architectures/client-homeserver' },
								{ label: 'Global Aggregators', slug: 'explore/pubky-apps/app-architectures/global-aggregators' },
								{ label: 'Custom Backend', slug: 'explore/pubky-apps/app-architectures/custom-backend' },
							],
						},
						{
							label: 'Indexing & Aggregation',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/indexing-and-aggregation/introduction' },
								{ label: 'Indexer', slug: 'explore/pubky-apps/indexing-and-aggregation/indexer' },
								{ label: 'Aggregator', slug: 'explore/pubky-apps/indexing-and-aggregation/aggregator' },
								{ label: 'Pubky Nexus', slug: 'explore/pubky-apps/indexing-and-aggregation/pubky-nexus' },
								{ label: 'Web Server', slug: 'explore/pubky-apps/indexing-and-aggregation/web-server' },
							],
						},
						{
							label: 'Reference App',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/reference-app/introduction' },
								{ label: 'pubky.app', slug: 'explore/pubky-apps/reference-app/pubky-app' },
								{ label: 'Bookmarks', slug: 'explore/pubky-apps/reference-app/features/bookmarks' },
								{ label: 'Layouts', slug: 'explore/pubky-apps/reference-app/features/layouts' },
								{ label: 'Notifications', slug: 'explore/pubky-apps/reference-app/features/notifications' },
								{ label: 'Perspectives', slug: 'explore/pubky-apps/reference-app/features/perspectives' },
								{ label: 'Posts', slug: 'explore/pubky-apps/reference-app/features/posts' },
								{ label: 'Profiles', slug: 'explore/pubky-apps/reference-app/features/profiles' },
								{ label: 'Search', slug: 'explore/pubky-apps/reference-app/features/search' },
								{ label: 'Tags', slug: 'explore/pubky-apps/reference-app/features/tags' },
								{ label: 'Trends', slug: 'explore/pubky-apps/reference-app/features/trends' },
							],
						},
					],
				},
				{
					label: 'Technologies',
					autogenerate: { directory: 'explore/technologies' },
				},
			],
		}),
	],
});
