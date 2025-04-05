import { useState } from 'react';

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
}

export interface ResumeData {
  title: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, questions });
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...questions];
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
        {questions.map((q, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              문항 {index + 1}
            </label>
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
              required
            />
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
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          제출하기
        </button>
      </div>
    </form>
  );
}