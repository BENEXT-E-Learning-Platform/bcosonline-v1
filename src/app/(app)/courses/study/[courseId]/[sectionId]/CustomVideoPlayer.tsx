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
  DownloadCloud,
} from 'lucide-react'

interface CustomVideoPlayerProps {
  url: string
  title?: string
  isRTL?: boolean
  onError?: (error: string) => void
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  url,
  title,
  isRTL = false,
  onError,
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

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize video player
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      setIsLoading(false)
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

    // Load the video directly
    video.src = url
    video.load()

    return () => {
      // Clean up event listeners
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('progress', handleProgress)
    }
  }, [url, onError])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

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
      if (isPlaying) {
        setShowControls(false)
      }
    }

    player.addEventListener('mousemove', handleMouseMove)
    player.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      player.removeEventListener('mousemove', handleMouseMove)
      player.removeEventListener('mouseleave', handleMouseLeave)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // Play/pause video
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
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
    setQuality(newQuality)
    setShowQualityMenu(false)

    // Here you would implement quality switching logic
    console.log(`Quality changed to ${newQuality}`)
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

    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  if (!url) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">No video URL provided</div>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {title && (
        <h3 className="px-4 py-3 font-medium border-b dark:border-gray-700 dark:text-white">
          {title}
        </h3>
      )}

      <div className="relative aspect-video bg-black">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-2"></div>
              <div className="text-white text-sm">Loading video...</div>
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
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
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
            />

            {/* Play/Pause overlay */}
            {!isPlaying && !isLoading && !error && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full p-4 text-white hover:bg-opacity-80 transition"
              >
                <Play className="h-8 w-8 fill-current" />
              </button>
            )}

            {/* Controls overlay (shows/hides on mouse movement) */}
            <div
              className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
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
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 relative z-10"
                    style={{ backgroundColor: 'transparent' }}
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
                        className={`w-0 group-hover:w-20 transition-all duration-300 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer ml-0 group-hover:ml-2 accent-blue-500 ${
                          isRTL ? 'mr-0 group-hover:mr-2' : ''
                        }`}
                      />
                    </div>

                    {/* Time display */}
                    <div className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quality settings */}
                    <div className="relative">
                      <button
                        className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition text-white"
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
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
                                q === quality ? 'text-blue-400' : 'text-white'
                              }`}
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

      {/* RTL/LTR controls - for demonstration outside the player */}
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
        <div className="flex items-center">
          <button className="flex items-center text-sm text-blue-600 dark:text-blue-400">
            <DownloadCloud className="h-4 w-4 mr-1" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomVideoPlayer
