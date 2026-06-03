import EditSetupForm from "./EditSetupForm";

export default async function EditSetupPage({
    params,
}: {
    params: Promise<{ setupId: string }>;
}) {
    const { setupId } = await params;

    return <EditSetupForm setupId={setupId} />;
}