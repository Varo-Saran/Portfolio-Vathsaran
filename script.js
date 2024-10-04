if (searchInput && searchBtn) {
        let debounceTimer;

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                showSuggestionsAndResults(searchInput.value);
            }, 300);
        });
    
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSuggestionsAndResults(searchInput.value);
        });
    
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        searchSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion') || e.target.closest('.search-result')) {
                const selectedText = e.target.classList.contains('suggestion') ? 
                    e.target.textContent : 
                    e.target.closest('.search-result').querySelector('a').textContent;
                searchInput.value = selectedText;
                searchSuggestions.style.display = 'none';
                showSuggestionsAndResults(selectedText);
            }
        });

        console.log('Search event listeners attached');
    } else {
        console.error('Search input or button not found');
    }
