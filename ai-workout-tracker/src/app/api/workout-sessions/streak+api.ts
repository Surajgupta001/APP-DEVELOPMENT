import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, workoutSessions } from "@/database";

export async function GET(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session)
        return Response.json({ message: "Unauthorized" }, { status: 401 });

    const sessions = await db
        .select({ startedAt: workoutSessions.startedAt })
        .from(workoutSessions)
        .where(eq(workoutSessions.userId, session.user.id));
    const workoutDates = sessions.map(({ startedAt }) => startedAt.toISOString());

    return Response.json({
        workoutDates,
    });
}