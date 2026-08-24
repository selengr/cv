import Spinner from "@/components/icons/spinner";

interface Props {
  className?: string;
}

export default function LoadingBox({ className }: Props) {
  return (
    <div
      className={`flex w-full items-center rounded-md border border-black/10 bg-gray-50 px-3 py-4 text-sm font-bold ${className ?? ""}`}
    >
      <Spinner className="ml-2 h-4 w-4 !text-sky-500" />
      <span className="text-gray-600">در حال دریافت کردن اطلاعات</span>
    </div>
  );
}
