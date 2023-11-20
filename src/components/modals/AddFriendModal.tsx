import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useClient } from "@/context/ClientContext";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

interface AddFriendData {
  query: string;
}

export default function AddFriendModal({
  show,
  set,
}: {
  show: boolean;
  set: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<AddFriendData>({
    defaultValues: {
      query: "",
    },
  });
  const { client } = useClient();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as any).id === "backdrop") set(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") set(false);
    };

    if (typeof window !== "undefined") {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [set]);

  const handleSubmit = async (values: AddFriendData) => {
    console.log(values);

    // Check if values.query is empty before further processing
    if (!values.query.trim()) {
      console.error("Query is empty");
      return;
    }

    const result = values.query.split("#");
    await client?.addFriend(result[0], result[1]);
    set(false);
  };

  return (
    <div id="backdrop" className="modal-overlay">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <header>Add Friend</header>
          <div className="body">
            <div className="row center">
              {/* Integrate your Input component with react-hook-form */}
              <Input {...form.register("query")} placeholder="strafe#0001" />
            </div>
            <div className="row center">
              <Button type="button" onClick={() => set(false)}>
                Cancel
              </Button>
              <Button type="submit">Send</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}