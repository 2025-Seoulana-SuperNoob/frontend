import { useState } from 'react';
import Link from 'next/link';

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
}

export interface ResumeData {
  title: string;
  company: string;
  year: number;
  experience: 'newcomer' | 'experienced';
  position: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [title, setTitle] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    company: '',
    year: new Date().getFullYear(),
    experience: 'newcomer' as const,
    position: '',
  });
  const [questions, setQuestions] = useState([
    { question: '', answer: '' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      ...basicInfo,
      questions
    });
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (indexToRemove: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== indexToRemove));
    }
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...questions];
    if (field === 'answer' && value.length > 3000) {
      return;
    }
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          자기소개서 제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="자기소개서 제목을 입력하세요"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">기본 정보</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              지원 기업
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={basicInfo.company}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예) 네이버"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              지원 연도
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={basicInfo.year}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="2010"
              max="2030"
              required
            />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              경력 구분
            </label>
            <select
              id="experience"
              name="experience"
              value={basicInfo.experience}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="newcomer">신입</option>
              <option value="experienced">경력</option>
            </select>
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              지원 직무
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={basicInfo.position}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예) 프론트엔드 개발자"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">자기소개서 문항</h3>
        {questions.map((q, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                문항 {index + 1}
              </label>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  삭제
                </button>
              )}
            </div>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="질문을 입력하세요"
              required
            />
            <textarea
              value={q.answer}
              onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="답변을 입력하세요"
              maxLength={3000}
              required
            />
            <div className="text-right">
              <span className={`text-sm ${q.answer.length >= 3000 ? 'text-red-500' : 'text-gray-500'}`}>
                {q.answer.length.toLocaleString()}/3,000자
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          + 문항 추가
        </button>
        <div className="flex gap-2">
          <Link
            href="/"
            className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            메인으로
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            제출하기
          </button>
        </div>
      </div>
    </form>
  );
}