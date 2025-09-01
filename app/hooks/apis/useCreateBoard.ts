"use client";

import { Board } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

function useCreateBoard() {
  const createBoard = async (
    taskId: number,
    column: string,
    newValue: Board[] | undefined
  ) => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .update({
          [column]: newValue,
        })
        .eq("id", taskId)
        .select();

      if (data && status === 200) {
        // 테이블에 row 데이터 정상 생성
        toast.message("새로운 DO-BOARD가 생성되었습니다.", {
          description: "생성한 DO-BOARD를 사용해보세요!",
        });
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
  return createBoard;
}

export { useCreateBoard };
