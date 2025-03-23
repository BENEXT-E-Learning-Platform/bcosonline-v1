'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Shield,
} from 'lucide-react'

interface CustomVideoPlayerProps {
  url: string // URL of the video
  videoId: string // Unique identifier for the video
  title?: string
  isRTL?: boolean
  onError?: (error: string) => void
  apiEndpoint?: string // Endpoint to fetch secure URL
  tokenExpiryMinutes?: number // How long tokens are valid
  bucketName?: string // MinIO bucket name
}

// Interface for secure URL response from server
interface SecureUrlResponse {
  url: string
  expiresAt: number
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoId,
  title,
  isRTL = false,
  onError,
  apiEndpoint = '/api/video/getMinioSecureUrl',
  tokenExpiryMinutes = 15,
  bucketName = 'firstbucket',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [quality, setQuality] = useState<string>('auto')
  const [qualities] = useState<string[]>(['auto', '1080p', '720p', '480p', '360p'])
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState<boolean>(false)
  const [secureUrl, setSecureUrl] = useState<string>('')
  const [urlExpiry, setUrlExpiry] = useState<number>(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTimeRef = useRef<number>(0)
  const refreshUrlTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch secure presigned URL from MinIO
  const fetchSecureUrl = async () => {
    try {
      setIsLoading(true)

      // Request a presigned URL from the server
      const response = await fetch(`${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          bucketName,
          quality: quality !== 'auto' ? quality : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch secure URL: ${response.status}`)
      }

      const data: SecureUrlResponse = await response.json()

      if (!data.url) {
        throw new Error('Invalid response format from server')
      }

      // Set the secure URL and expiry time
      setSecureUrl(data.url)
      setUrlExpiry(data.expiresAt)

      // Schedule URL refresh at 80% of expiry time
      const timeUntilExpiry = data.expiresAt - Date.now()
      scheduleUrlRefresh(timeUntilExpiry * 0.8)
    } catch (err) {
      console.error('Error fetching secure URL:', err)
      setError('Failed to load secure video URL. Please try again.')
      setIsLoading(false)
      if (onError) onError((err as Error).message)
    }
  }

  // Schedule URL refresh before expiry
  const scheduleUrlRefresh = (timeMs: number) => {
    // Clear any existing timeout
    if (refreshUrlTimeoutRef.current) {
      clearTimeout(refreshUrlTimeoutRef.current)
    }

    refreshUrlTimeoutRef.current = setTimeout(() => {
      // Only refresh if video is still being watched
      if (videoRef.current && !videoRef.current.paused) {
        fetchSecureUrl()
      }
    }, timeMs)
  }

  // Initial fetch of secure URL
  useEffect(() => {
    fetchSecureUrl()

    return () => {
      // Clean up refresh timeout on unmount
      if (refreshUrlTimeoutRef.current) {
        clearTimeout(refreshUrlTimeoutRef.current)
      }
    }
  }, [videoId, apiEndpoint, quality, bucketName])

  // Initialize video player when secure URL is available
  useEffect(() => {
    const video = videoRef.current
    if (!video || !secureUrl) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      lastTimeRef.current = video.currentTime
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      setIsLoading(false)

      // Try to determine if the error is due to an expired URL
      if (urlExpiry && Date.now() > urlExpiry) {
        setError('Video session expired. Refreshing...')
        fetchSecureUrl()
        return
      }

      const err = 'Failed to load video. Please try again.'
      setError(err)
      console.error('Video error:', e)
      if (onError) onError(err)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const progressPercent = (bufferedEnd / video.duration) * 100
        setProgress(progressPercent)
      }
    }

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('progress', handleProgress)

    // Set video source to the presigned URL
    video.src = secureUrl
    video.load()

    // If we had a previous playback position, restore it
    if (lastTimeRef.current > 0) {
      video.currentTime = lastTimeRef.current
    }

