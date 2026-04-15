import FeedbackForm from '@/components/FeedbackForm';

interface PageProps {
  params: Promise<{
    enterprise: string;
    sector: string;
  }>;
}

export default async function KioskPage({ params }: PageProps) {
  const { enterprise, sector } = await params;

  return (
    <div>
      <FeedbackForm enterprise={enterprise} sector={sector} />
    </div>
  );
}
