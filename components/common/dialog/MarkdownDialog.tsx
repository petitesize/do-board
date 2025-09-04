"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// Components
import LabelCalendar from "../calendar/LabelCalendar";
import MDEditor from "@uiw/react-md-editor";
// Shadcn UI
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Checkbox,
  Separator,
  Button,
} from "@/components/ui";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Board } from "@/types";
import { useCreateBoard } from "@/app/hooks/apis";

interface Props {
  board: Board;
  children: React.ReactNode;
}

function MarkdownDialog({ board, children }: Props) {
  const { id } = useParams();
  const updateBoard = useCreateBoard();

  // 컴포넌트 상태 값
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState<string | undefined>(
    "**Hello, World!**"
  );

  const initState = () => {
    setIsCompleted(false);
    setTitle("");
    setStartDate(new Date());
    setEndDate(new Date());
    setContent("**Hello, World!**");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  };
  //  MD Done 버튼 => Supabase에 저장
  const handleSubmit = async (boardId: string) => {
    if (!title || !startDate || !endDate || !content) {
      toast.error("기입되지 않은 값이 있습니다.", {
        description: "제목, 날짜 혹은 내용을 모두 작성해주세요.",
      });
      return;
    }

    try {
      // 선택한 todo를 찾고, 수정된 값으로 업데이트
      const newBoards = todo.boards.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoard(Number(id), "todos", newBoards);
      handleCloseDialog();
    } catch (error) {
      toast.error("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요!`,
      });
      throw error;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <Checkbox className="w-5 h-5 min-w-5" checked={true} />
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="w-full text-xl outline-none bg-transparent"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용하여 DO-BOARD를 작성해보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelCalendar label="From" />
          <LabelCalendar label="To" />
        </div>
        <Separator />
        {/* 마크다운 */}
        <MDEditor height={320 + "px"} onChange={setContent} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>취소</Button>
          </DialogClose>
          <Button
            onClick={() => handleSubmit(board.id)}
            type={"submit"}
            className="cursor-pointer font-normal border-rose-500 bg-rose-400 text-white hover:bg-rose-400 hover:text-white"
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownDialog };
