import { Task } from "@/types";
import { atom } from "jotai";

export const todosAtom = atom<Task[]>([]);

export const todoAtom = atom<Task | null>(null);
