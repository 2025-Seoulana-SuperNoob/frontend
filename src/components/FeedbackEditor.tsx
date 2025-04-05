"use client";

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface CommentData {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  questionId: string;
}

interface FeedbackEditorProps {
  questions: {
    question: string;
    answer: string;
  }[];
  readOnly?: boolean;
  onSubmit?: (content: string, index: number, walletAddress: string) => Promise<void>;
}

export default function FeedbackEditor({
  questions,
  readOnly = false,
  onSubmit,
}: FeedbackEditorProps) {
  const { publicKey } = useWallet();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const addComment = (questionId: string) => {
    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      content: "",
      author: publicKey?.toBase58() || "Unknown",
      createdAt: new Date(),
      questionId,
    };

    setComments([...comments, newComment]);
    setActiveComment(newComment.id);
    setCommentContent("");
  };

  const updateComment = (commentId: string, content: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content };
        }
        return comment;
      })
    );
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
        if (activeComment.startsWith('comment-')) {
          updateComment(activeComment, commentContent);
          if (onSubmit) {
            await onSubmit(
              commentContent,
              activeQuestionIndex,
              publicKey.toBase58()
            );
          }
        } else {
          const newComment: CommentData = {
            id: `comment-${Date.now()}`,
            content: commentContent,
            author: publicKey.toBase58(),
            createdAt: new Date(),
            questionId: activeComment,
          };
          setComments([...comments, newComment]);
          if (onSubmit) {
            await onSubmit(
              commentContent,
              activeQuestionIndex,
              publicKey.toBase58()
            );
          }
        }
        setActiveComment(null);
        setCommentContent('');
      } catch {
        setError("피드백 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } else if (!publicKey) {
      setError("지갑 연결이 필요합니다.");
    }
  };

  const getCommentsForQuestion = (questionId: string) => {
    return comments.filter((comment) => comment.questionId === questionId);
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
          <h3 className="text-lg font-semibold">피드백 목록</h3>
          {!readOnly && (
            <button
              onClick={() => addComment(`question-${activeQuestionIndex}`)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              피드백 추가
            </button>
          )}
        </div>
        <div className="space-y-4">
          {getCommentsForQuestion(`question-${activeQuestionIndex}`).length ? (
            getCommentsForQuestion(`question-${activeQuestionIndex}`).map(
              (comment) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-blue-500 pl-4 bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-blue-600 truncate max-w-[150px]" title={comment.author}>
                          {comment.author.length > 8 ? `${comment.author.slice(0, 8)}...` : comment.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.createdAt.toLocaleDateString()}
                        </p>
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
              )
            )
          ) : (
            <div className="text-center text-gray-500 py-4">
              아직 작성된 피드백이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
