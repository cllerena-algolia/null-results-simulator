import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import './App.css';

const App = () => {
  const [searchData, setSearchData] = useState({ terms: [], counts: [] });
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [indexName, setIndexName] = useState('');
  const [conversionRate, setConversionRate] = useState();
  const [aov, setAOV] = useState();
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const client = algoliasearch(appId, apiKey);
    const index = client.initIndex(indexName);

    const lostConversions = [];
    const potentialLostRevenue = [];
    const searchCount = searchData.counts;

    const searchResults = await Promise.all(
      searchData.terms.map(async (term, i) => {
        const { nbHits } =  await index.search(term);
        if (nbHits > 0) { lostConversions[i] = searchCount[i]; }
        else { lostConversions[i] = 0; } 
        potentialLostRevenue[i] = lostConversions[i] * conversionRate * aov;

        return {
          term,
          nbHits,
          lostConversions: lostConversions[i],
          potentialLostRevenue: potentialLostRevenue[i]        
        };
      })
    );

    setResults(searchResults);
  };

  const handleCSVDownload = () => {
    const csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Term', 'nbHits', 'Lost Conversions', 'Potential Lost Revenue'];
    const csvRows = [headers.join(',')];

    results.forEach(({ term, nbHits, lostConversions, potentialLostRevenue }) => {
      const row = [term, nbHits, lostConversions, potentialLostRevenue].join(',');
      csvRows.push(row);
    });

    const csvData = csvRows.join('\n');
    const encodedData = encodeURI(csvContent + csvData);
    const link = document.createElement('a');
    link.href = encodedData;
    link.download = 'search_results.csv';
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container">
      <h1 className="title">Algolia Null Results Simulator</h1>
      <div className="input-group">
        <label>
          Search Data (Terms):
          <input
            className="input-field"
            type="text"
            value={searchData.terms.join(',')}
            onChange={(e) =>
              setSearchData({
                ...searchData,
                terms: e.target.value.split(','),
              })
            }
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Search Data (Counts):
          <input
            className="input-field"
            type="text"
            value={searchData.counts.join(',')}
            onChange={(e) =>
              setSearchData({
                ...searchData,
                counts: e.target.value.split(',').map(Number),
              })
            }
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Algolia App ID:
          <input
            className="input-field"
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Algolia API Key:
          <input
            className="input-field"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Algolia Index Name:
          <input
            className="input-field"
            type="text"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Customer Average Conversion Rate:
          <input
            className="input-field"
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Customer AOV (Average Order Value):
          <input
            className="input-field"
            type="number"
            value={aov}
            onChange={(e) => setAOV(Number(e.target.value))}
          />
        </label>
      </div>
      <button className="search-button" onClick={handleSearch}>Search</button>
      <button className="download-button" onClick={handleCSVDownload}>Download CSV</button>
      <div className="results-container">
        <h2>Search Results:</h2>
        <textarea
          className="results-textarea"
          rows="10"
          cols="50"
          value={JSON.stringify(results, null, 2)}
          readOnly
        />
      </div>
    </div>
  );
};

export default App;

