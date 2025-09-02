"use client";

import { todosAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { toast } from "sonner";

function useGetTodos() {
  const [todos, setTodos] = useAtom(todosAtom);
  const getTodos = async () => {
    try {
      const { data, status, error } = await supabase.from("todos").select("*");

      if (data && status === 200) setTodos(data);
      if (error) {
        toast.error("에러가 발생했습니다.", {
          description: `Supabase Error: ${error.message || `알 수 없는 오류`}`,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요!`,
      });
    }
  };

  return { getTodos, todos };
}

export { useGetTodos };
