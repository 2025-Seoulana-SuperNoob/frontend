"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import FeedbackEditor from "@/components/FeedbackEditor";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import api from "@/lib/api/axios";

interface Resume {
  _id: string;
  title: string;
  company: string;
  year: number;
  experience: string;
  position: string;
  questions: { question: string; answer: string }[];
}

interface Feedback {
  _id: string;
  content: string;
  walletAddress: string;
  createdAt: string;
  selections: {
    from: number;
    to: number;
  }[];
}

export default function FeedbackPage() {
  const { id } = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, feedbacksRes] = await Promise.all([
          api.get<Resume>(API_ENDPOINTS.RESUME.DETAIL(id as string)),
          api.get<Feedback[]>(API_ENDPOINTS.RESUME.FEEDBACK.LIST(id as string)),
        ]);
        setResume(resumeRes.data);
        setFeedbacks(feedbacksRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitFeedback = async (content: string) => {
    try {
      const response = await api.post<Feedback>(
        API_ENDPOINTS.RESUME.FEEDBACK.CREATE(id as string),
        {
          content,
          selections: [
            {
              from: 0, // TODO: 실제 선택 위치 정보 추가
              to: 0, // TODO: 실제 선택 위치 정보 추가
            },
          ],
          walletAddress: "Current User", // TODO: Solana 지갑 주소로 변경
        }
      );
      setFeedbacks([response.data, ...feedbacks]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-32 w-full mb-8" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          자기소개서를 찾을 수 없습니다
        </h1>
        <Link href="/resume" className="text-blue-500 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{resume.title}</h1>
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
        <h2 className="text-xl font-bold mb-4">피드백 작성</h2>
        <FeedbackEditor
          questions={resume.questions}
          onSubmit={handleSubmitFeedback}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">피드백 목록</h2>
        {feedbacks.length === 0 ? (
          <p>아직 작성된 피드백이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">
                    {feedback.walletAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: feedback.content }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
