import { Finish, IPhone } from "@/lib/types";
import { PhoneRender } from "./PhoneRender";

export function ProductImage({
  phone,
  finish,
  className,
}: {
  phone: IPhone;
  finish: Finish;
  className?: string;
}) {
  if (phone.image) {
    // Drop a real photo of the actual pre-owned unit into /public/products to use it.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={phone.image} alt={phone.name} className={className} />;
  }
  return <PhoneRender finish={finish} className={className} />;
}
