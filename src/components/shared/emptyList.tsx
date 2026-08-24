import { EyeSlashIcon } from "@heroicons/react/24/outline";

interface Props {
  title: string;
  description: string;
  className?: string;
}

export default function EmptyList({ title, description, className }: Props) {
  return (
    <div
      className={`rounded-lg border-2 border-dashed border-gray-300 p-12 py-24 text-center ${className ?? ""}`}
    >
      <EyeSlashIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-base font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
