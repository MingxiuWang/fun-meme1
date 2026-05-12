type Image = { id: string; url: string };

export function ImageGallery({ images, alt }: { images: Image[]; alt: string }) {
  if (images.length === 0) return null;

  const [hero, ...rest] = images;

  return (
    <div className="mt-6 space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.url}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {rest.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
