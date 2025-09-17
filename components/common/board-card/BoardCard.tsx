"use client";
// Shadcn UI
import { Checkbox, Button, Separator } from "@/components/ui";
// CSS
import { ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card/card";
import LabelCalendar from "../calendar/LabelCalendar";
import { MarkdownDialog } from "@/components/common";

import { Board } from "@/types";
import {
  useCreateBoard,
  useDeleteBoard,
  useGetTodoById,
} from "@/app/hooks/apis";
import { useParams } from "next/navigation";
import { todoAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);
  const todo = useAtomValue(todoAtom);
  const updateBoard = useCreateBoard();

  const { getTodoById } = useGetTodoById(Number(id));

  const [startDate, setStartDate] = useState<Date | undefined>(
    board.startDate ? new Date(board.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    board.endDate ? new Date(board.endDate) : undefined
  );

  const handleSubmit = async (boardId: string) => {
    if (!board.title || !board.startDate || !board.endDate) {
      toast.error("기입되지 않은 값이 있습니다.", {
        description: "제목, 날짜를 모두 작성해주세요.",
      });
      return;
    }

    try {
      // 선택한 todo를 찾고, 수정된 값으로 업데이트
      const newBoards = todo?.contents.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, startDate, endDate };
        }
        return board;
      });
      await updateBoard(Number(id), "contents", newBoards);
      getTodoById();
    } catch (error) {
      toast.error("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요!`,
      });
      throw error;
    }
  };

  useEffect(() => {
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
  }, [board.startDate, board.endDate]);

  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={board.isCompleted} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="w-full text-xl outline-none bg-transparent"
            disabled={true}
            value={board.title}
          />
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <ChevronUp className="text-[#6d6d6d]" />
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelCalendar
            label="From"
            value={startDate}
            onChange={setStartDate}
          />
          <LabelCalendar label="To" value={endDate} onChange={setEndDate} />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button
            onClick={() => handleSubmit(board.id)}
            variant={"ghost"}
            className="font-normal text-[#6d6d6d]"
          >
            Save
          </Button>
          <Button
            onClick={handleDeleteBoard}
            variant={"ghost"}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <MarkdownDialog board={board}>
        <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
          {board.title ? "Update Contents" : "Add Contents"}
        </Button>
      </MarkdownDialog>
    </Card>
  );
}

export { BoardCard };
