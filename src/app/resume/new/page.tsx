'use client';

import { useRouter } from 'next/navigation';
import ResumeForm, { ResumeData } from '@/components/ResumeForm';

export default function NewResumePage() {
  const router = useRouter();

  const handleSubmit = async (data: ResumeData) => {
    try {
      // TODO: Solana 프로그램과 연동하여 데이터 저장
      console.log('Resume data:', data);

      // 임시로 성공 메시지 표시
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