import { useAtom, atom, Atom, useAtomValue } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import { Suspense } from "react";
import { singularize } from "inflection";
import flatten from "lodash.flatten";
import { appStore } from "@/stores";

type User = {
  id: number;
  name: string;
};

type Permit = {
  id: number;
  userId: number;
  title: string;
};

interface FetchUserResponse {
  user: User;
  permits: Permit[];
}

const wait = () => {
  return new Promise((r) => setTimeout(r, 1));
};

const fetchUser = async (): Promise<FetchUserResponse> => {
  await wait();
  return {
    user: { id: 1, name: "Kyle Davis" },
    permits: [
      { id: 1, userId: 1, title: "Permit A" },
      { id: 2, userId: 1, title: "Permit B" },
    ],
  };
};

const [fetchUserDataAtom, fetchUserDataStatusAtom] = atomsWithQuery(() => ({
  queryKey: ["user"],
  queryFn: fetchUser,
  // select(data) {
  //   return data.user;
  // },
}));

const UserData = () => {
  const [data] = useAtom(fetchUserDataStatusAtom);

  if (data.isLoading) {
    return <div>Loading User</div>;
  }

  return (
    <Suspense fallback={<div>Loading User Data</div>}>
      <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </Suspense>
  );
};

export default function TestRoute() {
  return (
    <div>
      <div>User</div>
      <div>
        <UserData />
      </div>
    </div>
  );
}
