"use client";

import { useRef, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface CommentData {
  id: string;
  content: string;
  walletAddress: string;
  createdAt: Date;
  rewardAmount?: number;
}

interface FeedbackResponse {
  id: string;
  content: string;
  walletAddress: string;
  createdAt: string;
  rewardAmount?: number;
}

interface FeedbackEditorProps {
  questions: {
    question: string;
    answer: string;
  }[];
  readOnly?: boolean;
  resumeId: string;
}

export default function FeedbackEditor({
  questions,
  readOnly = false,
  resumeId,
}: FeedbackEditorProps) {
  const { publicKey } = useWallet();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<FeedbackResponse[]>(
        API_ENDPOINTS.RESUME.FEEDBACK.LIST(resumeId)
      );
      // Convert string dates to Date objects
      const formattedComments = data.map((comment: FeedbackResponse) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        rewardAmount: comment.rewardAmount ? Number(comment.rewardAmount) : undefined,
      }));
      setComments(formattedComments);
    } catch (error) {
      setError("피드백을 불러오는데 실패했습니다.");
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [resumeId, activeQuestionIndex]);

  const addComment = () => {
    if (!publicKey) {
      setError("지갑 연결이 필요합니다.");
      return;
    }

    // 이미 피드백이 있는지 확인
    if (comments.length > 0) {
      setError("이미 피드백을 작성하셨습니다.");
      return;
    }

    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      content: "",
      walletAddress: publicKey.toBase58(),
      createdAt: new Date(),
    };

    setComments([...comments, newComment]);
    setActiveComment(newComment.id);
    setCommentContent("");
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setCommentContent(comment.content);
      setActiveComment(commentId);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    setActiveComment(null);
  };

  const handleSaveComment = async () => {
    if (activeComment && publicKey) {
      try {
        setError(null);
        const response = await api.post(
          API_ENDPOINTS.RESUME.FEEDBACK.CREATE(resumeId),
          {
            content: commentContent,
            walletAddress: publicKey.toBase58(),
          }
        );

        if (response.data) {
          setComments([...comments, response.data]);
          setActiveComment(null);
          setCommentContent('');
          fetchComments();
        }
      } catch (err) {
        setError("피드백 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } else if (!publicKey) {
      setError("지갑 연결이 필요합니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestionIndex(index)}
            className={`px-4 py-2 rounded-md ${
              activeQuestionIndex === index
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            문항 {index + 1}
          </button>
        ))}
      </div>

      <div className="border rounded-lg p-4 bg-white mb-4">
        <h3 className="text-lg font-semibold mb-2">
          문항 {activeQuestionIndex + 1}
        </h3>
        <p className="text-gray-700 mb-4">
          {questions[activeQuestionIndex].question}
        </p>
        <div className="space-y-4">
          <div>
            <textarea
              value={questions[activeQuestionIndex].answer}
              readOnly
              className="w-full min-h-[200px] p-4 border rounded-lg resize-none bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white" ref={commentsSectionRef}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">피드백</h3>
          {!readOnly && comments.length === 0 && (
            <button
              onClick={addComment}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              피드백 작성
            </button>
          )}
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div key="loading" className="text-center text-gray-500 py-4">
              피드백을 불러오는 중...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-l-4 border-blue-500 pl-4 bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-blue-600 truncate max-w-[150px]" title={comment.walletAddress}>
                        {comment.walletAddress.length > 8 ? `${comment.walletAddress.slice(0, 8)}...` : comment.walletAddress}
                      </p>
                      <p className="text-sm text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                      {comment.rewardAmount && (
                        <p className="text-sm text-green-600">
                          보상: {comment.rewardAmount} SOL
                        </p>
                      )}
                    </div>
                    {!readOnly && activeComment !== comment.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  {activeComment === comment.id ? (
                    <div className="mt-2">
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full h-32 p-2 border rounded-md mb-2"
                        placeholder="피드백을 입력하세요..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setActiveComment(null);
                            setError(null);
                          }}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSaveComment}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div key="no-comments" className="text-center text-gray-500 py-4">
              아직 작성된 피드백이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