    return () => {
      // Clean up event listeners
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('progress', handleProgress)
    }
  }, [secureUrl])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement
      setIsFullscreen(isInFullscreen)

      // Always show controls briefly when entering fullscreen
      if (isInFullscreen) {
        setShowControls(true)

        // Set a timeout to auto-hide controls if playing
        if (isPlaying && controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
          }, 3000)
        }
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isPlaying])

  // Handle mouse movement to show/hide controls
  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const handleMouseMove = () => {
      setShowControls(true)

      // Clear existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      // Set new timeout to hide controls
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const handleMouseLeave = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      // Don't auto-hide controls when in fullscreen mode unless playing
      if (isPlaying) {
        setShowControls(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show controls on any key press
      setShowControls(true)

      // Clear existing timeout and set a new one
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }

      // Space to toggle play/pause
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      }
      // Left arrow to seek backward
      else if (e.code === 'ArrowLeft') {
        const video = videoRef.current
        if (video) {
          video.currentTime = Math.max(0, video.currentTime - 10)
        }
      }
      // Right arrow to seek forward
      else if (e.code === 'ArrowRight') {
        const video = videoRef.current
        if (video) {
          video.currentTime = Math.min(video.duration, video.currentTime + 10)
        }
      }
      // F key to toggle fullscreen
      else if (e.code === 'KeyF') {
        toggleFullscreen()
      }
      // M key to toggle mute
      else if (e.code === 'KeyM') {
        toggleMute()
      }
    }

    player.addEventListener('mousemove', handleMouseMove)
    player.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      player.removeEventListener('mousemove', handleMouseMove)
      player.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('keydown', handleKeyDown)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, isFullscreen])

  // Prevent right-click menu and keyboard shortcuts for browser video controls
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent default browser shortcuts for video
      if (
        ['KeyI', 'KeyJ', 'KeyK', 'KeyL', 'Period', 'Comma'].includes(e.code) &&
        (e.ctrlKey || e.altKey)
      ) {
        e.preventDefault()
      }
    }

    video.addEventListener('contextmenu', preventRightClick)
    document.addEventListener('keydown', preventKeyboardShortcuts)

    return () => {
      video.removeEventListener('contextmenu', preventRightClick)
      document.removeEventListener('keydown', preventKeyboardShortcuts)
    }
  }, [])

  // Play/pause video
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      // Check if URL is expired before playing
      if (urlExpiry && Date.now() > urlExpiry) {
        setError('Video session expired. Refreshing...')
        fetchSecureUrl()
        return
      }

      video.play().catch((err) => {
        console.error('Play error:', err)
        setError('Failed to play video. Try again or check browser autoplay settings.')
      })
    }

    setIsPlaying(!isPlaying)
  }

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const seekTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = seekTime
    setCurrentTime(seekTime)
    lastTimeRef.current = seekTime
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
      video.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      video.muted = false
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const player = playerRef.current
    if (!player) return

    if (!document.fullscreenElement) {
      if (player.requestFullscreen) {
        player.requestFullscreen().catch((err) => {
          console.error('Fullscreen error:', err)
        })
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error('Exit fullscreen error:', err)
        })
      }
    }
  }

  // Change video quality
  const changeQuality = (newQuality: string) => {
    // Store current time and playback state to restore after quality change
    const currentPlaybackTime = lastTimeRef.current
    const wasPlaying = isPlaying

    setQuality(newQuality)
    setShowQualityMenu(false)

    // Refetch URL with new quality parameter
    setIsLoading(true)

    // The actual quality change happens in the fetchSecureUrl function
    // based on the quality state that we just updated
    fetchSecureUrl().then(() => {
      // When new video loads, restore position and playback state
      const video = videoRef.current
      if (video) {
        const handleQualityLoaded = () => {
          video.currentTime = currentPlaybackTime
          if (wasPlaying) {
            video.play()
          }
          video.removeEventListener('loadeddata', handleQualityLoaded)
        }

        video.addEventListener('loadeddata', handleQualityLoaded)
      }
    })
  }

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowPlaybackRateMenu(false)
  }

  // Format time (seconds -> MM:SS)
  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return '0:00'

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Retry loading the video
  const retryLoading = () => {
    setError(null)
    setIsLoading(true)
    fetchSecureUrl()
  }

  // Determine accent color
  const accentColor = '#91be3f'
  const accentColorOpacity = 'rgba(145, 190, 63, 0.7)'

  return (
    <div
      ref={playerRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'} ${isFullscreen ? 'fullscreen-mode' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {title && !isFullscreen && (
        <h3 className="px-4 py-3 font-medium border-b dark:border-gray-700 dark:text-white flex items-center">
          <Shield className="h-4 w-4 mr-2" style={{ color: accentColor }} />
          {title}
        </h3>
      )}

      <div className="relative aspect-video bg-black">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="flex flex-col items-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-2"
                style={{ borderColor: accentColor }}
              ></div>
              <div className="text-white text-sm">Loading secure video...</div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
            <div className="text-center text-white p-6">
              <p className="mb-4">{error}</p>
              <button
                onClick={retryLoading}
                className="px-4 py-2 text-white rounded flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Video element */}
            <video
              ref={videoRef}
              className="w-full h-full"
              onClick={togglePlay}
              playsInline
              style={{ objectFit: 'contain' }}
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture={true}
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Play/Pause overlay */}
            {!isPlaying && !isLoading && !error && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 text-white hover:bg-opacity-80 transition"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              >
                <Play className="h-8 w-8 fill-current" />
              </button>
            )}

            {/* Controls overlay (shows/hides on mouse movement) */}
            <div
              className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } ${isFullscreen ? 'fullscreen-controls pb-6' : ''}`}
            >
              {/* Controls */}
              <div className="bg-gradient-to-t from-black to-transparent pt-10 pb-2 px-4">
                {/* Progress bar container */}
                <div className="relative flex items-center mb-3">
                  {/* Buffered progress */}
                  <div
                    className="absolute h-1.5 bg-gray-500 rounded-lg"
                    style={{ width: `${progress}%` }}
                  ></div>

                  {/* Seek bar */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer relative z-10"
                    style={
                      {
                        backgroundColor: 'transparent',
                        accentColor: accentColor,
                        WebkitAppearance: 'none',
                        '--webkit-accent-color': accentColor,
                      } as React.CSSProperties
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause button */}
                    <button
                      onClick={togglePlay}
                      className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white" />
                      )}
                    </button>

                    {/* Volume controls */}
                    <div className="flex items-center group">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-white" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume * 100}
                        onChange={handleVolumeChange}
                        className={`w-0 group-hover:w-20 transition-all duration-300 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer ml-0 group-hover:ml-2 ${
                          isRTL ? 'mr-0 group-hover:mr-2' : ''
                        }`}
                        style={{
                          accentColor: accentColor,
                          WebkitAppearance: 'none',
                        }}
                      />
                    </div>

                    {/* Time display */}
                    <div className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Playback rate */}
                    <div className="relative">
                      <button
                        className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition text-white text-sm"
                        onClick={() => {
                          setShowPlaybackRateMenu(!showPlaybackRateMenu)
                          setShowQualityMenu(false)
                        }}
                      >
                        {playbackRate}x
                      </button>

                      {showPlaybackRateMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded shadow-lg py-2 min-w-24 z-20">
                          <div className="px-3 py-1 text-xs text-gray-400">Speed</div>
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                            <button
                              key={rate}
                              className={`w-full text-left px-4 py-1.5 text-sm hover:bg-gray-700 ${
                                rate === playbackRate ? 'text-white' : 'text-white'
                              }`}
                              style={{
                                color: rate === playbackRate ? accentColor : 'white',
                              }}
                              onClick={() => changePlaybackRate(rate)}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quality settings */}
                    <div className="relative">
                      <button
                        className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition text-white"
                        onClick={() => {
                          setShowQualityMenu(!showQualityMenu)
                          setShowPlaybackRateMenu(false)
                        }}
                      >
                        <Settings className="h-5 w-5" />
                      </button>

                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded shadow-lg py-2 min-w-32 z-20">
                          <div className="px-3 py-1 text-xs text-gray-400">Quality</div>
                          {qualities.map((q) => (
                            <button
                              key={q}
                              className={`w-full text-left px-4 py-1.5 text-sm hover:bg-gray-700 ${
                                q === quality ? 'text-white' : 'text-white'
                              }`}
                              style={{
                                color: q === quality ? accentColor : 'white',
                              }}
                              onClick={() => changeQuality(q)}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition text-white"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status bar - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div
          className={`flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}
        >
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {isRTL ? (
                <ChevronLeft className="h-4 w-4 inline" />
              ) : (
                <ChevronRight className="h-4 w-4 inline" />
              )}
              <span className="ml-1">{Math.round(progress)}% buffered</span>
            </div>
          </div>
        </div>
      )}

      {/* Add fullscreen styles */}
      <style jsx>{`
        .fullscreen-mode {
          width: 100vw !important;
          height: 100vh !important;
          background-color: black !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fullscreen-mode .aspect-video {
          height: 100% !important;
        }

        .fullscreen-controls {
          z-index: 10000;
        }

        /* Custom range input styling */
        input[type='range']::-webkit-slider-thumb {
          background-color: ${accentColor};
        }

        input[type='range']::-moz-range-thumb {
          background-color: ${accentColor};
        }

        input[type='range']::-ms-thumb {
          background-color: ${accentColor};
        }
      `}</style>
    </div>
  )
}

export default CustomVideoPlayer
