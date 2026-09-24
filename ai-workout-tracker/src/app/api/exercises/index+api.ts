import { db } from "@/database";
import { exercises } from "@/database/schema";
import { auth } from "@/lib/auth";
import { ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const search = new URL(request.url).searchParams.get("search")?.trim();

    const query = db
        .select({
            category: exercises.category,
            description: exercises.description,
            difficulty: exercises.difficulty,
            equipment: exercises.equipment,
            forceType: exercises.forceType,
            id: exercises.id,
            image: exercises.image,
            mechanics: exercises.mechanics,
            muscles: exercises.muscles,
            name: exercises.name,
        })
        .from(exercises);

    const data = search
        ? await query.where(
              or(
                  ilike(exercises.name, `%${search}%`),
                  ilike(exercises.muscles, `%${search}%`),
                  ilike(exercises.category, `%${search}%`),
              ),
          )
        : await query;

    return Response.json(data);
}
