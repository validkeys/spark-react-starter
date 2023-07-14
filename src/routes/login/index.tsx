import { useLogin, sessionAtom } from "@/stores/auth";
import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";

export default function LoginRoute() {
  const { login, isLoading } = useLogin();
  const session = useAtomValue(sessionAtom);

  const submitHandler = () => {
    void login([{ email: "validkeys@gmail.com", password: "hello" }]);
  };

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  if (session.isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <div>{session.isAuthenticated ? "Authenticated" : "Unauthenticated"}</div>
      <button type="button" onClick={submitHandler}>
        Login
      </button>
      <div>{JSON.stringify(session, null, 2)}</div>
    </>
  );
}

// export default function LoginRoute() {
//   useEffect(() => {
//     document.body.classList.add("h-full");
//     document.getElementById("root")?.classList.add("h-full");
//     document.documentElement.classList.add("h-full", "bg-white");

//     return () => {
//       document.body.classList.remove("h-full");
//       document.documentElement.classList.remove("h-full", "bg-white");
//       document.getElementById("root")?.classList.remove("h-full");
//     };
//   }, []);

//   const { register, handleSubmit } = useForm<AuthenticationCredentials>();
//   const [, postAtom] = postSessionQuery;
//   const [response, mutate] = useAtom(postAtom);
//   const authAtom = useAtomValue(auth);

//   if (authAtom.user) {
//     return <Navigate replace to="/" />;
//   }

//   const onSubmit: SubmitHandler<AuthenticationCredentials> = async (data) => {
//     await mutate([data]);
//   };

//   return (
//     <>
//       {/*
//         This example requires updating your template:

//         ```
//         <html class="h-full bg-white">
//         <body class="h-full">
//         ```
//       */}
//       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <img
//             className="mx-auto h-10 w-auto"
//             src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//             alt="Your Company"
//           />
//           <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium leading-6 text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   {...register("email", { required: true })}
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <a
//                     href="#"
//                     className="font-semibold text-indigo-600 hover:text-indigo-500"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   {...register("password", { required: true })}
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//           <p className="mt-10 text-center text-sm text-gray-500">
//             Not a member?{" "}
//             <a
//               href="#"
//               className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
//             >
//               Start a 14 day free trial
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }
