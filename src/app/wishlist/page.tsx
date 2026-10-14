import { Wishlist } from '@/components/wishlist';
import { requestTime } from '@/lib/server-time';
export default async function WishlistPage(){return <Wishlist now={await requestTime()}/>;}
