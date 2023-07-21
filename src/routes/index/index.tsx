import { useSession, useTailwindFullscreen } from "@/state"
import { useUserPermits } from "@/state"
import { PermitCard } from "./components/PermitCard"
import { DaisyTheme } from "@/components/daisy/Theme"

export const Component = () => {
  useTailwindFullscreen()
  const { data: permits, isLoading } = useUserPermits()
  const { data: session } = useSession()

  if (isLoading) {
    return <div>Loading Permits</div>
  }

  return (
    <DaisyTheme theme="light">
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex flex-col">
            <h2 className="text-center text-2xl font-bold leading-9">
              Hey, {session?.user.name}
            </h2>
            <h3 className="text-center leading-9 text-gray-500">
              What would you like to do today?
            </h3>
          </div>

          {permits?.map((permit) => (
            <PermitCard key={`permit.card.${permit.id}`} permit={permit} />
          ))}
        </div>
      </div>
    </DaisyTheme>
  )
}

export default Component
