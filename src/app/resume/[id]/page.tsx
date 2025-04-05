'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FeedbackViewer from '@/components/FeedbackViewer';

interface Resume {
  id: string;
  title: string;
  questions: string[];
  author: string;
  isMine: boolean;
}

interface Comment {
  id: string;
  content: string;
  quotedText?: string;
  questionIndex: number;
  author: string;
  createdAt: Date;
}

export default function ResumePage() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // TODO: API 호출로 대체
    setResume({
      id: params.id as string,
      title: '천하제일 자소설',
      questions: [
        '1. 자신의 강점과 약점을 설명해주세요.',
        '2. 지원 동기를 작성해주세요.',
        '3. 입사 후 포부를 작성해주세요.'
      ],
      author: '홍길동',
      isMine: false
    });

    setComments([
      {
        id: '1',
        content: '구체적인 예시를 들어 설명하면 더 좋을 것 같습니다.',
        quotedText: '저는 책임감이 강하고 꼼꼼한 성격입니다.',
        questionIndex: 0,
        author: '김피드백',
        createdAt: new Date('2024-03-20')
      },
      {
        id: '2',
        content: '회사의 비전과 연계해서 작성하면 좋을 것 같습니다.',
        quotedText: '귀사의 발전에 기여하고 싶습니다.',
        questionIndex: 2,
        author: '이코멘트',
        createdAt: new Date('2024-03-21')
      }
    ]);
  }, [params.id]);

  if (!resume) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{resume.title}</h1>
        <p className="text-gray-600">작성자: {resume.author}</p>
      </div>

      <FeedbackViewer
        questions={resume.questions}
        comments={comments}
      />
    </div>
  );
}
