import { useEffect, useRef, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Comment from '@sereneinserenade/tiptap-comment-extension';

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
}

export default function FeedbackEditor({ questions, readOnly = false }: FeedbackEditorProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);

  const focusCommentWithActiveId = (id: string) => {
    if (!commentsSectionRef.current) return;

    const commentInput = commentsSectionRef.current.querySelector<HTMLTextAreaElement>(`textarea#${id}`);
    if (!commentInput) return;

    commentInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    commentInput.focus();
  };

  useEffect(() => {
    if (!activeCommentId) return;
    focusCommentWithActiveId(activeCommentId);
  }, [activeCommentId]);

  const editor1 = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: 'tiptap-comment',
          style: 'background-color: #fff3cd; border-bottom: 2px solid #ffa500;',
        },
        onCommentActivated: (commentId) => {
          setActiveCommentId(commentId);
          if (commentId) setTimeout(() => focusCommentWithActiveId(commentId));
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
        onCommentActivated: (commentId) => {
          setActiveCommentId(commentId);
          if (commentId) setTimeout(() => focusCommentWithActiveId(commentId));
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
        onCommentActivated: (commentId) => {
          setActiveCommentId(commentId);
          if (commentId) setTimeout(() => focusCommentWithActiveId(commentId));
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

    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      content: '',
      author: 'Current User', // TODO: Solana 지갑 주소로 변경
      createdAt: new Date(),
      questionId
    };

    setComments([...comments, newComment]);
    editor.commands.setComment(newComment.id);
    setActiveCommentId(newComment.id);
  };

  const updateComment = (commentId: string, content: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content };
      }
      return comment;
    }));
  };

  const saveComment = () => {
    setActiveCommentId(null);
    editors.forEach(editor => editor?.commands.focus());
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
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg border ${
                      activeCommentId === comment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      {!readOnly && (
                        <button
                          onClick={() => {
                            editors[index]?.commands.unsetComment(comment.id);
                            setComments(comments.filter(c => c.id !== comment.id));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    {!readOnly ? (
                      <>
                        <textarea
                          id={comment.id}
                          value={comment.content}
                          onChange={(e) => updateComment(comment.id, e.target.value)}
                          className="w-full p-2 border rounded-md text-sm"
                          placeholder="댓글을 입력하세요"
                          rows={3}
                          disabled={comment.id !== activeCommentId}
                        />
                        {activeCommentId === comment.id && (
                          <button
                            onClick={saveComment}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            저장
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">{comment.content}</p>
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