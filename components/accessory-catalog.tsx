import Image from "next/image";
import { ArrowRight, Headphones, CarFront, Grip } from "lucide-react";
import { accessoryCategories } from "@/lib/accessories";
import { ShoppingInquiry } from "./shopping-inquiry";
import styles from "./accessory-catalog.module.css";

const photos = [
  { src: "/assets/accessories/textured-case.webp", alt: "Style example: a black textured GUESS case beside a phone" },
  { src: "/assets/accessories/screen-protector.webp", alt: "Style example: a clear screen protector above a phone" },
  { src: "/assets/accessories/charging-accessories.webp", alt: "Style example: multiport charging accessories with a watch charger" },
];
const icons = [Headphones, CarFront, Grip];

export function AccessoryCatalog({ device = "" }: { device?: string }) {
  return (
    <section className="accessory-section section-space" id="accessories" aria-labelledby="accessories-title">
      <div className="section-heading"><div><p className="section-label">A little more you</p><h2 id="accessories-title">Good company<br />for your phone.</h2></div><p>Choose the essentials that suit your day. Tell us your model and preferences, and we’ll check the right options for pickup.</p></div>
      <div className="accessory-feature" data-scroll-scene>
        <Image src="/assets/brand/campaign-city.jpg" alt="Cellzy campaign: a woman taking a photograph with her phone" fill sizes="(max-width: 760px) 100vw, 88vw" data-scroll-image />
        <div><span>Style. Meet everyday life.</span><ShoppingInquiry kind="accessory" device={device} categoryId="cases" className={styles.featureButton}>Find your next case <ArrowRight aria-hidden="true" /></ShoppingInquiry></div>
      </div>
      <div className={styles.collection}>
        <div className={styles.cards}>
          {accessoryCategories.slice(0, 3).map((category, index) => (
            <article className={styles.card} key={category.id}>
              <div className={styles.photo}><Image src={photos[index].src} alt={photos[index].alt} fill sizes="(max-width: 760px) 90vw, 28vw" /></div>
              <div className={styles.cardCopy}><h3>{category.title}</h3><p>{category.copy}</p><ShoppingInquiry kind="accessory" categoryId={category.id} device={device}>Explore {category.title.toLowerCase()} <ArrowRight aria-hidden="true" /></ShoppingInquiry></div>
            </article>
          ))}
        </div>
        <p className={styles.note}>Photos show example styles, not live stock. Ask us to confirm brands, fit and availability for your phone.</p>
        <div className={styles.more}>
          {accessoryCategories.slice(3).map((category, index) => {
            const Icon = icons[index];
            return <article key={category.id}><Icon aria-hidden="true" /><div><h3>{category.title}</h3><p>{category.copy}</p><ShoppingInquiry kind="accessory" categoryId={category.id} device={device}>Explore {category.title.toLowerCase()} <ArrowRight aria-hidden="true" /></ShoppingInquiry></div></article>;
          })}
        </div>
      </div>
    </section>
  );
}
