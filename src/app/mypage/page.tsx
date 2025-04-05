'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { publicKey, disconnect } = useWallet();
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [copied, setCopied] = useState(false);

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 닉네임 변경 API 호출
    console.log('닉네임 변경:', nickname);
  };

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // TODO: 계정 삭제 API 호출
      console.log('계정 삭제');
      disconnect();
      router.push('/');
    }
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">계정 정보</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            지갑 주소
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 p-3 rounded overflow-hidden">
              <span className="break-all">
                {publicKey ? formatAddress(publicKey.toString()) : '지갑이 연결되지 않았습니다.'}
              </span>
            </div>
            {publicKey && (
              <button
                onClick={copyAddress}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap min-w-[60px]"
              >
                {copied ? '복사됨' : '복사'}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleNicknameChange} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="새로운 닉네임을 입력하세요"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap min-w-[60px]"
              >
                변경
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            로그아웃
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}