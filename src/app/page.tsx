'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-[480px] mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            천하제일 자소설
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            함께 성장하는 플랫폼
          </p>
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">자기소개서 작성</h2>
            <p className="text-gray-600">나만의 이야기를 담은 자기소개서를 작성해보세요.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">피드백 제공</h2>
            <p className="text-gray-600">다른 사람의 자기소개서에 피드백을 남겨주세요.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">주요 기능</h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              솔라나 지갑 연동
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              실시간 피드백 시스템
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              직관적인 에디터
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
