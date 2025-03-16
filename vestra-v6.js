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
        this.searchForm = document.createElement('form');
        this.searchInput = document.createElement('input');
        this.input = this.searchInput;
        this.searchIcon = document.createElement('div');
        this.searchResults = document.createElement('div');
        this.searchResultsContainer = document.createElement('div');
        this.searchDisclaimer = document.createElement('p');
        this.searchInputContainer = document.createElement('div');
        this.searchBtn = document.createElement('button');
        this.exitIcon = document.createElement('div');
        this.loadingIcon = document.createElement('div');
        this.vestraLogo = document.createElement('div');
        this.vestraLogo.innerHTML =
        `
   <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1108 246"
    fill="currentColor"
    stroke-width="30"
  >
    <path
      d="M111.5 0.00012207L131 55.0001H86.5L68.5 0.00012207H111.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M86.5523 54.8001H130.952L162.952 151.8L194.952 54.8001H237.552L183.352 195H140.152L86.5523 54.8001ZM266.562 54.8001H381.162V86.8001H308.162V108.8H374.362V140.8H308.162V163H383.162V195H266.562V54.8001ZM521.885 100C517.085 97.2001 511.818 94.6001 506.085 92.2001C500.352 89.8001 494.752 87.8668 489.285 86.4001C483.952 84.9334 479.285 84.2001 475.285 84.2001C471.818 84.2001 469.018 84.8668 466.885 86.2001C464.752 87.5334 463.685 89.6001 463.685 92.4001C463.685 95.4668 464.952 98.0001 467.485 100C470.152 101.867 473.685 103.467 478.085 104.8C482.485 106.133 487.285 107.533 492.485 109C497.685 110.333 502.885 112.067 508.085 114.2C513.285 116.2 518.018 118.8 522.285 122C526.685 125.067 530.218 129.133 532.885 134.2C535.552 139.133 536.885 145.267 536.885 152.6C536.885 162.733 534.218 171.133 528.885 177.8C523.685 184.333 516.685 189.267 507.885 192.6C499.218 195.8 489.618 197.4 479.085 197.4C471.085 197.4 463.018 196.467 454.885 194.6C446.752 192.733 438.952 190.133 431.485 186.8C424.152 183.467 417.552 179.4 411.685 174.6L427.285 143C432.085 147.133 437.618 150.867 443.885 154.2C450.285 157.4 456.618 160 462.885 162C469.285 163.867 474.818 164.8 479.485 164.8C484.018 164.8 487.552 164 490.085 162.4C492.618 160.667 493.885 158.133 493.885 154.8C493.885 151.733 492.552 149.267 489.885 147.4C487.218 145.4 483.685 143.733 479.285 142.4C475.018 141.067 470.218 139.733 464.885 138.4C459.685 137.067 454.485 135.467 449.285 133.6C444.218 131.6 439.485 129.067 435.085 126C430.685 122.933 427.152 119 424.485 114.2C421.952 109.4 420.685 103.4 420.685 96.2001C420.685 87.1334 423.085 79.2668 427.885 72.6001C432.685 65.8001 439.418 60.6001 448.085 57.0001C456.752 53.4001 466.952 51.6001 478.685 51.6001C489.352 51.6001 499.885 53.1335 510.285 56.2001C520.685 59.1334 529.685 63.0668 537.285 68.0001L521.885 100ZM565.54 54.8001H688.74V88.0001H647.94V195H606.14V88.0001H565.54V54.8001ZM785.126 54.8001C804.059 54.8001 818.659 59.1334 828.926 67.8001C839.192 76.4668 844.326 88.6668 844.326 104.4C844.326 121.2 839.192 134.267 828.926 143.6C818.659 152.8 804.059 157.4 785.126 157.4H761.326V195H719.726V54.8001H785.126ZM785.126 125.2C791.392 125.2 796.192 123.533 799.526 120.2C802.992 116.867 804.726 112 804.726 105.6C804.726 99.6001 802.992 95.0001 799.526 91.8001C796.192 88.4668 791.392 86.8001 785.126 86.8001H761.326V125.2H785.126ZM775.926 142.2H816.326L849.126 195H801.926L775.926 142.2Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M1023.4 191.2H979.005L947.005 94.2001L915.005 191.2L872.405 191.2L926.605 51.0001H969.805L1023.4 191.2Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M214.5 1.00012L194.347 56.5001H237L257.592 1.00012H214.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M97 15.0001L15 15.0001"
      stroke="currentColor"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M305 16L226 16"
      stroke="currentColor"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M872.5 191L852.5 246H894.5L915.092 191H872.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M1023.5 191L1043 246H999.592L979 191H1023.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M883 231H803"
      stroke="currentColor"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M1093 231L1012 231"
      stroke="currentColor"
      strokeWidth="30"
      strokeLinecap="round"
    />
  </svg>
        `

        this.searchHeaderContainer.appendChild(this.vestraLogo);
        this.searchHeaderContainer.appendChild(this.searchHeader);

        this.searchInputContainer.appendChild(this.searchInput);
        this.searchForm.appendChild(this.searchInputContainer);
        this.searchForm.appendChild(this.searchDisclaimer);
        this.searchForm.appendChild(this.searchBtn);
        this.searchContainer.appendChild(this.searchHeaderContainer);
        this.searchContainer.appendChild(this.searchForm);
        this.searchResultsContainer.appendChild(this.searchResults);
        this.searchContainer.appendChild(this.searchResultsContainer);
        this.searchContainer.appendChild(this.exitIcon);
        this.searchContainer.appendChild(this.loadingIcon);
        document.body.appendChild(this.searchContainer);
        document.body.appendChild(this.searchIcon);

        this.searchIcon.innerHTML = 
        `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        `


        this.exitIcon.innerHTML = '&times;';
        this.exitIcon.addEventListener('click', (e) => {
            this.searchContainer.style.display = 'none';
            this.searchIcon.style.display = 'flex';
        });

        this.searchHeader.textContent = 'Gervigreindarleit';

        this.searchDisclaimer.textContent = 'Með því að nota leitina samþykkir þú ';
        this.vestraTermsRef = document.createElement('a');
        this.vestraTermsRef.href = 'https://vestra.is/skilmalar';
        this.vestraTermsRef.textContent = 'skilmála';
        const vestraName = document.createElement('span');
        vestraName.textContent = ' og hefur lesið ';
        this.vestraPrivacyRef = document.createElement('a');
        this.vestraPrivacyRef.href = 'https://vestra.is/personuverndarstefna';
        this.vestraPrivacyRef.textContent = 'persónuverndarstefnu';
        this.searchDisclaimer.appendChild(this.vestraTermsRef);
        this.searchDisclaimer.appendChild(vestraName);
        this.searchDisclaimer.appendChild(this.vestraPrivacyRef);
        this.vestraName = document.createElement('span');
        this.vestraName.textContent = ' Vestra';
        this.searchDisclaimer.appendChild(this.vestraName);

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

        Object.assign(this.vestraTermsRef.style, {
            color: '#007bff',
            textDecoration: 'none'
        });

        Object.assign(this.vestraPrivacyRef.style, {
            color: '#007bff',
            textDecoration: 'none'
        });

        Object.assign(this.vestraLogo.querySelector('svg').style, {
            width: '5rem',
            position: 'absolute',
            inset: '0'
        });

        Object.assign(this.vestraLogo.style, {
            width: '5rem',
            height: '0rem',
            fill: 'currentColor',
            position: 'relative',
            marginBottom: '0.5rem'
        });

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
            height: '5rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '2rem',
            paddingLeft: '1rem',
            position: 'relative',
        });

        Object.assign(this.searchHeader.style, {
            fontSize: '1.25rem',
            height: '1.25rem',
            fontWeight: 'bold',
            margin: 'auto',
            position: 'absolute',
            textAlign: 'center',
            inset: 0
        });

        Object.assign(this.searchBtn.style, {
            fontSize: '1rem',
            filter: 'drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.25))',
            background: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '1.5rem',
            border: 'none',
            marginLeft: '1rem',
            cursor: 'pointer',
            border: '0.1rem solid #5CF39F',
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
            filter: 'drop-shadow(0 0 0.4rem #5CF39F)',
            border: '0.1rem solid #5CF39F)',
            borderRadius: '2.5rem',
            width: '3.5rem',
            height: '3.5rem',
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
            boxShadow: '0 0 1rem rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: '9999',
            borderRadius: '1rem',
            display: 'none',
            overflow: 'hidden',
            border: '0.1rem solid rgba(255, 255, 255, 1.0)',
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
            padding: '0.75rem',
            borderRadius: '1.5rem',
            gap: '0.5rem',
            background: 'white',
            boxShadow: '0 0 1rem rgba(0, 0, 0, 0.1)'
        });

        Object.assign(this.searchInput.style, {
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
            top: '-2.75rem',
            width: '80%',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'black',
        });

        Object.assign(this.searchResultsContainer.style, {
            width: '100%',
            height: '27.25rem',
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        });

        if(window.innerWidth < 768) { 
            /* Mobile look */

            Object.assign(this.searchContainer.style, {
                width: 'calc(100% - 3rem)',
                height: 'calc(100% - 3rem)',
                bottom: '1.5rem',
                right: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 0 2rem rgba(0, 0, 0, 0.35)',
            });

            Object.assign(this.searchHeaderContainer.style, {
                height: '4rem',
                paddingLeft: '1rem',
            });

            Object.assign(this.searchHeader.style, {
                fontSize: '1rem',
            });

            Object.assign(this.searchInputContainer.style, {
                padding: '0.5rem',
            });

            Object.assign(this.searchInput.style, {
                fontSize: '0.75rem',
            });

            Object.assign(this.searchDisclaimer.style, {
                fontSize: '0.75rem',
            });

            Object.assign(this.searchResultsContainer.style, {
                height: 'calc(100% - 12rem)',
            });

            Object.assign(this.searchIcon.style, {
                bottom: '1rem',
                right: '1rem',
                width: '3rem',
                height: '3rem',
                fontSize: '1.5rem',
            });

            Object.assign(this.exitIcon.style, {
                fontSize: '1.5rem',
            });

            Object.assign(this.searchBtn.style, {
                fontSize: '0.75rem',
                padding: '0.5rem 1rem',
            });

            Object.assign(this.loadingIcon.style, {
                fontSize: '0.75rem',
            });
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
                padding: '1rem 0rem',
                overflowY: 'scroll'
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