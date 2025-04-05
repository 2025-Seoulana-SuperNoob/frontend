'use client';

import { useState } from 'react';
import Link from 'next/link';
import FeedbackEditor from '@/components/FeedbackEditor';

// 임시 데이터
const SAMPLE_RESUME = {
  title: '프론트엔드 개발자 지원서',
  company: '네이버',
  year: 2024,
  experience: 'newcomer',
  position: '프론트엔드 개발자',
  questions: [
    {
      question: '1. 지원 동기',
      answer: '저는 어릴 때부터 기술에 대한 호기심이 많았습니다. 특히 웹 개발 분야에서 사용자 경험을 개선하는 것에 큰 관심을 가지고 있었습니다.'
    },
    {
      question: '2. 프로젝트 경험',
      answer: '대학 시절, 팀 프로젝트에서 프론트엔드 개발을 맡아 사용자 인터페이스를 구현했습니다. React와 TypeScript를 활용하여 모던한 웹 애플리케이션을 개발하였습니다.'
    },
    {
      question: '3. 기술 스택',
      answer: '- Frontend: React, TypeScript, Next.js\n- Backend: Node.js, Express\n- Database: MongoDB, PostgreSQL\n- Others: Git, Docker'
    }
  ]
};

export default function FeedbackPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: 피드백 저장 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('피드백이 저장되었습니다.');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">피드백 작성</h1>
        <div className="space-x-2">
          <Link
            href="/resume"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            목록으로
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSaving ? '저장 중...' : '피드백 저장'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{SAMPLE_RESUME.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">지원 기업</p>
            <p className="font-medium">{SAMPLE_RESUME.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">지원 연도</p>
            <p className="font-medium">{SAMPLE_RESUME.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">경력 구분</p>
            <p className="font-medium">{SAMPLE_RESUME.experience === 'newcomer' ? '신입' : '경력'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">지원 직무</p>
            <p className="font-medium">{SAMPLE_RESUME.position}</p>
          </div>
        </div>
      </div>

      <FeedbackEditor questions={SAMPLE_RESUME.questions} />
    </div>
  );
}