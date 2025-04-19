import React from 'react';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import './Pagination.css';

const Pagination = ({
    currentPage,
    setCurrentPage,
    totalItems,
    itemsPerPage = 50,
    scrollToTop = true
}) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (scrollToTop) {
            document.getElementById("top")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    // If there's only one page or no items, don't show pagination
    if (totalPages <= 1 || totalItems === 0) return null;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Always show first page
        pageNumbers.push(1);

        // Calculate range around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're near the start or end
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(totalPages - 4, 2);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // Add pages around current page
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="pagination-container d-flex justify-content-center mt-4">
            <button
                className="btn btn-outline-danger pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeft />
            </button>

            {getPageNumbers().map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        className={`btn pagination-btn ${page === currentPage
                            ? "btn-danger active"
                            : "btn-outline-danger"
                            }`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className="btn btn-outline-danger pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ArrowRight />
            </button>
        </div>
    );
};

export default Pagination; 