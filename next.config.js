/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	async headers() {
		return [
			{
				source: '/:all*(svg|jpg|png)',
				locale: false,
				headers: [
					{
						key: 'Cache-Control',
						value: `public, s-maxage=${24 * 60 * 60}`,
					},
				],
			},
		]
	},
}

module.exports = nextConfig
