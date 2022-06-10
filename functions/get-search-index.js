import fetch from 'node-fetch';
const { convert } = require('html-to-text');

exports.handler = async ev => {
	const lyricsAsHtml = ev.queryStringParameters.lyricsAsHtml == 'true';

	const response = await fetch(
		"https://graphql.kontent.ai/fd742f82-d991-00e6-8d84-5b22158c71b0",
		{
			headers: {
				"Content-Type": "application/graphql"
			},
			method: "POST",
			body: `
				query SearchIndex {
					song_All {
						items {
							title
							artist
							albumName
							lyrics {
								html
							}
							albumCover {
								items {
									url
								}
							}
							inAppUrl
						}
					}
				}
			`
		}
	);
	let results = (await response.json())
		.data
		.song_All
		.items
		.map(
			result => ({
				...result,
				lyrics: lyricsAsHtml
					? result.lyrics.html
					: convert(result.lyrics.html)
			})
		);

	return {
		statusCode: 200,
		body: JSON.stringify(results, null, '\t')
	};
};
