import React from "react";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
// CSS
import styles from "./SideNavigation.module.scss";
import { Input } from "@/components/ui/input";

function SideNavigation() {
  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="focus-visible:ring-0"
        />
        <Button variant={"outline"} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={"outline"}
          className="w-full text-rose-500 border-rose-400 hover:bg-rose-50 hover:text-rose-500"
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To Do</span>
      </div>
    </div>
  );
}

export default SideNavigation;
