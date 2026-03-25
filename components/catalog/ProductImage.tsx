import Image from 'next/image';
import { PackageOpen } from 'lucide-react';

interface ProductImageProps {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * Supabase Storage görselini next/image ile render eder.
 * src yoksa gri placeholder (PackageOpen ikonu) gösterir.
 */
export default function ProductImage({
  src,
  alt,
  priority = false,
  className = '',
}: ProductImageProps) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-fe-raised ${className}`}>
        <PackageOpen className="w-10 h-10 text-fe-muted" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
