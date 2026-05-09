"use server";
import { addFeedback } from "@/lib/data";

export async function addFeedbackAction(
    email: string,
    message: string,
    name?: string,
    userId?: string,
) {
    await addFeedback(email, message, name, userId);
}
