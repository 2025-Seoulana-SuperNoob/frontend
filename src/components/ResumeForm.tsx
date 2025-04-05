import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import api from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
}

export interface ResumeData {
  title: string;
  company: string;
  year: number;
  experience: '신입' | '경력';
  position: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const DEPOSIT_AMOUNT = 0.000003; // 0.000003 SOL
const PROGRAM_ID = new PublicKey("B1GRHGLqpyhw2QzTBk9Fnd8t69CYNuphKpj2YfXZxxwe"); // 스마트 컨트랙트 주소

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const { publicKey, signTransaction } = useWallet();
  const [title, setTitle] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    company: '',
    year: new Date().getFullYear(),
    experience: '신입' as const,
    position: '',
  });
  const [questions, setQuestions] = useState([
    { question: '', answer: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setError("지갑 연결이 필요합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1. 트랜잭션 생성
      const connection = new Connection("https://api.devnet.solana.com");
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PROGRAM_ID,
          lamports: DEPOSIT_AMOUNT * LAMPORTS_PER_SOL,
        })
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 2. 트랜잭션 서명
      const signedTx = await signTransaction(transaction);
      const txHash = await connection.sendRawTransaction(signedTx.serialize());

      // 3. 트랜잭션 확인 대기
      await connection.confirmTransaction(txHash);

      // 4. 백엔드에 자기소개서와 트랜잭션 정보 전송
      const response = await api.post(API_ENDPOINTS.RESUME.CREATE, {
        title,
        ...basicInfo,
        questions,
        walletAddress: publicKey.toBase58(),
        depositAmount: DEPOSIT_AMOUNT,
        depositTransaction: txHash,
      });

      if (response.data) {
        // 성공 처리
        onSubmit({
          title,
          ...basicInfo,
          questions
        });
        setTitle('');
        setBasicInfo({
          company: '',
          year: new Date().getFullYear(),
          experience: '신입' as const,
          position: '',
        });
        setQuestions([{ question: '', answer: '' }]);
        alert("자기소개서가 성공적으로 등록되었습니다.");
      }
    } catch (err) {
      console.error("Error submitting resume:", err);
      setError("자기소개서 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

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
              <option value="신입">신입</option>
              <option value="경력">경력</option>
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

      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          자기소개서를 등록하기 위해서는 {DEPOSIT_AMOUNT} SOL의 예치금이 필요합니다.
        </p>
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
            disabled={isSubmitting || !publicKey}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "등록 중..." : "자기소개서 등록"}
          </button>
        </div>
      </div>
    </form>
  );
}