"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
// Components
import { Progress, Button } from "@/components/ui";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import BasicBoard from "@/components/common/board/BasicBoard";
// Shadcn UI

import { toast } from "sonner";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

// CSS
import styles from "./page.module.scss";
import { supabase } from "@/utils/supabase";
import { ChevronLeft } from "lucide-react";
// Supabase 컬럼
export interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

export interface BoardContent {
  boardId: string | number;
  isCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

function TaskPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Todo>();
  const [startDate, setStartDate] = useState<string | Date | undefined>(
    new Date()
  );
  const [endDate, setEndDate] = useState<string | Date | undefined>(new Date());

  // ==================================================================================
  const insertRowData = async (contents: BoardContent[]) => {
    // Supabase DB 연동
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        contents: contents,
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      console.error(error);
      toast.message("에러가 발생했습니다.", {
        description: "콘솔 창에 출력된 에러를 확인해주세요.",
      });
    }

    if (status === 204) {
      toast.message("추가 완료!", {
        description: "새로운 보드가 생성되었습니다.",
      });
      getData();
    }
  };

  // ADD NEW BOARD 버튼 클릭
  const createBoard = () => {
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    if (boards && boards.contents.length > 0) {
      newContents = [...boards.contents];
      newContents.push(BoardContent);
      insertRowData(newContents);
    } else if (boards && boards.contents.length === 0) {
      newContents.push(BoardContent);
      insertRowData(newContents);
    }
  };

  // ==================================================================================

  // Supabase에 기존에 생성된 보드가 있는지 확인
  const getData = async () => {
    const {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    if (todos !== null) {
      todos.forEach((todo: Todo) => {
        if (todo.id === Number(pathname.split("/")[2])) {
          setBoards(todo);
          setTitle(todo.title);
        }
      });
    }
  };

  const handleSave = async () => {
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        title: title,
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      toast.message("에러가 발생했습니다.", {
        description: "콘솔 창에 출력된 에러를 확인해주세요.",
      });
    }

    if (status === 204) {
      toast.message("수정 완료!", {
        description: "작성한 게시물이 올바르게 저장되었습니다.",
      });
      getData();
      // 상태 변경  (onSave가 호출될 때 상태 변경)
      setSidebarState("updated");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles["header__btn-box"]}>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => router.push("/")}
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant={"secondary"} onClick={handleSave}>
            저장
          </Button>
          <Button className="text-rose-600 bg-red-50 hover:bg-rose-50 ">
            삭제
          </Button>
        </div>
      </div>
      <div className={styles.header__top}>
        {/* 제목 입력 Input 섹션 */}
        <input
          value={title}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title Here!"
          className={styles.header__top__input}
        />
        {/* 진행 상황 척도 그래프 섹션 */}
        <div className="flex items-center justify-start gap-4">
          <small className="text-sm font-medium leading-none text-[#6d6d6d]">
            1/10 Completed
          </small>
          <Progress className="w-60 h-[10px]" value={33} />
        </div>
      </div>
      {/* 캘린터 + Add New Board 버튼 섹션 */}
      <div className={styles.header__bottom}>
        <div className="flex items-center gap-5">
          <LabelCalendar label="From" />
          <LabelCalendar label="To" />
        </div>
        <Button className="text-white bg-[#e79057] hover:bg-[#e79057] hover:ring-1 hover:ring-[#e79057] hover:ring-offset-1 active:bg-[#d5753d] hover:shadow-lg">
          Add New Board
        </Button>
      </div>
    </div>
  );
}

export default TaskPage;
