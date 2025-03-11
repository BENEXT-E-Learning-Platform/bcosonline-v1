'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MoreVertical,
  Clock,
  Users,
  BookOpen,
  Star,
  Download,
  Share2,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Badge,
} from 'lucide-react'
import { useMediaQuery } from '../hooks/use-media-query'
import { cn } from '../lib/utils'
import { useDirection } from './direction-provider'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'

type Course = {
  id: string
  title: string
  description: string
  image: {
    url: string
  }
  curriculum: Array<{
    blockType: string
    title?: string
  }>
  category: string
  trending: boolean
  students: number
  instructor: string
  instructorRole: string
  enrolled: boolean
  progress: number
  rating: number
  keyPoints: string[]
  assignments: Array<{
    id: string
    title: string
    description: string
    dueDate: string
    points: number
  }>
  tools: Array<{
    name: string
    description: string
    link: string
    icon: string
  }>
  reviews: Array<{
    id: string
    user: string
    avatar: string
    rating: number
    date: string
    comment: string
  }>
  relatedCourses: Course[]
}

type CourseDetailProps = {
  course: Course
}

// Helper functions
function getCourseDuration(course: Course) {
  if (!course?.curriculum || !Array.isArray(course.curriculum)) {
    return '1h 30m'
  }

  const totalMinutes = course.curriculum.reduce((total, block) => {
    if (block.blockType === 'video') return total + 10
    return total + 15
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function getModulesFromCurriculum(course: Course) {
  if (!course?.curriculum || !Array.isArray(course.curriculum)) {
    return []
  }

  return course.curriculum.map((block, index) => ({
    id: `${index + 1}`,
    title: block.title || `Module ${index + 1}`,
    duration: block.blockType === 'video' ? '10:00' : '15:00',
    completed: false,
    current: index === 0,
  }))
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { direction } = useDirection()
  const modules = getModulesFromCurriculum(course)
  const duration = getCourseDuration(course)

  // Mock data - In real app, fetch this based on courseId
  // const course = {
  //   id: courseId,
  //   title: 'Animation is the Key of Successful UI/UX Design',
  //   instructor: 'Prashant Kumar Singh',
  //   instructorRole: 'Software Developer',
  //   enrolled: false, // Toggle this to show different states
  //   progress: 40,
  //   duration: '1h 30m',
  //   students: 500,
  //   modules: 5,
  //   rating: 4.5,
  //   reviews: 120,
  //   description: `The successful UI/UX design application is that is a feature-story solution technology.
  //   In this course, you will learn a complete UI/UX design for developers and UI/UX design.
  //   In this course, you can create a mobile application UI/UX design from scratch.

  //   So before a developer, we are not required to be a professional designer. So this course is specially designed for developers who want to learn UI/UX design from scratch. Here, you will learn how to create a mobile application UI/UX design from scratch. This design may vary based on the basis of making interface elements and graphics for applications or websites that focus on maximizing usability and creating the best user experience. That's why UI/UX design is important for any application that can help to make it more interesting and easy to use.

  //   To explain UI/UX in a simple way, how to create a UI/UX application UI/UX design from scratch. In this course, you will learn how to create a mobile application UI/UX design from scratch. This design may vary based on the basis of making interface elements and graphics for applications or websites that focus on maximizing usability and creating the best user experience. That's why UI/UX design is important for any application that can help to make it more interesting and easy to use.

  //   The course is suitable for those of you who want to deepen mobile application development, especially in the field of UI/UX design. This course is also suitable for those of you who want to explore the world as your personal business needs. If you encounter difficulties while studying, please ask our Mentor directly through the "Ask our Mentor" feature.`,
  //   keyPoints: [
  //     'Understand the basics of UI/UX design & Animation',
  //     'Understand the basics of Figma prototypes',
  //     'Creating animation 2D animation using adobe app',
  //     'Preventing designing using animation',
  //   ],
  //   modules: [
  //     { id: 1, title: 'Introduction', duration: '10:00', completed: true, current: false },
  //     { id: 2, title: 'What is UX Design', duration: '10:00', completed: true, current: false },
  //     { id: 3, title: 'Usability Testing', duration: '10:00', completed: false, current: true },
  //     {
  //       id: 4,
  //       title: 'Create Usability Test',
  //       duration: '30:00',
  //       completed: false,
  //       current: false,
  //     },
  //     { id: 5, title: 'How to Implement', duration: '30:00', completed: false, current: false },
  //   ],
  //   relatedCourses: [
  //     {
  //       id: 1,
  //       title: "Beginner's Guide To Becoming A Professional Frontend Developer",
  //       image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  //       instructor: 'Prashant Kumar Singh',
  //     },
  //     {
  //       id: 2,
  //       title: 'How To Create Your Online Course',
  //       image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
  //       instructor: 'Prashant Kumar Singh',
  //     },
  //     {
  //       id: 3,
  //       title: 'Learn Software Development With Us',
  //       image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  //       instructor: 'Prashant Kumar Singh',
  //     },
  //     {
  //       id: 4,
  //       title: "Beginner's Guide To Becoming A Professional Frontend Developer",
  //       image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  //       instructor: 'Prashant Kumar Singh',
  //     },
  //   ],
  //   assignments: [
  //     {
  //       id: 1,
  //       title: 'Create a simple animation',
  //       description: 'Create a simple animation using the techniques learned in the course.',
  //       dueDate: '2023-12-31',
  //       points: 100,
  //     },
  //     {
  //       id: 2,
  //       title: 'Design a mobile app interface',
  //       description: 'Design a mobile app interface using the principles learned in the course.',
  //       dueDate: '2024-01-15',
  //       points: 150,
  //     },
  //   ],
  //   tools: [
  //     {
  //       name: 'Figma',
  //       description: 'Design and prototype tool',
  //       link: 'https://figma.com',
  //       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  //     },
  //     {
  //       name: 'Adobe XD',
  //       description: 'UI/UX design tool',
  //       link: 'https://adobe.com/products/xd.html',
  //       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg',
  //     },
  //     {
  //       name: 'Adobe After Effects',
  //       description: 'Animation tool',
  //       link: 'https://adobe.com/products/aftereffects.html',
  //       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg',
  //     },
  //   ],
  //   reviews: [
  //     {
  //       id: 1,
  //       user: 'John Doe',
  //       avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  //       rating: 5,
  //       date: '2023-10-15',
  //       comment: 'Great course! I learned a lot about UI/UX design and animation.',
  //     },
  //     {
  //       id: 2,
  //       user: 'Jane Smith',
  //       avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  //       rating: 4,
  //       date: '2023-09-20',
  //       comment: 'Very informative course. The instructor explains concepts clearly.',
  //     },
  //   ],
  // }

  // Video player controls
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setVideoProgress(isNaN(progress) ? 0 : progress)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setVideoProgress(0)
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const value = parseInt(e.target.value)
    setVolume(value)
    video.volume = value / 100
    if (value === 0) {
      setIsMuted(true)
      video.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      video.muted = false
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const value = parseInt(e.target.value)
    setVideoProgress(value)
    video.currentTime = (value / 100) * video.duration
  }

  const toggleFullscreen = () => {
    const container = videoContainerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-6',
        direction === 'rtl' ? 'text-right' : 'text-left',
      )}
    >
      {/* Main content */}
      <div className="flex-1">
        {/* Video player */}
        <div
          ref={videoContainerRef}
          className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6"
        >
          <video
            ref={videoRef}
            poster={course.image?.url || '/placeholder.svg'}
            className="w-full h-full object-cover"
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </div>
          )}

          {/* Video controls */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={videoProgress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
                  <div className="text-xs text-white">00:30 / 10:00</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={toggleMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    {showVolumeSlider && (
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/80 rounded-md"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students} Students</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.curriculum?.length || 0} Modules</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>
                  {course.rating} ({course.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Add to Wishlist</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download Resources</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Instructor */}
        {/* <div className="flex items-center gap-3 mb-6">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{course.instructor}</p>
            <p className="text-sm text-muted-foreground">{course.instructorRole}</p>
          </div>
        </div> */}

        {/* Tabs */}
        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="about"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="assignment"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              Assignment
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              Tools
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 pt-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="text-muted-foreground space-y-4">
                {course.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Key Points</h2>
              <ul className="space-y-2">
                {course.keyPoints?.map((point, index) => (
                  <li key={index} className="...">
                    <div className="..." />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="space-y-6 pt-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Course Assignments</h2>
              <div className="space-y-4">
                {/* {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <Badge>{assignment.points} points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 pt-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Required Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* {course.tools.map((tool) => (
                  <div key={tool.name} className="border rounded-lg p-4 flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image
                        src={tool.icon || '/placeholder.svg?height=48&width=48'}
                        alt={tool.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6 pt-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Student Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-5 w-5',
                          star <= Math.round(course.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300',
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{course.rating}</span>
                  {/* <span className="text-muted-foreground">({course.reviews} reviews)</span> */}
                </div>
              </div>

              <div className="space-y-4">
                {/* {course.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{review.user}</h3>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300',
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Related Courses</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {course.relatedCourses?.map((relatedCourse) => (
              <Link key={relatedCourse.id} href={`/courses/${relatedCourse.id}`}>
                <Card key={relatedCourse.id} className="overflow-hidden group">
                  <div className="relative aspect-video">
                    <Image
                      src={relatedCourse.image?.url || '/placeholder.svg'}
                      alt={relatedCourse.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {relatedCourse.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>PK</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{relatedCourse.instructor}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar - Course modules */}
      <div className="w-full lg:w-80">
        <div className="lg:sticky lg:top-6 space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{course.curriculum?.length || 0} Modules</h2>
              {course.enrolled && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-md transition-colors',
                      module.current && 'bg-primary/10',
                      module.completed && 'bg-muted',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex items-center justify-center h-6 w-6 rounded-full border text-xs font-medium',
                          module.completed && 'bg-primary border-primary text-white',
                          module.current && 'border-primary text-primary',
                        )}
                      >
                        {module.completed ? <CheckCircle2 className="h-4 w-4" /> : module.id}
                      </div>
                      <div>
                        <p
                          className={cn(
                            'font-medium',
                            module.completed && 'text-muted-foreground line-through',
                          )}
                        >
                          {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{module.duration}</p>
                      </div>
                    </div>
                    {module.current && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              {course.enrolled ? (
                <Button className="w-full bg-primary hover:bg-primary/90">Continue Learning</Button>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90">Enroll Now</Button>
              )}
            </div>
          </div>

          {/* Certificate info */}
          {course.enrolled && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-medium mb-2">Course Certificate</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete all modules to earn your certificate of completion
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">{course.progress}%</span> completed
                </div>
                <Button variant="outline" size="sm" disabled={course.progress < 100}>
                  View Certificate
                </Button>
              </div>
            </div>
          )}

          {/* Download resources */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="font-medium mb-2">Course Resources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download course materials and resources
            </p>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
