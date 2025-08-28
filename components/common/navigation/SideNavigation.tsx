"use client";

import React, { useEffect, useState } from "react";
// Shadcn UI
import { Button } from "@/components/ui/button/button";
import { Dot, Search } from "lucide-react";
// CSS
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

  const handleCreateTask = async () => {
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
    <aside className="page__aside">
      <div className="flex-col flex h-full gap-3">
        {/* 검색창 UI */}
        <SearchBar placeholder="검색어를 입력하세요." />
        {/* Add New Page 버튼 UI */}
        <Button
          className="text-[#e79057] bg-white border border-[#e79057] hover:bg-[#fff9f5]"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">MY TASK</span>
          </small>
          <ul className="flex flex-col">
            {/* Supabase DB에 데이터가 없을 경우 */}
            <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
              <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
              등록된 Task가 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default SideNavigation;
