'use client';

import { useRef, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Comment from '@sereneinserenade/tiptap-comment-extension';

interface CommentData {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  questionId: string;
  quotedText?: string;
}

interface FeedbackEditorProps {
  questions: {
    question: string;
    answer: string;
  }[];
  readOnly?: boolean;
  onSubmit?: (content: string, selectedText: string) => Promise<void>;
}

export default function FeedbackEditor({ questions, readOnly = false, onSubmit }: FeedbackEditorProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const editor1 = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: 'tiptap-comment',
          style: 'background-color: #fff3cd; border-bottom: 2px solid #ffa500;',
        },
      }),
    ],
    content: questions[0]?.answer || '',
    editable: !readOnly,
  });

  const editor2 = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: 'tiptap-comment',
          style: 'background-color: #fff3cd; border-bottom: 2px solid #ffa500;',
        },
      }),
    ],
    content: questions[1]?.answer || '',
    editable: !readOnly,
  });

  const editor3 = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: 'tiptap-comment',
          style: 'background-color: #fff3cd; border-bottom: 2px solid #ffa500;',
        },
      }),
    ],
    content: questions[2]?.answer || '',
    editable: !readOnly,
  });

  const editors = [editor1, editor2, editor3];

  const addComment = (questionId: string) => {
    const editor = editors[parseInt(questionId.split('-')[1])];
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      alert('텍스트를 선택해주세요.');
      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to);
    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      content: '',
      author: 'Current User', // TODO: Solana 지갑 주소로 변경
      createdAt: new Date(),
      questionId,
      quotedText: selectedText
    };

    setComments([...comments, newComment]);
    editor.commands.setComment(newComment.id);
    setActiveComment(newComment.id);
    setCommentContent('');
  };

  const updateComment = (commentId: string, content: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content };
      }
      return comment;
    }));
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setCommentContent(comment.content);
      setActiveComment(commentId);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    setActiveComment(null);
  };

  const handleSaveComment = async () => {
    if (activeComment) {
      if (activeComment.startsWith('comment-')) {
        updateComment(activeComment, commentContent);
        if (onSubmit) {
          const comment = comments.find(c => c.id === activeComment);
          if (comment) {
            await onSubmit(commentContent, comment.quotedText || '');
          }
        }
      } else {
        const newComment: CommentData = {
          id: `comment-${Date.now()}`,
          content: commentContent,
          author: 'Current User', // TODO: Solana 지갑 주소로 변경
          createdAt: new Date(),
          questionId: activeComment
        };
        setComments([...comments, newComment]);
        if (onSubmit) {
          await onSubmit(commentContent, '');
        }
      }
      setActiveComment(null);
      setCommentContent('');
    }
  };

  const getCommentsForQuestion = (questionId: string) => {
    return comments.filter(comment => comment.questionId === questionId);
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, index) => (
        <div key={index} className="w-full">
          <div className="border rounded-lg p-4 bg-white mb-4">
            <h3 className="text-lg font-semibold mb-2">문항 {index + 1}</h3>
            <p className="text-gray-700 mb-4">{q.question}</p>
            <div className="prose max-w-none">
              <EditorContent editor={editors[index]} className="min-h-[200px]" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-white" ref={index === 0 ? commentsSectionRef : null}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">댓글 목록</h3>
              {!readOnly && (
                <button
                  onClick={() => addComment(`question-${index}`)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  댓글 추가
                </button>
              )}
            </div>
            <div className="space-y-4">
              {getCommentsForQuestion(`question-${index}`).length ? (
                getCommentsForQuestion(`question-${index}`).map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-blue-600">{comment.author}</p>
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
                    {comment.quotedText && (
                      <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">
                        {comment.quotedText}
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
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  아직 작성된 댓글이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {editors.map((editor, index) => (
        editor && !readOnly && (
          <BubbleMenu key={index} editor={editor} className="bg-white border rounded-lg shadow-lg p-1">
            <button
              onClick={() => addComment(`question-${index}`)}
              className="p-2 hover:bg-gray-100 rounded-md"
              title="댓글 추가"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </BubbleMenu>
        )
      ))}
    </div>
  );
}