"use client";

import { todoAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

function useGetTodoById(todoId: number) {
  const [todo, setTodo] = useAtom(todoAtom);
  const getTodoById = async () => {
    const { data, status, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", todoId);

    if (data && status === 200) setTodo(data[0]);
    if (error) {
      toast.error("에러가 발생했습니다.", {
        description: `Supabase Error: ${error.message || `알 수 없는 오류`}`,
      });
    }
    try {
    } catch (error) {
      console.log(error);
      toast.error("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요!`,
      });
    }
  };

  useEffect(() => {
    if (todoId) getTodoById();
  }, [todoId]);
  return { todo, getTodoById };
}
export { useGetTodoById };
