import { Outlet } from "react-router-dom"

export const Component = () => {
  // const {
  //   data: organizationResponse,
  //   isLoading,
  //   isError,
  // } = useCurrentOrganization()

  // if (isLoading) {
  //   return <div>Loading Organization</div>
  // }

  // if (isError) {
  //   return <div>Error Loading Organization</div>
  // }

  // const { organization } = organizationResponse

  return <Outlet />
}

export default Component
