'use client'

import dynamic from 'next/dynamic'

import { useState, useEffect, useRef } from 'react'
//import { Document, Page } from 'react-pdf'
import { Spreadsheet } from 'react-spreadsheet'
import { ChevronRight, ChevronLeft, Download, Maximize, Minimize } from 'lucide-react'

// Set up PDF.js worker with a fallback mechanism
//import * as pdfjs from 'pdfjs-dist'
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// Use a CDN for the worker script
/*pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf_viewer.min.css' //`//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`

if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  console.error('PDF.js worker script not specified.')
}*/

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), {
  ssr: false,
  loading: () => <div className="flex justify-center p-10">Loading PDF viewer...</div>,
})

const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
})

// Types for content viewers
interface VideoContentProps {
  url: string
  title?: string
}

interface PDFContentProps {
  url: string
  title?: string
}

interface ExcelContentProps {
  url: string
  title?: string
}

interface DocContentProps {
  url: string
  title?: string
}

// Video Content Viewer
export const VideoContentViewer = ({ url, title }: VideoContentProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Handle video loading events
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedData = () => {
      setLoading(false)
    }

    const handleError = () => {
      setLoading(false)
      setError('Failed to load the video. Please try again.')
    }

    videoElement.addEventListener('loadeddata', handleLoadedData)
    videoElement.addEventListener('error', handleError)

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData)
      videoElement.removeEventListener('error', handleError)
    }
  }, [url])

  // Handle empty URLs
  if (!url) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">No video URL provided</div>
      </div>
    )
  }

  const toggleFullscreen = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow w-50 h-50">
      {title && <h3 className="px-4 py-3 font-medium border-b">{title}</h3>}
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            id="course-video"
            src={url}
            className="w-full h-auto"
            controls
            controlsList="nodownload"
          />
        )}

        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

// PDF Content Viewer
export const PDFContentViewer = ({ url, title }: PDFContentProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle empty URLs
  if (!url) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">No PDF URL provided</div>
      </div>
    )
  }

  // Process the URL to ensure it's correctly formatted
  const processedUrl =
    url.startsWith('http') || url.startsWith('/')
      ? url
      : `/api/files?fileName=${encodeURIComponent(url)}`

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF loading error:', error)
    setError('Failed to load the PDF. Please try downloading it instead.')
    setIsLoading(false)
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset
      if (newPage >= 1 && newPage <= (numPages || 1)) {
        return newPage
      }
      return prevPageNumber
    })
  }

  const previousPage = () => changePage(-1)
  const nextPage = () => changePage(1)

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.2, 2.0))
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.2, 0.6))

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      {title && <h3 className="px-4 py-3 font-medium border-b">{title}</h3>}

      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="px-2 py-1 bg-white border rounded text-sm"
            disabled={scale <= 0.6}
          >
            -
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-2 py-1 bg-white border rounded text-sm"
            disabled={scale >= 2.0}
          >
            +
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="mx-2 text-sm">
            {pageNumber} / {numPages || '?'}
          </span>
          <button
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <a
          href={processedUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 flex justify-center py-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <a
              href={processedUrl}
              download
              className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded"
            >
              Download PDF
            </a>
          </div>
        ) : (
          <Document
            file={processedUrl} // Use the actual PDF URL instead of Mozilla viewer
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="flex justify-center p-10">Loading PDF...</div>}
            error={<div className="text-red-500 p-10">Error loading the PDF</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              loading={
                <div className="flex justify-center items-center h-64 w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }
            />
          </Document>
        )}
      </div>
    </div>
  )
}

