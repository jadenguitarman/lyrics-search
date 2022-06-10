const search = instantsearch({
	indexName: 'lyrics',
	searchClient: algoliasearch(
		'8WCMJCP5DG', // identifies this specific application
		'7654ba9896fe4286deca1195f47bb2a0' // this is my public api key
	)
});

// instantiate custom widget
search.addWidgets([
	instantsearch.connectors.connectSearchBox(
		(renderOptions, isFirstRender) => {
			const { query, refine, clear, isSearchStalled, widgetParams } = renderOptions;

			if (isFirstRender) {
				const input = document.createElement('input');
				input.type = "search";
				input.id = "search-input";
				input.addEventListener('input', event => {
					if (event.target.value) refine(event.target.value);
					else clear();
				});

				widgetParams.container.appendChild(input);
			}

			widgetParams.container.querySelector('input').value = query;
		}
	)({
		container: document.getElementById('search-input-container')
	}),

	instantsearch.widgets.hits({
		container: '#search-hits',
		templates: {
			item: hit => {
				if (hit._highlightResult.lyrics.matchedWords.length) console.log(`Matched the word "${hit._highlightResult.lyrics.matchedWords[0]}" in lyrics of ${hit.title} ${
					hit._highlightResult.lyrics.value.includes(hit._highlightResult.lyrics.matchedWords[0])
						? "because it actually appeared"
						: "without the word actually appearing"
				}`)
				return `
					<a class="search-result" href="/songs/${hit.inAppUrl}">
						<img src="${hit.albumCover.items[0].url}" class="search-result-img" />
						<span class="search-result-title">${hit.title}</span>
						<span class="search-result-artist">${hit.artist}</span>
						<span class="search-result-album">from <i>${hit.albumName}</i></span>
					</a>
				`;
			}
		}
	})
]);

search.start();
