"use client";

import React, { useEffect, useState } from "react";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Dot, Search } from "lucide-react";
// CSS
import styles from "./SideNavigation.module.scss";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

function SideNavigation() {
  const router = useRouter();
  //   타입 임시지정 수정필수
  const [todos, setTodos] = useState<any>([]);

  const onCreate = async () => {
    console.log("함수 호출");

    // Supabase 데이터베이스 row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: "",
        end_date: "",
        contents: [],
      },
    ]);

    if (error) {
      console.error(error);
    }

    if (status === 201) {
      toast.message("페이지 생성 완료!", {
        description: "새로운 투두리스트가 생성되었습니다.",
      });
      router.push("/create");
    }
  };

  //   Supabase에 기존에 생성된 페이지가 있는지 없는지 체크
  const getTodos = async () => {
    const {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    if (status === 200) {
      setTodos(todos);
    }
  };

  useEffect(() => {
    getTodos();
  }, [todos]);

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="focus-visible:ring-0"
        />
        <Button variant={"outline"} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={"outline"}
          className="w-full text-rose-500 border-rose-400 hover:bg-rose-50 hover:text-rose-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To Do</span>
        {/* Is Supabase Todos */}
        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((todo: any) => {
              return (
                <div
                  className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                  key={todo.id}
                >
                  <Dot className="mr-1 text-green-400" />
                  <span className="text-sm">
                    {todo.title === "" ? "제목 없음" : todo.title}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
