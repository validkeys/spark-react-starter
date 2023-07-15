IDEA:

- Fetch data from the API
- Push into a store

the store would be a collection of atoms in a dictionary for
each model name:

```
{
  user: atom({
    1: atom({}),
    2: atom({})
  }),
  permit: atom({

  })
}
```

- Each record in the store would be an atom
- We then expose "use" hooks like:

const [ user, updateUser ] = useUser(id)
const [ permits ] = useUserPermits(user.id)

// would be derived from the session
const [ user, updateUser ] = userCurrentUser()

- The useUserPermits would return the current records
  in the store matching the permits for the current
  user but then also fire an update query in the background (SEE: PlaceHolderData on react query)
