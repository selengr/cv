"use client";

import ReactPaginate from "react-paginate";

interface Props {
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
  pageCount?: number;
  page?: number;
  onPageChangeHandler: (selected: { selected: number }) => void;
}

export default function ReactCustomPaginate({
  pageRangeDisplayed = 3,
  marginPagesDisplayed = 2,
  pageCount = 0,
  page = 0,
  onPageChangeHandler,
}: Props) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      className="relative z-0 mt-4 -space-x-px inline-flex rounded-md shadow-sm"
      breakLabel="..."
      breakClassName="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
      nextLabel="بعدی"
      nextClassName="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      activeClassName="relative z-10 inline-flex items-center border border-sky-500 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600"
      onPageChange={onPageChangeHandler}
      forcePage={Math.max(page - 1, 0)}
      pageCount={pageCount}
      pageClassName="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      previousLabel="قبلی"
      previousClassName="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      renderOnZeroPageCount={null}
    />
  );
}
