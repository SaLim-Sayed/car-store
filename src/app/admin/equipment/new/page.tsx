import NewEquipmentClient from "./new-equipment-client"

export default async function NewEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) || {}
  const category = typeof sp.category === "string" ? sp.category : undefined
  return <NewEquipmentClient initialCategory={category} />
}
