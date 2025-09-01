import { usePathname } from "next/navigation";
// Shadcn UI
import { Checkbox } from "@/components/ui/checkbox/checkbox";
// CSS
import { Button } from "@/components/ui/button/button";
import { ChevronUp } from "lucide-react";
import MarkdownDialog from "../dialog/MarkdownDialog";
import MDEditor from "@uiw/react-md-editor";
import { Card } from "@/components/ui/card/card";
import LabelCalendar from "../calendar/LabelCalendar";
import { Separator } from "@/components/ui";

function BoardCard() {
  const pathname = usePathname();

  return (
    // <div className={styles.container}>
    //   <div className={styles.container__header}>
    //     <div className={styles.container__header__titleBox}>
    //       <Checkbox className="w-5 h-5" />
    //       {data.title !== "" ? (
    //         <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
    //           {data.title}
    //         </h3>
    //       ) : (
    //         <span className={styles.title}>
    //           Please enter a title for the board.
    //         </span>
    //       )}
    //     </div>
    //     <Button variant={"ghost"}>
    //       <ChevronUp className="w-5 h-5 text-gray-400" />
    //     </Button>
    //   </div>
    //   <div className={styles.container__body}>
    //     <div className={styles.container__body__calendarBox}>
    //       <div className="flex items-center gap-3">
    //         <span className="text-[#6d6d6d]">From</span>
    //         {/* 시간까지 사용할 거라면 ko-KR 사용하고, 정제*/}
    //         <Input
    //           value={
    //             data.startDate !== ""
    //               ? new Date(data.startDate)
    //                   .toLocaleString("ko-KR")
    //                   .split("오")[0]
    //               : "pick a date"
    //           }
    //           disabled
    //         />
    //       </div>
    //       <div className="flex items-center gap-3">
    //         <span className="text-[#6d6d6d]">To</span>
    //         <Input
    //           value={
    //             data.endDate !== ""
    //               ? new Date(data.endDate)
    //                   .toLocaleString("ko-KR")
    //                   .split("오")[0]
    //               : "pick a date"
    //           }
    //           disabled
    //         />
    //       </div>
    //     </div>
    //     <div className={styles.container__body__buttonBox}>
    //       <Button
    //         variant={"ghost"}
    //         className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500 cursor-pointer"
    //       >
    //         Duplicate
    //       </Button>
    //       <Button
    //         variant={"ghost"}
    //         className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
    //         onClick={() => handleDelete(data.boardId)}
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   </div>
    //   {data.content && (
    //     <Card className="w-full p-4 mb-3">
    //       <MDEditor value={data.content} height={100 + "%"} />
    //     </Card>
    //   )}
    //   <div className={styles.container__footer}>
    //     <MarkdownDialog data={data} updateBoards={getData} />
    //   </div>
    // </div>
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={true} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="w-full text-xl outline-none bg-transparent"
            disabled={true}
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
          <LabelCalendar label="From" />
          <LabelCalendar label="To" />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
            Duplicate
          </Button>
          <Button
            variant={"ghost"}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
        Add Contents
      </Button>
    </Card>
  );
}

export { BoardCard };
