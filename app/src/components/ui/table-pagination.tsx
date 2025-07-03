import { useMemo, useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}: TablePaginationProps) {
  const handlePreviousPage = useCallback(() => {
    onPageChange(Math.max(1, currentPage - 1))
  }, [currentPage, onPageChange])

  const handleNextPage = useCallback(() => {
    onPageChange(Math.min(totalPages, currentPage + 1))
  }, [totalPages, currentPage, onPageChange])

  const paginationItems = useMemo(
    () =>
      Array.from({ length: Math.min(maxVisiblePages, totalPages) }, (_, i) => ({
        page: i + 1,
        isActive: currentPage === i + 1
      })),
    [maxVisiblePages, totalPages, currentPage]
  )

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {paginationItems.map(({ page, isActive }) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={isActive}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
