"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useCreateBoard, useGetTodoById, useGetTodos } from "@/app/hooks/apis";
// Components
import { Progress, Button } from "@/components/ui";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import { BoardCard, DeleteTodoPopup } from "@/components/common";

// CSS
import styles from "./page.module.scss";
import { ChevronLeft } from "lucide-react";
// Types
import { Board } from "@/types";
import Image from "next/image";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const createBoard = useCreateBoard();
  const { todo } = useGetTodoById(Number(id));
  const { getTodos } = useGetTodos();

  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [count, setCount] = useState<number>(0);

  const formattedDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-CA");
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
    if (!title || !startDate || !endDate) {
      toast.error("기입되지 않은 값이 있습니다.", {
        description: `제목, 시작일, 종료일은 필수 값입니다.`,
      });
      return;
    }

    try {
      const { data, status, error } = await supabase
        .from("todos")
        .update({
          title,
          start_date: formattedDate(startDate ?? new Date()),
          end_date: formattedDate(endDate ?? new Date()),
        })
        .eq("id", id)
        .select(); // 반환되는 값이 있으면 select를 해주면 data 에 반환값이 저장

      if (data && status === 200) {
        // 테이블에 row 데이터 정상 생성
        toast.message("TODO 저장을 완료하였습니다.");
        // 상태값 업데이트: SideNavigation update
        getTodos();
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

  useEffect(() => {
    if (todo?.contents) {
      const compltedCount = todo.contents.filter(
        (content: Board) => content.isCompleted
      ).length;
      setCount(compltedCount);
    }
  }, [todo?.contents]);

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
            <DeleteTodoPopup>
              <Button className="text-rose-600 bg-red-50 hover:bg-rose-50 ">
                삭제
              </Button>
            </DeleteTodoPopup>
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
              {count}/{todo?.contents.length} Completed
            </small>
            <Progress
              className="w-60 h-[10px]"
              value={
                todo && todo.contents.length > 0
                  ? (count / todo.contents.length) * 100
                  : 0
              }
            />
          </div>
        </div>
        {/* 캘린터 + Add New Board 버튼 섹션 */}
        <div className={styles.header__bottom}>
          <div className="flex items-center gap-5">
            <LabelCalendar
              label="From"
              value={startDate}
              onChange={setStartDate}
            />
            <LabelCalendar label="To" value={endDate} onChange={setEndDate} />
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
