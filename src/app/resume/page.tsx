'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Skeleton from '@/components/Skeleton';

interface Resume {
  _id: string;
  title: string;
  company: string;
  year: number;
  experience: string;
  position: string;
  createdAt: string;
  walletAddress: string;
}

interface PaginatedResumes {
  data: Resume[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FilterType = 'all' | 'mine' | 'others';

export default function ResumeListPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!publicKey) {
      router.push('/');
      return;
    }

    const fetchResumes = async () => {
      try {
        const response = await api.get<PaginatedResumes>(
          API_ENDPOINTS.RESUME.LIST(currentPage, 10)
        );
        setResumes(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [publicKey, currentPage, router]);

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'all') return true;
    if (filter === 'mine') return resume.walletAddress === publicKey?.toString();
    return resume.walletAddress !== publicKey?.toString();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    return `${dateString} (${dayOfWeek})`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="space-x-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자기소개서 목록</h1>
        <Link
          href="/resume/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

      {filteredResumes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            {filter === 'others'
              ? '아직 올라온 자기소개서가 없어요'
              : '아직 작성한 자기소개서가 없습니다.'}
          </p>
          {filter !== 'others' && (
            <Link
              href="/resume/new"
              className="text-blue-500 hover:text-blue-700"
            >
              첫 자기소개서 작성하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{resume.title}</h2>
                  <div className="text-gray-600 space-y-1">
                    <p>지원 기업: {resume.company}</p>
                    <p>지원 연도: {resume.year}</p>
                    <p>경력 구분: {resume.experience === 'newcomer' ? '신입' : '경력'}</p>
                    <p>지원 직무: {resume.position}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    작성일: {formatDate(resume.createdAt)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link
                    href={`/resume/${resume._id}`}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800"
                  >
                    보기
                  </Link>
                  {resume.walletAddress === publicKey?.toString() && (
                    <Link
                      href={`/resume/${resume._id}/edit`}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      수정
                    </Link>
                  )}
                  {resume.walletAddress !== publicKey?.toString() && (
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}