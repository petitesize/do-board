"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useDeleteTodo() {
  const router = useRouter();
  const deleteTodo = async (todoId: number) => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoId);
      // 삭제 완료 시 204
      if (status === 204) {
        toast.message("선택한 TODO가 삭제되었습니다.", {
          description: "새로운 TODO는 언제든 추가가 가능합니다.",
        });
        router.push("/");
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

  return { deleteTodo };
}

export { useDeleteTodo };
