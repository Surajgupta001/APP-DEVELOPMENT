import { EXERCISE_DATA_URL, EXERCISE_IMAGE_URL, EXERCISE_NAMES, SourceExercise } from './exercises';

const selectedNames = new Set<string>(EXERCISE_NAMES);

async function seed() {
    process.loadEnvFile();

    const { db } = await import('../index');
    const { exercises } = await import('../schema');

    const response = await fetch(EXERCISE_DATA_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch exercise data: ${response.statusText}`);
    }

    const source = ((await response.json()) as SourceExercise[]).filter(
        ({ name }) => selectedNames.has(name)
    );

    if (source.length !== 20) {
        throw new Error(`Expected 20 exercises, but got ${source.length}`);
    }

    const values = source.map((exercise) => ({
        slug: exercise.id.replaceAll(' ', '-').toLowerCase(),
        name: exercise.name,
        userId: 'IEzpfgk0IHB9tgc96xy4mQXNuwYHpwau',
        image: exercise.images[0] ? `${EXERCISE_IMAGE_URL}/${exercise.images[0]}` : null,
        muscles: exercise.primaryMuscles.join(', '),
        description: `${exercise.name} is a ${exercise.level} ${exercise.category} exercise that primarily targets the ${exercise.primaryMuscles.join(', ')} muscles.`,
        difficulty: exercise.level,
        equipment: exercise.equipment,
        forceType: exercise.force,
        mechanicType: exercise.mechanic,
        category: exercise.category,
    }));

    await db.insert(exercises).values(values).onConflictDoNothing();
    console.log(`Seeded ${values.length} exercises into the database.`);
    console.log('Seeding completed successfully.');
};

seed().catch((error) => {
    console.error('Error seeding exercises:', error);
    process.exit(1);
});