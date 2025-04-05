import { useEffect, useRef, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Comment from '@sereneinserenade/tiptap-comment-extension';

interface CommentData {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface FeedbackEditorProps {
  content: string;
  readOnly?: boolean;
}

export default function FeedbackEditor({ content, readOnly = false }: FeedbackEditorProps) {
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: 'tiptap-comment'
        },
        onCommentActivated: (commentId) => {
          setActiveCommentId(commentId);
          if (commentId) setTimeout(() => focusCommentWithActiveId(commentId));
        },
      }),
    ],
    content,
    editable: !readOnly,
  });

  const addComment = () => {
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
      createdAt: new Date()
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
    editor?.commands.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full prose max-w-none">
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-4">자기소개서 내용</h3>
          <EditorContent editor={editor} className="min-h-[400px]" />
        </div>
      </div>

      <div className="w-full" ref={commentsSectionRef}>
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-4">댓글 목록</h3>
          <div className="space-y-4">
            {comments.length ? (
              comments.map((comment) => (
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
                          editor?.commands.unsetComment(comment.id);
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

      {editor && !readOnly && (
        <BubbleMenu editor={editor} className="bg-white border rounded-lg shadow-lg p-1">
          <button
            onClick={addComment}
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
      )}
    </div>
  );
}