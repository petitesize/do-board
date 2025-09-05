"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useCreateBoard, useGetTodoById } from "@/app/hooks/apis";
// Components
import { Progress, Button } from "@/components/ui";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import { BoardCard } from "@/components/common";
// Shadcn UI
import { useAtom } from "jotai";
import { todosAtom } from "@/store/atoms";
// CSS
import styles from "./page.module.scss";
import { ChevronLeft } from "lucide-react";
// Types
import { Board } from "@/types";
import Image from "next/image";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const createBoard = useCreateBoard();
  const { todo } = useGetTodoById(Number(id));

  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // ==================================================================================

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setStartDate(todo.start_date ? new Date(todo.start_date) : new Date());
      setEndDate(todo.end_date ? new Date(todo.end_date) : new Date());
      setBoards(todo.contents);
    }
  }, [todo]);
  // ADD NEW BOARD 버튼 핸들러
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };

    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    createBoard(Number(id), "contents", newBoards);
  };

  // ==================================================================================

  const handleSave = async () => {
    // const { data, error, status } = await supabase
    //   .from("todos")
    //   .update({
    //     title: title,
    //   })
    //   .eq("id", pathname.split("/")[2]);
    // if (error) {
    //   toast.message("에러가 발생했습니다.", {
    //     description: "콘솔 창에 출력된 에러를 확인해주세요.",
    //   });
    // }
    // if (status === 204) {
    //   toast.message("수정 완료!", {
    //     description: "작성한 게시물이 올바르게 저장되었습니다.",
    //   });
    //   getData();
    //   // 상태 변경  (onSave가 호출될 때 상태 변경)
    //   setSidebarState("updated");
    // }
  };

  return (
    <>
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
            <LabelCalendar label="From" value={startDate} />
            <LabelCalendar label="To" value={endDate} />
          </div>
          <Button
            onClick={handleAddBoard}
            className="text-white bg-[#e79057] hover:bg-[#e79057] hover:ring-1 hover:ring-[#e79057] hover:ring-offset-1 active:bg-[#d5753d] hover:shadow-lg"
          >
            Add New Board
          </Button>
        </div>
      </div>
      <div className={styles.body}>
        {boards.length !== 0 ? (
          <div className={styles.body__isData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
            {boards.map((board: Board) => {
              return <BoardCard key={board.id} board={board} />;
            })}
          </div>
        ) : (
          <div className={styles.body__noData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              There is no board yet.
            </h3>
            <small className="text-sm font-medium leading-none text-[#6d6d6d] mt-3 mb-7">
              Click the button and start flashing!
            </small>
            <button onClick={handleAddBoard}>
              <Image
                src={"/assets/image/round-button.svg"}
                width={74}
                height={74}
                alt="rounded-button"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskPage;
