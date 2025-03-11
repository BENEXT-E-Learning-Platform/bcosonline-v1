'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, Users, Play } from 'lucide-react'
import { useDirection } from './direction-provider'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'

// Define prop types
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
}

type DashboardContentProps = {
  initialCourses: Course[]
}

export function DashboardContent({ initialCourses }: DashboardContentProps) {
  const { direction } = useDirection()
  const [activeTab, setActiveTab] = useState('all')
  const [courses] = useState(initialCourses)
  const [userProgress] = useState(() => {
    // Initialize mock user progress
    const progress = {}
    initialCourses.forEach((course) => {
      progress[course.id] = Math.floor(Math.random() * 80) + 10 // Random progress between 10-90%
    })
    return progress
  })

  // Featured course is the first course in the list
  const featuredCourse =
    courses.length > 0
      ? courses[0]
      : {
          id: 'featured',
          title: 'Sharpen Your Skills With Professional Online Courses',
          cta: 'Join Now',
        }

  // Recently watched courses (first 3)
  const watchedCourses = courses.slice(0, 3).map((course) => ({
    id: course.id,
    title: course.title,
    progress: userProgress[course.id] || 0,
  }))

  // Continue watching courses
  const continueCourses = courses.slice(0, 3).map((course) => {
    const mediaUrl =
      course.image?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'

    return {
      id: course.id,
      title: course.title,
      image: mediaUrl,
      instructor: 'Instructor Name', // Could be added to your course schema
      role: 'Software Developer',
      progress: userProgress[course.id] || 0,
    }
  })

  // Current course (for the sidebar)
  const currentCourse =
    courses.length > 0
      ? {
          id: courses[0].id,
          title: courses[0].title,
          instructor: 'Instructor Name',
          students: 500, // Could be fetched from enrollment count
          duration: getCourseDuration(courses[0]),
          progress: userProgress[courses[0].id] || 0,
          modules: getModulesFromCurriculum(courses[0]),
          image:
            courses[0].image?.url || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        }
      : {
          id: 'current',
          title: 'UX Design: How To Implement Usability Testing',
          instructor: 'Alfredo Rhiel Madsen',
          students: 500,
          duration: '1h 30m',
          progress: 40,
          modules: [{ id: 1, title: 'Introduction', duration: '10:00' }],
          image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        }

  // Helper function to extract modules from curriculum blocks
  function getModulesFromCurriculum(course) {
    if (!course?.curriculum || !Array.isArray(course.curriculum)) {
      return [{ id: 1, title: 'Introduction', duration: '10:00' }]
    }

    return course.curriculum.map((block, index) => {
      // You could extract more details based on block type (video or quiz)
      const blockType = block.blockType
      const title =
        blockType === 'video'
          ? block.title || 'Video Lesson'
          : 'Quiz: ' + (block.title || 'Assessment')

      // Estimate duration based on block type
      const duration =
        blockType === 'video'
          ? '10:00' // Mock duration, you could add actual duration to your schema
          : '15:00'

      return {
        id: index + 1,
        title: title,
        duration: duration,
      }
    })
  }

  // Helper function to calculate course duration from curriculum
  function getCourseDuration(course) {
    if (!course?.curriculum || !Array.isArray(course.curriculum)) {
      return '1h 30m'
    }

    // Mock durations based on block types
    // You could add actual duration fields to your schema
    const totalMinutes = course.curriculum.reduce((total, block) => {
      if (block.blockType === 'video') {
        return total + 10 // Assume 10 min per video
      } else {
        return total + 15 // Assume 15 min per quiz
      }
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  // Mock mentors data - Could be replaced with actual mentors from Payload
  const mentors = [
    {
      id: 1,
      name: 'Prashant Kumar Singh',
      role: 'Instructor',
      date: '25/10/2023',
      course: 'Understanding Concept Of React',
      courseId: 'react-concepts',
      image: 'https://github.com/shadcn.png',
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      role: 'Instructor',
      date: '25/10/2023',
      course: 'Understanding Concept Of React',
      courseId: 'react-basics',
      image: 'https://github.com/shadcn.png',
    },
  ]

  const ChevronPrev = direction === 'rtl' ? ChevronRight : ChevronLeft
  const ChevronNext = direction === 'rtl' ? ChevronLeft : ChevronRight

  // Show message if no courses available
  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">No courses available.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Welcome message */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Good Morning, Prashant</h1>
              <p className="text-muted-foreground">Continue Your Journey And Achieve Your Target</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="icon">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured course */}
          <Link href={`/courses/${featuredCourse.id}`}>
            <Card className="bg-primary text-primary-foreground overflow-hidden relative hover:bg-primary/90 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="max-w-md">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">{featuredCourse.title}</h2>
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    {featuredCourse.cta}
                  </Button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-32 h-32 rounded-full border-4 border-primary-foreground/20 hidden md:block"></div>
                <div className="absolute bottom-0 right-20 w-16 h-16 rounded-full bg-secondary/20 hidden md:block"></div>
              </CardContent>
            </Card>
          </Link>

          {/* Watched courses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchedCourses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">2/8 Watched</p>
                        <h3 className="font-medium">{course.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon">
                        <svg
                          width="4"
                          height="16"
                          viewBox="0 0 4 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current"
                        >
                          <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" />
                        </svg>
                      </Button>
                    </div>
                    <Progress value={course.progress} className="h-1 mt-4" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Continue watching */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Continue Watching</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronPrev className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronNext className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {continueCourses.map((course) => (
                <Link href={`/courses/${course.id}`} key={course.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative aspect-video">
                      <Image
                        src={course.image || '/placeholder.svg'}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="icon" className="rounded-full bg-white/90 hover:bg-white">
                          <Play className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-accent text-accent-foreground">TRENDING</Badge>
                      <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>PK</AvatarFallback>
                        </Avatar>
                        <div className="ml-2">
                          <p className="text-sm font-medium">{course.instructor}</p>
                          <p className="text-xs text-muted-foreground">{course.role}</p>
                        </div>
                      </div>
                      <Progress value={course.progress} className="h-1 mt-4" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mentors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Mentor</h2>
              <Button variant="link" className="text-accent">
                See All
              </Button>
            </div>

            <div className="space-y-4">
              {mentors.map((mentor) => (
                <Link href={`/courses/${mentor.courseId}`} key={mentor.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={mentor.image} />
                            <AvatarFallback>PK</AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="font-medium">{mentor.name}</p>
                            <p className="text-sm text-muted-foreground">{mentor.date}</p>
                          </div>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">TRENDING</Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm hover:text-primary transition-colors">
                          {mentor.course}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Show details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar - Current course */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Today</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <ChevronPrev className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <ChevronNext className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Link href={`/courses/${currentCourse.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative aspect-video">
                  <Image
                    src={currentCourse.image}
                    alt="Course thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge className="mb-2">Beginner</Badge>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AM</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <h3 className="font-bold hover:text-primary transition-colors">
                    {currentCourse.title}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{currentCourse.students} Student</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{currentCourse.duration}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{currentCourse.progress}%</span>
                    </div>
                    <Progress value={currentCourse.progress} className="h-1" />
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">5 Modules</h4>
                    <div className="space-y-3">
                      {currentCourse.modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span className="w-5 text-muted-foreground">{module.id}</span>
                            <span>{module.title}</span>
                          </div>
                          <span className="text-muted-foreground">{module.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-primary">Go to detail</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
