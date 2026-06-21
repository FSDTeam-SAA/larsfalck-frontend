import ArtistHero from "../_components/ArtistHero";
import Discography from "../_components/Discography";
import PopularTracks from "../_components/PopularTracks";

export default function ArtistPage() {
  return (
    <main className="">
      <ArtistHero
        name="Emma Rhodes"
        cover="/banner.png"
        avatar="/album.png"
        monthlyListeners="12 Albums • 245 Songs"
        description="Emma Rhodes is a composer and producer creating relaxing instrumental music for wellness, meditation, commercial spaces, and everyday listening."
      />

      {/* Popular Songs Component */}
      <PopularTracks />
      <Discography/>
    </main>
  );
}
