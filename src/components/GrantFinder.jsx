import React, { useState } from 'react';
import { searchGrants, defaultGrantCategories } from '../services/grantService';

const GrantFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const searchResults = await searchGrants(searchTerm);
            setResults(searchResults);
        } catch (err) {
            setError('Failed to search grants. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSearchTerm(category);
        setSelectedCategory(category);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Grant Finder</h2>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter grant category or keyword..."
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

            {/* Grant Categories */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Popular Grant Categories:</h3>
                <div className="flex flex-wrap gap-2">
                    {defaultGrantCategories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategorySelect(category)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                        >
                            {category}
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
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Available Grants</h3>
                    {results.map((result, index) => (
                        <div key={index} className="border p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-medium text-blue-600 hover:underline">
                                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                                        {result.title}
                                    </a>
                                </h4>
                                {result.estimatedAmount && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {result.estimatedAmount}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-3">{result.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Source: {new URL(result.source).hostname}</span>
                                <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    View Details
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {!loading && results.length === 0 && searchTerm && (
                <div className="text-center text-gray-600 py-8">
                    <p className="text-lg mb-2">No grants found for your search term.</p>
                    <p>Try selecting a category from above or using different keywords.</p>
                </div>
            )}
        </div>
    );
};

export default GrantFinder; 