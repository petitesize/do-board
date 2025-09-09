"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useCreateTodo() {
  const router = useRouter();
  const createTodo = async () => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .insert([
          {
            title: null,
            start_date: null,
            end_date: null,
            contents: [],
          },
        ])
        .select();

      if (data && status === 201) {
        // 테이블에 row 데이터 정상 생성
        toast.message("새로운 TASK가 생성되었습니다.", {
          description: "나만의 DO-BOARD를 생성해보세요!",
        });
        router.push(`/todo/${data[0].id}`);
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

  return createTodo;
}

export { useCreateTodo };
