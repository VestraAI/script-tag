const Vestra = {};

Vestra.search = class {

	constructor(options) {
        
        const { 
            uuid,
            searchFormId,
            searchResultsId,
            linkResultsId,
            apiKey,
            styles
        } = options;

        this.searchDisclaimerStyles = styles?.searchDisclaimer;
        this.searchResultsStyles = styles?.searchResults;
        this.linkResultsStyles = styles?.linkResults;
        this.uuid = uuid;
		this.apiUrl = 'https://vestra-portal-ff0e04098746.herokuapp.com';
		this.searchUrl = `${this.apiUrl}/vestraSearch`;
        this.apiKey = apiKey;
        this.callbacks = {};

        document.addEventListener('DOMContentLoaded', (e) => {
            this._initSearchResults(searchResultsId);
            this._initLinkResults(linkResultsId);
            this._initSearchForm(searchFormId);
        });

        return this;
	}

    _initLinkResults = (linkResultsId) => {
        this.linkResults = document.getElementById(linkResultsId);
    }

    _initSearchResults = (searchResultsId) => {
        this.searchResults = document.getElementById(searchResultsId);
    }

    _initSearchForm = (searchFormId) => {
        
        // Get elements
        this.searchForm = document.getElementById(searchFormId);
        this.input = this.searchForm.querySelector('input');
        this.input.setAttribute('autocomplete', 'off');

        // Add styles to search form
        this.searchForm.style.setProperty('position', 'relative');
        
        // Create search disclaimer and add styles
        const searchDisclaimer = document.createElement('p');
        searchDisclaimer.textContent = 'Um leitina gilda ';
        const vestraTermsRef = document.createElement('a');
        vestraTermsRef.href = 'https://vestra.is/skilmalar';
        vestraTermsRef.textContent = 'skilmálar';
        searchDisclaimer.appendChild(vestraTermsRef);
        const vestraName = document.createElement('span');
        vestraName.textContent = ' Vestra';
        searchDisclaimer.appendChild(vestraName);
        this.searchForm.appendChild(searchDisclaimer);
        searchDisclaimer.classList.add('search-disclaimer');
        this.searchDisclaimer = searchDisclaimer;
        if (this.searchDisclaimer) {
            this.searchDisclaimer.style.setProperty('position', 'absolute');
            this.searchDisclaimer.style.setProperty('visibility', 'hidden');
            this.searchDisclaimer.style.setProperty('display', 'none');
            Object.assign(this.searchDisclaimer.style, {
                fontSize: '0.8rem',
                color: 'black',
                backgroundColor: '#fff',
                borderBottomLeftRadius: this.input.style.borderTopLeftRadius,
                borderBottomRightRadius: this.input.style.borderTopRightRadius,
                border: '1px solid #ccc',
                paddingBottom: '1rem',
                paddingTop: '1rem',
                textAlign: 'center',
                width: this.input?.offsetWidth - 2 + 'px'
            });
        }
        if (this.linkResults) {
            Object.assign(this.linkResults.style, {
                margin: '20px auto',
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                lineHeight: '1.6',
                color: '#333',
                maxWidth: '700px',
                width: 'calc(90% - 2rem)',
                display: 'flex',
                flexDirection: 'column'
            });
        }
        this._applySearchResultStyles();
        if(this.searchDisclaimerStyles) {
            Object.entries(this.searchDisclaimerStyles).forEach(([key, value]) => {
                searchDisclaimer.style.setProperty(key, value);
            });
        }
        if(this.linkResultsStyles) {
            Object.entries(this.linkResultsStyles).forEach(([key, value]) => {
                this.linkResults.style.setProperty(key, value);
            });
        }

        // Add event listeners
        this.input.addEventListener('focusin', (e) => {
            searchDisclaimer.style.setProperty('visibility', 'visible');
            searchDisclaimer.style.setProperty('display', 'block');
            this.searchDisclaimer.style.setProperty('bottom', `calc( -0.8rem - ${this.searchDisclaimer?.offsetHeight}px)`);
        });
        this.input.addEventListener('focusout', (e) => {
            if(e.relatedTarget === vestraTermsRef) return;
            searchDisclaimer.style.setProperty('visibility', 'hidden');
            searchDisclaimer.style.setProperty('display', 'none');
            this.searchDisclaimer.style.setProperty('bottom', `calc( -0.8rem - ${this.searchDisclaimer?.offsetHeight}px)`);
        });
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.search(this.input.value);
        });
    }

	search = async (query) => {

        if(this.isStreaming) return;

        this.message = '';
        this.searchResults.innerHTML = '';
        this.linkResults.innerHTML = '';
        this.input.disabled = true;
        this.isStreaming = false;
        this.call('searching', true);
        this.call('start', query);

		let res = await fetch(this.searchUrl, {
			method: 'POST',
			body: JSON.stringify({ uuid: this.uuid, query: query }),
			headers: {
				'Content-Type': 'application/json',
                'x-api-key': this.apiKey
			}
		});

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		
		let done = false;
		while(!done) {

			const data = await reader.read();
			const value = data.value;
			done = data.done;
			
			let chunkList = decoder.decode(value).split('\n');
			for(let i = 0; i < chunkList.length-1; i++) {
				
				let parsed = JSON.parse(chunkList[i]);
				
				if(parsed.error) {
					this.call('error', parsed.error);
                    this.call('searching', false);
                    this.call('end', query);
                    this.isStreaming = false;
                    this.input.disabled = false;
					return;
				}
				if(parsed.end) {
                    this.call('searching', false);
                    this.call('end', query);
                    this.isStreaming = false;
                    this.input.disabled = false;
                    this._applySearchResultStyles();
					return;
				}
				if(parsed.link) {
                    this.call('link', parsed.link);
                    const link = document.createElement('a');
                    link.href = parsed.link;
                    link.textContent = parsed.link;
                    this.linkResults.appendChild(link);
                };
				if(parsed.message) {
                    if(!this.isStreaming) {
                        this.call('streaming', query);
                        this.isStreaming = true;
                    }
                    this.call('message', parsed.message);
                    this.message += parsed.message;
                    this.searchResults.innerHTML = convertMarkdown(this.message);
                }
			}
		}
	}

    on = (event, callback) => {
        this.callbacks[event] = callback;
        return this;
    }

    call = (event, ...args) => {
        if(this.callbacks[event]) this.callbacks[event](...args);
    }

    _applySearchResultStyles = () => {

        if (this.searchResults) {
            Object.assign(this.searchResults.style, {
                fontFamily: 'Arial, sans-serif',
                margin: '20px auto',
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                lineHeight: '1.6',
                color: '#333',
                maxWidth: '700px',
                width: 'calc(90% - 2rem)'
            });
    
            this.searchResults.querySelectorAll('h1').forEach(el => Object.assign(el.style, {
                fontSize: '24px',
                fontWeight: 'bold',
                borderBottom: '2px solid #ddd',
                paddingBottom: '5px',
                marginBottom: '15px'
            }));
    
            this.searchResults.querySelectorAll('h2').forEach(el => Object.assign(el.style, {
                fontSize: '22px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px'
            }));
    
            this.searchResults.querySelectorAll('h3').forEach(el => Object.assign(el.style, {
                fontSize: '20px',
                fontWeight: 'bold',
                marginTop: '15px'
            }));
    
            this.searchResults.querySelectorAll('p').forEach(el => Object.assign(el.style, {
                fontSize: '16px',
                marginBottom: '15px'
            }));
    
            this.searchResults.querySelectorAll('a').forEach(el => Object.assign(el.style, {
                color: '#007bff',
                textDecoration: 'none'
            }));
    
            this.searchResults.querySelectorAll('a:hover').forEach(el => Object.assign(el.style, {
                textDecoration: 'underline'
            }));
    
            this.searchResults.querySelectorAll('ul, ol').forEach(el => Object.assign(el.style, {
                paddingLeft: '20px',
                marginBottom: '15px'
            }));
    
            this.searchResults.querySelectorAll('li').forEach(el => Object.assign(el.style, {
                marginBottom: '5px'
            }));
    
            this.searchResults.querySelectorAll('blockquote').forEach(el => Object.assign(el.style, {
                borderLeft: '4px solid #007bff',
                background: '#f1f1f1',
                padding: '10px',
                margin: '15px 0',
                fontStyle: 'italic',
                color: '#555'
            }));
    
            this.searchResults.querySelectorAll('pre').forEach(el => Object.assign(el.style, {
                background: '#222',
                color: '#f8f8f2',
                padding: '15px',
                borderRadius: '5px',
                overflowX: 'auto'
            }));
    
            this.searchResults.querySelectorAll('code').forEach(el => Object.assign(el.style, {
                fontFamily: 'Courier New, monospace',
                background: '#eee',
                padding: '3px 6px',
                borderRadius: '4px'
            }));
    
            this.searchResults.querySelectorAll('pre code').forEach(el => Object.assign(el.style, {
                background: 'none',
                padding: '0',
                borderRadius: '0'
            }));
    
            this.searchResults.querySelectorAll('table').forEach(el => Object.assign(el.style, {
                width: '100%',
                borderCollapse: 'collapse',
                margin: '15px 0'
            }));
    
            this.searchResults.querySelectorAll('th, td').forEach(el => Object.assign(el.style, {
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left'
            }));
    
            this.searchResults.querySelectorAll('th').forEach(el => Object.assign(el.style, {
                background: '#007bff',
                color: 'white'
            }));

            if(this.searchResultsStyles) {
                Object.entries(this.searchResultsStyles).forEach(([key, value]) => {
                    this.searchResults.style.setProperty(key, value);
                });
            }
        }
    }
}

function convertMarkdown(markdownText) {
    const converter = new showdown.Converter();
    converter.setOption('tables', true);
    const rawHTML = converter.makeHtml(markdownText);    
    const safeHTML = DOMPurify.sanitize(rawHTML);
    return safeHTML;
}