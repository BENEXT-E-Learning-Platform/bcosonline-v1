'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Filter,
  Clock,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Badge,
} from 'lucide-react'
import { useDirection } from './direction-provider'
import { useMediaQuery } from '../hooks/use-media-query'
import { cn } from '../lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
import { Input } from './ui/input'

type Course = {
  id: string
  title: string
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
}

type CoursesContentProps = {
  initialCourses: Course[]
}

// Helper function to calculate course duration from curriculum
function getCourseDuration(course: Course) {
  if (!course?.curriculum || !Array.isArray(course.curriculum)) {
    return '1h 30m'
  }

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

export function CoursesContent({ initialCourses }: CoursesContentProps) {
  const { direction } = useDirection()
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Popular')

  // Use courses from props
  const courses = initialCourses

  // Categories (you might want to derive these from payload data)
  const categories = [
    'All',
    'Web Development',
    'Software Development',
    'UI/UX Design',
    'Education',
    'Design',
    'Marketing',
  ]

  // Sort options
  const sortOptions = [
    'Popular',
    'Newest',
    'Highest Rated',
    'Price: Low to High',
    'Price: High to Low',
  ]

  // Filter courses based on search and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Explore Courses</h1>
        <p className="text-muted-foreground">Discover new skills and expand your knowledge</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Course Name, Mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {!isMobile && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Category: {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(selectedCategory === category && 'bg-primary/10 font-medium')}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 min-w-[160px]">
                  Sort by: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={cn(sortBy === option && 'bg-primary/10 font-medium')}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Mobile filters */}
      {isMobile && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Courses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => {
          const modulesCount = course.curriculum?.length || 0
          const duration = getCourseDuration(course)

          return (
            <Link href={`/courses/${course.id}`} key={course.id}>
              <Card className="overflow-hidden group h-full cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <Image
                    src={course.image?.url || '/placeholder.svg'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {course.trending && (
                    <Badge className="absolute bottom-2 left-2 bg-primary text-white">
                      TRENDING
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>PK</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-xs font-medium">Instructor Name</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{course.students} Students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>{modulesCount} Modules</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 bg-primary text-white hover:bg-primary/90"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              3
            </Button>
            <span className="mx-1">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8">
              10
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* No results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter to find what you are looking for.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
