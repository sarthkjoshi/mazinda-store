import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LoaderButton({
  title,
  loading = false,
  variant = "primary",
  type = "button",
}) {
  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }
  return <Button type={type}>{title}</Button>;
}
