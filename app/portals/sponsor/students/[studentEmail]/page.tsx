import SponsorStudentView from "@/components/portals/SponsorStudentView";

export default function SponsorStudentPage({ params }: { params: { studentEmail: string } }) {
  return <SponsorStudentView studentEmail={decodeURIComponent(params.studentEmail)} />;
}
