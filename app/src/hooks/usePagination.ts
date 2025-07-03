import { useState, useMemo, useCallback } from 'react'

interface UsePaginationProps<T> {
  items: T[]
  itemsPerPage: number
}

interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  currentItems: T[]
  setCurrentPage: (page: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function usePagination<T>({
  items,
  itemsPerPage
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1)

  const { totalPages, currentItems } = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage)
    return { totalPages, currentItems }
  }, [items, currentPage, itemsPerPage])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  return {
    currentPage,
    totalPages,
    currentItems,
    setCurrentPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage
  }
}
