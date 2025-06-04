"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { Button } from "@/components/ui/button";

function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>
          How to Start:
        </span>
        <div className={styles.container__onBoarding__steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant={"outline"}
          className="w-full bg-transparent text-rose-500 border-rose-400 hover:bg-rose-50 hover:text-rose-500"
          onClick={() => router.push("/create")}
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
}

export default Home;
