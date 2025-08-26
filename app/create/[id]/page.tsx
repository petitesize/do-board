"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
// Components
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

function Page() {
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

  const onSave = async () => {
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
    <div className={styles.container}>
      <div className="absolute top-6 left-7 flex items-center gap-2">
        <Button variant={"outline"} size={"icon"} onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <Button variant={"outline"} onClick={onSave}>
          저장
        </Button>
      </div>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그레스 바 UI */}
            <Progress
              value={33}
              className="w-[30%] h-2"
              indicatorColor="bg-rose-500"
            ></Progress>
          </div>
          {/* 캘린더 UI */}
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              <LabelCalendar label="From" readonly={true} />
              <LabelCalendar label="To" />
            </div>
            <Button
              variant={"outline"}
              className="w-[15%] cursor-pointer border-rose-500 bg-rose-400 text-white hover:bg-rose-400 hover:text-white "
              onClick={createBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subTitle}>
                Click the button and start flashing!
              </span>
              <button className={styles.button} onClick={createBoard}>
                <Image
                  src="/assets/image/round-button.svg"
                  alt="round-button"
                  width={100}
                  height={100}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            {boards?.contents.map((board: BoardContent) => {
              return (
                <BasicBoard
                  key={board.boardId}
                  data={board}
                  handleBoards={setBoards}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
