import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AINotes, TStock } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { addNote } from "@/lib/api/db";
import useFetchAINotes from "@/lib/queries/useFetchAINotes";
import { Skeleton } from "antd";

type Props = {
  ticker: string;
  name: string;
  type: string;
  stock: TStock;
};

const AINotesList = ({ ticker, name, type, stock }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [addedNotes, setAddedNotes] = useState<number[]>([]);

  const { data: AINotesList, error, isLoading } = useFetchAINotes(ticker, type);

  const addNoteMutation = useMutation({
    mutationFn: (text: string) => {
      return addNote(stock.id, user!.id, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", stock.id],
      });
    },
  });

  const addNotes = (note: AINotes, index: number) => {
    setAddedNotes((prev) => [...prev, index]);
    addNoteMutation.mutate(note.explanation);
  };

  if (error) return;
  return (
    <>
      <li className="text-sm">Suggested by AI:</li>
      {isLoading ? (
        <>
          <li>
            <Skeleton active paragraph={{ rows: 1 }} />
          </li>
          <li>
            <Skeleton active paragraph={{ rows: 1 }} />
          </li>
          <li>
            <Skeleton active paragraph={{ rows: 1 }} />
          </li>
        </>
      ) : (
        AINotesList?.map((note: AINotes, i: number) => {
          if (!addedNotes.includes(i))
            return (
              <li key={i}>
                <div
                  className={`flex items-center space-x-2 border border-primary hover:border-primary-hover hover:bg-primary-hover text-dark hover:text-white rounded-md py-1 px-2 rtl:space-x-reverse`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{note.explanation}</p>
                  </div>
                  <button
                    className="text-xl py-1 px-1.5"
                    onClick={() => addNotes(note, i)}
                  >
                    +
                  </button>
                </div>
              </li>
            );
        })
      )}
    </>
  );
};

export default AINotesList;
