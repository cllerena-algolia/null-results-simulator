import React, { useState } from 'react';
import axios from 'axios';
import algoliasearch from 'algoliasearch/lite';

const SearchComponent = () => {
  const [searchStrings, setSearchStrings] = useState('');
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [indexName, setIndexName] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const stringsList = searchStrings.split(',').map((str) => str.trim());

    const client = algoliasearch(appId, apiKey);
    const index = client.initIndex(indexName);

    const results = await Promise.all(
      stringsList.map(async (searchTerm) => {
        const response = await index.search(searchTerm);
        return { searchTerm, nbHits: response.nbHits };
      })
    );

    setSearchResults(results);
  };

  return (
    <div>
      <div>
        <label>
          Search Strings:
          <input
            type="text"
            value={searchStrings}
            onChange={(e) => setSearchStrings(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Algolia App ID:
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Algolia API Key:
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Algolia Index Name:
          <input
            type="text"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <label>Search Results:</label>
        <textarea
          rows="10"
          cols="50"
          readOnly
          value={JSON.stringify(searchResults, null, 2)}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
D