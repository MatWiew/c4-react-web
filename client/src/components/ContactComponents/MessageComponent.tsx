import React from "react";
import MessageForm from "./MessageForm";

interface MessageComponentProps {}

const MessageComponent: React.FC<MessageComponentProps> = () => {
  return (
    <section className="flex flex-col justify-center items-center px-24 pt-8 pb-1.5 mx-auto w-full text-white rounded-xl bg-neutral-900 max-lg:bg-opacity-80 min-h-[520px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <MessageForm />
    </section>
  );
};

export default MessageComponent;
