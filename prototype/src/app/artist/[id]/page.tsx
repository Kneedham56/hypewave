import { notFound } from "next/navigation";
import { ArtistView } from "@/components/ArtistView";
import { artists, getArtist } from "@/lib/data";

export function generateStaticParams() {
  return artists.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/artist/[id]">) {
  const { id } = await params;
  return { title: `${getArtist(id)?.name ?? "Artist"} · HypeWave` };
}

export default async function ArtistPage({ params }: PageProps<"/artist/[id]">) {
  const { id } = await params;
  if (!getArtist(id)) notFound();
  return <ArtistView id={id} />;
}
