import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCarsCollectionJsonLd,
  buildFaqJsonLd,
  CARS_MARKET_FAQ,
} from "@/lib/seo";

export function CarsJsonLd() {
  return (
    <>
      <JsonLd data={buildCarsCollectionJsonLd()} />
      <JsonLd data={buildFaqJsonLd(CARS_MARKET_FAQ)} />
    </>
  );
}
