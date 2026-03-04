import { Recurrence } from "@/types";

export default function getDateRange(recurrence: Recurrence): { startingDate: string; endingDate: string } {
    const now = new Date();
    const end = now.toISOString();

    const start = new Date(now);

    switch (recurrence) {
        case "daily":
            start.setDate(start.getDate() - 1); 
            break;
        case "weekly":
            start.setDate(start.getDate() - 7); 
            break;
        case "monthly":
            start.setDate(start.getDate() - 30);
            break;
    }

    return { startingDate: start.toISOString(), endingDate: end };
}