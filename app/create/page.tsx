import Image from "next/image";
import styles from "./page.module.scss";
// Shadcn UI
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import BasicBoard from "@/components/common/board/BasicBoard";

function page() {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
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
              className="w-[15%] border-rose-500 bg-rose-400 text-white hover:bg-rose-400 hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {/* <div className={styles.container__body__infoBox}>
          <span className={styles.title}>There is no board yet.</span>
          <span className={styles.subTitle}>
            Click the button and start flashing!
          </span>
          <button className={styles.button}>
            <Image
              src="/assets/image/round-button.svg"
              alt="round-button"
              width={100}
              height={100}
            />
          </button>
        </div> */}
        <BasicBoard />
      </main>
    </div>
  );
}

export default page;
