import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PageLoadingStateProps = {
  mode?: "dashboard" | "members" | "details" | "form";
};

export function PageLoadingState({
  mode = "dashboard",
}: PageLoadingStateProps) {
  if (mode === "form") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-[5.4rem] w-full" />
            <Skeleton className="h-[5.4rem] w-full" />
            <Skeleton className="h-[5.4rem] w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-40" />
          </CardContent>
        </Card>
        <Card className="hidden xl:block">
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "details") {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Card>
          <CardHeader className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-10 w-32" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-32 w-full sm:col-span-2 xl:col-span-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "members") {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-[3.25rem] w-full max-w-xl" />
          <Skeleton className="h-12 w-40" />
        </div>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </section>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
