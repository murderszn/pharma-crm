import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { toast } from '../components/Toast';
import { searchGrants, defaultGrantCategories } from '../services/grantService';
import { writeGrant } from '../services/grantWritingService';
import { BetaBadge } from '../components/BetaDisclaimer';
import { useNavigate } from 'react-router-dom';

export function GrantFinder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [requirementsModal, setRequirementsModal] = useState({ isOpen: false, content: '', title: '', description: '' });
    
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const searchResults = await searchGrants(searchTerm);
            setResults(searchResults);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWriteGrant = async (grant) => {
        try {
            toast.info('Analyzing grant requirements...');
            
            const requirements = `
Organization Requirements:
- Organization Type: ${grant.analysis?.organizationType || 'Not specified'}
- Eligibility Criteria: ${grant.analysis?.eligibility || 'Not specified'}
- Track Record: ${grant.analysis?.trackRecord || 'Not specified'}

Project Requirements:
- Focus Area: ${grant.analysis?.focusArea || grant.title}
- Grant Amount: ${grant.analysis?.grantAmount?.max ? `$${grant.analysis.grantAmount.max.toLocaleString()}` : 'Not specified'}
- Timeline: ${grant.analysis?.timeRelevance?.deadline || 'Not specified'}
- Project Scope: ${grant.description || 'Not specified'}

Key Deliverables:
${grant.analysis?.deliverables?.map(d => `- ${d}`).join('\n') || '- To be determined based on project goals\n- Must align with grant objectives\n- Should demonstrate measurable impact'}

Additional Notes:
- Status: ${grant.analysis?.timeRelevance?.isActive ? 'Active' : 'Inactive'}
- Validity Score: ${grant.analysis?.validityScore || 'N/A'}
            `;
            
            setRequirementsModal({
                isOpen: true,
                content: requirements,
                title: grant.title,
                description: grant.description
            });
            
        } catch (error) {
            toast.error('Failed to analyze grant requirements');
            console.error('Error:', error);
        }
    };

    // Table columns configuration
    const columns = useMemo(() => [
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ row }) => (
                <div className="max-w-md">
                    <a href={row.original.url} className="text-primary-600 hover:text-primary-800 font-medium">
                        {row.original.title}
                    </a>
                    <p className="text-sm text-gray-500 truncate">{row.original.description}</p>
                    {row.original.analysis?.timeRelevance?.isActive && (
                        <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Active
                            </span>
                            {row.original.analysis?.timeRelevance?.deadline && (
                                <span className="ml-2 text-xs text-gray-500">
                                    Due: {new Date(row.original.analysis.timeRelevance.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'analysis.grantAmount.max',
            Cell: ({ value }) => value ? `$${value.toLocaleString()}` : 'N/A',
            sortType: 'number'
        },
        {
            Header: 'Deadline',
            accessor: 'analysis.timeRelevance.deadline',
            Cell: ({ value, row }) => {
                if (!value) return 'N/A';
                const deadline = new Date(value);
                const now = new Date();
                const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                
                return (
                    <div className="flex flex-col">
                        <span>{deadline.toLocaleDateString()}</span>
                        {daysUntil > 0 && (
                            <span className={`text-xs ${
                                daysUntil <= 14 ? 'text-red-600' :
                                daysUntil <= 30 ? 'text-orange-600' :
                                'text-green-600'
                            }`}>
                                {daysUntil} days left
                            </span>
                        )}
                    </div>
                );
            },
            sortType: (rowA, rowB) => {
                const a = rowA.original.analysis?.timeRelevance?.deadline;
                const b = rowB.original.analysis?.timeRelevance?.deadline;
                if (!a && !b) return 0;
                if (!a) return 1;
                if (!b) return -1;
                return new Date(a) - new Date(b);
            }
        },
        {
            Header: 'Status',
            accessor: 'analysis.timeRelevance.isActive',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            Header: 'Validity',
            accessor: 'analysis.validityScore',
            Cell: ({ value }) => (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
            )
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="space-x-2">
                    <button
                        onClick={() => handleWriteGrant(row.original)}
                        className="inline-flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Requirements
                    </button>
                </div>
            )
        }
    ], []);

    // Table configurations
    const tableConfig = useMemo(
        () => ({
            columns,
            data: results,
            initialState: {
                sortBy: [
                    { id: 'analysis.timeRelevance.deadline', desc: false }
                ],
                filters: []
            }
        }),
        [columns, results]
    );

    // Initialize table with memoized config and plugins
    const table = useTable(
        tableConfig,
        useFilters,
        useSortBy
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Grant Finder</h1>
                    <BetaBadge className="ml-2" />
                </div>
                <p className="mt-2 text-gray-600">
                    Discover and analyze grant opportunities tailored to your organization
                </p>
            </div>

            {/* Search Section */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter keywords to search for grants..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Categories */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {defaultGrantCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setSearchTerm(category);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedCategory === category
                                    ? 'bg-primary-100 text-primary-800'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
                    <div className="overflow-x-auto">
                        <table {...table.getTableProps()} className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {column.render('Header')}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...table.getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                                {table.rows.map(row => {
                                    table.prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                                                    {cell.render('Cell')}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Requirements Modal */}
            {requirementsModal.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                                            Grant Requirements: {requirementsModal.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">{requirementsModal.description}</p>
                                        <div className="mt-4 bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh]">
                                            <pre className="whitespace-pre-wrap font-sans text-sm">
                                                {requirementsModal.content}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(requirementsModal.content);
                                        navigate('/grant-writer');
                                        toast.success('Requirements copied! Redirecting to Grant Writer...');
                                    }}
                                    className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Copy & Write Grant
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRequirementsModal({ isOpen: false, content: '', title: '', description: '' })}
                                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GrantFinder; 