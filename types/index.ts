export interface Task {
  id: number;
  title: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  contents: Board[];
}

export interface Board {
  id: string;
  isCompleted: boolean;
  title: string;
  startDate: undefined | Date;
  endDate: undefined | Date;
  content: string;
}
