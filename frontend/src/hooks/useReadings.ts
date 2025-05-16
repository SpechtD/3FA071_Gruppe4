
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReading, deleteReading, getReading, getReadings, updateReading } from "../services/api";
import { Reading } from "../adapters/reading.adapter";
import { adaptReadingFromAPI, adaptReadingsFromAPI, adaptReadingToAPI } from "../adapters/reading.adapter";
import { KindOfMeter } from "../types/api";
import { toast } from "sonner";

export const useReadings = () => {
  const queryClient = useQueryClient();

  // Query to fetch readings with optional filters
  const useFilteredReadings = (filters?: {
    customer?: string;
    start?: string;
    end?: string;
    kindOfMeter?: string;
  }) => {
    return useQuery({
      queryKey: ["readings", filters],
      queryFn: async () => {
        // Map the meter type if provided
        let apiKindOfMeter: KindOfMeter | undefined;
        if (filters?.kindOfMeter) {
          switch (filters.kindOfMeter) {
            case 'electricity':
              apiKindOfMeter = KindOfMeter.STROM;
              break;
            case 'water':
              apiKindOfMeter = KindOfMeter.WASSER;
              break;
            case 'heating':
              apiKindOfMeter = KindOfMeter.HEIZUNG;
              break;
          }
        }

        const response = await getReadings({
          customer: filters?.customer,
          start: filters?.start,
          end: filters?.end,
          kindOfMeter: apiKindOfMeter,
        });
        return adaptReadingsFromAPI(response.readings);
      },
    });
  };

  // Query to fetch a single reading
  const useReading = (uuid: string) => {
    return useQuery({
      queryKey: ["reading", uuid],
      queryFn: async () => {
        const response = await getReading(uuid);
        return adaptReadingFromAPI(response.reading);
      },
      enabled: !!uuid,
    });
  };

  // Mutation to create a reading
  const createReadingMutation = useMutation({
    mutationFn: async (readingData: Omit<Reading, "uuid">) => {
      // Creating a temporary UUID for the reading
      const tempReading = {
        ...readingData,
        uuid: crypto.randomUUID(),
      } as Reading;

      const apiReading = adaptReadingToAPI(tempReading);
      const response = await createReading(apiReading);
      return adaptReadingFromAPI(response.reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      toast.success("Reading created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create reading: ${error.message}`);
    },
  });

  // Mutation to update a reading
  const updateReadingMutation = useMutation({
    mutationFn: async (readingData: Reading) => {
      const apiReading = adaptReadingToAPI(readingData);
      const response = await updateReading(apiReading);
      return adaptReadingFromAPI(response.reading);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["reading", variables.uuid] });
      toast.success("Reading updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update reading: ${error.message}`);
    },
  });

  // Mutation to delete a reading
  const deleteReadingMutation = useMutation({
    mutationFn: async (uuid: string) => {
      await deleteReading(uuid);
      return uuid;
    },
    onSuccess: (uuid) => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["reading", uuid] });
      toast.success("Reading deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete reading: ${error.message}`);
    },
  });

  return {
    useFilteredReadings,
    useReading,
    createReading: createReadingMutation.mutate,
    updateReading: updateReadingMutation.mutate,
    deleteReading: deleteReadingMutation.mutate,
    createReadingLoading: createReadingMutation.isPending,
    updateReadingLoading: updateReadingMutation.isPending,
    deleteReadingLoading: deleteReadingMutation.isPending,
  };
};
