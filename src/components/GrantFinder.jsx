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
        const term = searchTerm.trim();
        if (!term) {
            setError('Please enter a search term or select a category.');
            return;
        }

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const searchResults = await searchGrants(term);
            setResults(searchResults);
            if (searchResults.length === 0) {
                setError('No grants found. Try different keywords or select a category from above.');
            }
        } catch (err) {
            // Handle specific error messages from the service
            setError(err.message || 'Failed to search grants. Please try again later.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = async (category) => {
        setSearchTerm(category);
        setSelectedCategory(category);
        
        // Automatically trigger search when category is selected
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const searchResults = await searchGrants(category);
            setResults(searchResults);
            if (searchResults.length === 0) {
                setError('No grants found for this category. Please try a different category or search term.');
            }
        } catch (err) {
            setError(err.message || 'Failed to search grants. Please try again later.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to render grant status badge
    const renderStatusBadge = (analysis) => {
        if (!analysis) return null;
        
        const { timeRelevance, validityScore } = analysis;
        let color = 'gray';
        let text = 'Unknown';
        
        if (validityScore >= 80) {
            color = timeRelevance.isActive ? 'green' : 'red';
            text = timeRelevance.isActive ? 'Active' : 'Inactive';
        } else if (validityScore >= 50) {
            color = 'yellow';
            text = 'Needs Verification';
        }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                {text}
            </span>
        );
    };

    // Helper function to render probability indicator
    const renderProbabilityIndicator = (probability) => {
        const colors = {
            'High': 'green',
            'Medium': 'yellow',
            'Low': 'red'
        };
        const color = colors[probability] || 'gray';
        
        return (
            <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full bg-${color}-400`}></span>
                <span className="text-sm text-gray-600">{probability}</span>
            </div>
        );
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
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching...
                            </span>
                        ) : 'Search'}
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
                            disabled={loading}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Searching for grants...</p>
                </div>
            )}

            {/* Error Message */}
            {error && !loading && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Available Grants</h3>
                    {results.map((result, index) => (
                        <div key={index} className="border p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-medium text-blue-600 hover:underline">
                                            <a href={result.url}>
                                                {result.title}
                                            </a>
                                        </h4>
                                        {result.analysis && renderStatusBadge(result.analysis)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Source: {new URL(result.source).hostname}
                                    </div>
                                </div>
                                {result.analysis?.grantAmount && (
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">
                                            ${result.analysis.grantAmount.min.toLocaleString()} - 
                                            ${result.analysis.grantAmount.max.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {result.analysis.grantAmount.isConfirmed ? 'Confirmed Amount' : 'Estimated Amount'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-4">{result.description}</p>

                            {/* Analysis Section */}
                            {result.analysis && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Dates */}
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Dates</h5>
                                            <div className="space-y-1 text-sm">
                                                <div>Start: {result.analysis.timeRelevance.startDate}</div>
                                                <div>Deadline: {result.analysis.timeRelevance.deadline}</div>
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Requirements</h5>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {result.analysis.requirements.slice(0, 3).map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Metrics */}
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Analysis</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Validity Score:</span>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium">{result.analysis.validityScore}%</span>
                                                        <div className="ml-2 w-20 h-2 bg-gray-200 rounded-full">
                                                            <div 
                                                                className="h-full bg-blue-600 rounded-full" 
                                                                style={{width: `${result.analysis.validityScore}%`}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Success Probability:</span>
                                                    {renderProbabilityIndicator(result.analysis.successProbability)}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Application Complexity:</span>
                                                    <span className="text-sm">{result.analysis.applicationComplexity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reasoning */}
                                    <div className="mt-4 text-sm text-gray-600">
                                        <span className="font-medium">Analysis Notes:</span> {result.analysis.reasoning}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex justify-end space-x-2">
                                <a
                                    href={result.url}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    View Details
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GrantFinder; 