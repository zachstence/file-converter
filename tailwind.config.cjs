const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				'logo': ['Asap', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [
		require("daisyui"),
	],
};

module.exports = config;
