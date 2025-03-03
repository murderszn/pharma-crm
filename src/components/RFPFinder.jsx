import React, { useState } from 'react';
import { searchRFPs, defaultSearchTerms } from '../services/tavilyService';

const RFPFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const searchResults = await searchRFPs(searchTerm);
            setResults(searchResults);
        } catch (err) {
            setError('Failed to search RFPs. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">RFP Finder</h2>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter search term..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Suggested Terms */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Suggested Search Terms:</h3>
                <div className="flex flex-wrap gap-2">
                    {defaultSearchTerms.map((term, index) => (
                        <button
                            key={index}
                            onClick={() => setSearchTerm(term)}
                            className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 text-sm"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Search Results</h3>
                    {results.map((result, index) => (
                        <div key={index} className="border p-4 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-medium text-blue-600 hover:underline">
                                    <a href={result.url}>
                                        {result.title}
                                    </a>
                                </h4>
                            </div>
                            <p className="text-gray-600 mb-2">{result.description}</p>
                            <p className="text-sm text-gray-500">Source: {result.source}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {!loading && results.length === 0 && searchTerm && (
                <div className="text-center text-gray-600">
                    No RFPs found for your search term. Try another keyword.
                </div>
            )}
        </div>
    );
};

export default RFPFinder; 