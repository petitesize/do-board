import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
// Shadcn UI
import { Checkbox } from "@/components/ui/checkbox";
// CSS
import styles from "./BasicBoard.module.scss";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import MarkdownDialog from "../dialog/MarkdownDialog";
import { BoardContent, Todo } from "@/app/create/[id]/page";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Card } from "@/components/ui/card";

interface Props {
  data: BoardContent;
  handleBoards: (data: Todo) => void;
}

function BasicBoard({ data, handleBoards }: Props) {
  const pathname = usePathname();

  const handleDelete = async (id: string | number) => {
    // 선택 board에 대한 데이터만 수정 / 삭제
    const { data: todos } = await supabase.from("todos").select("*");

    if (todos !== null) {
      todos.forEach(async (todo: Todo) => {
        if (todo.id === Number(pathname.split("/")[2])) {
          const newContents = todo.contents.filter(
            (el: BoardContent) => el.boardId !== id
          );

          // 삭제한 보드를 제외하고 Supabase에 다시 저장
          const { data, error, status } = await supabase
            .from("todos")
            .update({
              contents: newContents,
            })
            .eq("id", pathname.split("/")[2]);

          if (error) {
            console.error(error);
            toast.message("에러가 발생했습니다.", {
              description: "콘솔 창에 출력된 에러를 확인하세요.",
            });
          }

          if (status === 204) {
            toast.message("삭제가 완료되었었습니다.", {
              description: "보드가 올바르게 삭제되었습니다.",
            });

            // 삭제 후 렌더링
            getData();
          }
        }
      });
    }
  };

  // Supabase에 기존에 생성된 보드가 있는지 확인
  const getData = async () => {
    const { data: todos, error } = await supabase.from("todos").select("*");

    if (error) {
      toast.message("데이터 로드 실패!", {
        description: "데이터를 불러오는 중 오류가 발생했습니다.",
      });
      return;
    }

    if (todos === null || todos.length === 0) {
      toast.message("조회 가능한 데이터가 없습니다.", {
        description: "조회 가능한 데이터가 없습니다.",
      });
      return;
    }
    todos.forEach((todo: Todo) => {
      if (todo.id === Number(pathname.split("/")[2])) {
        handleBoards(todo);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox}>
          <Checkbox className="w-5 h-5" />
          {data.title !== "" ? (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {data.title}
            </h3>
          ) : (
            <span className={styles.title}>
              Please enter a title for the board.
            </span>
          )}
        </div>
        <Button variant={"ghost"}>
          <ChevronUp className="w-5 h-5 text-gray-400" />
        </Button>
      </div>
      <div className={styles.container__body}>
        <div className={styles.container__body__calendarBox}>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">From</span>
            {/* 시간까지 사용할 거라면 ko-KR 사용하고, 정제*/}
            <Input
              value={
                data.startDate !== ""
                  ? new Date(data.startDate)
                      .toLocaleString("ko-KR")
                      .split("오")[0]
                  : "pick a date"
              }
              disabled
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">To</span>
            <Input
              value={
                data.endDate !== ""
                  ? new Date(data.endDate)
                      .toLocaleString("ko-KR")
                      .split("오")[0]
                  : "pick a date"
              }
              disabled
            />
          </div>
        </div>
        <div className={styles.container__body__buttonBox}>
          <Button
            variant={"ghost"}
            className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500 cursor-pointer"
          >
            Duplicate
          </Button>
          <Button
            variant={"ghost"}
            className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
            onClick={() => handleDelete(data.boardId)}
          >
            Delete
          </Button>
        </div>
      </div>
      {data.content && (
        <Card className="w-full p-4 mb-3">
          <MDEditor value={data.content} height={100 + "%"} />
        </Card>
      )}
      <div className={styles.container__footer}>
        <MarkdownDialog data={data} updateBoards={getData} />
      </div>
    </div>
  );
}

export default BasicBoard;
