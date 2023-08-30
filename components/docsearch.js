import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

function Docsearch({ className }) { 
  const input = useRef(null);
  const { locale } = useRouter();

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea'];

    const down = (e) => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase()) !== -1
      ) {
        if (e.key === '/') {
          e.preventDefault();
          input.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (window.docsearch) {
      window.docsearch({
        appId: 'N801ZM9TWC',
        apiKey: 'ea61f809e797b9888aa3e2b21b910fa5',
        indexName: 'memgraph',
        inputSelector: 'input#algolia-doc-search',
      });
    }
  }, [locale]);

  return (
    <div className={`relative w-full md:w-64 mr-2 docs-search ${className}`}>
      <input
        id="algolia-doc-search"
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
        type="search"
        placeholder='Search ("/" to focus)'
        ref={input}
      />
    </div>
  );
}

export default Docsearch;
