// app/(app)/courses/exams/[examId]/page.tsx
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Exam as PayloadExam } from '@/payload-types'
import ExamPageClient from './ExamPage.client'

// Fetch exam data
async function getExamData(examId: number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const examRes = await payload.findByID({
      collection: 'exams',
      id: examId,
      depth: 4, // Adjust depth as needed
    })

    return examRes as PayloadExam
  } catch (e) {
    console.error('Error fetching exam:', e)
    return null
  }
}

// Generate dynamic metadata for the exam page
export async function generateMetadata({
  params,
}: {
  params: { examId: number }
}): Promise<Metadata> {
  const { examId } = await params
  const exam = await getExamData(examId)

  if (!exam) {
    return {
      title: 'BCOS - Exam Not Found',
    }
  }

  return {
    title: `BCOS - ${exam.title}`,
    description: `Take the exam for ${exam.title} on BCOS`,
  }
}

export default async function ExamPage({ params }: { params: { examId: number } }) {
  const { examId } = await params
  const exam = await getExamData(examId)

  if (!exam) {
    return <div>Exam not found</div>
  }

  return (
    <div className="w-full h-screen">
      <ExamPageClient exam={exam} />
          
    </div>
  )
}
