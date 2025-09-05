import { Todo } from "@/types";
import { atom } from "jotai";

export const todosAtom = atom<Todo[]>([]);

export const todoAtom = atom<Todo | null>(null);
