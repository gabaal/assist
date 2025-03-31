"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ASSISTANT } from "../../ai-assistants/page";
import Image from "next/image";
import { AssistantContext } from "@/context/AssistantContext";
function AssistantList() {
  const convex = useConvex();
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const { assistant, setAssistant } = useContext(AssistantContext);

  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);

  useEffect(() => {
    user && GetUserAssistants();
  }, [user]);

  const GetUserAssistants = async () => {
    const result = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      {
        uid: user._id,
      }
    );
    setAssistantList(result);
    console.log(assistantList);
  };

  return (
    <div className="p-5 bg-secondary border-r-[1px] h-screen relative">
      <h2 className="font-bold text-lg">Your Personal AI Assistants</h2>

      <Button className="w-fill mt-3">+ Add New Assistant</Button>
      <Input className="bg-white mt-3 w-[162px]" placeholder="Search" />
      <div className="mt-5">
        {assistantList.map((assistant_, index) => (
          <div
            key={index}
            onClick={() => setAssistant(assistant_)}
            className={`p-2 flex gap-3 items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl cursor-pointer mt-2 ${assistant_.id == assistant?.id && "bg-gray-200 dark:bg-gray-700"}`}
          >
            <Image
              src={assistant_.image}
              alt={assistant_.name}
              width={60}
              height={60}
              className="rounded-xl w-[60px] h-[60px] object-cover"
            />
            <div>
              <h2 className="font-bold">{assistant_.name}</h2>
              <h2 className="text-gray-600 dark:text-gray-300 text-sm">
                {assistant_.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-10 flex gap-3 items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-[90%] p-2 rounded-xl cursor-pointer">
        <Image
          src={user.picture}
          alt="user"
          width={35}
          height={35}
          className="rounded-full"
        />
        <div>
          <h2 className="font-bold">{user?.name}</h2>
          <h2 className="text-gray-400 text-sm">
            {user?.orderId ? "Pro Plan" : "Free Plan"}
          </h2>
        </div>
      </div>
    </div>
  );
}
export default AssistantList;
