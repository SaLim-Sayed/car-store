import NewBikeClient from "./new-bike-client"

export default async function NewBikePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) || {}
  const category = typeof sp.category === "string" ? sp.category : undefined
  return <NewBikeClient initialCategory={category || "موتوسيكل"} />
}
