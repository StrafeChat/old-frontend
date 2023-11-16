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
  const [isBrowser, setIsBrowser] = useState(false);
  const { client } = useClient();

  useEffect(() => {
    setIsBrowser(true);

    if (typeof window != "undefined") {
      setTimeout(() => {
        document.addEventListener("click", (event) => {
          if ((event.target as any).id === "backdrop") set(false);
        });
      }, 1000);

      setTimeout(() => {
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") set(false);
        });
      }, 1000);
    }
  }, [set]);

  const handleSubmit = async (values: AddFriendData) => {
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
              <Input placeholder="strafe#0001" />
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
