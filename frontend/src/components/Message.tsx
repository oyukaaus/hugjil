import { SiOpenai } from "react-icons/si";
import { HiUser } from "react-icons/hi";
import { TbCursorText } from "react-icons/tb";

const Message = (props: any) => {
  const { message } = props;
  const { role, content: text } = message;

  const isUser = role === "user";

  return (
    <div
      className={`w-full px-4 py-4 md:py-6 ${
        isUser ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-[#444654]"
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-4 text-sm">
        {/* Avatar */}
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-black/70 text-white shrink-0">
          {isUser ? <HiUser className="h-4 w-4" /> : <SiOpenai className="h-4 w-4" />}
        </div>

        {/* Message content */}
        <div className="flex-1 whitespace-pre-wrap break-words prose dark:prose-invert">
          {!isUser && text === null ? (
            <TbCursorText className="h-6 w-6 animate-pulse text-gray-400 dark:text-gray-300" />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
