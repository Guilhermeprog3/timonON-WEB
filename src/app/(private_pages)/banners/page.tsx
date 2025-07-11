import { BannerList } from "@/app/components/banner/BannerList";
import { getBanners } from "@/app/components/banner/action";
import { Banner } from "@/app/types/banner";

export default async function BannersPage() {
  const initialBanners: Banner[] = await getBanners();

  return (
    <div className="space-y-6">
      <BannerList initialBanners={initialBanners} />
    </div>
  );
}