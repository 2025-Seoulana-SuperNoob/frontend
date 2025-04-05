import { EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Comment from "@sereneinserenade/tiptap-comment-extension";

interface CommentData {
  id: string;
  content: string;
  selections: {
    from: number;
    to: number;
  }[];
  questionIndex: number;
  author: string;
  createdAt: Date;
}

interface FeedbackViewerProps {
  questions: string[];
  comments: CommentData[];
}

function QuestionEditor({
  question,
  comments,
  questionIndex,
}: {
  question: string;
  comments: CommentData[];
  questionIndex: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Comment.configure({
        HTMLAttributes: {
          class: "tiptap-comment",
          style: "background-color: #fff3cd; border-bottom: 2px solid #ffa500;",
        },
      }),
    ],
    content: question,
    editable: false,
    onCreate: ({ editor }) => {
      // 각 댓글에 대해 하이라이팅 적용
      const questionComments = comments.filter(
        (c) => c.questionIndex === questionIndex
      );
      questionComments.forEach((comment) => {
        if (comment.selections.length > 0) {
          editor.commands.setComment(comment.id);
        }
      });
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none mb-6">
      <EditorContent editor={editor} />
      {comments
        .filter((c) => c.questionIndex === questionIndex)
        .map(
          (comment) =>
            comment.selections.length > 0 && (
              <blockquote
                key={comment.id}
                className="border-l-4 border-gray-300 pl-4 mb-2 text-gray-600 italic"
              >
                {editor.state.doc.textBetween(
                  comment.selections[0].from,
                  comment.selections[0].to
                )}
              </blockquote>
            )
        )}
    </div>
  );
}

export default function FeedbackViewer({
  questions,
  comments,
}: FeedbackViewerProps) {
  const questionComments = (questionIndex: number) => {
    return comments.filter(
      (comment) => comment.questionIndex === questionIndex
    );
  };

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">질문 {index + 1}</h3>

          <QuestionEditor
            question={question}
            comments={comments}
            questionIndex={index}
          />

          {questionComments(index).length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">피드백</h4>
              {questionComments(index).map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-blue-600">
                        {comment.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
