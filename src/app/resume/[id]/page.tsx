'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import api from '@/lib/api/axios';
import Skeleton from '@/components/Skeleton';
import FeedbackViewer from '@/components/FeedbackViewer';

interface Resume {
  _id: string;
  title: string;
  company: string;
  year: number;
  experience: string;
  position: string;
  questions: { question: string; answer: string }[];
  walletAddress: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  selectedText?: string;
  resumeId: string;
  walletAddress: string;
  createdAt: string;
}

export default function ResumePage() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, commentsRes] = await Promise.all([
          api.get<Resume>(API_ENDPOINTS.RESUME.DETAIL(params.id as string)),
          api.get<Comment[]>(API_ENDPOINTS.RESUME.FEEDBACK.LIST(params.id as string)),
        ]);
        setResume(resumeRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!resume) {
    return <div>자기소개서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{resume.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">회사</p>
            <p>{resume.company}</p>
          </div>
          <div>
            <p className="text-gray-600">연도</p>
            <p>{resume.year}</p>
          </div>
          <div>
            <p className="text-gray-600">경력</p>
            <p>{resume.experience}</p>
          </div>
          <div>
            <p className="text-gray-600">직무</p>
            <p>{resume.position}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">자기소개서 문항</h2>
        <div className="space-y-6">
          {resume.questions.map((q, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{index + 1}. {q.question}</h3>
              <p className="whitespace-pre-wrap">{q.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">피드백</h2>
        {comments.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">아직 작성된 피드백이 없습니다.</p>
          </div>
        ) : (
          <FeedbackViewer
            questions={resume.questions.map(q => q.question)}
            comments={comments.map(comment => ({
              id: comment._id,
              content: comment.content,
              quotedText: comment.selectedText,
              questionIndex: 0, // TODO: 실제 문항 인덱스 매핑 필요
              author: comment.walletAddress,
              createdAt: new Date(comment.createdAt)
            }))}
          />
        )}
      </div>
    </div>
  );
}
