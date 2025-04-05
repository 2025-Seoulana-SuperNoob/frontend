'use client';

import { useState } from 'react';
import Link from 'next/link';

// 임시 데이터
const resumes = [
  {
    id: 1,
    title: '프론트엔드 개발자 지원',
    questions: 3,
    createdAt: '2024-03-20',
    author: '내가 작성한 자기소개서',
    isMine: true,
  },
  {
    id: 2,
    title: '백엔드 개발자 지원',
    questions: 4,
    createdAt: '2024-03-21',
    author: '다른 사람의 자기소개서',
    isMine: false,
  },
];

type FilterType = 'all' | 'mine' | 'others';

export default function ResumeListPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'all') return true;
    if (filter === 'mine') return resume.isMine;
    return !resume.isMine;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자기소개서 목록</h1>
        <Link
          href="/resume/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 자기소개서 작성
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-4 py-2 rounded-md ${
              filter === 'mine'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            내가 작성한 자기소개서
          </button>
          <button
            onClick={() => setFilter('others')}
            className={`px-4 py-2 rounded-md ${
              filter === 'others'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            다른 사람의 자기소개서
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredResumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{resume.title}</h2>
                <p className="text-gray-600">
                  {resume.questions}개 문항 · {resume.createdAt}
                </p>
                <p className="text-sm text-gray-500 mt-1">{resume.author}</p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/resume/${resume.id}`}
                  className="px-3 py-1 text-blue-600 hover:text-blue-800"
                >
                  보기
                </Link>
                {resume.isMine && (
                  <Link
                    href={`/resume/${resume.id}/edit`}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    수정
                  </Link>
                )}
                {!resume.isMine && (
                  <Link
                    href={`/resume/feedback`}
                    className="px-3 py-1 text-green-600 hover:text-green-800"
                  >
                    피드백
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}