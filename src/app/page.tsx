'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      <div className="w-full max-w-[480px]">
        <header className="px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">천하제일 자소설</h1>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              지갑 연결하기
            </button>
          </div>
        </header>

        <main className="px-4 py-12">
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              자기소개서 피드백으로<br />
              <span className="text-blue-600">수익을 창출</span>하세요
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              자기소개서를 피드백하며 함께 성장하는 플랫폼
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/resume/new"
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                자기소개서 작성하기
              </Link>
              <Link
                href="/resume"
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                피드백 하러가기
              </Link>
            </div>
          </section>

          <section className="flex flex-col gap-4 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">자기소개서 작성</h3>
              <p className="text-gray-600">
                나만의 자기소개서를 작성하고 전문가들의 피드백을 받아보세요.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">피드백 제공</h3>
              <p className="text-gray-600">
                다른 사람의 자기소개서에 피드백을 제공하고 보상을 받으세요.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">수익 창출</h3>
              <p className="text-gray-600">
                피드백을 통해 얻은 보상으로 새로운 기회를 만들어보세요.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요</h2>
            <p className="text-gray-600 mb-8">
              Solana 지갑을 연결하고 천하제일 자소설의 다양한 기능을 경험해보세요
            </p>
            <button className="w-full px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              지갑 연결하고 시작하기
            </button>
          </section>
        </main>

        <footer className="px-4 py-8 border-t">
          <p className="text-center text-gray-600">
            © 2024 천하제일 자소설. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
