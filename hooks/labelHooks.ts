import { useAuth } from "@/context/AuthContext";
import { labelAPI } from "@/services/api";
import { useLabelStore } from "@/store/useLabelStore";
import { useCallback } from "react";

export const getLabels = () => {
  const { user } = useAuth();
  const { setLabels } = useLabelStore();

  const fetchLabels = useCallback(async () => {
    try {
      const data = await labelAPI
        .getAll(user?.id || "")
        .then((res) => res.data.values);
      setLabels(data);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  }, [user?.id, setLabels]); // La fonction ne change que si l'ID utilisateur change

  return fetchLabels;
};
