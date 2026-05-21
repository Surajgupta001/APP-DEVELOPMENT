import { useEffect, useState } from "react";
import type { StreamChat, UserResponse } from "stream-chat";

const useStreamUsers = (client: any, userId: string) => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!client || !userId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // don't fetch myself and admins
                const response = await client.queryUsers(
                    { id: { $nin: [userId] }, role: { $nin: ["admin"] } } as any,
                    { last_active: -1 },
                    { limit: 50 },
                );
                setUsers(response.users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                // TODO: sentry logs & capture exception
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [client, userId]);

    return { users, loading };
};

export default useStreamUsers;