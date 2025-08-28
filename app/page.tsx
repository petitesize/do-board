"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
// Shadcn UI
import { Button } from "@/components/ui/button/button";
import { toast } from "sonner";

function InitPage() {
  const router = useRouter();

  // 페이지 생성 및 Supabase 연동
  // 클라이언트 사이드에서, 컴포넌트 자체적으로 사용하는 함수 이름은 handle~ 로 명명
  const handleCreateTask = async () => {
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
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 mb-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          How to Start:
        </h3>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">
            1. Create a page
          </small>
          <small className="text-sm font-normal leading-none">
            2. Add boards to page
          </small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#FFF9F5] w-[180px]"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
