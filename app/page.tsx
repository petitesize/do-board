"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// CSS
import styles from "./page.module.scss";

function Home() {
  const router = useRouter();

  // 페이지 생성 및 Supabase 연동
  const onCreate = async () => {
    // Supabase 데이터베이스 row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ]);
    // INSERT 후에 .select() 하면 인서트후, 인서트된 데이터에 supabase에서 생성된 ID까지 돌아옴
    // 선택사항
    // .select();

    if (error) {
      console.log(error);
    }

    // 생성한 투두리스트의 ID 값으로 URL 파라미터 생성/변경 => Next.js 동적 라우팅(Dynamic Routing)
    const { data } = await supabase.from("todos").select();

    if (status === 201) {
      toast.message("페이지 생성 완료!", {
        description: "새로운 투두리스트가 생성되었습니다.",
      });

      if (data) {
        // supabase 활용하기 때문에 가장 최신 생성된 id를 다음과 같이 조회
        router.push(`/create/${data[data?.length - 1].id}`);
      } else return;
    }
  };

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
          className="w-full cursor-pointer bg-transparent text-rose-500 border-rose-400 hover:bg-rose-50 hover:text-rose-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
}

export default Home;
