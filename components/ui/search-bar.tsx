import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

function SearchBar({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div
      className={cn(
        "flex w-full h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      <SearchIcon className="h-[18px] w-[18px]" />
      <input
        type="search"
        data-slot="input"
        className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
}

export { SearchBar };
