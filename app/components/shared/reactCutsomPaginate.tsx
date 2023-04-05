

import ReactPaginate from "react-paginate";
import React from "react";


interface Props {
    pageRangeDisplayed? : number,
    marginPagesDisplayed? : number,
    pageCount? : number,
    page? : number,
    onPageChangeHandler : (selected : { selected : number }) => void
}

export default function ReactCustomPaginate({ pageRangeDisplayed = 3 ,  marginPagesDisplayed = 2 , pageCount = 0 , page = 0 , onPageChangeHandler } : Props) {

    return (
        pageCount > 1
            ? (
                <ReactPaginate
                    className="relative mt-4 z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    breakLabel="..."
                    breakClassName="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    nextLabel="بعدی"
                    nextClassName="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    pageRangeDisplayed={pageRangeDisplayed}
                    marginPagesDisplayed={marginPagesDisplayed}
                    activeClassName="z-10 bg-sky-50 border-sky-500 text-sky-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    onPageChange={onPageChangeHandler}
                    forcePage={page - 1}
                    pageCount={pageCount}
                    pageClassName="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    previousLabel="قبلی"
                    previousClassName="relative inline-flex items-center text-sm px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    renderOnZeroPageCount={undefined}
                />
            )
            : null
    )
}