export const ExcelContentViewer = ({ url, title }: ExcelContentProps) => {
  const [data, setData] = useState<any[][]>([])
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [activeSheet, setActiveSheet] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('Rendering ExcelContentViewer with URL:', url, 'Title:', title)

  // Extract filename from URL
  const fileName = url ? url.split('/').pop() : 'Excel file'

  useEffect(() => {
    if (!url) {
      setLoading(false)
      setError('No Excel file URL provided')
      return
    }

    console.log('Starting Excel file parsing...')

    // Function to fetch and parse Excel file
    const parseExcelFile = async () => {
      try {
        setLoading(true)

        // Import XLSX dynamically only when needed
        const XLSX = await import('xlsx')

        // Fetch the Excel file
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status}`)
        }

        // Convert response to array buffer
        const arrayBuffer = await response.arrayBuffer()

        // Parse workbook
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })

        // Get all sheet names
        const sheets = workbook.SheetNames
        setSheetNames(sheets)

        if (sheets.length > 0) {
          // Set first sheet as active by default
          setActiveSheet(sheets[0])

          // Parse the first sheet
          const worksheet = workbook.Sheets[sheets[0]]

          // Convert to array of arrays (with header: 1 option)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          // Format for react-spreadsheet (convert to cells with value property)
          const formattedData = jsonData.map((row: any) =>
            Array.isArray(row)
              ? row.map((cell: any) => ({ value: cell === null ? '' : String(cell) }))
              : [{ value: row === null ? '' : String(row) }],
          )

          setData(formattedData)
        }

        setLoading(false)
      } catch (err) {
        console.error('Excel parsing error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error parsing Excel file')
        setLoading(false)
      }
    }

    parseExcelFile()

    return () => {
      // Cleanup if needed
      console.log('Excel viewer component cleanup')
    }
  }, [url])

  // Handle sheet switching
  const switchSheet = async (sheetName: string) => {
    if (!url || activeSheet === sheetName) return

    try {
      setLoading(true)

      // Import XLSX dynamically
      const XLSX = await import('xlsx')

      // Fetch and parse again (could optimize by caching workbook)
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })

      // Get the selected worksheet
      const worksheet = workbook.Sheets[sheetName]

      // Convert to array of arrays
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      // Format for react-spreadsheet
      const formattedData = jsonData.map((row: any) =>
        Array.isArray(row)
          ? row.map((cell: any) => ({ value: cell === null ? '' : String(cell) }))
          : [{ value: row === null ? '' : String(row) }],
      )

      setActiveSheet(sheetName)
      setData(formattedData)
      setLoading(false)
    } catch (err) {
      console.error('Error switching sheets:', err)
      setError('Failed to switch sheets')
      setLoading(false)
    }
  }

  if (loading) {
    console.log('Component is in loading state.')
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="mr-3">Loading Excel data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 text-center">{error}</div>
        <div className="mt-4 text-center">
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Download File
          </a>
        </div>
      </div>
    )
  }

  console.log('Rendering Excel data interface for file:', fileName)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {title && <h3 className="px-4 py-3 font-medium border-b">{title}</h3>}

      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <div className="flex space-x-2 overflow-x-auto">
          {sheetNames.map((sheet) => (
            <button
              key={sheet}
              onClick={() => switchSheet(sheet)}
              className={`px-3 py-1 text-sm rounded ${
                activeSheet === sheet
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sheet}
            </button>
          ))}
        </div>
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </div>

      <div className="overflow-auto" style={{ maxHeight: '500px' }}>
        {data.length > 0 ? (
          <Spreadsheet data={data} />
        ) : (
          <div className="p-8 text-center text-gray-500">No data available in this sheet</div>
        )}
      </div>
    </div>
  )
}

// Doc Content Viewer (for Word documents)
export const DocContentViewer = ({ url, title }: DocContentProps) => {
  // Handle empty URLs
  if (!url) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">No URL provided for Word document</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {title && <h3 className="px-4 py-3 font-medium border-b">{title}</h3>}

      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-500">Word Document</span>
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </div>

      <div className="p-6 text-center">
        <p className="mb-4 text-gray-700">
          Word documents cannot be viewed directly. Please download the file to view it.
        </p>
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download className="h-5 w-5 mr-2" />
          Download File
        </a>
      </div>
    </div>
  )
}
