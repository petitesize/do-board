"use client";

import { useCreateTodo, useGetTodos } from "@/app/hooks/apis";
// Shadcn UI
import { Button, SearchBar } from "@/components/ui";
import { Todo } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { todos, getTodos } = useGetTodos();

  useEffect(() => {
    getTodos();
  }, [id]);

  const handleCreateTodo = useCreateTodo();

  return (
    <aside className="page__aside">
      <div className="flex-col flex h-full gap-3">
        {/* 검색창 UI */}
        <SearchBar placeholder="검색어를 입력하세요." />
        {/* Add New Page 버튼 UI */}
        <Button
          className="text-[#e79057] bg-white border border-[#e79057] hover:bg-[#fff9f5]"
          onClick={handleCreateTodo}
        >
          Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">MY TODO</span>
          </small>
          <ul className="flex flex-col">
            {todos.length === 0 ? (
              <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
                등록된 Task가 없습니다.
              </li>
            ) : (
              todos.map((todo: Todo) => {
                return (
                  <li
                    key={todo.id}
                    onClick={() => router.push(`/todo/${todo.id}`)}
                    className={`${
                      todo.id === Number(id) && "bg-[#f5f5f5]"
                    } min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer`}
                  >
                    <div
                      className={`${
                        todo.id === Number(id)
                          ? "bg-[#00f38d]"
                          : "bg-neutral-400"
                      } h-[6px] w-[6px] rounded-full`}
                    ></div>
                    <span
                      className={`${
                        todo.id !== Number(id) && "text-neutral-400"
                      }`}
                    >
                      {todo.title ? todo.title : "등록된 제목이 없습니다."}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export { SideNavigation };
