"use client";

import React, { useEffect, useState } from "react";
// Shadcn UI
import { Button } from "@/components/ui/button/button";
import { Dot, Search } from "lucide-react";
// CSS
import styles from "./SideNavigation.module.scss";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

import { SearchBar } from "@/components/ui/search-bar/search-bar";

function SideNavigation() {
  const router = useRouter();
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  //   타입 임시지정 수정필수
  const [todos, setTodos] = useState<any>([]);

  const onCreate = async () => {
    // Supabase 데이터베이스 row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: new Date(),
        end_date: new Date(),
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
      const { data } = await supabase.from("todos").select("*");
      if (data) {
        // 최근 생성된 = 가장 마지막 요소에 라우팅
        router.push(`/create/${data[data?.length - 1].id}`);
        // 목록 갱신
        getTodos();
      }
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
  }, [sidebarState]);

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <SearchBar placeholder="검색어를 입력해주세요" />
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={"outline"}
          className="w-full cursor-pointer text-rose-500 border-rose-400 hover:bg-rose-50 hover:text-rose-500"
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
