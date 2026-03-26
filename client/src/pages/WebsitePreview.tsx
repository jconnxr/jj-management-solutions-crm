import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";

/**
 * Public shareable page that renders a generated website in a full-screen iframe.
 * No authentication required — anyone with the link can view the preview.
 */
export default function WebsitePreview() {
  const { token } = useParams<{ token: string }>();

  const { data: website, isLoading, error } = trpc.websites.getByToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 text-sm">Loading website preview...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <p className="text-gray-800 text-lg font-medium">Preview not found</p>
          <p className="text-gray-500 text-sm">This website preview may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  if (website.status === "generating") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-800 text-lg font-medium">Website is being generated</p>
          <p className="text-gray-500 text-sm">Please check back in a moment.</p>
        </div>
      </div>
    );
  }

  if (!website.htmlUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <p className="text-gray-800 text-lg font-medium">Website generation failed</p>
          <p className="text-gray-500 text-sm">Please contact the sender for a new preview link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={website.htmlUrl}
        className="w-full h-full border-0"
        title={`${website.businessName} - Website Preview`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
