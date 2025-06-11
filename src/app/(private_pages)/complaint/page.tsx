import { ComplaintsList } from "@/app/components/complaint-list/index"
import { getComplaints } from "@/app/components/complaint-list/action"

export default async function ComplaintsPage() {
  const complaints = await getComplaints()

  return (
    <div className="">
      <ComplaintsList initialComplaints={complaints} />
    </div>
  )
}
