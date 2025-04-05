'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import ResumeForm, { ResumeData } from '@/components/ResumeForm';
import api from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function NewResumePage() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const handleSubmit = async (data: ResumeData) => {
    if (!publicKey) {
      alert('지갑을 연결해주세요.');
      return;
    }

    try {
      await api.post(API_ENDPOINTS.RESUME.CREATE, {
        walletAddress: publicKey.toString(),
        title: data.title,
        company: data.company,
        year: data.year,
        experience: data.experience,
        position: data.position,
        questions: data.questions,
      });

      alert('자기소개서가 성공적으로 제출되었습니다!');
      router.push('/resume');
    } catch (error) {
      console.error('Error submitting resume:', error);
      alert('자기소개서 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새 자기소개서 작성</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ResumeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}