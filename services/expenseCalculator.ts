import { Transaction } from "@/types";
import { transactionAPI } from "./api";

export async function fetchExpenseAmount(
    accountId: string,
    calculePeriod: number
): Promise<number> {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - calculePeriod);

    const res = await transactionAPI.getALLTransactions(accountId, {
        type: "OUT",   
        startingDate: start.toISOString(),
        endingDate: now.toISOString(),
        sortBy: "date",
        sort: "desc",
    });

    const transactions: Transaction[] = res.data;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0); 
    return total;
}