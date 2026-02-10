import { useAuth } from "@/context/AuthContext";
import { labelAPI } from "@/services/api";
import { useLabelStore } from "@/store/useLabelStore";
import { Label } from "@/types";

export const getALLLabels = () => {
  const { user } = useAuth();
  const { setLabels } = useLabelStore();

  const fetchLabels = async () => {
    try {
      const data: Label[] = await labelAPI
        .getAll(user?.id || "")
        .then((res) => res.data.values);
      setLabels(data);
      console.log("Labels fetched successfully");
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };

  return fetchLabels;
};
