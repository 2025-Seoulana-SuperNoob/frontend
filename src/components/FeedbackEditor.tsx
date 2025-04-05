"use client";

import { useRef, useState, useEffect } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Comment from "@sereneinserenade/tiptap-comment-extension";
import { useWallet } from "@solana/wallet-adapter-react";

interface CommentData {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  questionId: string;
  selections: number[];
}

interface FeedbackEditorProps {
  questions: {
    question: string;
    answer: string;
  }[];
  readOnly?: boolean;
  onSubmit?: (content: string, selections: number[]) => Promise<void>;
}

interface QuestionEditorProps {
  content: string;
  readOnly: boolean;
  onSelectionUpdate: (selection: { from: number; to: number }) => void;
}

function QuestionEditor({ content, readOnly, onSelectionUpdate }: QuestionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto',
          },
        },
      }),
      Comment.configure({
        HTMLAttributes: {
          class: "tiptap-comment",
          style: "background-color: #fff3cd; border-bottom: 2px solid #ffa500;",
        },
      }),
    ],
    content: content,
    editable: !readOnly,
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      onSelectionUpdate({ from, to });
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="prose max-w-none relative">
      <EditorContent editor={editor} className="min-h-[200px] p-4 border rounded-lg" />
      {editor && !readOnly && (
        <BubbleMenu
          editor={editor}
          className="bg-white border rounded-lg shadow-lg p-1 flex items-center gap-1"
          tippyOptions={{ duration: 100 }}
        >
          <button
            onClick={() => {
              const { from, to } = editor.state.selection;
              if (from !== to) {
                onSelectionUpdate({ from, to });
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="댓글 추가"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </BubbleMenu>
      )}
    </div>
  );
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
  const [currentSelection, setCurrentSelection] = useState<{ from: number; to: number } | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const addComment = (questionId: string) => {
    if (!currentSelection) {
      alert("텍스트를 선택해주세요.");
      return;
    }

    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      content: "",
      author: publicKey?.toBase58() || "Unknown",
      createdAt: new Date(),
      questionId,
      selections: [currentSelection.from, currentSelection.to]
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
    if (activeComment) {
      if (activeComment.startsWith('comment-')) {
        updateComment(activeComment, commentContent);
        if (onSubmit) {
          const comment = comments.find(c => c.id === activeComment);
          if (comment) {
            await onSubmit(commentContent, comment.selections);
          }
        }
      } else {
        const newComment: CommentData = {
          id: `comment-${Date.now()}`,
          content: commentContent,
          author: publicKey?.toBase58() || "Unknown",
          createdAt: new Date(),
          questionId: activeComment,
          selections: currentSelection ? [currentSelection.from, currentSelection.to] : [0, 0]
        };
        setComments([...comments, newComment]);
        if (onSubmit) {
          await onSubmit(commentContent, newComment.selections);
        }
      }
      setActiveComment(null);
      setCommentContent('');
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
          {questions.map((question, index) => (
            <div
              key={index}
              className={`${activeQuestionIndex === index ? '' : 'hidden'}`}
            >
              <QuestionEditor
                content={question.answer}
                readOnly={readOnly}
                onSelectionUpdate={setCurrentSelection}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white" ref={commentsSectionRef}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">피드백 목록</h3>
          {!readOnly && (
            <button
              onClick={() => addComment(`question-${activeComment?.split('-')[1] || 0}`)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              피드백 추가
            </button>
          )}
        </div>
        <div className="space-y-4">
          {getCommentsForQuestion(`question-${activeComment?.split('-')[1] || 0}`).length ? (
            getCommentsForQuestion(`question-${activeComment?.split('-')[1] || 0}`).map(
              (comment) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-blue-600">
                        {comment.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    {!readOnly && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  {comment.selections.length > 0 && (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">
                      {questions[parseInt(comment.questionId.split('-')[1])]?.answer.slice(
                        comment.selections[0],
                        comment.selections[1]
                      )}
                    </blockquote>
                  )}
                  {activeComment === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full h-32 p-2 border rounded-md mb-2"
                        placeholder="피드백을 입력하세요..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setActiveComment(null)}
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
                    <p className="text-gray-700">{comment.content}</p>
                  )}
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
