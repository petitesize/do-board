"use client";

import { todoAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useGetTodoById } from "./useGetTodoById";
import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";

function useDeleteBoard(todoId: number, boardId: string) {
  const { getTodoById } = useGetTodoById(todoId);
  const [todo] = useAtom(todoAtom);

  const deleteBoard = async () => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .update({
          contents: todo?.contents.filter(
            (board: Board) => board.id !== boardId
          ),
        })
        .eq("id", todoId);

      if (status === 204) {
        toast.message("선택한 TODO-BOARD가 삭제되었습니다.");

        getTodoById();
      }

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
  return deleteBoard;
}

export { useDeleteBoard };
