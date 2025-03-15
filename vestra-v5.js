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

        if(!searchFormId || !searchResultsId || !linkResultsId) {
            this.default = true;
        }

        if(document.readyState === 'complete') {
            this._init();
        } else {
            document.addEventListener('DOMContentLoaded', (e) => {
                this._init();
            });
        }

        return this;
	}

    _init = () => {
        if(this.default) {
            this._initDefaultSearchForm();
        } else {
            this._initSearchResults(searchResultsId);
            this._initLinkResults(linkResultsId);
            this._initSearchForm(searchFormId);
        }
    }

    _initDefaultSearchForm = () => {

        this.searchContainer = document.createElement('div');
        this.searchHeader = document.createElement('h1');
        this.searchHeaderContainer = document.createElement('div');
        this.searchHeaderInfo = document.createElement('p');
        this.searchForm = document.createElement('form');
        this.searchInput = document.createElement('input');
        this.input = this.searchInput;
        this.searchIcon = document.createElement('div');
        this.searchCircle = document.createElement('div');
        this.searchHandle = document.createElement('div');
        this.searchResults = document.createElement('div');
        this.searchResultsContainer = document.createElement('div');
        this.searchDisclaimer = document.createElement('p');
        this.searchInputContainer = document.createElement('div');
        this.searchBtn = document.createElement('button');
        this.exitIcon = document.createElement('div');
        this.loadingIcon = document.createElement('div');
 
        this.searchInputContainer.appendChild(this.searchInput);
        this.searchForm.appendChild(this.searchInputContainer);
        this.searchForm.appendChild(this.searchDisclaimer);
        this.searchForm.appendChild(this.searchBtn);
        this.searchHeaderContainer.appendChild(this.searchHeader);
        this.searchHeaderContainer.appendChild(this.searchHeaderInfo);
        this.searchContainer.appendChild(this.searchHeaderContainer);
        this.searchContainer.appendChild(this.searchForm);
        this.searchResultsContainer.appendChild(this.searchResults);
        this.searchContainer.appendChild(this.searchResultsContainer);
        this.searchContainer.appendChild(this.exitIcon);
        this.searchContainer.appendChild(this.loadingIcon);
        document.body.appendChild(this.searchContainer);
        this.searchIcon.appendChild(this.searchCircle);
        this.searchIcon.appendChild(this.searchHandle);
        document.body.appendChild(this.searchIcon);

        this.exitIcon.innerHTML = '&times;';
        this.exitIcon.addEventListener('click', (e) => {
            this.searchContainer.style.display = 'none';
            this.searchIcon.style.display = 'flex';
        });

        this.searchHeader.textContent = 'Gervigreindarleit';
        this.searchHeaderInfo.textContent = 'Knúin af Vestra';

        this.searchDisclaimer.textContent = 'Með því að nota leitina samþykkir þú ';
        const vestraTermsRef = document.createElement('a');
        vestraTermsRef.href = 'https://vestra.is/skilmalar';
        vestraTermsRef.textContent = 'skilmála';
        this.searchDisclaimer.appendChild(vestraTermsRef);
        const vestraName = document.createElement('span');
        vestraName.textContent = ' og hefur lesið persónuverndarstefnu Vestra';
        this.searchDisclaimer.appendChild(vestraName);

        this.searchBtn.textContent = 'Leita';
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.search(this.searchInput.value);
        });

        this.searchIcon.addEventListener('click', (e) => {
            this.searchContainer.style.display = 'flex';
            this.searchInput.focus();
            this.searchIcon.style.display = 'none';
        });

        this.loadingIcon.textContent = 'leita...';

        Object.assign(this.loadingIcon.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1rem',
            color: 'black',
            zIndex: '9999',
            display: 'none'
        });

        Object.assign(this.searchHeaderContainer.style, {
            width: '100%',
            background: 'hsl(234 63% 7.5%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        });

        Object.assign(this.searchHeader.style, {
            fontSize: '1.5rem',
            height: '1.5rem',
            paddingLeft: '1rem',
            margin: '0',
            marginTop: '1rem'
        });

        Object.assign(this.searchHeaderInfo.style, {
            fontSize: '0.8rem',
            paddingLeft: '1rem',
            margin: '0',
            marginBottom: '1rem',
            opacity: '0.8',
            fontStyle: 'italic'
        });


        Object.assign(this.searchBtn.style, {
            minHeight: '100%',
            fontSize: '1rem',
            filter: 'drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.25))',
            background: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '1.5rem',
            border: 'none',
            marginLeft: '1rem',
            cursor: 'pointer',
            border: '1px solid #5CF39F',
            color: '#000'
        });
            
        Object.assign(this.searchHandle.style, {
            position: 'absolute',
            left: '1.75rem',
            top: '2.5rem',
            background: 'black',
            zIndex: '9999',
            width: '1.4rem',
            height: '0.2rem',
            transform: 'rotate(45deg)'
        })
    
        Object.assign(this.searchCircle.style, {
            position: 'absolute',
            left: '0.75rem',
            top: '0.85rem',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: '9998',
            border: '3px solid black',
            borderRadius: '50%',
            width: '1rem',
            height: '1rem'
        });


        Object.assign(this.searchIcon.style, {
            position: 'fixed',
            bottom: '1.5rem',
            right: '1rem',
            fontSize: '2rem',
            color: 'black',
            zIndex: '9999',
            cursor: 'pointer',
            backgroundColor: 'white',
            filter: 'drop-shadow(0 0 4px #5CF39F)',
            border: '1px solid #5CF39F)',
            borderRadius: '2.5rem',
            width: '4rem',
            height: '4rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        })
       
        Object.assign(this.exitIcon.style, {
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '1rem',
            fontSize: '2rem',
            color: 'white',
            zIndex: '9999',
            cursor: 'pointer'
        });

        Object.assign(this.searchContainer.style, {
            fontFamily: 'system-ui, sans-serif',
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            height: '40rem',
            width: '30rem',
            background: 'rgba(255, 255, 255, 1.0)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: '9999',
            borderRadius: '1rem',
            display: 'none',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 1.0)',
        });

        Object.assign(this.searchForm.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
        });

        Object.assign(this.searchInputContainer.style, {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2rem',
            padding: '0.5rem',
            borderRadius: '1.5rem',
            gap: '0.5rem',
            background: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        });

        Object.assign(this.searchInput.style, {
            height: '100%',
            padding: '0rem 0.5rem',
            border: 'none',
            borderRadius: '1.5rem',
            outline: 'none',
            fontSize: '1rem',
            fontFamily: 'Arial, sansserif',
            color: 'black',
            background: 'transparent',
            boxShadow: 'none',
            zIndex: '9999',
            minWidth: '20rem',
        });

        Object.assign(this.searchDisclaimer.style, {
            position: 'absolute',
            top: '-3rem',
            width: '80%',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'black',
        });

        Object.assign(this.searchResultsContainer.style, {
            width: '100%',
            height: '26rem',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        });

        if(window.innerWidth < 768) { 
            /* Mobile look */
        }

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.search(this.input.value);
        });
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

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.search(this.input.value);
        });
    }

	search = async (query) => {

        if(this.isStreaming) return;

        if(this.loadingIcon) this.loadingIcon.style.display = 'block';
        this.message = '';
        this.searchResults.innerHTML = '';
        if(this.linkResults) this.linkResults.innerHTML = '';
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
		const links = [];

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
                    if(!this.linkResults) this.searchResults.appendChild(...links);
                    if(this.default) this._applySearchResultStyles();
                    if(this.loadingIcon) this.loadingIcon.style.display = 'none';
					return;
				}
				if(parsed.link) {
                    this.call('link', parsed.link);
                    const link = document.createElement('a');
                    link.href = parsed.link;
                    link.textContent = parsed.link;
                    if(this.linkResults) {
                        this.linkResults.appendChild(link);
                    } else {
                        links.push(link);
                    }
                };
				if(parsed.message) {
                    if(!this.isStreaming) {
                        this.call('streaming', query);
                        this.isStreaming = true;
                        if(this.loadingIcon) this.loadingIcon.style.display = 'none';
                    }
                    this.call('message', parsed.message);
                    this.message += parsed.message;
                    this.searchResults.innerHTML = convertMarkdown(this.message);
                    if(this.default) this._applySearchResultStyles();
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
                margin: '0rem auto',
                lineHeight: '1.6',
                color: '#333',
                width: '90%',
                padding: '1rem 0rem'
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
                borderLeft: '4px solid #5CF39F',
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
                background: '#5CF39F',
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