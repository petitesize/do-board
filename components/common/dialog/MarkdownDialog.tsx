"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
// Components
import LabelCalendar from "../calendar/LabelCalendar";
import MDEditor from "@uiw/react-md-editor";
// Shadcn UI
import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
// CSS
import styles from "./MarkdownDialog.module.scss";

function MarkdownDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>(
    "**Hello, World!**"
  );

  // ===========================================================================

  //   Supabase에 저장
  const onSubmit = async () => {
    console.log("함수 호출");

    if (!title || !content) {
      toast.message("기입되지 않은 값이 있습니다.", {
        description: "제목, 날짜 혹은 내용을 모두 작성해주세요.",
      });
      return;
    } else {
      // Supabase 데이터베이스에 연동

      const { data, error, status } = await supabase
        .from("todos")
        .insert([{ title: title, content: content }])
        .select();

      if (error) {
        console.error(error);
        toast.message("에러가 발생했습니다.", {
          description: error.message,
        });
      }
      //   생성 완료
      if (status === 201) {
        toast.message("생성 완료!", {
          description: "작성한 글이 저장되었습니다.",
        });
      }

      //   등록 후 초기화
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Contents
        </span>
      </DialogTrigger>
      <DialogContent className="!max-w-fit">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write a title for your board"
                className={styles.dialog__titleBox__title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          {/* 마크다운 */}
          <div className={styles.dialog__markdown}>
            <MDEditor
              value={content}
              height={100 + "%"}
              onChange={setContent}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant={"ghost"}
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type={"submit"}
              className="font-normal border-rose-500 bg-rose-400 text-white hover:bg-rose-400 hover:text-white"
              onClick={onSubmit}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MarkdownDialog;
