'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import api from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Skeleton from '@/components/Skeleton';

interface UserInfo {
  walletAddress: string;
  nickname: string;
}

export default function MyPage() {
  const { publicKey, disconnect } = useWallet();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [nickname, setNickname] = useState('');
  const [copied, setCopied] = useState(false);

  // 지갑 연결이 해제되면 홈페이지로 이동
  useEffect(() => {
    if (!publicKey) {
      router.push('/');
    }
  }, [publicKey, router]);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (publicKey) {
        try {
          const response = await api.get(API_ENDPOINTS.USERS.INFO(publicKey.toString()));
          setUserInfo(response.data);
          setNickname(response.data.nickname);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [publicKey]);

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 닉네임 변경 API 호출
    console.log('닉네임 변경:', nickname);
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

  if (!userInfo) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-48 mb-6" />

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <Skeleton className="h-6 w-32 mb-4" />

          <div className="mb-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="flex-1 h-12" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

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
          <WalletMultiButton style={{}} />

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