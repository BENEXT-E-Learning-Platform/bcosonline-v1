// components/itemRenderer.tsx

import React from 'react'
import {
  VideoContentViewer,
  PDFContentViewer,
  ExcelContentViewer,
  DocContentViewer,
} from './ContentViewers'

export interface ContentItem {
  id: string
  blockType: string
  title?: string
  description?: string
  videoUrl?: string
  pdfUrl?: string
  excelUrl?: string
  docUrl?: string
  fileName?: string
  fileType?: string
}

interface ContentItemRendererProps {
  item: ContentItem
}

const ContentItemRenderer: React.FC<ContentItemRendererProps> = ({ item }) => {
  // Helper function to determine content type from fileName if blockType isn't specific

  const determineFileType = (fileName: string): string => {
    if (!fileName) return 'unknown'

    const extension = fileName.split('.').pop()?.toLowerCase()

    if (!extension) return 'unknown'

    if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video'
    } else if (['pdf'].includes(extension)) {
      return 'pdf'
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return 'excel'
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word'
    }

    return 'unknown'
  }

  // Determine content type based on blockType or fileName
  const contentType =
    item.blockType === 'fileContent' && item.fileName
      ? determineFileType(item.fileName)
      : item.blockType === 'videoContent'
        ? 'video'
        : item.blockType === 'pdfContent'
          ? 'pdf'
          : item.blockType === 'excelContent'
            ? 'excel'
            : item.blockType === 'docContent'
              ? 'word'
              : 'unknown'

  // Get the appropriate file URL based on content type
  // Modified getFileUrl function in ContentItemRenderer to better handle Excel files
  const getFileUrl = (): string => {
    // If explicit URLs are provided, use them
    if (contentType === 'video' && item.videoUrl) return item.videoUrl
    if (contentType === 'pdf' && item.pdfUrl) return item.pdfUrl
    if (contentType === 'excel' && item.excelUrl) return item.excelUrl
    if (contentType === 'word' && item.docUrl) return item.docUrl

    // Add direct detection for Excel files
    if (
      contentType === 'excel' ||
      ['xlsx', 'xls', 'csv'].some((ext) => item.fileName?.toLowerCase().endsWith(ext))
    ) {
      // Check if fileName is already a full URL
      if (item.fileName?.startsWith('http') || item.fileName?.startsWith('/')) {
        return item.fileName
      }
      // Otherwise build API URL
      if (item.fileName) {
        return `/api/files?fileName=${encodeURIComponent(item.fileName)}`
      }
    }

    // Otherwise, use the fileName if available
    if (item.fileName) {
      // This would be where you'd construct the URL to access the file
      return `/api/files?fileName=${encodeURIComponent(item.fileName)}`
    }

    return ''
  }

  // Render the appropriate content viewer based on content type
  const renderContentViewer = () => {
    const fileUrl = getFileUrl()

    switch (contentType) {
      case 'video':
        return <VideoContentViewer url={fileUrl} title={item.title} />
      case 'pdf':
        return <PDFContentViewer url={fileUrl} title={item.title} />
      case 'excel':
        return <ExcelContentViewer url={fileUrl} title={item.title} />
      case 'word':
        return <DocContentViewer url={fileUrl} title={item.title} />
      case 'quizQuestion':
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium mb-3">{item.title}</h3>
            {item.description && <p className="text-gray-700">{item.description}</p>}
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium mb-3">{item.title || 'Content'}</h3>
            {item.description && <p className="text-gray-700">{item.description}</p>}
          </div>
        )
    }
  }

  return <div className="mb-8">{renderContentViewer()}</div>
}

export default ContentItemRenderer
